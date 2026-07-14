# 🇨🇭 CH Fahren — Teoría Suiza (B + A)

App web bilingüe **alemán/español** para estudiar la teoría del examen de conducir suizo y repasar consejos para el examen práctico. Cubre las categorías **B** (coche) y **A/A1** (moto).

> El examen teórico básico (*Basistheorieprüfung*) es idéntico para A, A1 y B: 50 preguntas, aprobado con máx. 15 puntos de penalización. Por eso el banco de preguntas es compartido y solo los tips prácticos difieren por categoría.

## Funcionalidades

- **Pantalla inicial**: elegir Coche (B) o Moto (A) + selector de idioma DE/ES siempre visible
- **Modo estudio**: preguntas una a una con feedback inmediato, explicación bilingüe y filtro por tema
- **Modo examen**: simulación con preguntas aleatorias, temporizador, puntos de penalización y repaso de errores al final (umbral proporcional al tamaño del banco actual)
- **Repaso de falladas**: las preguntas falladas se guardan en `localStorage` y se eliminan al responderlas bien
- **Tips prácticos** por categoría: aparcar en paralelo, Rechtsvortritt, rotondas, Sicherheitsblick, autopista (B) · Spurgasse, slalom, Vollbremsung, el ocho, equipamiento (A)

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
  "image": null                // placeholder para señales/diagramas
}
```

Se soportan preguntas con **varias respuestas correctas** (checkboxes, como en el examen real). Los tips viven en `src/data/tips.json` con la misma estructura bilingüe.

## Añadir preguntas

Añade objetos a `src/data/questions.json` siguiendo el modelo. El modo examen escala automáticamente: usa hasta 50 preguntas y ajusta el umbral de aprobado y el tiempo de forma proporcional al tamaño del banco.

## Aviso

Las preguntas son **originales**, redactadas a partir de la normativa suiza (SVG, VRV, SSV) con fines de estudio. No son el material oficial del examen (banco ASA, protegido por copyright) y no sustituyen a los cursos ni al material oficial.
