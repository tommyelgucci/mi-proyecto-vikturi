import json
from datetime import datetime
from pathlib import Path

_HISTORY_FILE = Path(__file__).parent / "history.json"
_SUMMARY_FILE = Path(__file__).parent.parent / "context" / "session_memory.md"


def save_interaction(user_input: str, agent_response: str, training_mode: bool = False) -> None:
    """Append one interaction to the persistent history and refresh the markdown summary."""
    history = _load_history()
    history.append({
        "timestamp": datetime.now().isoformat(),
        "type": "training" if training_mode else "query",
        "user_input": user_input,
        # Truncate very long responses to keep the file manageable
        "agent_response": agent_response[:3000],
    })
    _HISTORY_FILE.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding="utf-8")
    _export_markdown_summary(history)


def get_recent_context(n: int = 5) -> str:
    """Return the last n interactions as a plain-text block for context injection."""
    history = _load_history()
    if not history:
        return ""
    lines = ["## Historial de sesiones recientes (últimas interacciones)\n"]
    for entry in history[-n:]:
        date = entry["timestamp"][:16].replace("T", " ")
        label = "ENTRENAMIENTO" if entry["type"] == "training" else "CONSULTA"
        lines.append(f"[{date}] {label}")
        lines.append(f"  Usuario: {entry['user_input']}")
        lines.append(f"  Respuesta: {entry['agent_response'][:400]}...")
        lines.append("")
    return "\n".join(lines)


def get_stats() -> dict:
    """Return simple statistics about the history."""
    history = _load_history()
    queries = [e for e in history if e["type"] == "query"]
    trainings = [e for e in history if e["type"] == "training"]
    last_date = history[-1]["timestamp"][:10] if history else "nunca"
    return {
        "total": len(history),
        "queries": len(queries),
        "trainings": len(trainings),
        "last_date": last_date,
    }


def _load_history() -> list:
    if not _HISTORY_FILE.exists():
        return []
    try:
        return json.loads(_HISTORY_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _export_markdown_summary(history: list) -> None:
    """Write a human-readable markdown file to context/ so context_loader picks it up."""
    if not history:
        return
    stats = {
        "total": len(history),
        "queries": sum(1 for e in history if e["type"] == "query"),
        "trainings": sum(1 for e in history if e["type"] == "training"),
    }
    lines = [
        "# Memoria Persistente del Ecosistema",
        "",
        f"*Última actualización: {datetime.now().strftime('%Y-%m-%d %H:%M')}*",
        f"- Interacciones totales: {stats['total']}",
        f"- Consultas: {stats['queries']} | Entrenamientos: {stats['trainings']}",
        "",
        "## Últimas 10 interacciones",
        "",
    ]
    for entry in history[-10:]:
        date = entry["timestamp"][:16].replace("T", " ")
        label = "ENTRENAMIENTO" if entry["type"] == "training" else "CONSULTA"
        lines.append(f"### [{date}] {label}")
        lines.append(f"**Usuario:** {entry['user_input']}")
        lines.append(f"**Respuesta:** {entry['agent_response'][:500]}...")
        lines.append("")
    _SUMMARY_FILE.write_text("\n".join(lines), encoding="utf-8")
