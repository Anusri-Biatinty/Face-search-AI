"""Anonymous photo-collection workflows using the existing AI services."""

from datetime import datetime, timezone
from pathlib import Path

from app.models.person import Person
from app.services.face_detector import detect_single_face
from app.services.person_store import PersonStore
from app.services.vector_index import FaceIndex


class PersonEnrollmentError(ValueError):
    """Raised when an image set cannot be enrolled."""


def create_person(
    image_paths: list[Path],
    person_store: PersonStore,
    face_index: FaceIndex,
    person_id: str,
) -> Person:
    """Create an anonymous collection and index each image embedding."""
    embeddings = _extract_embeddings(image_paths)
    person = Person.create(person_id)
    person.image_paths.extend(str(path.resolve()) for path in image_paths)
    person.embeddings.extend(embeddings)
    person_store.add(person)
    _add_embeddings(face_index, person.person_id, image_paths, embeddings)
    return person


def add_person_photos(
    person_id: str,
    image_paths: list[Path],
    person_store: PersonStore,
    face_index: FaceIndex,
) -> Person:
    """Index additional single-face images for one collection."""
    person_store.get(person_id)
    embeddings = _extract_embeddings(image_paths)
    person = person_store.add_images(
        person_id,
        [str(path.resolve()) for path in image_paths],
        embeddings,
    )
    _add_embeddings(face_index, person_id, image_paths, embeddings)
    return person


def _extract_embeddings(image_paths: list[Path]) -> list[list[float]]:
    if not image_paths:
        raise PersonEnrollmentError("At least one image is required.")
    embeddings: list[list[float]] = []
    for image_path in image_paths:
        face = detect_single_face(image_path)
        embeddings.append(face["embedding"])
    return embeddings


def _add_embeddings(face_index: FaceIndex, person_id: str,
                    image_paths: list[Path], embeddings: list[list[float]]) -> None:
    """Add embeddings with their owner person ID."""
    registered_at = datetime.now(timezone.utc).isoformat()
    for image_path, embedding in zip(image_paths, embeddings):
        face_index.add_face(
            embedding,
            {
                "person_id": person_id,
                "image_path": str(image_path.resolve()),
                "filename": image_path.name,
                "registered_at": registered_at,
            },
        )
