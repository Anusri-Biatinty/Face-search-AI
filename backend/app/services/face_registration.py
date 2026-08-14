"""Registration workflow for adding one face to the vector index."""

from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from app.services.face_detector import detect_single_face
from app.services.vector_index import FaceIndex


def register_face(
    image_path: str | Path,
    original_filename: str,
    face_index: FaceIndex,
) -> str:
    """Detect one face, index its embedding, and return its person ID."""
    face = detect_single_face(image_path)

    person_id = str(uuid4())
    face_index.add_face(
        face["embedding"],
        {
            "person_id": person_id,
            "image_path": str(Path(image_path).resolve()),
            "filename": original_filename,
            "registered_at": datetime.now(timezone.utc).isoformat(),
        },
    )
    return person_id
