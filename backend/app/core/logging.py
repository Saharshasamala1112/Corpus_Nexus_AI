import logging
import sys
from contextvars import ContextVar

from app.core.config import get_settings

request_id_var: ContextVar[str | None] = ContextVar("request_id", default=None)

LOG_FORMATTER = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"


class RequestContextFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_var.get() or "-"
        return True


def setup_logging() -> logging.Logger:
    settings = get_settings()
    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)
    handler.setFormatter(logging.Formatter(LOG_FORMATTER))
    handler.addFilter(RequestContextFilter())

    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    root_logger.handlers.clear()
    root_logger.addHandler(handler)

    # Suppress noisy third-party loggers
    for noisy in ("uvicorn.access", "httpcore", "httpx"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    return logging.getLogger("corpusguard")


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(f"corpusguard.{name}")
