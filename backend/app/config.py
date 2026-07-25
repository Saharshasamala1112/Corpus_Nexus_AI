import os
from pathlib import Path


def load_dotenv(dotenv_path: str | None = None) -> None:
    """Load environment variables from a .env file if present.

    Existing environment variables are not overwritten.
    """
    if dotenv_path is None:
        root = Path(__file__).resolve().parent.parent
        dotenv_path = root / '.env'
    else:
        dotenv_path = Path(dotenv_path)

    if not dotenv_path.exists():
        return

    for line in dotenv_path.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if '=' not in line:
            continue
        key, value = line.split('=', 1)
        key = key.strip()
        value = value.strip()
        if not key:
            continue
        if value.startswith("'") and value.endswith("'"):
            value = value[1:-1]
        elif value.startswith('"') and value.endswith('"'):
            value = value[1:-1]
        if key not in os.environ:
            os.environ[key] = value
