"""Face-search endpoint."""

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core.image_loader import get_image_store
from app.core.index_loader import get_face_index
from app.core.storage import storage_url
from app.services.search_service import search_images
from app.utils.image_upload import save_image_upload

router = APIRouter(tags=["search"])


@router.post("/search")
async def search_image(file: UploadFile = File(...)) -> dict[str, object]:
    """Search indexed faces using one validated query face."""
    _, image_path = await save_image_upload(file)

    try:
        matches = search_images(
            image_path=image_path,
            face_index=get_face_index(),
            image_store=get_image_store(),
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error
    finally:
        # Query uploads are not indexed, so they are no longer needed after search.
        image_path.unlink(missing_ok=True)

    return {
        "matches": [
            {
                "image_id": match["image_id"],
                "filename": match["filename"],
                "path": storage_url(match["path"]),
                "score": match["score"],
            }
            for match in matches
        ]
    }
