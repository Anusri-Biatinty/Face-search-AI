"""Multi-face image-upload workflow with persistent indexing."""

from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from app.core.storage import image_directory
from app.models.image import ImageRecord
from app.services.embedding_service import extract_all_faces, index_faces
from app.services.image_store import ImageStore
from app.services.vector_index import FaceIndex
from app.utils.image_upload import save_image_upload


async def upload_and_index_images(
    files: list[UploadFile],
    image_store: ImageStore,
    face_index: FaceIndex,
) -> list[ImageRecord]:
    """Save originals, index every face, and return their image metadata."""
    if not files:
        raise HTTPException(status_code=422, detail="At least one image is required.")

    saved_images: list[tuple[str, str, Path]] = []
    try:
        for file in files:
            stored_filename, image_path = await save_image_upload(
                file,
                image_directory(),
            )
            saved_images.append((stored_filename, file.filename or stored_filename, image_path))

        detected_faces = [
            extract_all_faces(image_path)
            for _, _, image_path in saved_images
        ]
    except (HTTPException, ValueError):
        _remove_images([image_path for _, _, image_path in saved_images])
        raise

    records: list[ImageRecord] = []
    for (stored_filename, original_filename, image_path), faces in zip(
        saved_images,
        detected_faces,
    ):
        image_id = str(uuid4())
        face_records = index_faces(
            image_id=image_id,
            image_path=image_path,
            filename=original_filename,
            faces=faces,
            face_index=face_index,
        )
        record = ImageRecord(
            image_id=image_id,
            filename=original_filename,
            path=str(image_path.resolve()),
            created_at=datetime.now(timezone.utc).isoformat(),
            faces=face_records,
        )
        image_store.add(record)
        records.append(record)

    return records


def _remove_images(image_paths: list[Path]) -> None:
    """Remove original images that could not be processed."""
    for image_path in image_paths:
        image_path.unlink(missing_ok=True)
