from dataclasses import dataclass, field


@dataclass
class Sprint:
    goal: str
    stories: list[str] = field(default_factory=list)
    tasks: list[str] = field(default_factory=list)
    acceptance: list[str] = field(default_factory=list)
    timeline: list[str] = field(default_factory=list)
    risks: list[str] = field(default_factory=list)
