# Vikturi AI — Explicación del proyecto (para entrevistas)

Este documento explica qué es el proyecto, cómo funciona por dentro, y las decisiones
técnicas más importantes — en un lenguaje que puedas repetir con confianza aunque no
hayas escrito el código línea por línea tú mismo. Tú diseñaste el producto, tomaste las
decisiones, y dirigiste cada cambio; este documento es tu chuleta para explicarlo.

---

## 1. El pitch de 30 segundos

> "Vikturi AI es una app web de asistentes de IA especializados — no un solo chatbot
> genérico, sino un equipo de 7 agentes, cada uno experto en un área (código,
> creatividad visual, fitness, investigación, marketing, tutorías). El sistema detecta
> automáticamente qué agente debe responder según lo que pides, y cada uno puede además
> generar imágenes, generar video, convertir texto a voz, leer archivos que subas
> (código, PDFs, Word) y buscar información real en internet. Está desplegado en vivo
> en Hugging Face Spaces, con un pipeline de CI/CD que sincroniza automáticamente cada
> cambio desde GitLab."

---

## 2. Arquitectura general

```
Usuario (navegador)
      │
      ▼
Streamlit (app.py)  ──────────────►  interfaz de chat, subida de archivos, botones
      │
      ▼
Router de agentes (crew/ecosystem_simple.py)
      │
      ├─► detecta palabras clave en el mensaje del usuario
      ├─► elige QUÉ agente responde (Dimelis, DrewAI, Teriania, etc.)
      └─► arma el "system prompt" de ese agente + el historial de la conversación
      │
      ▼
Anthropic Claude API (el modelo de lenguaje que realmente "piensa" y responde)
      │
      ▼
(si aplica) servicios externos gratuitos:
      ├─ generación de imágenes → NVIDIA NIM (FLUX) → Hugging Face → Pollinations → Craiyon
      ├─ generación de video    → NVIDIA Cosmos3-Nano
      ├─ texto a voz            → gTTS (Google) → Hugging Face
      └─ búsqueda web real      → DuckDuckGo Search
```

**Punto clave para entrevista:** el "cerebro" que entiende y redacta las respuestas es
siempre Claude (Anthropic) — los agentes no son 7 modelos de IA distintos, son 7
**personalidades/especialidades distintas** (7 prompts de sistema distintos) que se le
inyectan al mismo modelo según el contexto. Esto es mucho más barato y simple que correr
7 modelos separados, y es un patrón real usado en la industria ("prompt-based agent
routing").

---

## 3. Por qué existe una versión "simple" sin CrewAI

El proyecto empezó usando **CrewAI** (un framework de orquestación de agentes) con
ChromaDB para memoria vectorial. Esa versión sigue en el repo (`agents/`, `crew/
ecosystem_crew.py`), pero **la app desplegada en producción usa una versión más simple**
(`crew/ecosystem_simple.py`) que llama directo a la API de Anthropic sin pasar por
CrewAI.

**Por qué se tomó esa decisión (buena respuesta de entrevista):**
- CrewAI + ChromaDB añaden overhead (más dependencias, más tiempo de arranque, más
  puntos de falla) para un caso de uso que en el fondo es "elegir un prompt y llamar al
  LLM una vez".
- En el entorno gratuito de Hugging Face Spaces (recursos limitados), menos capas =
  arranque más rápido y menos consumo de memoria.
- Es más fácil de depurar: cada función `_try_*()` hace una sola cosa y se puede probar
  aislada.

Esto demuestra criterio de ingeniería: **usar la herramienta más simple que resuelve el
problema**, no la más sofisticada.

---

## 4. Los agentes y el sistema de enrutamiento

| Agente | Especialidad | Cómo se activa |
|---|---|---|
| **Vikturi AI** (Master) | Coordinador general, respuestas generales | Por defecto si nada más aplica |
| **Dimelis AI** | Código, revisión, generación de apps | Palabras como "código", "función", "debug", "html", "api" |
| **DrewAI** | Imágenes, video, análisis visual, contenido para redes | "genera", "imagen de", "video", "dibuja" |
| **Yvannia AI** | Tutorías, explicaciones paso a paso | "explícame", "cómo funciona", "no entiendo" |
| **Teriania** | Investigación con fuentes reales de internet | "investiga", "últimas noticias", "qué pasó" |
| **Gasp Tree** | Marketing, branding, redes sociales | "campaña", "marketing", "tiktok", "branding" |
| **Vigor AI** | Fitness, nutrición, entrenamiento | "rutina", "gym", "proteína", "hipertrofia" |

**Cómo funciona el enrutamiento (`_route()` en `ecosystem_simple.py`):** el texto del
usuario se pasa a minúsculas y sin acentos, y se compara contra listas de palabras clave
por agente (`_CODE_KW`, `_IMAGE_KW`, `_FITNESS_KW`, etc.). El primer grupo que coincide
gana. Es una heurística simple (no usa IA para decidir el enrutamiento) — rápida, gratis,
y predecible. La alternativa sería pedirle a un LLM que decida el enrutamiento, pero eso
cuesta una llamada extra a la API por cada mensaje.

---

## 5. Funcionalidades clave (y cómo resolviste cada una)

### 5.1 Generación de imágenes — cadena de respaldo ("fallback chain")
Cuando pides una imagen, el sistema intenta varios servicios gratuitos **en orden**,
uno tras otro, hasta que uno funciona:

```
NVIDIA NIM (FLUX) → Hugging Face (FLUX) → Pollinations.ai → Craiyon → mensaje de error
```

Cada servicio es una función independiente (`_try_nvidia`, `_try_hf`,
`_try_pollinations`, `_try_craiyon`) que:
1. Intenta generar la imagen.
2. Si falla por cualquier motivo, **no rompe la app** — solo registra el error en los
   logs y devuelve `None`, para que el siguiente servicio de la cadena lo intente.

**Por qué esto es una buena decisión de diseño:** ningún servicio gratuito es 100%
confiable (límites de cuota, mantenimiento, bloqueos). Tener varios respaldos
automáticos significa que el usuario casi nunca ve un error, aunque el primer servicio
falle.

### 5.2 Generación de video
Mismo patrón, usando NVIDIA Cosmos3-Nano (modelo de "world foundation model" que genera
video corto a partir de texto). Sin respaldo todavía (es un solo proveedor), porque no
hay tantas alternativas gratuitas de video como de imagen.

### 5.3 Edición de imágenes
Usa NVIDIA FLUX.1-Kontext-dev: subes una foto, escribes "edita esta imagen y..." y el
modelo la modifica manteniendo el resto igual (parecido a "inpainting").

### 5.4 Texto a voz ("🔊 Escuchar")
Convierte cualquier respuesta del asistente en audio, usando gTTS (Google, gratis, sin
API key) como principal.

### 5.5 Subida de archivos
- **Imágenes** → Claude las analiza directamente (Claude tiene visión nativa).
- **Código** (`.py`, `.js`, `.html`, etc.) → Dimelis AI las revisa/mejora.
- **Documentos** (`.pdf`, `.docx`, `.txt`) → se extrae el texto y se analiza.
- **Video** → se separa el audio (transcripción con Whisper) y frames clave (análisis
  visual con Claude).

### 5.6 Investigación con fuentes reales
Teriania usa `duckduckgo-search` para traer resultados reales de internet antes de
responder, y tiene una regla estricta de **no inventar fuentes** — si no hay resultados
verificados, lo dice explícitamente en vez de alucinar una URL falsa.

---

## 6. Seguridad — decisiones importantes

- **Ningún API key vive en el código.** Todas las claves (Anthropic, Hugging Face,
  NVIDIA) se guardan como "Secrets" en la configuración de Hugging Face Spaces, y el
  código las lee con `os.getenv(...)`. Si alguien ve el repositorio de código, no ve
  ninguna clave real.
- **Principio de "fallar en silencio, seguir funcionando":** cada integración externa
  está envuelta en `try/except` — si un servicio externo falla o cambia su API, la app
  no se cae, solo ese servicio específico deja de estar disponible temporalmente.

---

## 7. Pipeline de despliegue (CI/CD)

```
Cambio de código  →  push a GitLab (rama main)
                          │
                          ▼
                 GitLab CI (.gitlab-ci.yml)
                          │
                          ▼
        Sincroniza automáticamente la carpeta
        multi-agent-ecosystem/ hacia Hugging Face Spaces
                          │
                          ▼
           HF Spaces reconstruye el contenedor Docker
           y reinicia la app — cambios en vivo en minutos
```

Esto es un pipeline real de **CI/CD (Integración/Despliegue Continuo)**: cada cambio
aprobado se sube automáticamente a producción sin pasos manuales, usando la API de
Hugging Face (`HfApi().upload_folder(...)`) disparada por un job de GitLab CI.

---

## 8. Retos reales que resolviste (útil para "cuéntame un reto técnico")

**Ejemplo 1 — Reto: "el token de Hugging Face daba error 401 aunque parecía correcto".**
Causa raíz: HF enruta las llamadas de `InferenceClient` a un proveedor externo de pago
por defecto, a menos que se especifique `provider="hf-inference"` explícitamente —
además el token necesitaba un permiso específico ("Make calls to Inference Providers")
que no tienen los tokens estándar. Solución: fijar el proveedor explícitamente y generar
un token "Fine-grained" con el permiso correcto.

**Ejemplo 2 — Reto: "un servicio 'gratis' (Cloudflare Workers AI) fallaba siempre con
error de conexión SSL".** Se investigó a fondo (incluso forzando la versión de TLS) y se
concluyó que era un bloqueo de red entre la infraestructura de Hugging Face y Cloudflare
— no arreglable desde el código. Decisión: desactivar ese intento en vez de dejarlo
fallando en cada solicitud (para no añadir latencia innecesaria), y documentarlo.

**Ejemplo 3 — Reto: "muchos proveedores anuncian 'nivel gratis' que en la práctica no lo
es".** Se probaron y descartaron Gemini (pedía tarjeta), ModelsLab (sin crédito real
desde la primera llamada) — un ejemplo real de **due diligence** técnica: no confiar en
el marketing, verificar con una prueba en vivo antes de comprometerse.

---

## 9. Posibles preguntas de entrevista + cómo responderlas

**"¿Por qué Streamlit y no React/FastAPI?"**
> Streamlit permite construir una interfaz funcional en Python puro, sin escribir
> JavaScript por separado — ideal para iterar rápido en un proyecto personal/prototipo
> donde la velocidad de desarrollo importa más que tener un frontend a medida.

**"¿Cómo garantizas que el sistema no se caiga si un servicio externo falla?"**
> Cada integración externa está aislada en su propia función con manejo de excepciones,
> y las funciones críticas (como generación de imágenes) tienen una cadena de varios
> proveedores de respaldo, para que un solo punto de falla no tumbe la funcionalidad.

**"¿Cómo manejas los secretos/API keys?"**
> Nunca en el código fuente — se inyectan como variables de entorno en la plataforma de
> despliegue (HF Spaces Secrets), siguiendo el principio de separar configuración de
> código.

**"¿Qué mejorarías si tuvieras más tiempo?"**
> - Reemplazar el enrutamiento por palabras clave con embeddings/clasificación semántica
>   para que sea más robusto ante frases que no usan las palabras exactas esperadas.
> - Añadir tests automatizados de extremo a extremo para las cadenas de generación de
>   imágenes/video.
> - Cachear resultados de búsqueda web para reducir latencia.

---

## 10. Glosario rápido (por si te preguntan un término)

- **API / API key:** forma en que un programa le pide datos/servicios a otro por
  internet; la "key" es la contraseña que te identifica ante ese servicio.
- **LLM (Large Language Model):** el modelo de IA que entiende y genera texto (aquí,
  Claude de Anthropic).
- **System prompt:** instrucciones fijas que le das al modelo antes de la conversación,
  definiendo su "personalidad" y reglas de comportamiento.
- **Fallback / cadena de respaldo:** si el plan A falla, intenta el plan B, C, D…
  automáticamente.
- **CI/CD:** automatizar que cada cambio de código se pruebe/despliegue solo, sin pasos
  manuales.
- **Rate limit:** límite de cuántas solicitudes puedes hacerle a una API en un periodo
  de tiempo.
- **gRPC:** una forma alternativa (a HTTP normal) de que dos programas se comuniquen,
  usada por algunos servicios de NVIDIA (como el de texto a voz que se intentó integrar).
