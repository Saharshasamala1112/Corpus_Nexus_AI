import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_v1_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import get_logger, request_id_var, setup_logging

logger = get_logger("main")

_rate_limit_store: dict[str, list[float]] = {}


def _rate_limiter(request: Request) -> None:
    settings = get_settings()
    if not settings.RATE_LIMIT_ENABLED:
        return
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    window = settings.RATE_LIMIT_WINDOW_SECONDS
    max_requests = settings.RATE_LIMIT_MAX_REQUESTS
    timestamps = _rate_limit_store.get(client_ip, [])
    timestamps = [t for t in timestamps if now - t < window]
    if len(timestamps) >= max_requests:
        raise RateLimitExceeded()
    timestamps.append(now)
    _rate_limit_store[client_ip] = timestamps


class RateLimitExceeded(Exception):
    pass


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Enterprise AI copilot for codebase understanding",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # ---------------------------------------------------------------------------
    # Middleware
    # ---------------------------------------------------------------------------

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def rate_limit_middleware(request: Request, call_next):
        if request.url.path.startswith("/api/"):
            try:
                _rate_limiter(request)
            except RateLimitExceeded:
                return JSONResponse(
                    status_code=429,
                    content={
                        "error": {"code": 429, "message": "Too many requests. Please slow down."}
                    },
                )
        return await call_next(request)

    @app.middleware("http")
    async def request_logging_middleware(request: Request, call_next):
        import uuid

        req_id = str(uuid.uuid4())[:8]
        request_id_var.set(req_id)

        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000

        logger.info(
            "%s %s -> %d (%.1fms)",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response

    # ---------------------------------------------------------------------------
    # Exception handlers
    # ---------------------------------------------------------------------------

    register_exception_handlers(app)

    # ---------------------------------------------------------------------------
    # Routes
    # ---------------------------------------------------------------------------

    app.include_router(api_v1_router)

    # ---------------------------------------------------------------------------
    # Lifecycle
    # ---------------------------------------------------------------------------

    @app.on_event("startup")
    async def on_startup() -> None:
        setup_logging()
        logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)

        if "sqlite" not in settings.DATABASE_URL:
            from app.database.session import init_db

            await init_db()
            logger.info("Database initialized (PostgreSQL/production)")
        else:
            from app.database.session import init_db

            await init_db()
            logger.info("Database initialized (SQLite/development)")

    @app.on_event("shutdown")
    async def on_shutdown() -> None:
        logger.info("Shutting down %s", settings.APP_NAME)

    return app


app = create_app()
