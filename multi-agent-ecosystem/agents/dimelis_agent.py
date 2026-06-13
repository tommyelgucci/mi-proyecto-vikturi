from pathlib import Path
from crewai import Agent
from config.settings import settings

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def make_dimelis_agent() -> Agent:
    backstory = (_PROMPTS_DIR / "dimelis_prompt.md").read_text(encoding="utf-8")
    return Agent(
        role="Code Organizer & Developer Assistant",
        goal="Organize, structure, and explain code projects clearly and concisely with best practices",
        backstory=backstory,
        llm=settings.llm,
        verbose=True,
    )
