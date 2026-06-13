"""
Vikturi AI — Streamlit web interface for the multi-agent ecosystem.
Run: streamlit run app.py
"""
from __future__ import annotations
import os
import sys
from pathlib import Path

# Ensure project root is on sys.path when launched via `streamlit run`
sys.path.insert(0, str(Path(__file__).parent))

# Intercept ALL chromadb imports with a single meta path hook.
# CrewAI pulls in chromadb transitively; we use memory=False so none of it
# is needed. This avoids whack-a-mole mocking of individual submodules.
import importlib.abc
import importlib.machinery
from unittest.mock import MagicMock as _MM


class _ChromaBlocker(importlib.abc.MetaPathFinder, importlib.abc.Loader):
    def find_spec(self, fullname, path, target=None):
        if fullname == "chromadb" or fullname.startswith("chromadb."):
            return importlib.machinery.ModuleSpec(fullname, self, is_package=True)
        return None

    def create_module(self, spec):
        m = _MM()
        m.__path__ = []
        m.__spec__ = spec
        m.__name__ = spec.name
        m.__package__ = spec.name
        return m

    def exec_module(self, module):
        pass


sys.meta_path.insert(0, _ChromaBlocker())
del _MM, _ChromaBlocker

os.environ.setdefault("ANONYMIZED_TELEMETRY", "false")

import streamlit as st


def _render_message(content: str) -> None:
    """Renders a message, handling image markers:
    - 🖼️ IMAGE:<path>  → local file via st.image() (HF result, runs locally)
    - POLLINATIONS_IMG:<url> → browser-side <img> tag (no server request needed)
    """
    # ── HF local image ───────────────────────────────────────────────
    if "🖼️ IMAGE:" in content:
        before, rest = content.split("🖼️ IMAGE:", 1)
        if before.strip():
            st.markdown(before)
        first_line, *remaining = rest.split("\n", 1)
        img_path = Path(first_line.strip())
        if img_path.exists():
            st.image(str(img_path), use_container_width=True)
        else:
            st.warning(f"Imagen no encontrada: `{img_path}`")
        if remaining and remaining[0].strip():
            st.markdown(remaining[0])
        return

    # ── Pollinations browser-side image ──────────────────────────────
    if "POLLINATIONS_IMG:" in content:
        before, rest = content.split("POLLINATIONS_IMG:", 1)
        if before.strip():
            st.markdown(before)
        first_line, *remaining = rest.split("\n", 1)
        url = first_line.strip()
        # <img> tag loads from user's browser, not the Codespace server
        st.markdown(
            f'<img src="{url}" style="width:100%;border-radius:10px;margin:8px 0">',
            unsafe_allow_html=True,
        )
        if remaining and remaining[0].strip():
            st.markdown(remaining[0])
        return

    # ── Plain text ────────────────────────────────────────────────────
    st.markdown(content)


# ── Page config (must be first Streamlit call) ────────────────────────
st.set_page_config(
    page_title="Vikturi AI",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ────────────────────────────────────────────────────────
st.markdown("""
<style>
  /* Gradient brand title */
  .vk-title {
    font-size: 2.6rem;
    font-weight: 900;
    background: linear-gradient(135deg, #7C6EFA 0%, #3ECFCF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.1;
    margin: 0;
  }
  .vk-subtitle {
    font-size: 0.78rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #888;
    margin-top: 4px;
    margin-bottom: 20px;
  }
  /* Agent status pill */
  .agent-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.04);
    border-left: 3px solid #2ECC71;
    border-radius: 8px;
    padding: 9px 12px;
    margin-bottom: 7px;
  }
  .agent-pill .name { font-weight: 700; font-size: 0.9rem; }
  .agent-pill .desc { font-size: 0.75rem; color: #999; }
  /* Divider */
  hr { border-color: rgba(255,255,255,0.08) !important; }
  /* Hide default Streamlit footer */
  footer { visibility: hidden; }
  #MainMenu { visibility: hidden; }
</style>
""", unsafe_allow_html=True)

# ── Header ────────────────────────────────────────────────────────────
st.markdown('<p class="vk-title">⚡ Vikturi AI</p>', unsafe_allow_html=True)
st.markdown('<p class="vk-subtitle">The Multi-Agent Lore</p>', unsafe_allow_html=True)

# ── Sidebar ───────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 🟢 Estado del Sistema")
    st.markdown("---")

    _AGENTS = [
        ("🎨", "DrewAI",      "Visual, imágenes, TikTok"),
        ("📚", "Yvannia AI",  "Tutorías paso a paso"),
        ("💻", "Dimelis AI",  "Código, estructura, PEP8"),
        ("🔍", "Teriania",    "Investigación web verificada"),
    ]
    for icon, name, desc in _AGENTS:
        st.markdown(
            f'<div class="agent-pill">'
            f'<span style="font-size:1.3rem">{icon}</span>'
            f'<div><div class="name">{name}</div><div class="desc">{desc}</div></div>'
            f'</div>',
            unsafe_allow_html=True,
        )

    st.markdown("---")
    training_mode = st.toggle(
        "⚙️ Modo Entrenamiento",
        value=False,
        help="Lee los archivos de context/ para actualizar el briefing de los agentes",
    )

    st.markdown("---")

    # Session stats — fail silently if no history yet
    try:
        from memory.session_memory import get_stats
        stats = get_stats()
        st.markdown("### 📊 Estadísticas")
        col_a, col_b = st.columns(2)
        col_a.metric("Total", stats.get("total", 0))
        col_b.metric("Sesiones", stats.get("trainings", 0))
        if stats.get("last_date"):
            st.caption(f"Última actividad: {stats['last_date'][:10]}")
    except Exception:
        st.caption("Sin historial todavía.")

    st.markdown("---")
    st.caption("Vikturi AI · Multi-Agent Ecosystem · v1.0")

# ── Chat session state ────────────────────────────────────────────────
if "messages" not in st.session_state:
    st.session_state.messages = []

# Welcome message on first load
if not st.session_state.messages:
    st.session_state.messages.append({
        "role": "assistant",
        "content": (
            "¡Hola! Soy **Vikturi AI**, tu ecosistema multi-agente. "
            "Puedo delegarte a:\n\n"
            "- 💻 **Dimelis** para código y proyectos\n"
            "- 📚 **Yvannia** para aprender algo paso a paso\n"
            "- 🔍 **Teriania** para investigar con fuentes reales\n"
            "- 🎨 **DrewAI** para creatividad visual e imágenes\n\n"
            "¿Con qué empezamos?"
        ),
    })

# ── Render chat history ───────────────────────────────────────────────
for msg in st.session_state.messages:
    avatar = "⚡" if msg["role"] == "assistant" else "🧑"
    with st.chat_message(msg["role"], avatar=avatar):
        _render_message(msg["content"])

# ── Chat input ────────────────────────────────────────────────────────
_placeholder = (
    "Modo entrenamiento activo — escribe qué procesar..."
    if training_mode
    else "Escribe tu pregunta para Vikturi AI..."
)

if prompt := st.chat_input(_placeholder):
    # 1. Show user bubble immediately
    with st.chat_message("user", avatar="🧑"):
        st.markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    # 2. Run the ecosystem crew and stream status
    with st.chat_message("assistant", avatar="⚡"):
        with st.status("🧠 Analizando y delegando al agente correcto…", expanded=False) as status_box:
            try:
                from crew.ecosystem_crew import EcosystemCrew
                result = EcosystemCrew().run(prompt, training_mode=training_mode)
                status_box.update(label="✅ Respuesta lista", state="complete", expanded=False)
            except Exception as exc:
                result = (
                    f"❌ **Error del ecosistema**\n\n"
                    f"```\n{exc}\n```\n\n"
                    f"Revisa que `ANTHROPIC_API_KEY` esté configurada en `.env`."
                )
                status_box.update(label="❌ Error", state="error", expanded=True)

        _render_message(result)

    st.session_state.messages.append({"role": "assistant", "content": result})
    st.rerun()
