import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture(autouse=True)
def mock_env(monkeypatch):
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key-123")
    monkeypatch.setenv("MODEL", "claude-sonnet-4-6")


@patch("crewai.Agent")
def test_drewai_agent_instantiates(mock_agent_cls):
    agent = MagicMock()
    agent.role = "Creative Agent & Visual Designer"
    mock_agent_cls.return_value = agent
    from agents.drewai_agent import make_drewai_agent
    result = make_drewai_agent()
    assert result is not None


def test_generate_image_stub_no_keys(monkeypatch):
    monkeypatch.delenv("DALLE_API_KEY", raising=False)
    monkeypatch.delenv("FLUX_API_KEY", raising=False)
    from tools.image_tools import generate_image
    result = generate_image.func(description="A cat wearing sunglasses on the beach")
    assert "no activada" in result or "DALLE_API_KEY" in result
    # Must include an optimized prompt for manual use
    assert "sunglasses" in result.lower() or "cat" in result.lower()


def test_generate_image_includes_optimized_prompt(monkeypatch):
    monkeypatch.delenv("DALLE_API_KEY", raising=False)
    monkeypatch.delenv("FLUX_API_KEY", raising=False)
    from tools.image_tools import generate_image
    result = generate_image.func(description="A futuristic city at night")
    assert "futuristic city" in result.lower()


def test_analyze_image_bad_path():
    from tools.image_tools import analyze_image
    result = analyze_image.func(image_source="/nonexistent/image.jpg")
    assert "Error" in result or "error" in result


def test_optimize_prompt_appends_quality_suffix():
    from tools.image_tools import _optimize_prompt
    result = _optimize_prompt("A red dragon flying over mountains")
    assert "high quality" in result or "4K" in result or "detailed" in result


def test_optimize_prompt_photo_style():
    from tools.image_tools import _optimize_prompt
    result = _optimize_prompt("photo of a sunset")
    assert "photorealistic" in result or "DSLR" in result
