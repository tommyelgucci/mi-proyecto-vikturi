import pytest
from pathlib import Path
from unittest.mock import patch


@pytest.fixture
def tmp_kb(tmp_path, monkeypatch):
    import tools.knowledge_base as kb
    monkeypatch.setattr(kb, "_KB_DIR", tmp_path / "knowledge_base")
    return tmp_path / "knowledge_base"


def test_save_creates_file(tmp_kb):
    from tools.knowledge_base import save_to_knowledge_base
    result = save_to_knowledge_base.func(
        topic="CrewAI memory",
        summary="CrewAI 1.x supports long-term memory via SQLite.",
        sources="https://docs.crewai.com/concepts/memory, https://github.com/crewai",
    )
    assert "✅" in result
    files = list(tmp_kb.glob("*.md"))
    assert len(files) == 1
    content = files[0].read_text()
    assert "CrewAI memory" in content
    assert "SQLite" in content
    assert "https://docs.crewai.com" in content


def test_read_existing_entry(tmp_kb):
    from tools.knowledge_base import save_to_knowledge_base, read_knowledge_base
    save_to_knowledge_base.func(
        topic="Python decorators",
        summary="A decorator wraps a function to extend its behavior.",
        sources="https://docs.python.org/3/glossary.html#term-decorator",
    )
    result = read_knowledge_base.func(topic="Python decorators")
    assert "decorator" in result.lower()


def test_read_missing_entry(tmp_kb):
    from tools.knowledge_base import read_knowledge_base
    result = read_knowledge_base.func(topic="quantum computing")
    assert "vacía" in result or "No encontré" in result


def test_slugify_handles_special_chars(tmp_kb):
    from tools.knowledge_base import save_to_knowledge_base
    result = save_to_knowledge_base.func(
        topic="FastAPI + JWT Auth (2025)",
        summary="JWT tokens in FastAPI.",
        sources="https://fastapi.tiangolo.com",
    )
    assert "✅" in result
    files = list(tmp_kb.glob("*.md"))
    assert len(files) == 1
    assert " " not in files[0].name


def test_cross_verify_logic():
    from tools.web_search import _cross_verify
    source_a = [{"body": "Python is a high level programming language used widely", "title": "Python"}]
    source_b = [{"body": "Python is widely used high level language for programming tasks", "title": "Python docs"}]
    verified, reason = _cross_verify([source_a, source_b])
    assert verified is True


def test_cross_verify_conflict():
    from tools.web_search import _cross_verify
    source_a = [{"body": "apple orange banana fruit tropical summer delicious sweet", "title": "Fruits"}]
    source_b = [{"body": "quantum physics nuclear reactor electron proton neutron energy", "title": "Physics"}]
    verified, _ = _cross_verify([source_a, source_b])
    assert verified is False
