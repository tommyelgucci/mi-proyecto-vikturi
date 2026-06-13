from pathlib import Path
from crewai import Agent
from config.settings import settings
from tools.image_tools import analyze_image, generate_image

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def make_drewai_agent() -> Agent:
    backstory = (_PROMPTS_DIR / "drewai_prompt.md").read_text(encoding="utf-8")
    return Agent(
        role="Creative Agent & Visual Designer",
        goal=(
            "Generate creative concepts, analyze images visually, produce optimized prompts "
            "for AI image tools, and craft compelling content for social media and advertising. "
            "Never handle code, technical explanations, or web research."
        ),
        backstory=backstory,
        tools=[analyze_image, generate_image],
        llm=settings.llm,
        verbose=True,
    )
