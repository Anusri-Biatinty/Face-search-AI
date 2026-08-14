"""Filesystem locations for persistent image and metadata storage."""

from os import getenv
from pathlib import Path

DEFAULT_STORAGE_DIR = Path(__file__).resolve().parents[2] / "storage"
STORAGE_DIR = Path(getenv("FACE_STORAGE_DIR", str(DEFAULT_STORAGE_DIR)))
IMAGES_DIR = STORAGE_DIR / "images"
IMAGE_METADATA_PATH = STORAGE_DIR / "metadata.json"
# Retained for legacy endpoints and data migration only.
PEOPLE_DIR = STORAGE_DIR / "people"
PERSON_METADATA_PATH = STORAGE_DIR / "people.json"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)


def person_image_directory(person_id: str) -> Path:
    """Return and create the directory reserved for one person's images."""
    directory = PEOPLE_DIR / person_id
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def image_directory() -> Path:
    """Return and create the directory containing original uploaded images."""
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    return IMAGES_DIR


def storage_url(image_path: str | Path) -> str:
    """Return the public URL path for an image inside persistent storage."""
    image_relative_path = Path(image_path).resolve().relative_to(STORAGE_DIR.resolve())
    return f"/storage/{image_relative_path.as_posix()}"
