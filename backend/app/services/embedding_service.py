"""Process every detected face in an image into FAISS and metadata records."""

from pathlib import Path
from uuid import uuid4

from app.models.image import FaceRecord
from app.services.face_detector import DetectedFace, detect_faces
from app.services.vector_index import FaceIndex


class ImageFaceValidationError(ValueError):
    """Raised when an uploaded image has no detectable faces."""


def extract_all_faces(image_path: str | Path) -> list[DetectedFace]:
    """Detect every face in an image and reject only empty detections."""
    faces = detect_faces(image_path)
    if not faces:
        raise ImageFaceValidationError("No face detected in the uploaded image.")
    return faces


def index_faces(
    image_id: str,
    image_path: str | Path,
    filename: str,
    faces: list[DetectedFace],
    face_index: FaceIndex,
) -> list[FaceRecord]:
    """Insert one FAISS vector and metadata record for every detected face."""
    stored_path = str(Path(image_path).resolve())
    records: list[FaceRecord] = []

    for face in faces:
        face_id = str(uuid4())
        vector_id = face_index.add_face(
            face["embedding"],
            {
                "face_id": face_id,
                "image_id": image_id,
                "image_path": stored_path,
                "filename": filename,
                "bbox": face["bbox"],
            },
        )
        records.append(
            FaceRecord(
                face_id=face_id,
                vector_id=vector_id,
                embedding_index=vector_id,
                bbox=face["bbox"],
                image_id=image_id,
            )
        )

    return records
