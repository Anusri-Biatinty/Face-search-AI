"""Consistent JSON error responses and validation-failure logging."""

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


def register_error_handlers(app: FastAPI) -> None:
    """Attach production-safe error handlers to the FastAPI application."""

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request,
        exception: StarletteHTTPException,
    ) -> JSONResponse:
        message = _error_message(exception.detail)
        if 400 <= exception.status_code < 500:
            logger.warning(
                "API validation failure: path=%s status=%s message=%s",
                request.url.path,
                exception.status_code,
                message,
            )
        return _error_response(exception.status_code, message)

    @app.exception_handler(RequestValidationError)
    async def request_validation_handler(
        request: Request,
        exception: RequestValidationError,
    ) -> JSONResponse:
        logger.warning(
            "Request validation failure: path=%s errors=%s",
            request.url.path,
            exception.errors(),
        )
        return _error_response(
            status_code=422,
            message="Invalid request data. Check the required fields and file upload.",
            code="request_validation_error",
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(
        request: Request,
        exception: Exception,
    ) -> JSONResponse:
        logger.exception("Unhandled API error: path=%s", request.url.path)
        return _error_response(
            status_code=500,
            message="An unexpected server error occurred.",
            code="internal_server_error",
        )


def _error_response(
    status_code: int,
    message: str,
    code: str | None = None,
) -> JSONResponse:
    """Create the standard error payload used by every API endpoint."""
    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "code": code or _error_code(status_code),
                "message": message,
            }
        },
    )


def _error_message(detail: object) -> str:
    """Avoid leaking arbitrary error structures in API responses."""
    return detail if isinstance(detail, str) else "The request could not be processed."


def _error_code(status_code: int) -> str:
    """Map standard HTTP statuses to stable client-facing error codes."""
    return {
        404: "not_found",
        413: "payload_too_large",
        415: "unsupported_media_type",
        422: "validation_error",
    }.get(status_code, "request_error")
