import ast
import re

from app.parsers.base import BaseParser, ParsedDocument


class PythonParser(BaseParser):
    def parse(self, file_path: str) -> ParsedDocument:
        content = self._read_file(file_path)
        extracted = self._extract_python(content)
        metadata = self._build_metadata(file_path, {
            "document_type": "source_code",
            "language": "python",
        })
        return ParsedDocument(content=extracted, metadata=metadata)

    def _extract_python(self, content: str) -> str:
        parts: list[str] = []
        try:
            tree = ast.parse(content)
        except SyntaxError:
            return content

        for node in ast.iter_child_nodes(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                docstring = ast.get_docstring(node) or ""
                parts.append(f"def {node.name}():\n    {docstring}" if docstring else f"def {node.name}()")
            elif isinstance(node, ast.ClassDef):
                docstring = ast.get_docstring(node) or ""
                methods = [
                    n.name for n in node.body
                    if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))
                ]
                header = f"class {node.name}:"
                if docstring:
                    header += f"\n    {docstring}"
                if methods:
                    header += f"\n    Methods: {', '.join(methods)}"
                parts.append(header)
            elif isinstance(node, ast.Assign):
                targets = [self._get_name(t) for t in node.targets]
                parts.append(f"{' = '.join(targets)} = ...")
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                parts.append(ast.get_source_segment(content, node) or "")

        if not parts:
            lines = [l for l in content.split("\n") if l.strip() and not l.strip().startswith("#")]
            parts = [" ".join(lines[:50])]

        return "\n".join(parts)

    def _get_name(self, node: ast.expr) -> str:
        if isinstance(node, ast.Name):
            return node.id
        if isinstance(node, ast.Attribute):
            return f"{self._get_name(node.value)}.{node.attr}"
        return "_"
