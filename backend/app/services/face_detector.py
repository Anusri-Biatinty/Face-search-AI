"""Face-detection service."""

from pathlib import Path
from typing import TypedDict

import cv2

from app.core.model_loader import get_face_model


class DetectedFace(TypedDict):
    """JSON-serializable face-detection result."""

    bbox: list[float]
    score: float
    embedding: list[float]


class FaceValidationError(ValueError):
    """Raised when an image cannot provide exactly one usable face."""


MIN_SEARCH_FACE_SCORE = 0.60
MIN_SEARCH_FACE_SIZE = 40
MIN_BLUR_VARIANCE = 25.0


def detect_faces(image_path: str | Path) -> list[DetectedFace]:
    """Detect faces and return their boxes, scores, and embeddings."""
    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError("The uploaded file could not be decoded as an image.")

    faces = get_face_model().get(image)
    results: list[DetectedFace] = []

    for face in faces:
        if face.embedding is None:
            raise RuntimeError("The face-recognition model did not return an embedding.")

        results.append(
            {
                "bbox": face.bbox.tolist(),
                "score": float(face.det_score),
                "embedding": face.embedding.tolist(),
            }
        )

    return results


def detect_single_face(image_path: str | Path) -> DetectedFace:
    """Return one face or raise a clear validation error for v1 endpoints."""
    faces = detect_faces(image_path)
    if not faces:
        raise FaceValidationError("No face detected in the uploaded image.")
    if len(faces) > 1:
        raise FaceValidationError("Multiple faces detected in the uploaded image.")
    return faces[0]


def detect_search_face(image_path: str | Path) -> DetectedFace:
    """Return one clear query face, with user-friendly search validation."""
    faces = detect_faces(image_path)
    if not faces:
        raise FaceValidationError("No face detected.")
    if len(faces) > 1:
        raise FaceValidationError(
            "Please upload a photo containing only one clearly visible face."
        )

    face = faces[0]
    if face["score"] < MIN_SEARCH_FACE_SCORE or _is_low_quality_face(
        image_path,
        face["bbox"],
    ):
        raise FaceValidationError("Face quality is too low.")
    return face


def _is_low_quality_face(image_path: str | Path, bbox: list[float]) -> bool:
    """Use face size and local sharpness as a lightweight quality safeguard."""
    image = cv2.imread(str(image_path))
    if image is None:
        return True

    height, width = image.shape[:2]
    left, top, right, bottom = [int(value) for value in bbox]
    left, top = max(left, 0), max(top, 0)
    right, bottom = min(right, width), min(bottom, height)
    if right - left < MIN_SEARCH_FACE_SIZE or bottom - top < MIN_SEARCH_FACE_SIZE:
        return True

    gray_face = cv2.cvtColor(image[top:bottom, left:right], cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray_face, cv2.CV_64F).var() < MIN_BLUR_VARIANCE
