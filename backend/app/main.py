"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.error_handlers import register_error_handlers
from app.core.index_loader import initialize_face_index
from app.core.image_loader import initialize_image_store
from app.core.storage import STORAGE_DIR
from app.routes.persons import router as persons_router
from app.routes.register import router as register_router
from app.routes.reset import router as reset_router
from app.routes.search import router as search_router
from app.routes.upload import router as upload_router
from app.utils.image_upload import UPLOAD_DIR


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Load the persistent face index before serving requests."""
    initialize_face_index()
    initialize_image_store()
    yield


app = FastAPI(title="AI Face Search API", lifespan=lifespan)
register_error_handlers(app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/storage", StaticFiles(directory=STORAGE_DIR), name="storage")
app.include_router(upload_router)
app.include_router(register_router)
app.include_router(search_router)
app.include_router(persons_router)
app.include_router(reset_router)
