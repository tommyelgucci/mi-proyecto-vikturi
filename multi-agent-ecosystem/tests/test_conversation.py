"""Tests for multi-turn conversation and image analysis features."""
import pytest
from unittest.mock import MagicMock, patch


# ── _build_conv_messages ──────────────────────────────────────────────────────

def test_build_conv_messages_skips_leading_assistant():
    from crew.ecosystem_simple import _build_conv_messages
    history = [
        {"role": "assistant", "content": "¡Hola! Soy Vikturi AI..."},  # welcome
        {"role": "user",      "content": "hola"},
        {"role": "assistant", "content": "¡Hola! ¿En qué te ayudo?"},
    ]
    result = _build_conv_messages(history)
    assert result[0]["role"] == "user"
    assert len(result) == 2


def test_build_conv_messages_empty_history():
    from crew.ecosystem_simple import _build_conv_messages
    assert _build_conv_messages(None) == []
    assert _build_conv_messages([]) == []


def test_build_conv_messages_preserves_order():
    from crew.ecosystem_simple import _build_conv_messages
    history = [
        {"role": "user",      "content": "mensaje 1"},
        {"role": "assistant", "content": "respuesta 1"},
        {"role": "user",      "content": "mensaje 2"},
        {"role": "assistant", "content": "respuesta 2"},
    ]
    result = _build_conv_messages(history)
    roles = [m["role"] for m in result]
    assert roles == ["user", "assistant", "user", "assistant"]


def test_build_conv_messages_truncates_long_content():
    from crew.ecosystem_simple import _build_conv_messages
    long_text = "x" * 5000
    history = [
        {"role": "user",      "content": "pregunta"},
        {"role": "assistant", "content": long_text},
    ]
    result = _build_conv_messages(history)
    assert len(result[1]["content"]) < 4000
    assert "truncado" in result[1]["content"]


def test_build_conv_messages_only_assistant_history():
    """Edge case: only the welcome message in history — returns empty list."""
    from crew.ecosystem_simple import _build_conv_messages
    history = [{"role": "assistant", "content": "Bienvenido"}]
    assert _build_conv_messages(history) == []


# ── _vision_content ───────────────────────────────────────────────────────────

def test_vision_content_structure(tmp_path):
    from crew.ecosystem_simple import _vision_content
    img = tmp_path / "test.png"
    # Minimal valid PNG (1x1 pixel)
    img.write_bytes(
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01'
        b'\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00'
        b'\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18'
        b'\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    content = _vision_content(str(img), "analiza esto")
    assert isinstance(content, list)
    assert content[0]["type"] == "image"
    assert content[1]["type"] == "text"
    assert content[1]["text"] == "analiza esto"
    assert content[0]["source"]["media_type"] == "image/png"


def test_vision_content_default_text(tmp_path):
    from crew.ecosystem_simple import _vision_content
    img = tmp_path / "photo.jpg"
    img.write_bytes(b'\xff\xd8\xff\xe0' + b'\x00' * 100)
    content = _vision_content(str(img), "")
    # Empty text gets a default prompt
    assert len(content[1]["text"]) > 0


# ── run_simple — multi-turn ───────────────────────────────────────────────────

@patch("anthropic.Anthropic")
def test_run_simple_passes_history_to_api(mock_anthropic_cls, monkeypatch):
    """run_simple must include prior turns in the messages sent to Anthropic."""
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key")

    mock_msg = MagicMock()
    mock_msg.content = [MagicMock(text="Respuesta de prueba")]
    mock_client = MagicMock()
    mock_client.messages.create.return_value = mock_msg
    mock_anthropic_cls.return_value = mock_client

    history = [
        {"role": "assistant", "content": "Bienvenido"},  # welcome, should be skipped
        {"role": "user",      "content": "¿qué es Python?"},
        {"role": "assistant", "content": "Python es un lenguaje..."},
    ]

    from crew.ecosystem_simple import run_simple
    run_simple("dame un ejemplo", chat_history=history)

    call_kwargs = mock_client.messages.create.call_args[1]
    messages = call_kwargs["messages"]

    # Must start with user turn (welcome skipped)
    assert messages[0]["role"] == "user"
    assert messages[0]["content"] == "¿qué es Python?"
    # Prior assistant turn included
    assert messages[1]["role"] == "assistant"
    # Current user message at the end
    assert messages[-1]["role"] == "user"
    assert "dame un ejemplo" in messages[-1]["content"]


@patch("anthropic.Anthropic")
def test_run_simple_agent_label_in_response(mock_anthropic_cls, monkeypatch):
    """Response must include the agent icon and name prefix."""
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key")

    mock_msg = MagicMock()
    mock_msg.content = [MagicMock(text="Aquí está el código.")]
    mock_client = MagicMock()
    mock_client.messages.create.return_value = mock_msg
    mock_anthropic_cls.return_value = mock_client

    from crew.ecosystem_simple import run_simple
    result = run_simple("muéstrame una función en Python")

    assert "**Dimelis AI**" in result or "**Yvannia AI**" in result or "**Vikturi AI**" in result


@patch("anthropic.Anthropic")
def test_run_simple_no_api_key(mock_anthropic_cls, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    from crew.ecosystem_simple import run_simple
    result = run_simple("hola")
    assert "ANTHROPIC_API_KEY" in result
    mock_anthropic_cls.assert_not_called()
