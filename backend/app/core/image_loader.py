"""Shared loader for persistent image metadata."""

from functools import lru_cache

from app.core.storage import IMAGE_METADATA_PATH
from app.services.image_store import ImageStore


@lru_cache(maxsize=1)
def get_image_store() -> ImageStore:
    """Return the process-wide image metadata store."""
    return ImageStore(IMAGE_METADATA_PATH)


def initialize_image_store() -> ImageStore:
    """Load persisted image metadata before requests are served."""
    image_store = get_image_store()
    image_store.load()
    return image_store
