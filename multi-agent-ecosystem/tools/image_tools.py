"""
Image tools for DrewAI.

ACTIVE NOW (no API key needed):
  - analyze_image     → Claude vision (uses your ANTHROPIC_API_KEY)
  - generate_image    → Pollinations.ai FLUX (100% free, no key)

Add to .env to unlock higher quality / more options:
  HF_TOKEN=...          → Hugging Face free tier (FLUX.1-schnell, SD XL, etc.)
  DALLE_API_KEY=...     → DALL-E 3 via OpenAI (paid, ~$0.04/img)
  FLUX_API_KEY=...      → FLUX.1 via fal.ai   (paid, ~$0.003/img)

Priority when generating: Pollinations (free) → HF (free) → fal.ai → DALL-E
"""
from __future__ import annotations
import base64
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path
from crewai.tools import tool

_MEDIA_TYPES = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png",  ".gif": "image/gif",
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
    except ImportError:
        return "Error: instala 'anthropic' con `pip install anthropic`."
    except Exception as e:
        return f"Error al analizar la imagen: {e}"


# ─────────────────────────────────────────────────────────────────
# IMAGE GENERATION — priority: Pollinations → HF → fal.ai → DALL-E
# ─────────────────────────────────────────────────────────────────

@tool("Generate Image")
def generate_image(description: str) -> str:
    """
    Generates an image from a text description.
    Works for free out of the box via Pollinations.ai.
    Add HF_TOKEN, FLUX_API_KEY, or DALLE_API_KEY to .env for more options.
    Returns the image URL and the optimized prompt used.
    """
    optimized = _optimize_prompt(description)

    hf_token   = os.getenv("HF_TOKEN", "")
    flux_key   = os.getenv("FLUX_API_KEY", "")
    dalle_key  = os.getenv("DALLE_API_KEY", "")

    # Always try Pollinations first (completely free, no key)
    result = _generate_pollinations(optimized)
    if result:
        return result

    # Hugging Face free tier
    if hf_token:
        return _generate_huggingface(optimized, hf_token)

    # fal.ai FLUX (cheap paid)
    if flux_key:
        return _generate_flux(optimized, flux_key)

    # DALL-E 3 (paid)
    if dalle_key:
        return _generate_dalle(optimized, dalle_key)

    # Fallback: return optimized prompt for manual use
    return _manual_prompt_fallback(description, optimized)


# ── Provider implementations ─────────────────────────────────────

def _generate_pollinations(prompt: str) -> str:
    """
    Pollinations.ai — 100% FREE, no API key needed.
    Uses FLUX model. Returns a direct image URL.
    """
    try:
        encoded = urllib.parse.quote(prompt)
        url = (
            f"https://image.pollinations.ai/prompt/{encoded}"
            "?width=1024&height=1024&model=flux&nologo=true&enhance=true"
        )
        # Validate the URL is reachable (HEAD request)
        req = urllib.request.Request(url, method="HEAD")
        urllib.request.urlopen(req, timeout=10)
        return (
            f"✅ Imagen generada con **Pollinations.ai** (FLUX · GRATIS · sin API key)\n\n"
            f"🔗 **URL de la imagen:**\n{url}\n\n"
            f"📝 **Prompt usado:** {prompt}\n\n"
            f"💡 Abre el link en tu navegador para ver la imagen. "
            f"Cada vez que abras el link genera una variación nueva."
        )
    except Exception:
        return ""   # Fall through to next provider


def _generate_huggingface(prompt: str, token: str) -> str:
    """
    Hugging Face Inference API — FREE with a free account.
    Model: black-forest-labs/FLUX.1-schnell
    Get your free token at: https://huggingface.co/settings/tokens
    """
    try:
        model = "black-forest-labs/FLUX.1-schnell"
        api_url = f"https://api-inference.huggingface.co/models/{model}"
        payload = json.dumps({"inputs": prompt}).encode()
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

        req = urllib.request.Request(api_url, data=payload, headers=headers)
        with urllib.request.urlopen(req, timeout=60) as resp:
            image_bytes = resp.read()

        import tempfile
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False, prefix="drewai_") as f:
            f.write(image_bytes)
            saved_path = f.name

        return (
            f"✅ Imagen generada con **Hugging Face FLUX.1-schnell** (cuenta gratuita)\n\n"
            f"📁 **Guardada en:** `{saved_path}`\n"
            f"📝 **Prompt usado:** {prompt}"
        )
    except Exception as e:
        return f"Error con Hugging Face: {e}. Verifica que HF_TOKEN sea válido."


def _generate_flux(prompt: str, api_key: str) -> str:
    """fal.ai FLUX.1 — requires: pip install fal-client (~$0.003/imagen)"""
    try:
        import fal_client
        os.environ["FAL_KEY"] = api_key
        result = fal_client.run(
            "fal-ai/flux/schnell",
            arguments={"prompt": prompt, "image_size": "square_hd", "num_images": 1},
        )
        url = result["images"][0]["url"]
        return f"✅ Imagen generada con **fal.ai FLUX.1**\n\n🔗 URL: {url}\n📝 Prompt: {prompt}"
    except ImportError:
        return "Error: instala fal-client con `pip install fal-client`."
    except Exception as e:
        return f"Error fal.ai: {e}"


def _generate_dalle(prompt: str, api_key: str) -> str:
    """DALL-E 3 via OpenAI SDK — requires: pip install openai (~$0.04/imagen)"""
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        response = client.images.generate(
            model="dall-e-3", prompt=prompt, size="1024x1024", quality="standard", n=1,
        )
        url = response.data[0].url
        revised = response.data[0].revised_prompt or prompt
        return f"✅ Imagen generada con **DALL-E 3**\n\n🔗 URL: {url}\n📝 Prompt revisado: {revised}"
    except ImportError:
        return "Error: instala openai con `pip install openai`."
    except Exception as e:
        return f"Error DALL-E: {e}"


def _manual_prompt_fallback(original: str, optimized: str) -> str:
    return (
        f"🎨 **Prompt optimizado listo** — úsalo en cualquier herramienta de imagen:\n\n"
        f"```\n{optimized}\n```\n\n"
        f"**Herramientas gratuitas donde pegarlo:**\n"
        f"• Pollinations.ai → https://pollinations.ai  (sin registro)\n"
        f"• Hugging Face Spaces → https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell\n"
        f"• Adobe Firefly → https://firefly.adobe.com  (créditos gratis al registrarse)\n"
        f"• Canva AI → https://canva.com  (tiene generador gratuito)\n\n"
        f"Para activar generación automática en el ecosistema, añade a tu `.env`:\n"
        f"  HF_TOKEN=tu_token_gratuito  → https://huggingface.co/settings/tokens"
    )


# ── Helpers ──────────────────────────────────────────────────────

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
