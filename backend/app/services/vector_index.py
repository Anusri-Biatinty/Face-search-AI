"""FAISS-backed vector index for face-embedding similarity search."""

import json
from pathlib import Path
from threading import RLock
from typing import Sequence, TypedDict

import faiss
import numpy as np

DEFAULT_EMBEDDING_DIMENSION = 512


class FaceMetadata(TypedDict):
    """Metadata stored alongside a face embedding."""

    face_id: str
    image_id: str
    image_path: str
    filename: str
    bbox: list[float]


class FaceSearchResult(TypedDict):
    """A matching face and its cosine-similarity score."""

    similarity: float
    metadata: FaceMetadata


class FaceIndex:
    """In-memory FAISS index with a JSON sidecar for face metadata."""

    def __init__(self, dimension: int = DEFAULT_EMBEDDING_DIMENSION) -> None:
        if dimension <= 0:
            raise ValueError("Embedding dimension must be positive.")

        self.dimension = dimension
        # Normalized vectors make inner-product search equivalent to cosine search.
        self.index = faiss.IndexFlatIP(dimension)
        self.metadata: list[FaceMetadata] = []
        self._lock = RLock()

    def add_face(
        self,
        embedding: np.ndarray | Sequence[float],
        metadata: FaceMetadata,
    ) -> int:
        """Normalize and add one embedding with its corresponding metadata."""
        vector = self._normalize_embedding(embedding)
        clean_metadata = self._validate_metadata(metadata)
        with self._lock:
            vector_id = int(self.index.ntotal)
            self.index.add(vector)
            self.metadata.append(clean_metadata)
            self._assert_alignment()
            return vector_id

    def search(
        self,
        embedding: np.ndarray | Sequence[float],
        top_k: int = 5,
    ) -> list[FaceSearchResult]:
        """Return the nearest stored faces ordered by cosine similarity."""
        if top_k <= 0:
            raise ValueError("top_k must be positive.")
        query = self._normalize_embedding(embedding)
        with self._lock:
            self._assert_alignment()
            if self.index.ntotal == 0:
                return []

            result_count = min(top_k, self.index.ntotal)
            distances, indexes = self.index.search(query, result_count)
            return [
                {
                    "similarity": float(score),
                    "metadata": self.metadata[index],
                }
                for score, index in zip(distances[0], indexes[0])
                if index >= 0
            ]

    def reset(self) -> None:
        """Replace the current index and metadata with an empty index."""
        with self._lock:
            self.index = faiss.IndexFlatIP(self.dimension)
            self.metadata = []
            self._assert_alignment()

    def save_index(self, path: str | Path) -> None:
        """Persist the FAISS index and matching metadata sidecar to disk."""
        index_path = Path(path)
        index_path.parent.mkdir(parents=True, exist_ok=True)
        with self._lock:
            self._assert_alignment()
            faiss.write_index(self.index, str(index_path))
            with self._metadata_path(index_path).open("w", encoding="utf-8") as file:
                json.dump(self.metadata, file, ensure_ascii=False)

    def load_index(self, path: str | Path) -> None:
        """Load a persisted index and verify its metadata remains aligned."""
        index_path = Path(path)
        metadata_path = self._metadata_path(index_path)
        if not index_path.is_file():
            raise FileNotFoundError(f"FAISS index not found: {index_path}")
        if not metadata_path.is_file():
            raise FileNotFoundError(f"Index metadata not found: {metadata_path}")

        index = faiss.read_index(str(index_path))
        if index.d != self.dimension:
            raise ValueError(
                f"Index dimension {index.d} does not match {self.dimension}."
            )

        with metadata_path.open(encoding="utf-8") as file:
            metadata = json.load(file)
        if not isinstance(metadata, list) or len(metadata) != index.ntotal:
            raise ValueError("Index metadata does not match the number of vectors.")

        validated_metadata = [self._validate_metadata(item) for item in metadata]
        with self._lock:
            self.index = index
            self.metadata = validated_metadata
            self._assert_alignment()

    def _assert_alignment(self) -> None:
        """Ensure every FAISS vector has metadata at the same position."""
        if self.index.ntotal != len(self.metadata):
            raise RuntimeError("FAISS vectors and metadata are out of alignment.")

    def _normalize_embedding(
        self,
        embedding: np.ndarray | Sequence[float],
    ) -> np.ndarray:
        """Return one finite, L2-normalized float32 embedding for FAISS."""
        vector = np.asarray(embedding, dtype=np.float32).reshape(1, -1)
        if vector.shape[1] != self.dimension:
            raise ValueError(
                f"Expected a {self.dimension}-dimensional embedding, "
                f"received {vector.shape[1]}."
            )
        if not np.isfinite(vector).all():
            raise ValueError("Embedding must contain only finite values.")
        if np.linalg.norm(vector) == 0:
            raise ValueError("Embedding must not have zero magnitude.")

        faiss.normalize_L2(vector)
        return vector

    @staticmethod
    def _metadata_path(index_path: Path) -> Path:
        """Return the sidecar path associated with a persisted FAISS index."""
        return index_path.with_suffix(f"{index_path.suffix}.metadata.json")

    @staticmethod
    def _validate_metadata(metadata: object) -> FaceMetadata:
        """Validate metadata loaded from disk before exposing it to callers."""
        if not isinstance(metadata, dict):
            raise ValueError("Stored face metadata must be an object.")

        string_fields = ("face_id", "image_id", "image_path", "filename")
        if any(not isinstance(metadata.get(field), str) for field in string_fields):
            # Preserve legacy index entries; active multi-face search ignores them.
            if all(
                isinstance(metadata.get(field), str)
                for field in ("person_id", "image_path", "filename")
            ):
                return {
                    "face_id": "",
                    "image_id": "",
                    "image_path": metadata["image_path"],
                    "filename": metadata["filename"],
                    "bbox": [],
                }
            raise ValueError("Stored face metadata contains invalid fields.")
        if not isinstance(metadata["bbox"], list):
            raise ValueError("Stored face metadata contains an invalid bounding box.")

        return {
            "face_id": metadata["face_id"],
            "image_id": metadata["image_id"],
            "image_path": metadata["image_path"],
            "filename": metadata["filename"],
            "bbox": metadata["bbox"],
        }
