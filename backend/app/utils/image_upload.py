"""Shared validation and persistence for uploaded images."""

import logging

from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

logger = logging.getLogger(__name__)

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MiB
CHUNK_SIZE = 1024 * 1024

# The content-type header is only a hint, so the file signature is also checked.
IMAGE_SIGNATURES = {
    b"\x89PNG\r\n\x1a\n": ".png",
    b"\xff\xd8\xff": ".jpg",
    b"GIF87a": ".gif",
    b"GIF89a": ".gif",
}
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
CONTENT_TYPE_BY_EXTENSION = {
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
}


def image_extension(contents: bytes) -> str | None:
    """Return the matching allowed image extension, or None for non-images."""
    if contents.startswith(b"RIFF") and contents[8:12] == b"WEBP":
        return ".webp"

    for signature, extension in IMAGE_SIGNATURES.items():
        if contents.startswith(signature):
            return extension
    return None


async def save_image_upload(
    file: UploadFile,
    destination_dir: Path = UPLOAD_DIR,
) -> tuple[str, Path]:
    """Validate and save an uploaded image, returning its generated path."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        _reject(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            "Only JPEG, PNG, GIF, and WebP images are supported.",
        )

    first_chunk = await file.read(CHUNK_SIZE)
    extension = image_extension(first_chunk)
    if extension is None:
        _reject(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "The uploaded file is not a supported image.",
        )
    if file.content_type != CONTENT_TYPE_BY_EXTENSION[extension]:
        _reject(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "The image content does not match its declared content type.",
        )

    destination_dir.mkdir(parents=True, exist_ok=True)
    upload_name = f"{uuid4().hex}{extension}"
    destination = destination_dir / upload_name
    bytes_written = 0

    try:
        with destination.open("xb") as output:
            chunk = first_chunk
            while chunk:
                bytes_written += len(chunk)
                if bytes_written > MAX_UPLOAD_BYTES:
                    _reject(
                        status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        (
                            "Image must be no larger than "
                            f"{MAX_UPLOAD_BYTES // (1024 * 1024)} MiB."
                        ),
                    )
                output.write(chunk)
                chunk = await file.read(CHUNK_SIZE)
    except HTTPException:
        destination.unlink(missing_ok=True)
        raise
    finally:
        await file.close()

    return upload_name, destination


def _reject(status_code: int, detail: str) -> None:
    """Log and raise a consistent client validation failure."""
    logger.warning("Image upload validation failed: %s", detail)
    raise HTTPException(status_code=status_code, detail=detail)
