import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api.v1.router import api_v1_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import get_logger, request_id_var, setup_logging
from app.core.rate_limiter import check_rate_limit, clear_rate_limiter, close_rate_limiter
from app.schemas.common import HealthCheckResult, HealthResponse

logger = get_logger("main")


class RateLimitExceeded(Exception):
    pass


@asynccontextmanager
async def lifespan(application: FastAPI):
    settings = get_settings()
    setup_logging()
    logger.info("Starting %s v%s", settings.APP_NAME, settings.APP_VERSION)

    if settings.JWT_SECRET_KEY == "change-me-in-production":
        logger.warning("JWT_SECRET_KEY is set to default value -- update in production!")

    await init_database(settings)

    yield

    await close_rate_limiter()
    clear_rate_limiter()
    logger.info("Shutting down %s", settings.APP_NAME)


async def init_database(settings) -> None:
    from app.database.session import init_db

    await init_db()
    db_type = (
        "PostgreSQL/production" if "sqlite" not in settings.DATABASE_URL else "SQLite/development"
    )
    logger.info("Database initialized (%s)", db_type)


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Enterprise AI copilot for codebase understanding",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

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
            client_ip = request.client.host if request.client else "unknown"
            allowed = await check_rate_limit(client_ip)
            if not allowed:
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

    register_exception_handlers(app)
    app.include_router(api_v1_router)

    @app.get("/health", tags=["health"])
    async def root_health():
        from app.database.session import engine as db_engine
        from app.vectorstore import get_vector_store

        checks: dict[str, HealthCheckResult] = {}

        try:
            async with db_engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            checks["database"] = HealthCheckResult(status="healthy")
        except Exception as exc:
            checks["database"] = HealthCheckResult(status="unhealthy", detail=str(exc))

        try:
            vs = get_vector_store()
            vs_count = vs.count()
            checks["vector_store"] = HealthCheckResult(
                status="healthy", detail=f"{vs_count} documents indexed"
            )
        except Exception as exc:
            checks["vector_store"] = HealthCheckResult(status="unhealthy", detail=str(exc))

        all_healthy = all(c.status == "healthy" for c in checks.values())
        return HealthResponse(
            status="healthy" if all_healthy else "degraded",
            version=settings.APP_VERSION,
            service=settings.APP_NAME,
            checks=checks,
        )

    return app


app = create_app()
