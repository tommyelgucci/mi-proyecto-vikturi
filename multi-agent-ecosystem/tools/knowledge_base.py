from __future__ import annotations
import re
from datetime import datetime
from pathlib import Path
from crewai.tools import tool

_KB_DIR = Path(__file__).parent.parent / "context" / "knowledge_base"


@tool("Save to Knowledge Base")
def save_to_knowledge_base(topic: str, summary: str, sources: str) -> str:
    """
    Saves a verified research summary to the local knowledge base.
    Use this after successfully cross-verifying information from multiple sources.
    Args:
        topic: Short title of the topic researched (e.g. 'CrewAI memory system')
        summary: The verified summary to save (markdown formatted)
        sources: Comma-separated list of source URLs used
    """
    _KB_DIR.mkdir(parents=True, exist_ok=True)
    slug = _slugify(topic)
    filepath = _KB_DIR / f"{slug}.md"

    existing_note = ""
    if filepath.exists():
        existing_note = f"\n> ⚠️ Este archivo ya existía y fue actualizado el {datetime.now().strftime('%Y-%m-%d %H:%M')}.\n"

    source_list = "\n".join(
        f"- {s.strip()}" for s in sources.split(",") if s.strip()
    )

    content = f"""# {topic}

*Guardado: {datetime.now().strftime('%Y-%m-%d %H:%M')}*
*Estado: Verificado (múltiples fuentes)*
{existing_note}
## Resumen

{summary}

## Fuentes verificadas

{source_list}
"""
    filepath.write_text(content, encoding="utf-8")
    return (
        f"✅ Guardado en knowledge base: context/knowledge_base/{slug}.md\n"
        f"Dimelis y Yvannia podrán leer este archivo en futuras sesiones."
    )


@tool("Read Knowledge Base")
def read_knowledge_base(topic: str) -> str:
    """
    Reads a previously saved research entry from the local knowledge base.
    Use this before searching the web — if the topic was already researched, use the cached result.
    Args:
        topic: Topic to look up (partial match is fine)
    """
    _KB_DIR.mkdir(parents=True, exist_ok=True)
    files = list(_KB_DIR.glob("*.md"))

    if not files:
        return "La base de conocimiento está vacía. No hay investigaciones previas guardadas."

    slug = _slugify(topic)
    # Exact match first
    exact = _KB_DIR / f"{slug}.md"
    if exact.exists():
        return exact.read_text(encoding="utf-8")

    # Partial match
    matches = [f for f in files if slug[:10] in f.stem or topic.lower()[:10] in f.stem]
    if matches:
        return matches[0].read_text(encoding="utf-8")

    available = ", ".join(f.stem for f in files)
    return (
        f"No encontré '{topic}' en la knowledge base. "
        f"Temas disponibles: {available}"
    )


def _slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "_", text.lower().strip())
    return slug[:60].strip("_")
