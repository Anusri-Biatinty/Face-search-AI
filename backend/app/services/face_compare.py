"""Face-comparison service based on InsightFace embeddings."""

from pathlib import Path
from typing import TypedDict

import cv2
import numpy as np

from app.core.model_loader import get_face_model

SAME_PERSON_THRESHOLD = 0.4


class FaceComparisonError(ValueError):
    """Raised when an image cannot provide exactly one usable face."""


class FaceComparisonResult(TypedDict):
    """JSON-serializable result of comparing two face images."""

    similarity: float
    is_same_person: bool


def _extract_single_embedding(image_path: str | Path) -> np.ndarray:
    """Return one face embedding or raise a clear comparison error."""
    image = cv2.imread(str(image_path))
    if image is None:
        raise FaceComparisonError(
            f"Image could not be decoded: {Path(image_path).name}"
        )

    faces = get_face_model().get(image)
    if not faces:
        raise FaceComparisonError(
            f"No face detected in image: {Path(image_path).name}"
        )
    if len(faces) > 1:
        raise FaceComparisonError(
            f"Multiple faces detected in image: {Path(image_path).name}"
        )

    embedding = faces[0].embedding
    if embedding is None:
        raise FaceComparisonError(
            f"No face embedding available for image: {Path(image_path).name}"
        )
    return np.asarray(embedding, dtype=np.float32)


def compare_faces(
    first_image_path: str | Path,
    second_image_path: str | Path,
) -> FaceComparisonResult:
    """Compare exactly one face from each image using cosine similarity."""
    first_embedding = _extract_single_embedding(first_image_path)
    second_embedding = _extract_single_embedding(second_image_path)

    first_norm = np.linalg.norm(first_embedding)
    second_norm = np.linalg.norm(second_embedding)
    if first_norm == 0 or second_norm == 0:
        raise FaceComparisonError("A face embedding has zero magnitude.")

    similarity = float(
        np.dot(first_embedding, second_embedding) / (first_norm * second_norm)
    )
    return {
        "similarity": similarity,
        "is_same_person": similarity >= SAME_PERSON_THRESHOLD,
    }
