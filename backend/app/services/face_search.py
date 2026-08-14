"""Face-search workflow backed by the shared FAISS index."""

from pathlib import Path

from app.services.face_detector import detect_single_face
from app.services.vector_index import FaceIndex, FaceSearchResult


def extract_search_embedding(image_path: str | Path) -> list[float]:
    """Extract the one valid face embedding used by a search query."""
    return detect_single_face(image_path)["embedding"]


def search_embedding(
    embedding: list[float],
    face_index: FaceIndex,
    top_k: int = 5,
) -> list[FaceSearchResult]:
    """Find the nearest indexed face embeddings for a query embedding."""
    return face_index.search(embedding, top_k=top_k)


def search_faces(
    image_path: str | Path,
    face_index: FaceIndex,
    top_k: int = 5,
) -> list[FaceSearchResult]:
    """Find the nearest indexed faces for exactly one face in an image."""
    embedding = extract_search_embedding(image_path)
    return search_embedding(embedding, face_index, top_k=top_k)
