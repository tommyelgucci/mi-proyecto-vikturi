from pathlib import Path
from crewai import Agent
from config.settings import settings
from tools.context_loader import context_loader

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def make_master_agent() -> Agent:
    backstory = (_PROMPTS_DIR / "master_prompt.md").read_text(encoding="utf-8")
    return Agent(
        role="Master Trainer & Orchestrator",
        goal="Understand the user's request and delegate it to the right specialist, or train agents using context files",
        backstory=backstory,
        tools=[context_loader],
        llm=settings.llm,
        verbose=True,
        allow_delegation=True,
    )
