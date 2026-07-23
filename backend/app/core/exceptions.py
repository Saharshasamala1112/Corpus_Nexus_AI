from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger("exceptions")


class AppException(Exception):
    def __init__(
        self,
        status_code: int,
        message: str,
        detail: Any = None,
    ):
        self.status_code = status_code
        self.message = message
        self.detail = detail


class NotFoundException(AppException):
    def __init__(self, resource: str = "Resource", resource_id: str | None = None):
        msg = f"{resource} not found"
        if resource_id:
            msg = f"{resource} with id '{resource_id}' not found"
        super().__init__(status_code=404, message=msg)


class BadRequestException(AppException):
    def __init__(self, message: str = "Bad request"):
        super().__init__(status_code=400, message=message)


class ConflictException(AppException):
    def __init__(self, message: str = "Conflict"):
        super().__init__(status_code=409, message=message)


async def app_exception_handler(_request: Request, exc: AppException) -> JSONResponse:
    logger.warning("AppException: %s (status=%d)", exc.message, exc.status_code)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.status_code,
                "message": exc.message,
                "detail": exc.detail,
            }
        },
    )


async def validation_exception_handler(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    errors = exc.errors()
    messages = []
    for error in errors:
        loc = " -> ".join(str(part) for part in error.get("loc", []))
        messages.append(f"{loc}: {error.get('msg', '')}")

    logger.warning("Validation error: %s", "; ".join(messages))
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": 422,
                "message": "Validation error",
                "detail": messages,
            }
        },
    )


async def general_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": 500,
                "message": "Internal server error",
                "detail": str(exc) if _app_is_debug() else None,
            }
        },
    )


def _app_is_debug() -> bool:
    from app.core.config import get_settings

    return get_settings().DEBUG


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppException, app_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(
        RequestValidationError,
        validation_exception_handler,  # type: ignore[arg-type]
    )
    app.add_exception_handler(Exception, general_exception_handler)  # type: ignore[arg-type]
