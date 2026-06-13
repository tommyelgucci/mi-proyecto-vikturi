from pathlib import Path
from langchain.tools import tool

_CONTEXT_DIR = Path(__file__).parent.parent / "context"


@tool("Context Loader")
def context_loader(query: str) -> str:
    """Reads all .md and .txt files from the context/ folder and returns their combined content for agent training."""
    files = sorted(
        list(_CONTEXT_DIR.glob("*.md")) + list(_CONTEXT_DIR.glob("*.txt"))
    )
    if not files:
        return "No context files found in the context/ directory. Add .md or .txt files there to use training mode."
    parts = []
    for f in files:
        parts.append(f"=== {f.name} ===\n{f.read_text(encoding='utf-8')}")
    return "\n\n".join(parts)
