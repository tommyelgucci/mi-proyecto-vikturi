---
title: Vikturi AI
emoji: ⚡
colorFrom: purple
colorTo: blue
sdk: docker
app_file: app.py
pinned: false
---

# Multi-Agent Ecosystem

A Python multi-agent AI system powered by CrewAI and Claude.

## Agents

| Agent | Role |
|---|---|
| **Master Trainer** | Orchestrates and delegates to the right specialist |
| **Dimelis AI** | Code organizer & developer assistant |
| **Yvannia AI** | Tutor & step-by-step learning guide |
| **Teriania** | Researcher & documentation summarizer |

## Setup

```bash
# 1. Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

## Usage

Run all commands from inside this folder (`multi-agent-ecosystem/`):

```bash
# Delegate to Dimelis (code/dev question)
python main.py "¿Cómo organizo un proyecto FastAPI con autenticación JWT?"

# Delegate to Yvannia (learning/tutorial)
python main.py "Explícame qué es un decorador en Python, paso a paso"

# Delegate to Teriania (research)
python main.py "¿Cuáles son las diferencias entre CrewAI y LangGraph en 2025?"

# Training mode: reads context/ files and enriches all agents
python main.py --train "Procesa mis notas y prepara a los agentes"
```

## Training Your Agents

Drop `.md` or `.txt` files into the `context/` folder with your personal notes, preferences, or project details. Then run:

```bash
python main.py --train "Resume mis notas de contexto"
```

The Master Agent will read every file in `context/` and produce an enriched briefing for each specialist agent.

## Project Structure

```
multi-agent-ecosystem/
├── main.py                  # Entry point
├── requirements.txt
├── .env.example
├── config/
│   └── settings.py          # Environment config
├── agents/
│   ├── master_agent.py
│   ├── dimelis_agent.py
│   ├── yvannia_agent.py
│   └── teriania_agent.py
├── prompts/                 # System prompts (edit to customize each agent)
│   ├── master_prompt.md
│   ├── dimelis_prompt.md
│   ├── yvannia_prompt.md
│   └── teriania_prompt.md
├── tools/
│   ├── context_loader.py    # Reads context/ files for training
│   └── web_search.py        # DuckDuckGo search for Teriania
├── crew/
│   └── ecosystem_crew.py    # Crew assembly and task orchestration
├── context/                 # Drop your training notes here
│   └── example_note.md
└── tests/
    └── test_agents.py
```
