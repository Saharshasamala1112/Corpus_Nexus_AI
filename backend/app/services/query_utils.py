def build_query_variants(question: str) -> list[str]:
    variants = []
    cleaned = normalize_text(question)
    if cleaned:
        variants.append(cleaned)

    tokens = [token for token in tokenize(cleaned) if len(token) > 2]
    if tokens:
        variants.append(" ".join(tokens[:8]))

    lowered = cleaned.lower()
    if any(
        keyword in lowered for keyword in ["deploy", "docker", "kubernetes", "service"]
    ):
        variants.append("deployment docker infrastructure")
    if any(keyword in lowered for keyword in ["api", "endpoint", "schema", "database"]):
        variants.append("api schema database")
    if any(keyword in lowered for keyword in ["git", "repository", "branch", "commit"]):
        variants.append("repository git workflow")

    seen: set[str] = set()
    unique: list[str] = []
    for variant in variants:
        if variant and variant.lower() not in seen:
            seen.add(variant.lower())
            unique.append(variant)
    return unique
