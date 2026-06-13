from pathlib import Path
from crewai import Agent
from config.settings import settings
from tools.web_search import web_search

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def make_teriania_agent() -> Agent:
    backstory = (_PROMPTS_DIR / "teriania_prompt.md").read_text(encoding="utf-8")
    return Agent(
        role="Researcher & Summarizer",
        goal="Find, read, and summarize documentation and articles with precision, objectivity, and clarity",
        backstory=backstory,
        tools=[web_search],
        llm=f"anthropic/{settings.model}",
        verbose=True,
    )
