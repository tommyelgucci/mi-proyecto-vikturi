import json
import pytest
from pathlib import Path
from unittest.mock import patch


@pytest.fixture
def tmp_memory(tmp_path, monkeypatch):
    """Redirect memory files to a temp directory for each test."""
    import memory.session_memory as sm
    monkeypatch.setattr(sm, "_HISTORY_FILE", tmp_path / "history.json")
    monkeypatch.setattr(sm, "_SUMMARY_FILE", tmp_path / "session_memory.md")
    return tmp_path


def test_save_and_load(tmp_memory):
    from memory.session_memory import save_interaction, get_recent_context, get_stats
    save_interaction("¿Qué es un decorador?", "Un decorador es...", training_mode=False)
    save_interaction("Entrena agentes", "Briefing generado.", training_mode=True)

    stats = get_stats()
    assert stats["total"] == 2
    assert stats["queries"] == 1
    assert stats["trainings"] == 1

    context = get_recent_context(n=5)
    assert "decorador" in context
    assert "ENTRENAMIENTO" in context


def test_empty_history_returns_empty_string(tmp_memory):
    from memory.session_memory import get_recent_context
    assert get_recent_context() == ""


def test_markdown_summary_created(tmp_memory):
    from memory.session_memory import save_interaction
    save_interaction("pregunta", "respuesta")
    summary = (tmp_memory / "session_memory.md").read_text()
    assert "Memoria Persistente" in summary
    assert "pregunta" in summary
