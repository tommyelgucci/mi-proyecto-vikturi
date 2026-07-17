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

// Carril único de Einspuren: calzada vertical x115–245, coche mirando al norte.
// Posiciones horizontales típicas: izquierda x=133, centro x=180, derecha x=227.
const LANE = [
  { type: 'grass', x: 0, y: 0, w: 115, h: 360 },
  { type: 'grass', x: 245, y: 0, w: 115, h: 360 },
  { type: 'road', x: 115, y: 0, w: 130, h: 360 },
  { type: 'curbLine', x1: 115, y1: 0, x2: 115, y2: 360 },
  { type: 'curbLine', x1: 245, y1: 0, x2: 245, y2: 360 },
]
// Igual, pero con una línea amarilla discontinua que delimita un espacio a la
// derecha (x210–245) reservado para girar a la derecha (o buses/bicis).
const LANE_DASHED = [...LANE, { type: 'yellowZone', x1: 210, y1: 0, x2: 210, y2: 360 }]

export const DIAGRAMS = {
  // q109: carril con flecha exclusiva izquierda, coche bien pegado a la izquierda.
  einspuren_left_only_correct: {
    elements: [...LANE, { type: 'laneArrow', x: 180, y: 150, kind: 'left' }],
    cars: [{ x: 133, y: 250, angle: 0, color: '#ffffff', blinker: 'left' }],
  },
  // q110: mismo carril, coche mal centrado (no pegado al borde izquierdo).
  einspuren_left_only_wrong_center: {
    elements: [...LANE, { type: 'laneArrow', x: 180, y: 150, kind: 'left' }],
    cars: [{ x: 180, y: 250, angle: 0, color: '#ffffff', blinker: 'left' }],
  },
  // q111: carril mixto recto/izquierda, coche a la izquierda sin blinker (va recto).
  einspuren_straight_left_correct: {
    elements: [...LANE, { type: 'laneArrow', x: 180, y: 150, kind: 'straightLeft' }],
    cars: [{ x: 133, y: 250, angle: 0, color: '#ffffff', blinker: null }],
  },
  // q112: mismo carril, coche a la izquierda pero con blinker izquierdo (va recto: mal).
  einspuren_straight_left_wrong_blinker: {
    elements: [...LANE, { type: 'laneArrow', x: 180, y: 150, kind: 'straightLeft' }],
    cars: [{ x: 133, y: 250, angle: 0, color: '#ffffff', blinker: 'left' }],
  },
  // q113: carril con línea amarilla discontinua, coche a la derecha con blinker derecho (gira a la derecha: bien).
  einspuren_straight_right_dashed_correct: {
    elements: [...LANE_DASHED, { type: 'laneArrow', x: 180, y: 150, kind: 'straightRight' }],
    cars: [{ x: 227, y: 250, angle: 0, color: '#ffffff', blinker: 'right' }],
  },
  // q114: semáforo + carril delimitado, coche a la derecha sin blinker (quiere ir recto: mal).
  einspuren_bus_lane_signal_wrong: {
    elements: [
      ...LANE_DASHED,
      { type: 'laneArrow', x: 180, y: 150, kind: 'straightRight' },
      { type: 'trafficLight', x: 295, y: 30 },
    ],
    cars: [{ x: 227, y: 250, angle: 0, color: '#ffffff', blinker: null }],
  },
  // q115: carril exclusivo derecha, coche pegado a la derecha con blinker derecho.
  einspuren_right_only_correct: {
    elements: [...LANE, { type: 'laneArrow', x: 180, y: 150, kind: 'right' }],
    cars: [{ x: 227, y: 250, angle: 0, color: '#ffffff', blinker: 'right' }],
  },
  // q116: carril triple (izq/recto/der), coche a la derecha con blinker derecho pero quiere ir a la IZQUIERDA (mal).
  einspuren_triple_wrong_left_intent: {
    elements: [...LANE, { type: 'laneArrow', x: 180, y: 150, kind: 'trident' }],
    cars: [{ x: 227, y: 250, angle: 0, color: '#ffffff', blinker: 'right' }],
  },

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
  // Trampa A: B viene de una calle a la derecha ópticamente angosta, pero sin
  // adoquines ni señales → sigue rigiendo el Rechtsvortritt normal.
  rechtsvortritt_narrow_no_mark: {
    elements: [
      ...CROSS,
      { type: 'grass', x: 225, y: 135, w: 135, h: 30 },
      { type: 'grass', x: 225, y: 195, w: 135, h: 30 },
      { type: 'curbLine', x1: 225, y1: 165, x2: 360, y2: 165 },
      { type: 'curbLine', x1: 225, y1: 195, x2: 360, y2: 195 },
    ],
    cars: [
      { label: 'A', color: '#ffffff', x: 202, y: 300, angle: 0 },
      { label: 'B', color: '#c0392b', x: 295, y: 180, angle: -90 },
    ],
    arrows: [
      { path: 'M 202 252 L 202 90' },
      { path: 'M 258 180 L 100 180' },
    ],
  },
  // Trampa B: la calle de B parece normal, pero una doble fila de adoquines en
  // la boca indica una Trottoirüberfahrt → B pierde la prioridad.
  rechtsvortritt_cobble: {
    elements: [...CROSS, { type: 'trottoirMark', x1: 225, y1: 135, x2: 225, y2: 225, kind: 'cobble' }],
    cars: [
      { label: 'A', color: '#ffffff', x: 202, y: 300, angle: 0 },
      { label: 'B', color: '#c0392b', x: 305, y: 158, angle: -90 },
    ],
    arrows: [
      { path: 'M 202 252 L 202 90' },
      { path: 'M 258 158 L 100 158' },
    ],
  },
  // Igual, pero con una rampa de asfalto (Belagskissen) en vez de adoquines.
  rechtsvortritt_ramp: {
    elements: [...CROSS, { type: 'trottoirMark', x1: 225, y1: 135, x2: 225, y2: 225, kind: 'ramp' }],
    cars: [
      { label: 'A', color: '#ffffff', x: 202, y: 300, angle: 0 },
      { label: 'B', color: '#c0392b', x: 305, y: 158, angle: -90 },
    ],
    arrows: [
      { path: 'M 202 252 L 202 90' },
      { path: 'M 258 158 L 100 158' },
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
  // Kreisel de un solo carril: coche entrando desde el sur, sin otro vehículo
  // (preguntas sobre comportamiento propio: posición + blinker).
  kreisel_1ausfahrt_correct: {
    elements: [
      { type: 'grass', x: 0, y: 0, w: 360, h: 360 },
      { type: 'road', x: 152, y: 0, w: 76, h: 90 },
      { type: 'road', x: 152, y: 270, w: 76, h: 90 },
      { type: 'road', x: 0, y: 152, w: 90, h: 76 },
      { type: 'road', x: 270, y: 152, w: 90, h: 76 },
      { type: 'ring', x: 180, y: 180, rOuter: 100, rInner: 42 },
    ],
    cars: [{ x: 210, y: 330, angle: 0, color: '#ffffff', blinker: 'right' }],
    arrows: [{ path: 'M 210 300 L 210 250 Q 210 180 270 180' }],
  },
  kreisel_1ausfahrt_no_blinker: {
    elements: [
      { type: 'grass', x: 0, y: 0, w: 360, h: 360 },
      { type: 'road', x: 152, y: 0, w: 76, h: 90 },
      { type: 'road', x: 152, y: 270, w: 76, h: 90 },
      { type: 'road', x: 0, y: 152, w: 90, h: 76 },
      { type: 'road', x: 270, y: 152, w: 90, h: 76 },
      { type: 'ring', x: 180, y: 180, rOuter: 100, rInner: 42 },
    ],
    cars: [{ x: 210, y: 330, angle: 0, color: '#ffffff', blinker: null }],
    arrows: [{ path: 'M 210 300 L 210 250 Q 210 180 270 180' }],
  },
  kreisel_2ausfahrt_correct: {
    elements: [
      { type: 'grass', x: 0, y: 0, w: 360, h: 360 },
      { type: 'road', x: 152, y: 0, w: 76, h: 90 },
      { type: 'road', x: 152, y: 270, w: 76, h: 90 },
      { type: 'road', x: 0, y: 152, w: 90, h: 76 },
      { type: 'road', x: 270, y: 152, w: 90, h: 76 },
      { type: 'ring', x: 180, y: 180, rOuter: 100, rInner: 42 },
    ],
    cars: [{ x: 190, y: 330, angle: 0, color: '#ffffff', blinker: null }],
    arrows: [{ path: 'M 190 300 Q 190 180 152 100' }],
  },
  kreisel_2ausfahrt_wrong_blinker: {
    elements: [
      { type: 'grass', x: 0, y: 0, w: 360, h: 360 },
      { type: 'road', x: 152, y: 0, w: 76, h: 90 },
      { type: 'road', x: 152, y: 270, w: 76, h: 90 },
      { type: 'road', x: 0, y: 152, w: 90, h: 76 },
      { type: 'road', x: 270, y: 152, w: 90, h: 76 },
      { type: 'ring', x: 180, y: 180, rOuter: 100, rInner: 42 },
    ],
    cars: [{ x: 190, y: 330, angle: 0, color: '#ffffff', blinker: 'left' }],
    arrows: [{ path: 'M 190 300 Q 190 180 152 100' }],
  },
  // Kreisel de doble carril: círculo divisorio discontinuo entre los dos
  // anillos; coche en el carril EXTERIOR queriendo la 3ª salida (mal: debería
  // ir por el interior y pasarse al exterior recién antes de salir).
  kreisel_doppelspurig_wrong: {
    elements: [
      { type: 'grass', x: 0, y: 0, w: 360, h: 360 },
      { type: 'road', x: 152, y: 0, w: 76, h: 90 },
      { type: 'road', x: 152, y: 270, w: 76, h: 90 },
      { type: 'road', x: 0, y: 152, w: 90, h: 76 },
      { type: 'road', x: 270, y: 152, w: 90, h: 76 },
      { type: 'ring', x: 180, y: 180, rOuter: 100, rInner: 42 },
      { type: 'circleOutline', x: 180, y: 180, r: 71 },
    ],
    cars: [{ x: 180, y: 95, angle: -90, color: '#ffffff', blinker: null }],
    arrows: [{ path: 'M 180 95 Q 100 95 60 180' }],
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
