from app.parsers.base import BaseParser, ParsedDocument
from app.parsers.markdown_parser import MarkdownParser
from app.parsers.python_parser import PythonParser
from app.parsers.typescript_parser import TypeScriptParser
from app.parsers.yaml_parser import YamlParser
from app.parsers.json_parser import JsonParser
from app.parsers.text_parser import TextParser

PARSERS: dict[str, type[BaseParser]] = {
    ".md": MarkdownParser,
    ".markdown": MarkdownParser,
    ".py": PythonParser,
    ".ts": TypeScriptParser,
    ".tsx": TypeScriptParser,
    ".js": TypeScriptParser,
    ".jsx": TypeScriptParser,
    ".yaml": YamlParser,
    ".yml": YamlParser,
    ".json": JsonParser,
    ".txt": TextParser,
    ".rst": TextParser,
    ".cfg": TextParser,
    ".ini": TextParser,
    ".toml": TextParser,
    ".env": TextParser,
    ".sh": TextParser,
    ".dockerfile": TextParser,
}


def get_parser(file_path: str) -> BaseParser:
    import os

    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    parser_cls = PARSERS.get(ext, TextParser)
    return parser_cls()
