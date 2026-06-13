from pathlib import Path
from crewai import Agent
from config.settings import settings
from tools.web_search import web_search
from tools.knowledge_base import save_to_knowledge_base, read_knowledge_base

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def make_teriania_agent() -> Agent:
    backstory = (_PROMPTS_DIR / "teriania_prompt.md").read_text(encoding="utf-8")
    return Agent(
        role="Researcher & Summarizer",
        goal=(
            "Find, read, and summarize documentation from multiple verified sources. "
            "Cross-verify information before reporting it. Save verified research to the "
            "knowledge base. Never invent or hallucinate information."
        ),
        backstory=backstory,
        tools=[web_search, save_to_knowledge_base, read_knowledge_base],
        llm=settings.llm,
        verbose=True,
    )
