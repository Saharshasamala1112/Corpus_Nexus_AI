import ast

from app.parsers.base import BaseParser, ParsedDocument


class PythonParser(BaseParser):
    def parse(self, file_path: str) -> ParsedDocument:
        content = self._read_file(file_path)
        extracted = self._extract_python(content)
        metadata = self._build_metadata(
            file_path,
            {
                "document_type": "source_code",
                "language": "python",
            },
        )
        return ParsedDocument(content=extracted, metadata=metadata)

    def _extract_python(self, content: str) -> str:
        parts: list[str] = []
        try:
            tree = ast.parse(content)
        except SyntaxError:
            return content

        for node in ast.iter_child_nodes(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                source = ast.get_source_segment(content, node) or ""
                parts.append(source)
            elif isinstance(node, ast.Assign):
                targets = [self._get_name(t) for t in node.targets]
                parts.append(f"{' = '.join(targets)} = ...")
            elif isinstance(node, (ast.Import, ast.ImportFrom)):
                parts.append(ast.get_source_segment(content, node) or "")

        if not parts:
            lines = [
                line
                for line in content.split("\n")
                if line.strip() and not line.strip().startswith("#")
            ]
            parts = [" ".join(lines[:50])]

        return "\n".join(parts)

    def _get_name(self, node: ast.expr) -> str:
        if isinstance(node, ast.Name):
            return node.id
        if isinstance(node, ast.Attribute):
            return f"{self._get_name(node.value)}.{node.attr}"
        return "_"
