"""
Streamlit Cloud-compatible runner — calls Anthropic API directly, no CrewAI/ChromaDB.
Used by app.py when VIKTURI_SIMPLE_MODE=1 or when running on cloud.
"""
from __future__ import annotations
import os
from pathlib import Path

import urllib.parse

import anthropic

from memory.session_memory import save_interaction, get_recent_context

_PROMPTS = Path(__file__).parent.parent / "prompts"

_IMAGE_KW = ("genera", "generate", "crea una imagen", "hazme una imagen",
             "dibuja", "draw", "diseña una imagen", "imagen de", "foto de")

_CODE_KW = ("código", "code", "función", "function", "clase", "class",
            "script", "pep8", "debugear", "debug", "error en", "refactor",
            "fastapi", "django", "flask", "sql", "api", "def ", "return")

_LEARN_KW = ("explícame", "explica", "qué es", "cómo funciona", "enseñame",
             "no entiendo", "aprend", "tutorial", "paso a paso", "analogía",
             "diferencia entre", "cuándo usar")

_RESEARCH_KW = ("investiga", "busca información", "qué sabes de", "research",
                "fuentes", "documentación", "comparación entre", "últimas noticias")


def _optimize_prompt(description: str) -> str:
    suffix = ", high quality, detailed, professional lighting, 4K"
    if len(description) <= 250:
        d = description.lower()
        if any(w in d for w in ("photo", "foto", "realistic", "realista")):
            suffix += ", photorealistic, DSLR camera, sharp focus"
        elif any(w in d for w in ("cartoon", "dibujo", "anime")):
            suffix += ", illustration style, vibrant colors, clean lines"
        elif any(w in d for w in ("publicidad", "ad", "advertising", "banner")):
            suffix += ", commercial photography, studio lighting, clean background"
    return description.rstrip(".") + suffix


def _try_hf(token: str, optimized: str) -> str | None:
    """Try HF image models; save PNG to /tmp/; return IMAGE marker or error string."""
    import time
    import requests as _req

    models = [
        "black-forest-labs/FLUX.1-schnell",
        "stabilityai/stable-diffusion-xl-base-1.0",
        "runwayml/stable-diffusion-v1-5",
    ]
    headers = {"Authorization": f"Bearer {token}"}

    for model in models:
        url = f"https://api-inference.huggingface.co/models/{model}"
        for attempt in range(2):
            try:
                resp = _req.post(url, headers=headers,
                                 json={"inputs": optimized}, timeout=60)
            except Exception as exc:
                return f"⚠️ HF sin conexión: `{exc}`"

            if resp.status_code == 503:
                wait = 20
                try:
                    wait = min(resp.json().get("estimated_time", 20), 35)
                except Exception:
                    pass
                if attempt == 0:
                    time.sleep(wait)
                    continue
                break  # try next model

            if resp.status_code == 401:
                return "❌ HF_TOKEN inválido — verifica el secret en Streamlit Cloud."

            if resp.status_code != 200:
                break  # try next model

            data = resp.content
            is_img = data[:4] == b'\x89PNG' or data[:3] == b'\xff\xd8\xff'
            if not is_img:
                break  # try next model

            out = Path(f"/tmp/vikturi_img_{int(time.time())}.png")
            out.write_bytes(data)
            return (
                f"✅ Imagen generada con **{model.split('/')[1]}** (Hugging Face)\n\n"
                f"🖼️ IMAGE:{out}\n\n"
                f"📝 **Prompt:** {optimized}"
            )

    return None


def _try_craiyon(description: str) -> str | None:
    """Try Craiyon (free, no API key, different domain than HF/Pollinations)."""
    import base64
    import requests as _req
    import time
    try:
        resp = _req.post(
            "https://api.craiyon.com/v3",
            json={
                "prompt": description[:500],
                "negative_prompt": "blurry, low quality",
                "model": "none",
                "token": None,
                "version": "35s5hfwn9n78gb06",
            },
            timeout=120,
            headers={"Content-Type": "application/json"},
        )
        if resp.status_code == 200:
            images = resp.json().get("images", [])
            if images:
                img_bytes = base64.b64decode(images[0])
                out = Path(f"/tmp/vikturi_img_{int(time.time())}.jpg")
                out.write_bytes(img_bytes)
                return (
                    f"✅ Imagen generada con **Craiyon** (AI · gratis)\n\n"
                    f"🖼️ IMAGE:{out}\n\n"
                    f"📝 **Prompt:** {description[:200]}"
                )
    except Exception:
        pass
    return None


def _generate_image(description: str) -> str:
    """Try HF → Craiyon → clear error message."""
    optimized = _optimize_prompt(description)

    # 1) Try Hugging Face (works if network allows)
    hf_token = os.getenv("HF_TOKEN", "")
    if hf_token:
        result = _try_hf(hf_token, optimized)
        if result:
            return result

    # 2) Try Craiyon (free, no key needed)
    result = _try_craiyon(description)
    if result:
        return result

    return (
        "⚠️ **Las APIs de imagen no están disponibles** desde los servidores "
        "de Streamlit Cloud en este momento.\n\n"
        "**Opciones:**\n"
        "- Prueba de nuevo en unos minutos\n"
        "- Usa la app localmente con `streamlit run app.py` donde HF sí funciona"
    )


def _route(request: str) -> tuple[str, str]:
    """Returns (agent_display_name, system_prompt_text)."""
    r = request.lower()

    def _read(name: str) -> str:
        return (_PROMPTS / name).read_text(encoding="utf-8")

    if any(kw in r for kw in _IMAGE_KW):
        return "DrewAI", _read("drewai_prompt.md")
    if any(kw in r for kw in _CODE_KW):
        return "Dimelis AI", _read("dimelis_prompt.md")
    if any(kw in r for kw in _LEARN_KW):
        return "Yvannia AI", _read("yvannia_prompt.md")
    if any(kw in r for kw in _RESEARCH_KW):
        return "Teriania", _read("teriania_prompt.md")
    # Default: Master routes via LLM with all agent descriptions in system prompt
    return "Vikturi AI", _read("master_prompt.md")


def run_simple(user_request: str, training_mode: bool = False) -> str:
    """Runs the ecosystem without CrewAI — single Anthropic API call."""
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        return (
            "❌ **ANTHROPIC_API_KEY no configurada.**\n\n"
            "Ve a Manage app → Settings → Secrets y agrega:\n"
            "```\nANTHROPIC_API_KEY = \"sk-ant-...\"\n```"
        )

    model = os.getenv("MODEL", "claude-sonnet-4-6")
    max_tokens = int(os.getenv("MAX_TOKENS", "4096"))
    recent = get_recent_context(n=5)

    # Training mode uses master prompt + context loader output
    if training_mode:
        system = (_PROMPTS / "master_prompt.md").read_text(encoding="utf-8")
        user_msg = (
            "[MODO ENTRENAMIENTO] Lee el siguiente historial de sesión y prepara "
            f"un briefing para todos los agentes.\n\n{recent}\n\n"
            f"Instrucción adicional: {user_request}"
        )
        agent_label = "Master Trainer"
    else:
        agent_label, system = _route(user_request)

        # Image generation — call tool directly, skip LLM
        if agent_label == "DrewAI" and any(kw in user_request.lower() for kw in _IMAGE_KW):
            result = _generate_image(user_request)
            save_interaction(user_request, result)
            return result

        user_msg = user_request
        if recent:
            user_msg = f"{user_request}\n\n[Contexto de sesión]\n{recent}"

    client = anthropic.Anthropic(api_key=api_key)
    message = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user_msg}],
    )

    result = message.content[0].text
    save_interaction(user_request, result, training_mode=training_mode)
    return result
