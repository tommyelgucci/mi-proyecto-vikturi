"""
Image tools for DrewAI.

- analyze_image   → Claude vision (uses ANTHROPIC_API_KEY)
- generate_image  → Hugging Face FLUX.1-schnell (free with HF_TOKEN)
"""
from __future__ import annotations
import base64
import os
import time
import urllib.request
from pathlib import Path

import requests as _requests
from crewai.tools import tool

_MEDIA_TYPES = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png",  ".gif": "image/gif",
    ".webp": "image/webp",
}

_HF_API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
_OUT_DIR = Path(__file__).parent.parent / "context" / "generated_images"


@tool("Analyze Image")
def analyze_image(image_source: str) -> str:
    """
    Analyzes an image using Claude's vision capabilities.
    Accepts a local file path or a public HTTPS URL.
    Returns a detailed creative and visual analysis.
    """
    try:
        import anthropic
        from config.settings import settings

        image_data, media_type = _load_image_as_base64(image_source)
        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        message = client.messages.create(
            model=settings.model,
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {"type": "base64", "media_type": media_type, "data": image_data},
                    },
                    {
                        "type": "text",
                        "text": (
                            "Analiza esta imagen desde una perspectiva creativa y de diseño. "
                            "Describe: qué hay en ella, el estilo visual, los colores dominantes, "
                            "el mood/emoción que transmite, fortalezas visuales, y posibles mejoras. "
                            "Si es contenido de redes sociales, analiza también su potencial de engagement."
                        ),
                    },
                ],
            }],
        )
        return message.content[0].text
    except Exception as e:
        return f"Error al analizar la imagen: {e}"


@tool("Generate Image")
def generate_image(description: str) -> str:
    """
    Generates an image using Hugging Face FLUX.1-schnell (free with HF_TOKEN).
    Saves the image locally and returns an IMAGE: marker for the UI to render it.
    """
    hf_token = os.getenv("HF_TOKEN", "")
    if not hf_token:
        return (
            "❌ **HF_TOKEN no configurado.** Para generar imágenes gratis:\n\n"
            "1. Crea cuenta en huggingface.co\n"
            "2. Settings → Access Tokens → New token (tipo **Read**)\n"
            "3. Agrega `HF_TOKEN=hf_...` a tu archivo `.env`\n"
            "4. Reinicia la app con `streamlit run app.py`"
        )

    optimized = _optimize_prompt(description)
    headers = {"Authorization": f"Bearer {hf_token}"}
    payload = {"inputs": optimized}

    for attempt in range(3):
        try:
            resp = _requests.post(_HF_API_URL, headers=headers, json=payload, timeout=90)
        except _requests.Timeout:
            if attempt < 2:
                time.sleep(5)
                continue
            return "❌ Timeout: el modelo tardó demasiado. Intenta de nuevo en unos segundos."

        if resp.status_code == 503:
            # Model is loading — wait and retry
            wait = 20
            try:
                wait = min(resp.json().get("estimated_time", 20), 40)
            except Exception:
                pass
            if attempt < 2:
                time.sleep(wait)
                continue
            return "❌ El modelo sigue cargando. Espera un momento e intenta de nuevo."

        if resp.status_code == 401:
            return "❌ HF_TOKEN inválido. Verifica que sea correcto en tu archivo `.env`."

        if resp.status_code != 200:
            return f"❌ Error de Hugging Face API ({resp.status_code}): {resp.text[:300]}"

        break

    # Save image to context/generated_images/
    _OUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"img_{int(time.time())}.png"
    out_path = _OUT_DIR / filename
    out_path.write_bytes(resp.content)

    return (
        f"✅ Imagen generada con **FLUX.1-schnell** (Hugging Face · gratis)\n\n"
        f"🖼️ IMAGE:{out_path}\n\n"
        f"📝 **Prompt optimizado:** {optimized}"
    )


def _optimize_prompt(description: str) -> str:
    if len(description) > 250:
        return description
    suffix = ", high quality, detailed, professional lighting, 4K"
    desc_lower = description.lower()
    if any(w in desc_lower for w in ("photo", "foto", "fotografía", "realistic", "realista")):
        suffix += ", photorealistic, DSLR camera, sharp focus"
    elif any(w in desc_lower for w in ("cartoon", "dibujo", "ilustración", "anime")):
        suffix += ", illustration style, vibrant colors, clean lines"
    elif any(w in desc_lower for w in ("publicidad", "ad", "advertising", "banner")):
        suffix += ", commercial photography, studio lighting, clean background"
    return description.rstrip(".") + suffix


def _load_image_as_base64(source: str) -> tuple[str, str]:
    if source.startswith("http://") or source.startswith("https://"):
        req = urllib.request.Request(source, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read()
            content_type = resp.headers.get("Content-Type", "image/jpeg").split(";")[0]
    else:
        path = Path(source)
        if not path.exists():
            raise FileNotFoundError(f"Imagen no encontrada: {source}")
        raw = path.read_bytes()
        content_type = _MEDIA_TYPES.get(path.suffix.lower(), "image/jpeg")
    return base64.standard_b64encode(raw).decode("utf-8"), content_type
