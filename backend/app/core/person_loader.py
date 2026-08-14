"""Shared loader for persistent person metadata."""

from functools import lru_cache

from app.core.storage import PERSON_METADATA_PATH
from app.services.person_store import PersonStore
from app.services.vector_index import FaceIndex


@lru_cache(maxsize=1)
def get_person_store() -> PersonStore:
    return PersonStore(PERSON_METADATA_PATH)


def initialize_person_store(face_index: FaceIndex) -> PersonStore:
    """Load persisted people before the application serves requests."""
    person_store = get_person_store()
    person_store.load()
    if person_store.backfill_embeddings(face_index):
        person_store.save()
    return person_store
