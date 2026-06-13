"""
Image tools for DrewAI.

- analyze_image   → Claude vision (uses ANTHROPIC_API_KEY)
- generate_image  → Pollinations.ai FLUX (100% free, no key needed)
"""
from __future__ import annotations
import base64
import urllib.parse
import urllib.request
from pathlib import Path
from crewai.tools import tool

_MEDIA_TYPES = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png",  ".gif": "image/gif",
    ".webp": "image/webp",
}


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
    Generates an image from a text description using Pollinations.ai (free, no API key).
    Returns a direct image URL — open it in any browser to see the result.
    """
    optimized = _optimize_prompt(description)
    encoded = urllib.parse.quote(optimized)
    url = (
        f"https://image.pollinations.ai/prompt/{encoded}"
        "?width=1024&height=1024&model=flux&nologo=true&enhance=true"
    )

    return (
        f"✅ Imagen generada con **Pollinations.ai** (FLUX · gratis · sin API key)\n\n"
        f"🔗 **Abre este link en tu navegador:**\n{url}\n\n"
        f"📝 **Prompt optimizado usado:**\n{optimized}\n\n"
        f"💡 Cada vez que recargues el link obtienes una variación nueva.\n"
        f"   Funciona en cualquier navegador — no necesita ninguna cuenta."
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
