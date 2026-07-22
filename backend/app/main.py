import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import get_logger, request_id_var, setup_logging

logger = get_logger("main")


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
