"""Persistent repository for person metadata."""

import json
from pathlib import Path
from threading import RLock

from app.models.person import Person
from app.services.vector_index import FaceIndex


class PersonNotFoundError(KeyError):
    """Raised when a person ID is not present in the repository."""


class PersonStore:
    """JSON-backed repository of people and their image paths."""

    def __init__(self, metadata_path: str | Path) -> None:
        self.metadata_path = Path(metadata_path)
        self._people: dict[str, Person] = {}
        self._lock = RLock()

    def load(self) -> None:
        """Load validated metadata when it has been persisted."""
        if not self.metadata_path.is_file():
            return
        with self.metadata_path.open(encoding="utf-8") as file:
            raw_people = json.load(file)
        if not isinstance(raw_people, list):
            raise ValueError("Person metadata must contain a list of people.")
        people = [Person.from_dict(raw_person) for raw_person in raw_people]
        person_map = {person.person_id: person for person in people}
        if len(person_map) != len(people):
            raise ValueError("Person metadata contains duplicate person IDs.")
        with self._lock:
            self._people = person_map

    def save(self) -> None:
        """Persist person metadata to JSON."""
        self.metadata_path.parent.mkdir(parents=True, exist_ok=True)
        with self._lock:
            data = [person.to_dict() for person in self._people.values()]
        with self.metadata_path.open("w", encoding="utf-8") as file:
            json.dump(data, file, ensure_ascii=False, indent=2)

    def add(self, person: Person) -> None:
        with self._lock:
            if person.person_id in self._people:
                raise ValueError("A person with this ID already exists.")
            self._people[person.person_id] = person

    def get(self, person_id: str) -> Person:
        with self._lock:
            try:
                return self._people[person_id]
            except KeyError as error:
                raise PersonNotFoundError(person_id) from error

    def add_images(
        self,
        person_id: str,
        image_paths: list[str],
        embeddings: list[list[float]],
    ) -> Person:
        """Append collection images and their matching embeddings."""
        if len(image_paths) != len(embeddings):
            raise ValueError("Collection images and embeddings must stay aligned.")
        with self._lock:
            person = self.get(person_id)
            person.image_paths.extend(image_paths)
            person.embeddings.extend(embeddings)
            return person

    def backfill_embeddings(self, face_index: FaceIndex) -> bool:
        """Migrate legacy collections by reconstructing aligned FAISS vectors."""
        embeddings_by_path = {
            metadata["image_path"]: face_index.index.reconstruct(position).tolist()
            for position, metadata in enumerate(face_index.metadata)
        }
        changed = False

        with self._lock:
            for person in self._people.values():
                if person.embeddings:
                    continue
                try:
                    person.embeddings = [
                        embeddings_by_path[image_path]
                        for image_path in person.image_paths
                    ]
                except KeyError as error:
                    raise ValueError(
                        "A legacy collection image is missing its FAISS embedding."
                    ) from error
                changed = True

        return changed
