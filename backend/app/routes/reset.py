"""Development-only database reset endpoint."""

from os import getenv

from fastapi import APIRouter, HTTPException, status

from app.services.reset_service import reset_database

router = APIRouter(tags=["development"])


def _is_development_mode() -> bool:
    """Return whether reset operations are permitted in this environment."""
    return getenv("APP_ENV", "development").strip().lower() in {
        "development",
        "dev",
        "local",
    }


@router.delete("/reset")
def reset() -> dict[str, object]:
    """Remove all development data and reinitialize empty persistent stores."""
    if not _is_development_mode():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Database reset is available only in development mode.",
        )

    reset_database()
    return {"success": True, "message": "Database reset successfully."}
