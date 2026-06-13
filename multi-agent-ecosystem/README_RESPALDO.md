# README_RESPALDO — Multi-Agent Ecosystem
### Sesión de desarrollo: Sábado 13 de junio de 2026
### Rama de trabajo: `claude/opus-plan-2trpfb` → repo `tommygucci/mis-proyectos-python`

---

## 1. Visión General del Proyecto

Sistema multi-agente en Python que orquesta cuatro agentes especializados bajo un **Agente Maestro**. El ecosistema recibe solicitudes del usuario, las delega automáticamente al especialista correcto, persiste la memoria entre sesiones y construye una base de conocimiento local.

**Stack tecnológico final:**

| Componente | Tecnología | Versión |
|---|---|---|
| Orquestación de agentes | CrewAI | ≥1.0.0 (probado en 1.14.7) |
| LLM | Anthropic Claude | claude-sonnet-4-6 |
| Búsqueda web | duckduckgo-search | ≥5.0.0 |
| Generación de imágenes | Pollinations.ai | Sin API key (HTTP URL) |
| Configuración | python-dotenv | ≥1.0.0 |
| Validación | Pydantic v2 | bundled con CrewAI |
| Tests | pytest | ≥8.0.0 |

---

## 2. Arquitectura del Ecosistema

### 2.1 Mapa de Agentes

```
Usuario
   │
   ▼
Master Trainer & Orchestrator
   ├── Dimelis AI  ──► Código, estructura de proyectos, buenas prácticas
   ├── Yvannia AI  ──► Tutorías paso a paso, aprendizaje personalizado
   ├── Teriania    ──► Investigación web multi-fuente, knowledge base
   └── DrewAI      ──► Creatividad visual, análisis y generación de imágenes
```

### 2.2 Flujo de una solicitud

```
python main.py "tu pregunta"
        │
        ▼
EcosystemCrew.run()
        ├── Carga últimas 5 interacciones (memory/session_memory.py)
        ├── Construye task para el Master Agent
        │
        ▼
Master Trainer analiza y delega:
   • código/dev        → Dimelis AI
   • aprendizaje       → Yvannia AI
   • investigación     → Teriania (KB first → web_search → guardar en KB)
   • visual/multimedia → DrewAI (analyze_image / generate_image)
        │
        ▼
Resultado guardado en memory/history.json + context/session_memory.md
```

---

## 3. Estructura de Archivos

```
multi-agent-ecosystem/
├── main.py                        # CLI: --train, --history, o pregunta libre
├── requirements.txt               # crewai>=1.0.0, anthropic, duckduckgo-search...
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore                     # Excluye .env, __pycache__, history.json, KB generada
│
├── config/
│   └── settings.py                # Carga .env; llm property → "anthropic/claude-sonnet-4-6"
│
├── agents/
│   ├── master_agent.py            # Trainer/Orquestador — herramienta: context_loader
│   ├── dimelis_agent.py           # Code organizer — sin herramientas extra
│   ├── yvannia_agent.py           # Tutora — sin herramientas extra
│   ├── teriania_agent.py          # Investigadora — web_search + save/read KB
│   └── drewai_agent.py            # Creativo visual — analyze_image + generate_image
│
├── prompts/                       # System prompts en Markdown (editables sin tocar código)
│   ├── master_prompt.md
│   ├── dimelis_prompt.md
│   ├── yvannia_prompt.md
│   ├── teriania_prompt.md
│   └── drewai_prompt.md
│
├── tools/
│   ├── context_loader.py          # Lee context/*.md y .txt para el modo entrenamiento
│   ├── web_search.py              # Búsqueda 3 fuentes + verificación cruzada
│   ├── knowledge_base.py          # save_to_knowledge_base + read_knowledge_base
│   └── image_tools.py             # analyze_image (Claude vision) + generate_image (Pollinations)
│
├── crew/
│   └── ecosystem_crew.py          # Ensambla los 5 agentes, define Task, lanza Crew
│
├── memory/
│   └── session_memory.py          # Persiste history.json + exporta session_memory.md
│
├── context/                       # Archivos de entrenamiento (leídos por context_loader)
│   ├── example_note.md            # Plantilla de ejemplo
│   ├── mis_skills_y_notas.md      # Nivel Python, estilo de código, reglas de oro
│   ├── session_memory.md          # Auto-generado por session_memory.py (gitignored)
│   └── knowledge_base/            # Auto-generado por Teriania (gitignored)
│       └── *.md                   # Un archivo por tema investigado y verificado
│
└── tests/
    ├── test_agents.py             # 4 tests: instanciación de cada agente
    ├── test_drewai.py             # 6 tests: image tools y DrewAI
    ├── test_knowledge_base.py     # 6 tests: save, read, slugify, cross-verify
    └── test_memory.py             # 3 tests: save, load, markdown export
```

---

## 4. Decisiones de Arquitectura

### 4.1 Por qué CrewAI ≥1.0.0 (y no 0.28.8)

Empezamos con `crewai==0.28.8`. Durante la fase de pruebas en GitHub Codespaces (Python 3.12) encontramos tres errores en cascada:

1. `ModuleNotFoundError: No module named 'pkg_resources'` — crewai 0.28.8 usa `setuptools<73`, pero el entorno tenía setuptools 82.
2. `AttributeError: 'str' object has no attribute 'bind'` — en 0.28.8 el parámetro `llm` exige un objeto LangChain, no un string.
3. `ImportError: cannot import name 'tool' from 'crewai.tools'` — la API de tools cambió.

**Solución:** Actualizar a `crewai>=1.0.0` que:
- Usa **litellm** internamente → acepta strings `"anthropic/claude-sonnet-4-6"` directamente
- Restauró `from crewai.tools import tool`
- Compatible con Python 3.12 sin dependencias de langchain antiguas

### 4.2 Por qué `llm` como string en settings.py

```python
@property
def llm(self) -> str:
    return f"anthropic/{self.model}"
```

CrewAI ≥1.0 delega la gestión del LLM a **litellm**, que resuelve el provider por el prefijo del string. Esto elimina la necesidad de importar `langchain_anthropic.ChatAnthropic` o cualquier wrapper.

### 4.3 Sistema de Memoria Persistente

No usamos el sistema de memoria nativo de CrewAI (requiere embeddings + ChromaDB + API de OpenAI para vectores). En su lugar implementamos:

- **`memory/history.json`**: log JSON simple con cada interacción (timestamp, tipo, input, output truncado a 3000 chars)
- **`context/session_memory.md`**: resumen markdown de las últimas 10 interacciones, leído automáticamente por `context_loader` en modo `--train`
- En cada `EcosystemCrew.run()`: se inyectan las últimas 5 interacciones en el contexto del Master Agent

Ventaja: sin dependencias extra, sin API de embeddings, human-readable.

### 4.4 Knowledge Base de Teriania

Teriania tiene un workflow obligatorio de 4 pasos:
1. Consultar `read_knowledge_base` antes de buscar en internet (evita búsquedas redundantes)
2. Si no está en KB → `web_search` (3 fuentes independientes)
3. Verificación cruzada: overlap de keywords ≥8% entre fuentes = información consistente
4. Si verificada → `save_to_knowledge_base` en `context/knowledge_base/{slug}.md`

### 4.5 Verificación Cruzada en web_search.py

Tres queries independientes por búsqueda:
- `query` (web general)
- `query wikipedia`
- `query official documentation OR docs OR site:github.com`

Cross-verify: si el ratio de palabras en común entre la fuente 1 y la fuente 2 es ≥8%, las fuentes son consistentes. Si no → mensaje explícito de conflicto, **sin inventar datos**.

### 4.6 DrewAI y Pollinations.ai

**Problema encontrado:** La llamada HTTP de verificación (`HEAD request`) a `image.pollinations.ai` es bloqueada por la política de red de GitHub Codespaces.

**Solución:** Eliminar el check de conectividad. La URL de Pollinations se construye localmente y siempre funciona en cualquier navegador:

```
https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&model=flux&nologo=true&enhance=true
```

El agente devuelve la URL lista para copiar y abrir en el navegador. No requiere API key ni registro.

---

## 5. Personalización de los Agentes

### Archivos de Contexto (`context/`)
- **`mis_skills_y_notas.md`**: nivel Python (CS50P), preferencias de estilo (PEP8, type hints, snake_case, SRP), preferencias de enseñanza (paso a paso, analogías primero), reglas de oro (no inventar, responder en español)

### System Prompts (`prompts/`)
Cada agente lee su prompt en tiempo de ejecución desde el archivo `.md` correspondiente. **Para cambiar el comportamiento de un agente, solo edita su archivo de prompt — sin tocar código Python.**

| Agente | Rasgos clave del prompt |
|---|---|
| Master | Delega sin dudar; protocolos explícitos para conflictos de fuentes |
| Dimelis | Guía de estilo hardcodeada: PEP8, type hints, SRP, imports ordenados |
| Yvannia | Fórmula fija: analogía → concepto mínimo → código mínimo → código completo → pregunta verificadora |
| Teriania | Workflow 4 pasos + sección `## Fuentes` obligatoria + regla anti-alucinación estricta |
| DrewAI | Formatos estructurados para hooks TikTok, briefs publicitarios, análisis de imagen |

---

## 6. Comandos de Uso

```bash
# Entrar al proyecto
cd /workspaces/mis-proyectos-python/multi-agent-ecosystem

# Configurar entorno (primera vez)
pip install -r requirements.txt
cp .env.example .env
# Editar .env con tu ANTHROPIC_API_KEY real

# Correr los tests (19 tests, todos deben pasar)
python -m pytest tests/ -v

# Consulta general (Master delega al especialista correcto)
python main.py "tu pregunta aquí"

# Modo entrenamiento (lee context/ y actualiza briefing de agentes)
python main.py --train "Procesa mis notas y prepara a los agentes"

# Ver historial de sesiones
python main.py --history

# Test directo del generador de imágenes
python -c "from tools.image_tools import generate_image; print(generate_image.func('a futuristic city at sunset, concept art'))"
```

---

## 7. Variables de Entorno

```bash
# Obligatoria
ANTHROPIC_API_KEY=sk-ant-...   # Tu clave de Anthropic

# Opcionales (modelo y tokens — ya tienen valores por defecto)
MODEL=claude-sonnet-4-6
MAX_TOKENS=4096
```

> **Nota de seguridad:** Nunca pongas la clave real en `.env.example`. Solo en `.env` (que está en `.gitignore`).

---

## 8. Errores Resueltos y Sus Soluciones

| Error | Causa | Solución |
|---|---|---|
| `ModuleNotFoundError: pkg_resources` | crewai 0.28.8 + setuptools >73 | Actualizar a crewai ≥1.0.0 |
| `'str' has no attribute 'bind'` | llm como string en crewai 0.28.8 | Actualizar a crewai ≥1.0.0 (litellm) |
| `cannot import 'tool' from crewai.tools` | API cambió en 0.28.8 | crewai 1.x restauró `from crewai.tools import tool` |
| `langchain_core.pydantic_v1` ImportError | langchain-core 1.x eliminó pydantic_v1 | Actualizar a crewai ≥1.0.0 |
| Pollinations `⚠️ no disponible` | HEAD request bloqueada en Codespaces | Eliminar check; URL funciona en navegador siempre |
| `main.py: No such file or directory` | Ejecutar desde raíz del repo | `cd multi-agent-ecosystem` primero |

---

## 9. Tests — Estado Final

```
tests/test_agents.py          4 tests  ✅  Instanciación de los 4 agentes
tests/test_drewai.py          6 tests  ✅  Pollinations URL, analyze, optimize_prompt
tests/test_knowledge_base.py  6 tests  ✅  Save, read, slugify, cross-verify
tests/test_memory.py          3 tests  ✅  Save, load, markdown export
─────────────────────────────────────────
TOTAL                        19 tests  ✅  Todos pasan
```

---

## 10. Próximos Pasos Sugeridos

- [ ] **API de imagen de pago** — añadir `HF_TOKEN` (gratuito) o `DALLE_API_KEY` cuando se quiera calidad superior
- [ ] **Interfaz web** — envolver el ecosistema con FastAPI + WebSockets para chat en tiempo real
- [ ] **Memoria semántica** — integrar ChromaDB para búsqueda por similitud sobre el historial
- [ ] **Higgsfield / Runway** — conectar DrewAI a generación de video cuando se tenga cuenta
- [ ] **Agente de voz** — añadir un quinto agente para transcripción y respuesta de audio
- [ ] **Mover al repo `multi-agent-ecosystem`** — crear nueva sesión Claude Code apuntando a ese repo y pushear desde allí directamente
