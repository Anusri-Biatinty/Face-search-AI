"""Development-only reset workflow for all persisted face-search data."""

import logging
import shutil
from pathlib import Path

from app.core.image_loader import get_image_store
from app.core.index_loader import INDEX_PATH, get_face_index, save_face_index
from app.core.storage import (
    IMAGE_METADATA_PATH,
    IMAGES_DIR,
    PEOPLE_DIR,
    PERSON_METADATA_PATH,
    STORAGE_DIR,
)
from app.services.image_store import ImageStore
from app.services.vector_index import FaceIndex
from app.utils.image_upload import UPLOAD_DIR

logger = logging.getLogger(__name__)
FACE_CROPS_DIR = STORAGE_DIR / "face_crops"


def reset_database(
    face_index: FaceIndex | None = None,
    image_store: ImageStore | None = None,
) -> None:
    """Clear files and live state, then persist fresh empty data stores."""
    index = face_index or get_face_index()
    store = image_store or get_image_store()
    index_metadata_path = INDEX_PATH.with_suffix(f"{INDEX_PATH.suffix}.metadata.json")

    logger.warning("Resetting face-search development database.")
    for directory in (IMAGES_DIR, PEOPLE_DIR, FACE_CROPS_DIR, UPLOAD_DIR):
        _remove_directory(directory)
    for file_path in (
        INDEX_PATH,
        index_metadata_path,
        IMAGE_METADATA_PATH,
        PERSON_METADATA_PATH,
    ):
        file_path.unlink(missing_ok=True)

    index.reset()
    store.reset()
    store.save()
    save_face_index(index)
    logger.info("Face-search development database reset successfully.")


def _remove_directory(directory: Path) -> None:
    """Remove a known application-owned directory and all its contents."""
    if directory.exists():
        shutil.rmtree(directory)
