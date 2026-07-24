import os
from typing import Optional


def get_database_url() -> Optional[str]:
    return os.environ.get("DATABASE_URL")


def create_engine_if_configured():
    url = get_database_url()
    if not url:
        return None

    try:
        from sqlalchemy import create_engine
        engine = create_engine(url)
        return engine
    except Exception:
        # SQLAlchemy not installed or cannot create engine
        return None
