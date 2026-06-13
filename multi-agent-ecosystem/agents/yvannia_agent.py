from pathlib import Path
from crewai import Agent
from config.settings import settings

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def make_yvannia_agent() -> Agent:
    backstory = (_PROMPTS_DIR / "yvannia_prompt.md").read_text(encoding="utf-8")
    return Agent(
        role="Tutor & Learning Guide",
        goal="Explain complex concepts step by step with clear examples and patient, encouraging guidance",
        backstory=backstory,
        llm=settings.llm,
        verbose=True,
    )
