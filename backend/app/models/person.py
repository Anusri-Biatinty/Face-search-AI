"""Anonymous photo-collection domain model."""

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from uuid import UUID, uuid4


@dataclass
class Person:
    """An internal collection of face images and their embeddings."""

    person_id: str
    image_paths: list[str]
    embeddings: list[list[float]]
    created_at: str

    def __post_init__(self) -> None:
        UUID(self.person_id)
        if self.embeddings and len(self.image_paths) != len(self.embeddings):
            raise ValueError("Collection images and embeddings must stay aligned.")

    @classmethod
    def create(cls, person_id: str | None = None) -> "Person":
        """Create an anonymous collection with a UUID and UTC timestamp."""
        return cls(
            person_id=person_id or str(uuid4()),
            image_paths=[],
            embeddings=[],
            created_at=datetime.now(timezone.utc).isoformat(),
        )

    def to_dict(self) -> dict[str, object]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: object) -> "Person":
        """Create a validated person from persisted JSON data."""
        if not isinstance(data, dict):
            raise ValueError("Stored person metadata must be an object.")
        required = ("person_id", "image_paths", "created_at")
        if any(field not in data for field in required):
            raise ValueError("Stored person metadata is incomplete.")
        if not isinstance(data["image_paths"], list) or not all(
            isinstance(path, str) for path in data["image_paths"]
        ):
            raise ValueError("Stored person image paths are invalid.")
        embeddings = data.get("embeddings", [])
        if not isinstance(embeddings, list) or not all(
            isinstance(embedding, list) for embedding in embeddings
        ):
            raise ValueError("Stored collection embeddings are invalid.")
        if embeddings and len(data["image_paths"]) != len(embeddings):
            raise ValueError("Stored collection images and embeddings are misaligned.")
        return cls(
            person_id=data["person_id"],
            image_paths=data["image_paths"],
            embeddings=embeddings,
            created_at=data["created_at"],
        )
