"""
Streamlit Cloud-compatible runner — calls Anthropic API directly, no CrewAI/ChromaDB.
Used by app.py when VIKTURI_SIMPLE_MODE=1 or when running on cloud.
"""
from __future__ import annotations
import os
from pathlib import Path

import anthropic

from memory.session_memory import save_interaction, get_recent_context
from tools.image_tools import generate_image

_PROMPTS = Path(__file__).parent.parent / "prompts"

_IMAGE_KW = ("genera", "generate", "crea una imagen", "hazme una imagen",
             "dibuja", "draw", "diseña una imagen", "imagen de", "foto de")

_CODE_KW = ("código", "code", "función", "function", "clase", "class",
            "script", "pep8", "debugear", "debug", "error en", "refactor",
            "fastapi", "django", "flask", "sql", "api", "def ", "return")

_LEARN_KW = ("explícame", "explica", "qué es", "cómo funciona", "enseñame",
             "no entiendo", "aprend", "tutorial", "paso a paso", "analogía",
             "diferencia entre", "cuándo usar")

_RESEARCH_KW = ("investiga", "busca información", "qué sabes de", "research",
                "fuentes", "documentación", "comparación entre", "últimas noticias")


def _route(request: str) -> tuple[str, str]:
    """Returns (agent_display_name, system_prompt_text)."""
    r = request.lower()

    def _read(name: str) -> str:
        return (_PROMPTS / name).read_text(encoding="utf-8")

    if any(kw in r for kw in _IMAGE_KW):
        return "DrewAI", _read("drewai_prompt.md")
    if any(kw in r for kw in _CODE_KW):
        return "Dimelis AI", _read("dimelis_prompt.md")
    if any(kw in r for kw in _LEARN_KW):
        return "Yvannia AI", _read("yvannia_prompt.md")
    if any(kw in r for kw in _RESEARCH_KW):
        return "Teriania", _read("teriania_prompt.md")
    # Default: Master routes via LLM with all agent descriptions in system prompt
    return "Vikturi AI", _read("master_prompt.md")


def run_simple(user_request: str, training_mode: bool = False) -> str:
    """Runs the ecosystem without CrewAI — single Anthropic API call."""
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        return (
            "❌ **ANTHROPIC_API_KEY no configurada.**\n\n"
            "Ve a Manage app → Settings → Secrets y agrega:\n"
            "```\nANTHROPIC_API_KEY = \"sk-ant-...\"\n```"
        )

    model = os.getenv("MODEL", "claude-sonnet-4-6")
    max_tokens = int(os.getenv("MAX_TOKENS", "4096"))
    recent = get_recent_context(n=5)

    # Training mode uses master prompt + context loader output
    if training_mode:
        system = (_PROMPTS / "master_prompt.md").read_text(encoding="utf-8")
        user_msg = (
            "[MODO ENTRENAMIENTO] Lee el siguiente historial de sesión y prepara "
            f"un briefing para todos los agentes.\n\n{recent}\n\n"
            f"Instrucción adicional: {user_request}"
        )
        agent_label = "Master Trainer"
    else:
        agent_label, system = _route(user_request)

        # Image generation — call tool directly, skip LLM
        if agent_label == "DrewAI" and any(kw in user_request.lower() for kw in _IMAGE_KW):
            result = generate_image.func(description=user_request)
            save_interaction(user_request, result)
            return result

        user_msg = user_request
        if recent:
            user_msg = f"{user_request}\n\n[Contexto de sesión]\n{recent}"

    client = anthropic.Anthropic(api_key=api_key)
    message = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user_msg}],
    )

    result = message.content[0].text
    save_interaction(user_request, result, training_mode=training_mode)
    return result
