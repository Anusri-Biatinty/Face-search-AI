"""Aggregate FAISS face matches into anonymous photo-collection results."""

from collections import defaultdict
from pathlib import Path
from typing import TypedDict

import numpy as np

from app.services.face_search import extract_search_embedding, search_embedding
from app.services.person_store import PersonNotFoundError, PersonStore
from app.services.vector_index import FaceIndex, FaceSearchResult

TOP_EMBEDDING_MATCHES = 10


class CollectionSearchResult(TypedDict):
    """Best anonymous collection returned by an aggregated face search."""

    person_id: str
    similarity: float
    image_paths: list[str]


def search_collections(
    image_path: str | Path,
    face_index: FaceIndex,
    person_store: PersonStore,
) -> CollectionSearchResult | None:
    """Return the best collection after aggregating its top FAISS matches."""
    query_embedding = extract_search_embedding(image_path)
    matches = search_embedding(
        query_embedding,
        face_index,
        top_k=TOP_EMBEDDING_MATCHES,
    )
    grouped_matches = _group_matches_by_person(matches, person_store)
    if not grouped_matches:
        return None

    person_id, similarity = max(
        (
            (matched_person_id, _mean_similarity(person_matches))
            for matched_person_id, person_matches in grouped_matches.items()
        ),
        key=lambda result: result[1],
    )
    person = person_store.get(person_id)

    return {
        "person_id": person_id,
        "similarity": similarity,
        "image_paths": _sort_images_by_similarity(person, query_embedding),
    }


def _group_matches_by_person(
    matches: list[FaceSearchResult],
    person_store: PersonStore,
) -> dict[str, list[FaceSearchResult]]:
    """Discard stale matches and group active FAISS matches by collection."""
    grouped_matches: dict[str, list[FaceSearchResult]] = defaultdict(list)
    for match in matches:
        person_id = match["metadata"]["person_id"]
        try:
            person_store.get(person_id)
        except PersonNotFoundError:
            continue
        grouped_matches[person_id].append(match)
    return grouped_matches


def _mean_similarity(matches: list[FaceSearchResult]) -> float:
    """Aggregate a collection's top-vector scores into one stable score."""
    return float(sum(match["similarity"] for match in matches) / len(matches))


def _sort_images_by_similarity(person, query_embedding: list[float]) -> list[str]:
    """Return every collection image ordered by its query cosine similarity."""
    query_vector = _normalize(query_embedding)
    image_scores = [
        (
            image_path,
            float(np.dot(query_vector, _normalize(embedding))),
        )
        for image_path, embedding in zip(person.image_paths, person.embeddings)
    ]
    return [
        image_path
        for image_path, _ in sorted(
            image_scores,
            key=lambda result: result[1],
            reverse=True,
        )
    ]


def _normalize(embedding: list[float]) -> np.ndarray:
    """Return a float32 L2-normalized embedding for cosine scoring."""
    vector = np.asarray(embedding, dtype=np.float32)
    norm = np.linalg.norm(vector)
    if norm == 0:
        raise ValueError("Stored face embedding has zero magnitude.")
    return vector / norm
