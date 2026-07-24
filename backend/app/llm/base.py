from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class LLMMessage:
    role: str
    content: str


@dataclass
class LLMResponse:
    content: str
    model: str
    usage: dict = field(default_factory=dict)
    finish_reason: str = ""


class BaseLLM(ABC):
    @abstractmethod
    async def chat(
        self,
        messages: list[LLMMessage],
        temperature: float = 0.1,
        max_tokens: int = 4096,
    ) -> LLMResponse: ...

    @abstractmethod
    async def chat_stream(
        self,
        messages: list[LLMMessage],
        temperature: float = 0.1,
        max_tokens: int = 4096,
    ): ...

    @property
    @abstractmethod
    def model_name(self) -> str: ...
