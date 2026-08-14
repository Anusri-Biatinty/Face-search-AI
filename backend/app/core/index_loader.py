"""Shared loader for the process-wide face vector index."""

from functools import lru_cache
from os import getenv
from pathlib import Path

from app.services.vector_index import FaceIndex

DEFAULT_INDEX_PATH = Path(__file__).resolve().parents[1] / "data" / "faces.faiss"
INDEX_PATH = Path(getenv("FACE_INDEX_PATH", str(DEFAULT_INDEX_PATH)))


@lru_cache(maxsize=1)
def get_face_index() -> FaceIndex:
    """Return the process-wide in-memory FAISS face index."""
    return FaceIndex()


def initialize_face_index() -> FaceIndex:
    """Load the persisted index and matching metadata when they exist."""
    face_index = get_face_index()
    metadata_path = INDEX_PATH.with_suffix(f"{INDEX_PATH.suffix}.metadata.json")

    if INDEX_PATH.is_file():
        face_index.load_index(INDEX_PATH)
    elif metadata_path.exists():
        raise RuntimeError("Found index metadata without its FAISS index file.")

    return face_index


def save_face_index(face_index: FaceIndex | None = None) -> None:
    """Persist the current shared face index and its metadata sidecar."""
    (face_index or get_face_index()).save_index(INDEX_PATH)
