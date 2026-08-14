"""Persistent metadata models for uploaded images and their detected faces."""

from dataclasses import asdict, dataclass


@dataclass
class FaceRecord:
    """One detected face mapped to its FAISS vector position."""

    face_id: str
    vector_id: int
    embedding_index: int
    bbox: list[float]
    image_id: str


@dataclass
class ImageRecord:
    """One original uploaded image and every face found within it."""

    image_id: str
    filename: str
    path: str
    created_at: str
    faces: list[FaceRecord]

    def to_dict(self) -> dict[str, object]:
        """Return JSON-serializable metadata."""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: object) -> "ImageRecord":
        """Build a validated image record from persisted metadata."""
        if not isinstance(data, dict):
            raise ValueError("Stored image metadata must be an object.")
        required = ("image_id", "filename", "path", "created_at", "faces")
        if any(field not in data for field in required):
            raise ValueError("Stored image metadata is incomplete.")
        if not isinstance(data["faces"], list):
            raise ValueError("Stored image faces must be a list.")

        faces = [FaceRecord(**face) for face in data["faces"]]
        return cls(
            image_id=data["image_id"],
            filename=data["filename"],
            path=data["path"],
            created_at=data["created_at"],
            faces=faces,
        )
