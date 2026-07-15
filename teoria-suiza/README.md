# 🇨🇭 CH Fahren — Teoría Suiza (B + A)

App web bilingüe **alemán/español** para estudiar la teoría del examen de conducir suizo y repasar consejos para el examen práctico. Cubre las categorías **B** (coche) y **A/A1** (moto).

> El examen teórico básico (*Basistheorieprüfung*) es idéntico para A, A1 y B: 50 preguntas, aprobado con máx. 15 puntos de penalización. Por eso el banco de preguntas es compartido y solo los tips prácticos difieren por categoría.

## Funcionalidades

- **Pantalla inicial**: elegir Coche (B) o Moto (A) + selector de idioma DE/ES siempre visible
- **Modo estudio**: preguntas una a una con feedback inmediato, explicación bilingüe y filtro por tema
- **Modo examen**: simulación con preguntas aleatorias, temporizador, puntos de penalización y repaso de errores al final. Con el banco actual (108 preguntas) ya alcanza el formato real: 50 preguntas, máx. 15 puntos, 45 min; con un banco menor escala proporcionalmente
- **Preguntas visuales**: parte del banco incluye una señal dibujada (`image: { type: "sign", id }`) o un diagrama de cruce/rotonda con vehículos etiquetados (`image: { type: "scene", id }`, ver `SceneDiagram.jsx` y `src/data/diagrams.js`) para preguntas de prioridad tipo "¿quién pasa primero?"
- **Repaso de falladas**: las preguntas falladas se guardan en `localStorage` y se eliminan al responderlas bien
- **Maniobras animadas**: animaciones SVG limpias en vista cenital (estilo "vídeo explicativo") con coche animado, indicador de volante, intermitentes, marcha atrás y captions paso a paso, bilingües. 10 maniobras de categoría B: aparcar en paralelo, en perpendicular y de frente, girar a la izquierda con Einspuren, tramo largo marcha atrás, cambio de sentido en 3 tiempos, parada en el STOP, frenada de emergencia (Vollbremsung), dónde parar ("Anhalten") y la regla de los 2 segundos
- **Tips prácticos** por categoría: aparcar en paralelo, Rechtsvortritt, rotondas, Sicherheitsblick, autopista (B) · Spurgasse, slalom, Vollbremsung, el ocho, equipamiento (A) · colores de indicadores de dirección y glosario de órdenes del examinador (ambas categorías)
- **Señales de tráfico (Verkehrssignale)**: ~55 señales suizas dibujadas como SVG paramétricos propios (`SignSprite.jsx` + `src/data/signs.js`), agrupadas en las 6 categorías oficiales (peligro, prioridad, prohibición, obligación, indicación, Wegweiser). Tres modos: explorar por categoría con significado, flashcards con progreso persistente y quiz "¿qué señal es esta?" con distractores de la misma categoría. Los dibujos son representaciones simplificadas con fines de estudio.
- **Primeros auxilios (Nothelfer)**: módulo de repaso del Nothelferkurs obligatorio (temario en `src/data/firstaid.js`): 8 temas de lectura (números de emergencia, asegurar el accidente, GABI, posición lateral, RCP 30:2 y DEA, hemorragias/shock, infarto/ictus/quemaduras, obligaciones legales), 26 flashcards con progreso persistente y quiz de 10 preguntas con feedback. No sustituye el curso oficial presencial.
- **Repetición espaciada (SRS)** en las flashcards de Nothelfer y Señales: cada tarjeta tiene un nivel (0–5) con intervalos crecientes (1, 3, 7, 14, 30 días); la baraja del día son las tarjetas nuevas o vencidas. "Me la sé" sube de nivel, "Repasar" la reinicia.
- **Estadísticas** (`Stats.jsx`): racha de días de estudio, aciertos por tema (ordenados de peor a mejor), historial de exámenes y progreso de flashcards de ambos módulos.
- **App instalable (PWA)**: manifest + service worker propio (`public/sw.js`, cache-first con actualización en segundo plano) — "Añadir a pantalla de inicio" en el móvil da un icono propio y funcionamiento offline. Se sirve vía GitHub Pages (ver más abajo); el registro del service worker se omite automáticamente si la app se abre como archivo local (`file://`), así el HTML de un solo archivo sigue funcionando igual.

## Stack

- React + Vite + Tailwind CSS v4
- Sin backend: datos en JSON estáticos (`src/data/`)
- Progreso del usuario en `localStorage`
- Mobile-first

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # previsualizar el build
```

## Modelo de datos

Cada pregunta en `src/data/questions.json`:

```json
{
  "id": "q001",
  "category": "both",          // "B", "A" o "both"
  "topic": "vortritt",         // para el filtro por tema
  "type": "multiple_choice",
  "points": 3,                 // penalización si se falla
  "question": { "de": "...", "es": "..." },
  "options": [
    { "id": "a", "text": { "de": "...", "es": "..." }, "correct": true }
  ],
  "explanation": { "de": "...", "es": "..." },
  "image": null                // o { "type": "sign", "id": "v_stop" } / { "type": "scene", "id": "kreisel" }
}
```

Se soportan preguntas con **varias respuestas correctas** (checkboxes, como en el examen real). Los tips viven en `src/data/tips.json` con la misma estructura bilingüe.

## Añadir preguntas

Añade objetos a `src/data/questions.json` siguiendo el modelo. El modo examen escala automáticamente: usa hasta 50 preguntas y ajusta el umbral de aprobado y el tiempo de forma proporcional al tamaño del banco.

## Añadir maniobras animadas

Las maniobras viven en `src/data/maneuvers.js` (JS, no JSON, para poder componer escenas con funciones). El motor de animación (`ManeuverPlayer.jsx`) y los sprites (`CarSprite.jsx`, `SceneElements.jsx`) son genéricos: una maniobra nueva es solo **datos**, no requiere tocar el motor.

Cada maniobra tiene:
- `scene.elements`: lista de elementos estáticos (`road`, `grass`, `curbLine`, `laneLine`, `yellowZone`, `driveway`, `crosswalk`, `stopSign`, `bayOutline`, `parkedCar`, `label`, `distanceTag`, `check`, `cross`) sobre un lienzo `360×560`.
- `steps`: cada paso anima el coche protagonista entre `keyframes` `{ t, x, y, angle }` (`t` de 0 a 1, ángulo 0 = arriba, positivo = gira a la derecha). Props opcionales por paso: `wheel` (`'left' | 'right' | 'straight'`), `reverse`, `braking`, `blinker`, `guides` (líneas guía cian), `callout` (bocadillo, p. ej. la orden del experto), `extraCars` (vehículos secundarios con sus propios keyframes, p. ej. tráfico en sentido contrario), `gapBadge` (✔/✘ junto al coche).

El reproductor respeta `prefers-reduced-motion`: sin autoplay, solo navegación por pasos mostrando la pose final de cada uno.

## Desplegar en GitHub Pages

El workflow `.github/workflows/deploy-teoria-suiza.yml` construye y publica `teoria-suiza/dist` en GitHub Pages en cada push a `main` que toque `teoria-suiza/**` (o manualmente con "Run workflow"). Pasos únicos para activarlo en el repo:

1. Mergear la rama a `main`.
2. En **Settings → Pages**, poner **Source: GitHub Actions**.

La URL resultante sirve la PWA (instalable, offline) en `https://<usuario>.github.io/<repo>/`.

## Aviso

Las preguntas son **originales**, redactadas a partir de la normativa suiza (SVG, VRV, SSV) con fines de estudio. No son el material oficial del examen (banco ASA, protegido por copyright) y no sustituyen a los cursos ni al material oficial.
