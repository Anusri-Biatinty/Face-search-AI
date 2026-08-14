"""Face-registration endpoint."""

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core.image_loader import get_image_store
from app.core.index_loader import get_face_index, save_face_index
from app.services.upload_service import upload_and_index_images

router = APIRouter(tags=["registration"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_image(file: UploadFile = File(...)) -> dict[str, object]:
    """Compatibility endpoint that indexes all faces from one image."""
    image_store = get_image_store()
    face_index = get_face_index()

    try:
        record = (await upload_and_index_images([file], image_store, face_index))[0]
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error

    image_store.save()
    save_face_index(face_index)
    return {"image_id": record.image_id, "faces_indexed": len(record.faces)}
