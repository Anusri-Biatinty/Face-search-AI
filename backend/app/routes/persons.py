"""Multi-face upload endpoint retained at the existing /persons path."""

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core.image_loader import get_image_store
from app.core.index_loader import get_face_index, save_face_index
from app.services.upload_service import upload_and_index_images

router = APIRouter(prefix="/persons", tags=["uploads"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_images(images: list[UploadFile] = File(...)) -> dict[str, int]:
    """Store originals and index every detected face from uploaded images."""
    image_store = get_image_store()
    face_index = get_face_index()

    try:
        records = await upload_and_index_images(images, image_store, face_index)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    image_store.save()
    save_face_index(face_index)
    return {
        "images_processed": len(records),
        "faces_indexed": sum(len(record.faces) for record in records),
    }
