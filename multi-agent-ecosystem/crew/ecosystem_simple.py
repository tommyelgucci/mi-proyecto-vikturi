"""
Streamlit Cloud-compatible runner — calls Anthropic API directly, no CrewAI/ChromaDB.
Used by app.py when running on cloud.
"""
from __future__ import annotations
import base64
import os
import re
import tempfile
import uuid
from pathlib import Path

import urllib.parse

import anthropic

from memory.session_memory import save_interaction, get_recent_context

_PROMPTS = Path(__file__).parent.parent / "prompts"

_IMAGE_KW = ("genera", "generate", "crea una imagen", "hazme una imagen",
             "dibuja", "draw", "diseña una imagen", "imagen de", "foto de")

_VIDEO_KW = ("video", "anima esta imagen", "animame", "animar")

_EDIT_KW = ("edita", "editar", "modifica", "modificar")

_CODE_KW = ("código", "code", "función", "function", "clase", "class",
            "script", "pep8", "debugear", "debug", "error en", "refactor",
            "fastapi", "django", "flask", "sql", "api", "def ", "return",
            "html", "css", "javascript", "typescript", "react",
            "frontend", "backend")

# Extensions accepted by the "Documento" uploader that should be treated as
# source code — force-routed to Dimelis AI regardless of the chat message text.
CODE_EXTENSIONS = {
    ".html", ".htm", ".md", ".markdown",
    ".py", ".js", ".jsx", ".ts", ".tsx",
    ".css", ".scss",
    ".java", ".kt",
    ".c", ".cpp", ".h", ".hpp",
    ".go", ".rb", ".php", ".rs",
    ".sh", ".bash",
    ".json", ".xml", ".yaml", ".yml",
    ".sql",
}

# Above this size a full-file rewrite risks exceeding the model's max output
# tokens and truncating mid-file — Dimelis is instructed to review by section instead.
CODE_FILE_SIZE_WARN_THRESHOLD = 300_000  # bytes

_FILE_BLOCK_RE = re.compile(
    r"<<<VIKTURI_FILE:(?P<filename>[^>\n]+)>>>\n(?P<content>.*?)\n<<<END_VIKTURI_FILE>>>",
    re.DOTALL,
)
_GENERATED_FILES_DIR = Path(tempfile.gettempdir()) / "vikturi_generated"


def is_code_file_too_large(doc_bytes: bytes | None, doc_suffix: str | None) -> bool:
    """True if an uploaded code file is large enough to risk exceeding max output tokens."""
    if not doc_bytes or (doc_suffix or "").lower() not in CODE_EXTENSIONS:
        return False
    return len(doc_bytes) > CODE_FILE_SIZE_WARN_THRESHOLD


def _extract_and_stash_generated_files(text: str) -> str:
    """Replace <<<VIKTURI_FILE:...>>> blocks with a 🖼️-IMAGE-style downloadable marker."""
    if "<<<VIKTURI_FILE:" not in text:
        return text

    _GENERATED_FILES_DIR.mkdir(parents=True, exist_ok=True)

    def _replace(match: re.Match) -> str:
        raw_name = os.path.basename(match.group("filename").strip())
        safe_name = f"{uuid.uuid4().hex}_{raw_name}"
        out_path = _GENERATED_FILES_DIR / safe_name
        out_path.write_text(match.group("content"), encoding="utf-8")
        return f"📄 FILE:{out_path}"

    return _FILE_BLOCK_RE.sub(_replace, text)


def _create_message(
    client: "anthropic.Anthropic",
    model: str,
    max_tokens: int,
    system: str,
    messages: list[dict],
) -> "anthropic.types.Message":
    """Streaming call — avoids SDK timeouts on large `max_tokens` code-generation responses."""
    with client.messages.stream(
        model=model, max_tokens=max_tokens, system=system, messages=messages,
    ) as stream:
        return stream.get_final_message()


# ── Text-to-speech ("🔊 Escuchar" button) ──────────────────────────────────────

_AGENT_LABEL_RE = re.compile(r"^[^\n]*\*\*[^*\n]+\*\*[^\n]*\n\n")
_MD_EMPHASIS_RE = re.compile(r"(\*\*|\*|`)")
_TTS_MAX_CHARS = 2000


def _clean_text_for_tts(content: str) -> str:
    """Strip markers/markdown so the TTS model reads only the narrative text."""
    text = _FILE_BLOCK_RE.sub("", content)
    text = re.sub(r"🖼️ IMAGE:[^\n]*", "", text)
    text = re.sub(r"POLLINATIONS_IMG:[^\n]*", "", text)
    text = re.sub(r"📄 FILE:[^\n]*", "", text)
    text = _AGENT_LABEL_RE.sub("", text, count=1)
    text = _MD_EMPHASIS_RE.sub("", text)
    text = re.sub(r"\n{2,}", "\n\n", text).strip()
    if len(text) > _TTS_MAX_CHARS:
        text = text[:_TTS_MAX_CHARS].rsplit(" ", 1)[0] + "…"
    return text


def text_to_speech(text: str, hf_token: str = "") -> bytes | None:
    """Generate spoken audio (MP3 bytes) for `text`. Tries gTTS (free, no key
    needed) first, then falls back to a HuggingFace model if a token is available.
    Returns None if both fail.
    """
    if not text:
        return None

    try:
        import io
        from gtts import gTTS
        buf = io.BytesIO()
        gTTS(text=text, lang="es").write_to_fp(buf)
        return buf.getvalue()
    except Exception:
        pass

    if hf_token:
        try:
            from huggingface_hub import InferenceClient
            client = InferenceClient(provider="hf-inference", token=hf_token)
            audio = client.text_to_speech(text, model="facebook/mms-tts-spa")
            return bytes(audio)
        except Exception:
            pass

    return None

_LEARN_KW = ("explícame", "explica", "qué es", "cómo funciona", "enseñame",
             "no entiendo", "aprend", "tutorial", "paso a paso", "analogía",
             "diferencia entre", "cuándo usar")

_RESEARCH_KW = ("investiga", "busca información", "qué sabes de", "research",
                "fuentes", "documentación", "comparación entre", "últimas noticias",
                "qué pasó", "qué le pasó", "noticias", "noticia", "murió", "falleció",
                "accidente", "murieron", "fallecieron", "se murió", "hoy pasó",
                "qué ocurrió", "qué sucedió", "enteraste", "escuchaste")

_MARKETING_KW = (
    "marketing", "campana", "banner", "portada", "anuncio", "publicidad",
    "marca", "branding", "facebook", "tiktok", "instagram", "youtube",
    "redes sociales", "social media", "estrategia de", "audiencia",
    "target", "hook", "copy", "slogan", "engagement", "viral",
    "contenido para", "post para", "thumbnail", "lanzamiento",
    "campaña", "gasp tree",
)

_FITNESS_KW = (
    "rutina", "entrenamiento", "gym", "gimnasio", "ejercicio", "musculo",
    "proteina", "caloria", "macros", "nutricion", "dieta", "suplemento",
    "hipertrofia", "fuerza", "resistencia", "calistenia", "cardio",
    "culturismo", "bodybuilding", "press de banca", "sentadilla", "peso muerto",
    "dominadas", "flexiones", "muscle up", "planche", "front lever",
    "recomposicion", "deficit calorico", "superavit", "volumen muscular",
    "plan de entrenamiento", "plan nutricional", "series", "repeticiones",
    "descanso muscular", "periodizacion", "imc", "masa muscular", "vigor",
    "perdida de grasa", "ganar musculo", "bajar de peso", "subir de peso",
)

_AGENT_ICONS: dict[str, str] = {
    "DrewAI": "🎨",
    "Dimelis AI": "💻",
    "Yvannia AI": "📚",
    "Teriania": "🔍",
    "Gasp Tree": "🌵",
    "Vigor AI": "💪",
    "Vikturi AI": "⚡",
    "Master Trainer": "🧠",
}


# ── Image generation helpers ──────────────────────────────────────────────────

# Category → richer descriptor phrase (lighting, camera/lens, composition, mood),
# in the spirit of well-structured prompt-gallery entries. Order matters — first
# match wins, so more specific categories are checked before general ones.
_PROMPT_STYLE_PATTERNS: list[tuple[tuple[str, ...], str]] = [
    (("logo", "logotipo", "marca", "branding", "icono", "isotipo"),
     ", minimalist vector logo, clean geometric shapes, flat design, "
     "balanced negative space, centered composition, brand-ready, white background"),
    (("retrato", "portrait", "rostro", "cara de", "headshot"),
     ", portrait photography, softbox lighting, shallow depth of field, "
     "85mm lens, bokeh background, natural skin texture, sharp eyes"),
    (("paisaje", "landscape", "montaña", "atardecer", "amanecer", "naturaleza", "bosque", "playa"),
     ", landscape photography, golden hour lighting, wide-angle lens, "
     "rule of thirds composition, dramatic sky, rich color grading"),
    (("cine", "cinematic", "cinematográfic", "escena de película", "dramátic"),
     ", cinematic still, anamorphic lens flare, moody volumetric lighting, "
     "wide shot composition, film grain, teal and orange color grade"),
    (("fantasía", "fantasy", "dragón", "mágic", "sci-fi", "ciencia ficción", "futurista", "espacial"),
     ", fantasy concept art, dramatic rim lighting, epic wide shot, "
     "intricate detail, atmospheric fog, vivid saturated colors"),
    (("acuarela", "watercolor", "pintura", "painting", "óleo", "oil painting"),
     ", traditional painting style, visible brush strokes, soft color bleed, "
     "textured paper, artistic composition, warm palette"),
    (("minimalista", "minimalist", "flat design", "plano", "simple y limpio"),
     ", minimalist flat design, simple geometric shapes, generous negative space, "
     "limited color palette, clean composition"),
    (("publicidad", "ad", "advertising", "banner", "anuncio", "producto", "product shot"),
     ", commercial product photography, studio softbox lighting, "
     "clean seamless background, three-quarter angle, sharp focus, ad-ready"),
    (("cartoon", "dibujo", "anime", "caricatura"),
     ", illustration style, vibrant colors, clean bold linework, "
     "expressive characters, flat cel shading"),
    (("photo", "foto", "realistic", "realista", "fotorrealista"),
     ", photorealistic, DSLR camera, 85mm lens, natural lighting, sharp focus"),
]


def _optimize_prompt(description: str) -> str:
    suffix = ", high quality, detailed, professional lighting, 4K"
    if len(description) <= 250:
        d = description.lower()
        for keywords, style_suffix in _PROMPT_STYLE_PATTERNS:
            if any(w in d for w in keywords):
                suffix += style_suffix
                break
    return description.rstrip(".") + suffix


def _try_nvidia(api_key: str, optimized: str) -> str | None:
    """Try NVIDIA NIM (FLUX) — free tier, no credit card, 1000 signup credits."""
    import time
    import requests as _req
    try:
        resp = _req.post(
            "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            json={
                "prompt": optimized[:2000],
                "width": 1024,
                "height": 1024,
                "seed": 0,
                "steps": 4,
            },
            timeout=60,
        )
        if resp.status_code == 200:
            data = resp.json()
            artifacts = data.get("artifacts") or []
            b64 = (
                artifacts[0].get("base64") if artifacts else
                data.get("image") or
                (data.get("images") or [None])[0] or
                ((data.get("data") or [{}])[0].get("b64_json"))
            )
            if b64:
                img_bytes = base64.b64decode(b64)
                out = Path(f"/tmp/vikturi_img_{int(time.time())}.png")
                out.write_bytes(img_bytes)
                return (
                    f"✅ Imagen generada con **NVIDIA NIM (FLUX)**\n\n"
                    f"🖼️ IMAGE:{out}\n\n"
                    f"📝 **Prompt:** {optimized}"
                )
        print(f"[_try_nvidia] status={resp.status_code} body={resp.text[:200]!r}")
    except Exception as e:
        print(f"[_try_nvidia] failed: {type(e).__name__}: {e}")
    return None


def _try_nvidia_video(api_key: str, prompt: str) -> str | None:
    """Try NVIDIA NIM Cosmos3-Nano (text-to-video) — same free NVIDIA account/key."""
    import time
    import requests as _req
    try:
        resp = _req.post(
            "https://ai.api.nvidia.com/v1/genai/nvidia/cosmos3-nano",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            json={
                "prompt": prompt[:2000],
                "resolution": "720_16_9",
                "num_output_frames": 121,
                "seed": 0,
            },
            timeout=180,
        )
        if resp.status_code == 200:
            b64 = resp.json().get("b64_video")
            if b64:
                video_bytes = base64.b64decode(b64)
                out = Path(f"/tmp/vikturi_video_{int(time.time())}.mp4")
                out.write_bytes(video_bytes)
                return (
                    f"✅ Video generado con **NVIDIA Cosmos3-Nano**\n\n"
                    f"🎬 VIDEO:{out}\n\n"
                    f"📝 **Prompt:** {prompt}"
                )
        print(f"[_try_nvidia_video] status={resp.status_code} body={resp.text[:200]!r}")
    except Exception as e:
        print(f"[_try_nvidia_video] failed: {type(e).__name__}: {e}")
    return None


def _generate_video(description: str) -> str:
    """Generate a short video via NVIDIA Cosmos3-Nano — no fallback service yet."""
    nvidia_key = os.getenv("NVIDIA_API_KEY", "")
    if nvidia_key:
        result = _try_nvidia_video(nvidia_key, description)
        if result:
            return result
    return (
        "⚠️ **Generación de video no disponible en este momento.**\n\n"
        "Intenta de nuevo en unos segundos."
    )


def _try_nvidia_edit(api_key: str, image_data_uri: str, prompt: str) -> str | None:
    """Try NVIDIA NIM FLUX.1-Kontext-dev (image editing) — same free NVIDIA account/key."""
    import time
    import requests as _req
    try:
        resp = _req.post(
            "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-kontext-dev",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            json={
                "prompt": prompt[:2000],
                "image": image_data_uri,
                "aspect_ratio": "match_input_image",
                "steps": 30,
                "cfg_scale": 3.5,
                "seed": 0,
            },
            timeout=60,
        )
        if resp.status_code == 200:
            data = resp.json()
            artifacts = data.get("artifacts") or []
            b64 = (
                artifacts[0].get("base64") if artifacts else
                data.get("image") or
                (data.get("images") or [None])[0] or
                ((data.get("data") or [{}])[0].get("b64_json"))
            )
            if b64:
                img_bytes = base64.b64decode(b64)
                out = Path(f"/tmp/vikturi_img_{int(time.time())}.png")
                out.write_bytes(img_bytes)
                return (
                    f"✅ Imagen editada con **NVIDIA NIM (FLUX.1-Kontext-dev)**\n\n"
                    f"🖼️ IMAGE:{out}\n\n"
                    f"📝 **Prompt:** {prompt}"
                )
        print(f"[_try_nvidia_edit] status={resp.status_code} body={resp.text[:200]!r}")
    except Exception as e:
        print(f"[_try_nvidia_edit] failed: {type(e).__name__}: {e}")
    return None


def _generate_edit_image(image_path: str, prompt: str) -> str:
    """Edit an uploaded image via NVIDIA FLUX.1-Kontext-dev — no fallback service yet."""
    nvidia_key = os.getenv("NVIDIA_API_KEY", "")
    if nvidia_key:
        path = Path(image_path)
        media_map = {
            ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
            ".png": "image/png", ".webp": "image/webp",
        }
        media_type = media_map.get(path.suffix.lower(), "image/jpeg")
        img_b64 = base64.b64encode(path.read_bytes()).decode()
        data_uri = f"data:{media_type};base64,{img_b64}"
        result = _try_nvidia_edit(nvidia_key, data_uri, prompt)
        if result:
            return result
    return (
        "⚠️ **Edición de imagen no disponible en este momento.**\n\n"
        "Intenta de nuevo en unos segundos."
    )


def _try_hf(token: str, optimized: str) -> str | None:
    """Try HF InferenceClient, pinned to HF's own free inference provider.

    Without an explicit `provider=`, HF's router auto-picks a third-party
    provider (e.g. "nscale") that requires separate billing/token scope and
    401s — "hf-inference" is HF's own infrastructure, covered by the free tier.
    """
    import time
    try:
        from huggingface_hub import InferenceClient
        client = InferenceClient(provider="hf-inference", token=token)
        image = client.text_to_image(optimized,
                                     model="black-forest-labs/FLUX.1-schnell")
        out = Path(f"/tmp/vikturi_img_{int(time.time())}.png")
        image.save(str(out))
        return (
            f"✅ Imagen generada con **FLUX.1-schnell** (Hugging Face)\n\n"
            f"🖼️ IMAGE:{out}\n\n"
            f"📝 **Prompt:** {optimized}"
        )
    except Exception as e:
        print(f"[_try_hf] failed: {type(e).__name__}: {e}")
        return None


def _try_pollinations(description: str) -> str | None:
    """Try Pollinations — works from HF Spaces."""
    import time
    import requests as _req
    short = description[:180].rstrip()
    encoded = urllib.parse.quote(short)
    url = (f"https://image.pollinations.ai/prompt/{encoded}"
           "?width=512&height=512&nologo=true")
    try:
        resp = _req.get(url, timeout=90)
        data = resp.content
        is_img = data[:4] == b'\x89PNG' or data[:3] == b'\xff\xd8\xff'
        if resp.status_code == 200 and is_img:
            out = Path(f"/tmp/vikturi_img_{int(time.time())}.png")
            out.write_bytes(data)
            return (
                f"✅ Imagen generada con **Pollinations.ai** (FLUX · gratis)\n\n"
                f"🖼️ IMAGE:{out}\n\n"
                f"📝 **Prompt:** {short}"
            )
        print(f"[_try_pollinations] status={resp.status_code} is_img={is_img} "
              f"first_bytes={data[:20]!r}")
    except Exception as e:
        print(f"[_try_pollinations] failed: {type(e).__name__}: {e}")
    return None


def _try_craiyon(description: str) -> str | None:
    """Try Craiyon (free, no API key)."""
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
        print(f"[_try_craiyon] status={resp.status_code} body={resp.text[:200]!r}")
    except Exception as e:
        print(f"[_try_craiyon] failed: {type(e).__name__}: {e}")
    return None


def _generate_image(description: str) -> str:
    """Try NVIDIA NIM → HF → Pollinations → Craiyon → error message."""
    optimized = _optimize_prompt(description)

    nvidia_key = os.getenv("NVIDIA_API_KEY", "")
    if nvidia_key:
        result = _try_nvidia(nvidia_key, optimized)
        if result:
            return result

    hf_token = os.getenv("HF_TOKEN", "")
    if hf_token:
        result = _try_hf(hf_token, optimized)
        if result:
            return result

    result = _try_pollinations(description)
    if result:
        return result

    result = _try_craiyon(description)
    if result:
        return result

    return (
        "⚠️ **Generación de imágenes no disponible en este momento.**\n\n"
        "Todos los servicios de imagen están ocupados o bloqueados. "
        "Intenta de nuevo en 30 segundos."
    )


# ── Routing ───────────────────────────────────────────────────────────────────

def _strip_accents(text: str) -> str:
    import unicodedata
    return unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")


def _route(request: str) -> tuple[str, str]:
    """Returns (agent_display_name, system_prompt_text)."""
    r = _strip_accents(request.lower())

    def _read(name: str) -> str:
        return (_PROMPTS / name).read_text(encoding="utf-8")

    if any(_strip_accents(kw) in r for kw in _MARKETING_KW):
        return "Gasp Tree", _read("gasptree_prompt.md")
    if any(_strip_accents(kw) in r for kw in _FITNESS_KW):
        return "Vigor AI", _read("vigor_prompt.md")
    if any(_strip_accents(kw) in r for kw in _VIDEO_KW):
        return "DrewAI", _read("drewai_prompt.md")
    if any(_strip_accents(kw) in r for kw in _IMAGE_KW):
        return "DrewAI", _read("drewai_prompt.md")
    if any(_strip_accents(kw) in r for kw in _CODE_KW):
        return "Dimelis AI", _read("dimelis_prompt.md")
    if any(_strip_accents(kw) in r for kw in _LEARN_KW):
        return "Yvannia AI", _read("yvannia_prompt.md")
    if any(_strip_accents(kw) in r for kw in _RESEARCH_KW):
        return "Teriania", _read("teriania_prompt.md")
    return "Vikturi AI", _read("master_prompt.md")


# ── Conversation helpers ──────────────────────────────────────────────────────

def _build_conv_messages(chat_history: list[dict] | None) -> list[dict]:
    """Convert Streamlit session_state.messages into Anthropic API messages.

    Skips leading assistant messages (the welcome bubble) so the array always
    starts with a user turn, as required by the Anthropic API.
    Long messages are truncated to keep token usage reasonable.
    """
    if not chat_history:
        return []

    messages: list[dict] = []
    saw_user = False
    for msg in chat_history:
        role = msg.get("role", "")
        if not saw_user:
            if role != "user":
                continue  # skip welcome/leading assistant messages
            saw_user = True
        if role not in ("user", "assistant"):
            continue
        content = msg.get("content", "")
        if len(content) > 3500:
            content = content[:3500] + "\n...[truncado]"
        messages.append({"role": role, "content": content})
    return messages


def _vision_content(image_path: str, text: str) -> list[dict]:
    """Build an Anthropic vision content block from a local image file."""
    path = Path(image_path)
    img_b64 = base64.b64encode(path.read_bytes()).decode()
    media_map = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".png": "image/png",  ".webp": "image/webp",
    }
    media_type = media_map.get(path.suffix.lower(), "image/jpeg")
    return [
        {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": img_b64}},
        {"type": "text", "text": text or "Analiza esta imagen en detalle."},
    ]


def _analyze_video(video_bytes: bytes, suffix: str, user_text: str, hf_token: str, client: "anthropic.Anthropic", model: str, max_tokens: int) -> str:
    """Extract audio (→ Whisper transcription) and keyframes (→ Claude Vision) from a video."""
    import subprocess
    import tempfile as _tmpmod

    work_dir = Path(_tmpmod.mkdtemp())
    src = work_dir / f"video{suffix}"
    src.write_bytes(video_bytes)

    # 1) Extract audio and transcribe with Whisper
    transcription = ""
    audio = work_dir / "audio.mp3"
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src), "-q:a", "0", "-map", "a", str(audio)],
            capture_output=True, timeout=120,
        )
        if audio.exists() and audio.stat().st_size > 0 and hf_token:
            from huggingface_hub import InferenceClient
            hf_client = InferenceClient(provider="hf-inference", token=hf_token)
            result = hf_client.automatic_speech_recognition(
                audio.read_bytes(), model="openai/whisper-large-v3"
            )
            transcription = getattr(result, "text", str(result)).strip()
    except Exception:
        pass

    # 2) Extract up to 6 keyframes (1 every 5 seconds)
    frames_dir = work_dir / "frames"
    frames_dir.mkdir()
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(src),
             "-vf", "fps=1/5,scale=512:-1",
             "-frames:v", "6",
             str(frames_dir / "frame_%02d.jpg")],
            capture_output=True, timeout=120,
        )
    except Exception:
        pass
    frames = sorted(frames_dir.glob("*.jpg"))

    # 3) Build Anthropic content: frames + transcription + user question
    content: list[dict] = []
    for frame in frames[:6]:
        b64 = base64.b64encode(frame.read_bytes()).decode()
        content.append({"type": "image",
                        "source": {"type": "base64", "media_type": "image/jpeg", "data": b64}})

    body = user_text or "Analiza este video: describe qué ocurre visualmente y qué se dice."
    if transcription:
        body = f"Transcripción del audio del video:\n\n{transcription}\n\n---\n\n{body}"
    if not frames:
        body = f"[No se pudieron extraer fotogramas del video]\n\n{body}"
    content.append({"type": "text", "text": body})

    system = (_PROMPTS / "drewai_prompt.md").read_text(encoding="utf-8")
    response = _create_message(
        client, model, max_tokens, system,
        [{"role": "user", "content": content}],
    ).content[0].text

    parts = ["🎬 **DrewAI** · Análisis de video"]
    if transcription:
        parts.append(f"\n**🎤 Transcripción de audio:**\n> {transcription[:600]}{'…' if len(transcription) > 600 else ''}")
    parts.append(f"\n**👁️ Análisis visual:**\n{response}")
    return "\n\n".join(parts)


def _document_content(doc_bytes: bytes, doc_suffix: str, user_text: str) -> list[dict]:
    """Build Anthropic content blocks for an attached document."""
    suffix = doc_suffix.lower()
    if suffix == ".pdf":
        b64 = base64.b64encode(doc_bytes).decode()
        return [
            {"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": b64}},
            {"type": "text", "text": user_text},
        ]
    if suffix == ".docx":
        import io
        from docx import Document as DocxDocument
        doc = DocxDocument(io.BytesIO(doc_bytes))
        extracted = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    else:
        extracted = doc_bytes.decode("utf-8", errors="replace")

    label = "[Archivo de código adjunto]" if suffix in CODE_EXTENSIONS else "[Documento adjunto]"
    body = f"{label}\n\n{extracted}\n\n---\n\n{user_text}"
    if is_code_file_too_large(doc_bytes, doc_suffix):
        body = (
            "[NOTA: este archivo es grande y probablemente exceda el límite de "
            "tokens de salida del modelo. NO intentes reescribirlo completo — "
            "resume su estructura, lista problemas/mejoras concretas, y ofrece "
            "reescribir una sección específica si el usuario lo pide.]\n\n" + body
        )
    return [{"type": "text", "text": body}]


# ── Web search helper ─────────────────────────────────────────────────────────

def _web_search(query: str, max_results: int = 5) -> str:
    """Search chain: Brave → DDG Instant Answer → DDGS library → Wikipedia."""
    import urllib.parse as _up
    import requests as _req

    # ── 1) Brave Search API (primary — real results, free tier 2k/month) ───
    brave_key = os.getenv("BRAVE_API_KEY", "")
    if brave_key:
        try:
            resp = _req.get(
                "https://api.search.brave.com/res/v1/web/search",
                params={"q": query, "count": max_results, "search_lang": "es"},
                headers={
                    "Accept": "application/json",
                    "Accept-Encoding": "gzip",
                    "X-Subscription-Token": brave_key,
                },
                timeout=8,
            )
            if resp.status_code == 200:
                web_results = resp.json().get("web", {}).get("results", [])
                if web_results:
                    lines = ["**Resultados de búsqueda web (Brave):**\n"]
                    for i, r in enumerate(web_results[:max_results], 1):
                        lines.append(f"{i}. **{r.get('title', '')}**")
                        lines.append(f"   {r.get('description', '')}")
                        lines.append(f"   Fuente: {r.get('url', '')}\n")
                    return "\n".join(lines)
        except Exception:
            pass

    # ── 2) DuckDuckGo Instant Answer API (no key, encyclopedia/facts) ──────
    try:
        params = {"q": query, "format": "json", "no_html": "1", "skip_disambig": "1"}
        resp = _req.get("https://api.duckduckgo.com/", params=params,
                        timeout=8, headers={"User-Agent": "VikturiAI/1.0"})
        if resp.status_code == 200:
            data = resp.json()
            lines = []
            abstract = data.get("AbstractText", "").strip()
            abstract_url = data.get("AbstractURL", "")
            if abstract:
                lines.append("**Resultado principal:**\n")
                lines.append(abstract)
                if abstract_url:
                    lines.append(f"Fuente: {abstract_url}\n")
            related = data.get("RelatedTopics", [])[:max_results]
            if related:
                lines.append("\n**Temas relacionados:**\n")
                for i, t in enumerate(related, 1):
                    text = t.get("Text", "")
                    url = t.get("FirstURL", "")
                    if text:
                        lines.append(f"{i}. {text}")
                        if url:
                            lines.append(f"   Fuente: {url}\n")
            if lines:
                return "\n".join(["**Resultados de búsqueda web:**\n"] + lines)
    except Exception:
        pass

    # ── 3) DDGS library fallback ────────────────────────────────────────────
    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
        if results:
            lines = ["**Resultados de búsqueda web:**\n"]
            for i, r in enumerate(results, 1):
                lines.append(f"{i}. **{r.get('title', '')}**")
                lines.append(f"   {r.get('body', '')}")
                lines.append(f"   Fuente: {r.get('href', '')}\n")
            return "\n".join(lines)
    except Exception:
        pass

    # ── 3) Wikipedia REST API (always free, no key) ─────────────────────────
    try:
        import requests as _req
        search_resp = _req.get(
            "https://en.wikipedia.org/w/api.php",
            params={"action": "query", "list": "search", "srsearch": query,
                    "srlimit": 3, "format": "json"},
            timeout=8, headers={"User-Agent": "VikturiAI/1.0"}
        )
        if search_resp.status_code == 200:
            items = search_resp.json().get("query", {}).get("search", [])
            if items:
                lines = ["**Resultados de Wikipedia:**\n"]
                for i, item in enumerate(items, 1):
                    title = item.get("title", "")
                    snippet = item.get("snippet", "").replace("<span class=\"searchmatch\">", "**").replace("</span>", "**")
                    url = f"https://en.wikipedia.org/wiki/{_up.quote(title.replace(' ', '_'))}"
                    lines.append(f"{i}. **{title}**")
                    lines.append(f"   {snippet}")
                    lines.append(f"   Fuente: {url}\n")
                return "\n".join(lines)
    except Exception:
        pass

    return "**Búsqueda web:** no disponible en este momento. Respondo con mi conocimiento interno, sin datos en tiempo real."


# ── Main entry point ──────────────────────────────────────────────────────────

def run_simple(
    user_request: str,
    training_mode: bool = False,
    chat_history: list[dict] | None = None,
    image_path: str | None = None,
    doc_bytes: bytes | None = None,
    doc_suffix: str | None = None,
    video_bytes: bytes | None = None,
    video_suffix: str | None = None,
) -> str:
    """Run the ecosystem without CrewAI — single Anthropic API call.

    Args:
        user_request:  Current user message text.
        training_mode: If True, read context/ files and produce an agent briefing.
        chat_history:  Prior conversation messages from Streamlit session_state.messages
                       (all entries BEFORE the current user message).
        image_path:    Optional local path to an image file; triggers DrewAI vision analysis.
        doc_bytes:     Optional raw bytes of an attached document (.pdf, .docx, .txt).
        doc_suffix:    File extension of the document (e.g. ".pdf", ".docx", ".txt").
    """
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        return (
            "❌ **ANTHROPIC_API_KEY no configurada.**\n\n"
            "Ve a Manage app → Settings → Secrets y agrega:\n"
            "```\nANTHROPIC_API_KEY = \"sk-ant-...\"\n```"
        )

    model = os.getenv("MODEL", "claude-sonnet-4-6")
    max_tokens = int(os.getenv("MAX_TOKENS", "16000"))
    client = anthropic.Anthropic(api_key=api_key)

    # ── Training mode ─────────────────────────────────────────────────
    if training_mode:
        recent = get_recent_context(n=5)
        system = (_PROMPTS / "master_prompt.md").read_text(encoding="utf-8")
        user_msg = (
            "[MODO ENTRENAMIENTO] Lee el siguiente historial de sesión y prepara "
            f"un briefing para todos los agentes.\n\n{recent}\n\n"
            f"Instrucción adicional: {user_request}"
        )
        response = _create_message(
            client, model, max_tokens, system,
            [{"role": "user", "content": user_msg}],
        ).content[0].text
        result = f"🧠 **Master Trainer**\n\n{response}"
        save_interaction(user_request, result, training_mode=True)
        return result

    # ── Video upload → DrewAI audio + visual analysis ─────────────────
    if video_bytes and video_suffix:
        hf_token = os.getenv("HF_TOKEN", "")
        result = _analyze_video(video_bytes, video_suffix, user_request, hf_token, client, model, max_tokens)
        save_interaction(user_request, result)
        return result

    # ── Image upload → edit (Kontext-dev) or DrewAI vision analysis ───
    if image_path and Path(image_path).exists():
        if any(kw in user_request.lower() for kw in _EDIT_KW):
            edit_result = _generate_edit_image(image_path, user_request)
            result = f"🎨 **DrewAI** · Edición de imagen\n\n{edit_result}"
            save_interaction(user_request, result)
            return result
        system = (_PROMPTS / "drewai_prompt.md").read_text(encoding="utf-8")
        messages = _build_conv_messages(chat_history)
        messages.append({"role": "user", "content": _vision_content(image_path, user_request)})
        response = _create_message(client, model, max_tokens, system, messages).content[0].text
        result = f"🎨 **DrewAI** · Análisis visual\n\n{response}"
        save_interaction(user_request, result)
        return result

    # ── Document upload ───────────────────────────────────────────────
    if doc_bytes and doc_suffix:
        suffix = doc_suffix.lower()
        if suffix in CODE_EXTENSIONS:
            agent_label, system = "Dimelis AI", (_PROMPTS / "dimelis_prompt.md").read_text(encoding="utf-8")
        else:
            agent_label, system = _route(user_request)
        messages = _build_conv_messages(chat_history)
        messages.append({"role": "user", "content": _document_content(doc_bytes, doc_suffix, user_request)})
        response = _create_message(client, model, max_tokens, system, messages).content[0].text
        response = _extract_and_stash_generated_files(response)
        icon = _AGENT_ICONS.get(agent_label, "⚡")
        result = f"{icon} **{agent_label}**\n\n{response}"
        save_interaction(user_request, result)
        return result

    # ── Normal routing ─────────────────────────────────────────────────
    agent_label, system = _route(user_request)

    # Video generation — call generator directly, skip LLM
    if agent_label == "DrewAI" and any(kw in user_request.lower() for kw in _VIDEO_KW):
        video_result = _generate_video(user_request)
        icon = _AGENT_ICONS["DrewAI"]
        result = f"{icon} **DrewAI** · Agente visual\n\n{video_result}"
        save_interaction(user_request, result)
        return result

    # Image generation — call generator directly, skip LLM
    if agent_label == "DrewAI" and any(kw in user_request.lower() for kw in _IMAGE_KW):
        img_result = _generate_image(user_request)
        icon = _AGENT_ICONS["DrewAI"]
        result = f"{icon} **DrewAI** · Agente visual\n\n{img_result}"
        save_interaction(user_request, result)
        return result

    # Build multi-turn messages
    messages = _build_conv_messages(chat_history)

    # Real web search for Teriania
    search_context = ""
    if agent_label == "Teriania":
        search_context = _web_search(user_request)

    # Inject persistent session context only when there is no in-session history
    current_msg = user_request
    if not chat_history:
        recent = get_recent_context(n=5)
        if recent:
            current_msg = f"{user_request}\n\n[Contexto de sesión]\n{recent}"

    if search_context:
        current_msg = f"{search_context}\n\n---\n\nPregunta del usuario: {current_msg}"

    messages.append({"role": "user", "content": current_msg})

    response = _create_message(client, model, max_tokens, system, messages).content[0].text
    response = _extract_and_stash_generated_files(response)

    icon = _AGENT_ICONS.get(agent_label, "⚡")
    result = f"{icon} **{agent_label}**\n\n{response}"
    save_interaction(user_request, result)
    return result
