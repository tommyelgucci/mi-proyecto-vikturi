"""
Image tools for DrewAI.

Active now:
  - analyze_image   → uses Claude vision (your existing ANTHROPIC_API_KEY)

Add API keys to .env to activate generation:
  - DALLE_API_KEY   → activates DALL-E 3 via OpenAI
  - FLUX_API_KEY    → activates FLUX.1 via fal.ai or Replicate
"""
from __future__ import annotations
import base64
import os
import urllib.request
from pathlib import Path
from crewai.tools import tool

_SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
_MEDIA_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
}


# ─────────────────────────────────────────────
# IMAGE ANALYSIS (active — uses Claude vision)
# ─────────────────────────────────────────────

@tool("Analyze Image")
def analyze_image(image_source: str) -> str:
    """
    Analyzes an image using Claude's vision capabilities.
    Accepts a local file path (e.g. /tmp/photo.jpg) or a public HTTPS URL.
    Returns a detailed creative and visual analysis of the image.
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
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_data,
                        },
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

    except ImportError:
        return "Error: instala la librería 'anthropic' con `pip install anthropic`."
    except Exception as e:
        return f"Error al analizar la imagen: {e}"


def _load_image_as_base64(source: str) -> tuple[str, str]:
    """Loads image from file path or URL and returns (base64_data, media_type)."""
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


# ─────────────────────────────────────────────
# IMAGE GENERATION (stub — activate via .env)
# ─────────────────────────────────────────────

@tool("Generate Image")
def generate_image(description: str) -> str:
    """
    Generates an image from a text description.
    Add DALLE_API_KEY or FLUX_API_KEY to your .env file to activate.
    Also returns the optimized prompt used, so you can run it manually in any tool.
    """
    dalle_key = os.getenv("DALLE_API_KEY", "")
    flux_key = os.getenv("FLUX_API_KEY", "")

    if dalle_key:
        return _generate_dalle(description, dalle_key)
    if flux_key:
        return _generate_flux(description, flux_key)
    return _generation_stub(description)


def _generate_dalle(description: str, api_key: str) -> str:
    """DALL-E 3 via OpenAI SDK. Requires: pip install openai"""
    try:
        from openai import OpenAI  # pip install openai
        client = OpenAI(api_key=api_key)
        response = client.images.generate(
            model="dall-e-3",
            prompt=description,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        url = response.data[0].url
        revised_prompt = response.data[0].revised_prompt or description
        return (
            f"✅ Imagen generada con DALL-E 3\n"
            f"🔗 URL: {url}\n"
            f"📝 Prompt revisado por DALL-E: {revised_prompt}"
        )
    except ImportError:
        return "Error: instala openai con `pip install openai` para usar DALL-E 3."
    except Exception as e:
        return f"Error DALL-E: {e}"


def _generate_flux(description: str, api_key: str) -> str:
    """FLUX.1 via fal.ai. Requires: pip install fal-client"""
    try:
        import fal_client  # pip install fal-client
        os.environ["FAL_KEY"] = api_key
        result = fal_client.run(
            "fal-ai/flux/schnell",
            arguments={
                "prompt": description,
                "image_size": "landscape_4_3",
                "num_inference_steps": 4,
                "num_images": 1,
            },
        )
        url = result["images"][0]["url"]
        return (
            f"✅ Imagen generada con FLUX.1\n"
            f"🔗 URL: {url}\n"
            f"📝 Prompt usado: {description}"
        )
    except ImportError:
        return "Error: instala fal-client con `pip install fal-client` para usar FLUX."
    except Exception as e:
        return f"Error FLUX: {e}"


def _generation_stub(description: str) -> str:
    """Fallback when no generation API key is configured."""
    optimized = _optimize_prompt(description)
    return (
        "🎨 Generación de imagen no activada — necesitas añadir una clave API a tu .env:\n\n"
        "  DALLE_API_KEY=sk-...   → DALL-E 3 (OpenAI)\n"
        "  FLUX_API_KEY=...       → FLUX.1 (fal.ai)\n\n"
        f"📝 Prompt optimizado listo para pegar en cualquier herramienta de IA:\n\n"
        f"  {optimized}\n\n"
        "Puedes usar este prompt directamente en:\n"
        "  • ChatGPT (DALL-E) → https://chat.openai.com\n"
        "  • Midjourney → https://midjourney.com\n"
        "  • Stable Diffusion → https://stability.ai"
    )


def _optimize_prompt(description: str) -> str:
    """Enhances a plain description into a detailed image generation prompt."""
    if len(description) > 200:
        return description
    suffixes = ", high quality, detailed, professional lighting, 4K"
    if "photo" in description.lower() or "foto" in description.lower():
        suffixes += ", photorealistic, DSLR camera"
    elif "cartoon" in description.lower() or "dibujo" in description.lower():
        suffixes += ", illustration style, vibrant colors"
    return description.rstrip(".") + suffixes
