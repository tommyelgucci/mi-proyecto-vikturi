import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture(autouse=True)
def mock_env(monkeypatch):
    monkeypatch.setenv("ANTHROPIC_API_KEY", "test-key-123")
    monkeypatch.setenv("MODEL", "claude-sonnet-4-6")


def _mock_agent(mock_cls, role):
    agent = MagicMock()
    agent.role = role
    mock_cls.return_value = agent
    return agent


@patch("crewai.Agent")
def test_dimelis_agent_instantiates(mock_agent_cls):
    _mock_agent(mock_agent_cls, "Code Organizer & Developer Assistant")
    from agents.dimelis_agent import make_dimelis_agent
    agent = make_dimelis_agent()
    assert agent is not None


@patch("crewai.Agent")
def test_yvannia_agent_instantiates(mock_agent_cls):
    _mock_agent(mock_agent_cls, "Tutor & Learning Guide")
    from agents.yvannia_agent import make_yvannia_agent
    agent = make_yvannia_agent()
    assert agent is not None


@patch("crewai.Agent")
def test_teriania_agent_instantiates(mock_agent_cls):
    _mock_agent(mock_agent_cls, "Researcher & Summarizer")
    from agents.teriania_agent import make_teriania_agent
    agent = make_teriania_agent()
    assert agent is not None


@patch("crewai.Agent")
def test_master_agent_instantiates(mock_agent_cls):
    _mock_agent(mock_agent_cls, "Master Trainer & Orchestrator")
    from agents.master_agent import make_master_agent
    agent = make_master_agent()
    assert agent is not None
