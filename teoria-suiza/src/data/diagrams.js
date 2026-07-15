// Diagramas estáticos de situaciones de prioridad para preguntas del examen.
// Renderizados por SceneDiagram.jsx sobre un lienzo de 360×360.
// Convención de flechas: cada vehículo lleva una flecha discontinua cian con su
// trayectoria prevista; las letras A/B/C identifican los vehículos en la pregunta.

const CROSS = [
  { type: 'grass', x: 0, y: 0, w: 135, h: 135 },
  { type: 'grass', x: 225, y: 0, w: 135, h: 135 },
  { type: 'grass', x: 0, y: 225, w: 135, h: 135 },
  { type: 'grass', x: 225, y: 225, w: 135, h: 135 },
  { type: 'road', x: 135, y: 0, w: 90, h: 360 },
  { type: 'road', x: 0, y: 135, w: 360, h: 90 },
  { type: 'curbLine', x1: 135, y1: 0, x2: 135, y2: 135 },
  { type: 'curbLine', x1: 225, y1: 0, x2: 225, y2: 135 },
  { type: 'curbLine', x1: 135, y1: 225, x2: 135, y2: 360 },
  { type: 'curbLine', x1: 225, y1: 225, x2: 225, y2: 360 },
  { type: 'curbLine', x1: 0, y1: 135, x2: 135, y2: 135 },
  { type: 'curbLine', x1: 0, y1: 225, x2: 135, y2: 225 },
  { type: 'curbLine', x1: 225, y1: 135, x2: 360, y2: 135 },
  { type: 'curbLine', x1: 225, y1: 225, x2: 360, y2: 225 },
]

export const DIAGRAMS = {
  // Cruce sin señales, 2 coches: B viene por la derecha de A → B primero.
  rechtsvortritt_2: {
    elements: CROSS,
    cars: [
      { label: 'A', color: '#ffffff', x: 202, y: 300, angle: 0 },
      { label: 'B', color: '#c0392b', x: 305, y: 158, angle: -90 },
    ],
    arrows: [
      { path: 'M 202 252 L 202 90' },
      { path: 'M 258 158 L 100 158' },
    ],
  },
  // Cruce sin señales, 3 coches: C (dcha. libre) → B (dcha. libre tras C) → A.
  rechtsvortritt_3: {
    elements: CROSS,
    cars: [
      { label: 'A', color: '#ffffff', x: 202, y: 300, angle: 0 },
      { label: 'B', color: '#c0392b', x: 305, y: 158, angle: -90 },
      { label: 'C', color: '#3f5aa3', x: 158, y: 60, angle: 180 },
    ],
    arrows: [
      { path: 'M 202 252 L 202 90' },
      { path: 'M 258 158 L 100 158' },
      { path: 'M 158 108 L 158 270' },
    ],
  },
  // Tram desde la izquierda de A: el tram tiene prioridad igualmente.
  tram_links: {
    elements: [
      ...CROSS,
      { type: 'rail', x1: 0, y1: 180, x2: 360, y2: 180 },
    ],
    cars: [
      { label: 'A', color: '#ffffff', x: 202, y: 300, angle: 0 },
      { label: 'B', kind: 'tram', x: 62, y: 180, angle: 90 },
    ],
    arrows: [
      { path: 'M 202 252 L 202 90' },
      { path: 'M 125 180 L 280 180' },
    ],
  },
  // Rotonda: A quiere entrar, B ya circula dentro (viene por la izquierda) → B primero.
  kreisel: {
    elements: [
      { type: 'grass', x: 0, y: 0, w: 360, h: 360 },
      { type: 'road', x: 152, y: 0, w: 76, h: 90 },
      { type: 'road', x: 152, y: 270, w: 76, h: 90 },
      { type: 'road', x: 0, y: 152, w: 90, h: 76 },
      { type: 'road', x: 270, y: 152, w: 90, h: 76 },
      { type: 'ring', x: 180, y: 180, rOuter: 100, rInner: 42 },
    ],
    cars: [
      { label: 'A', color: '#ffffff', x: 200, y: 312, angle: 0 },
      { label: 'B', color: '#c0392b', x: 106, y: 218, angle: 135 },
    ],
    arrows: [
      { path: 'M 200 275 L 200 245' },
      { path: 'M 128 242 Q 160 275 205 268' },
    ],
  },
  // Giro a la izquierda: A gira, B viene de frente recto → B primero.
  linksabbiegen: {
    elements: CROSS,
    cars: [
      { label: 'A', color: '#ffffff', x: 202, y: 300, angle: 0 },
      { label: 'B', color: '#3f5aa3', x: 158, y: 62, angle: 180 },
    ],
    arrows: [
      { path: 'M 202 252 Q 200 180 110 180' },
      { path: 'M 158 110 L 158 290' },
    ],
  },
  // Salida de parking: A sale de una plaza/entrada, B circula por la calle → B primero.
  ausfahrt: {
    elements: [
      { type: 'grass', x: 0, y: 0, w: 360, h: 120 },
      { type: 'road', x: 0, y: 120, w: 360, h: 110 },
      { type: 'grass', x: 0, y: 230, w: 360, h: 130 },
      { type: 'driveway', x: 210, y: 230, w: 90, h: 130 },
      { type: 'curbLine', x1: 0, y1: 120, x2: 360, y2: 120 },
      { type: 'curbLine', x1: 0, y1: 230, x2: 210, y2: 230 },
      { type: 'curbLine', x1: 300, y1: 230, x2: 360, y2: 230 },
      { type: 'laneLine', x1: 0, y1: 175, x2: 360, y2: 175, dashed: true },
      { type: 'label', x: 222, y: 350, text: 'P', size: 22 },
    ],
    cars: [
      { label: 'A', color: '#ffffff', x: 255, y: 290, angle: 0 },
      { label: 'B', color: '#c0392b', x: 80, y: 202, angle: 90 },
    ],
    arrows: [
      { path: 'M 255 250 Q 255 202 320 202' },
      { path: 'M 128 202 L 300 202' },
    ],
  },
}
