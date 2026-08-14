"""JSON-backed repository for uploaded-image and face metadata."""

import json
from pathlib import Path
from threading import RLock

from app.models.image import ImageRecord


class ImageStore:
    """Persistent metadata store keyed by original image ID."""

    def __init__(self, metadata_path: str | Path) -> None:
        self.metadata_path = Path(metadata_path)
        self._images: dict[str, ImageRecord] = {}
        self._lock = RLock()

    def load(self) -> None:
        """Load metadata from disk when it exists."""
        if not self.metadata_path.is_file():
            return
        with self.metadata_path.open(encoding="utf-8") as file:
            data = json.load(file)
        if not isinstance(data, dict) or not isinstance(data.get("images"), list):
            raise ValueError("Image metadata must contain an images list.")

        records = [ImageRecord.from_dict(item) for item in data["images"]]
        image_map = {record.image_id: record for record in records}
        if len(image_map) != len(records):
            raise ValueError("Image metadata contains duplicate image IDs.")
        with self._lock:
            self._images = image_map

    def save(self) -> None:
        """Persist all image and face metadata to JSON."""
        self.metadata_path.parent.mkdir(parents=True, exist_ok=True)
        with self._lock:
            payload = {"images": [record.to_dict() for record in self._images.values()]}
        with self.metadata_path.open("w", encoding="utf-8") as file:
            json.dump(payload, file, ensure_ascii=False, indent=2)

    def add(self, record: ImageRecord) -> None:
        """Store a newly processed image record."""
        with self._lock:
            if record.image_id in self._images:
                raise ValueError("Image metadata already exists for this ID.")
            self._images[record.image_id] = record

    def reset(self) -> None:
        """Remove all in-memory image records."""
        with self._lock:
            self._images.clear()

    def get(self, image_id: str) -> ImageRecord | None:
        """Return image metadata or None for an unknown image ID."""
        with self._lock:
            return self._images.get(image_id)
