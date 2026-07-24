from dataclasses import dataclass


@dataclass
class Member:
    id: str
    name: str
    role: str
    skill: str
    availability: int
