"""Image-centric FAISS search over all detected faces."""

from collections import defaultdict
from pathlib import Path
from typing import TypedDict

from app.services.face_detector import detect_search_face
from app.services.image_store import ImageStore
from app.services.vector_index import FaceIndex

TOP_FACE_MATCHES = 20
MINIMUM_IMAGE_SIMILARITY = 0.60


class ImageSearchMatch(TypedDict):
    """One image ranked by its strongest matching face."""

    image_id: str
    filename: str
    path: str
    score: float


def search_images(
    image_path: str | Path,
    face_index: FaceIndex,
    image_store: ImageStore,
) -> list[ImageSearchMatch]:
    """Search with one validated query face and rank unique source images."""
    query_face = detect_search_face(image_path)
    face_matches = face_index.search(query_face["embedding"], top_k=TOP_FACE_MATCHES)
    best_scores: dict[str, float] = defaultdict(float)

    for match in face_matches:
        image_id = match["metadata"]["image_id"]
        if not image_id or image_store.get(image_id) is None:
            continue
        best_scores[image_id] = max(best_scores[image_id], match["similarity"])

    matches: list[ImageSearchMatch] = []
    for image_id, score in best_scores.items():
        record = image_store.get(image_id)
        if record is None:
            continue
        matches.append(
            {
                "image_id": image_id,
                "filename": record.filename,
                "path": record.path,
                "score": score,
            }
        )

    qualifying_matches = [
        match
        for match in matches
        if match["score"] >= MINIMUM_IMAGE_SIMILARITY
    ]
    return sorted(
        qualifying_matches,
        key=lambda match: match["score"],
        reverse=True,
    )
