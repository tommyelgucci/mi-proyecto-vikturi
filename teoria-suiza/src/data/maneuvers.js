// Animaciones de maniobras: datos puros consumidos por ManeuverPlayer.
//
// Sistema de coordenadas: SVG viewBox 0 0 360 560 (retrato). Y crece hacia abajo.
// Ángulo del coche: 0 = morro hacia "arriba" (norte). Positivo = sentido horario.
//
// CONVENCIÓN FÍSICA (¡no romperla al añadir maniobras!):
// - Avanzar = la posición se mueve HACIA el morro; marcha atrás (`reverse: true`)
//   = la posición se mueve en sentido OPUESTO al morro.
// - En marcha atrás, la trasera sigue al volante: volante a la DERECHA =>
//   la trasera se desplaza a la derecha del coche y el morro rota en sentido
//   ANTIHORARIO (el ángulo disminuye). Volante a la izquierda, lo contrario.
//
// Cada paso (`step`) anima el coche protagonista entre keyframes {t, x, y, angle}
// con t creciente de 0 a 1. `extraCars` sigue el mismo esquema para vehículos
// secundarios (tráfico en sentido contrario, etc.) sincronizados con el mismo `t`.

export const CANVAS = { w: 360, h: 560 }

export const ROAD = '#5b6470'
export const GRASS = '#6fae3e'
export const CURB = '#3f4650'

function parallelBaysScene() {
  return {
    elements: [
      { type: 'road', x: 0, y: 0, w: 300, h: CANVAS.h },
      { type: 'grass', x: 300, y: 0, w: 60, h: CANVAS.h },
      { type: 'curbLine', x1: 300, y1: 0, x2: 300, y2: CANVAS.h },
      { type: 'parkedCar', x: 270, y: 60, angle: 0, color: '#e8ecef' },
      { type: 'parkedCar', x: 270, y: 170, angle: 0, color: '#c0392b' },
      { type: 'parkedCar', x: 270, y: 340, angle: 0, color: '#3f5aa3' },
    ],
  }
}

function perpendicularBaysScene() {
  const bay = (y) => ({ type: 'bayOutline', x: 260, y, w: 80, h: 50, angle: 0 })
  return {
    elements: [
      { type: 'road', x: 0, y: 0, w: CANVAS.w, h: CANVAS.h },
      { type: 'grass', x: 300, y: 0, w: 60, h: CANVAS.h },
      { type: 'curbLine', x1: 300, y1: 0, x2: 300, y2: CANVAS.h },
      bay(150),
      bay(210),
      bay(270),
      { type: 'parkedCar', x: 260, y: 150, angle: -90, color: '#c0392b' },
      { type: 'parkedCar', x: 260, y: 270, angle: 90, color: '#3f5aa3' },
      { type: 'laneLine', x1: 100, y1: 0, x2: 100, y2: CANVAS.h, dashed: true },
    ],
  }
}

function junctionScene() {
  return {
    elements: [
      { type: 'grass', x: 0, y: 0, w: CANVAS.w, h: 270 },
      { type: 'grass', x: 0, y: 360, w: CANVAS.w, h: 200 },
      { type: 'road', x: 140, y: 0, w: 160, h: CANVAS.h },
      { type: 'road', x: 0, y: 270, w: 300, h: 90 },
      { type: 'laneLine', x1: 220, y1: 0, x2: 220, y2: 270, dashed: true },
      { type: 'laneLine', x1: 220, y1: 360, x2: 220, y2: CANVAS.h, dashed: true },
      { type: 'laneLine', x1: 0, y1: 317, x2: 140, y2: 317, dashed: true },
      { type: 'curbLine', x1: 140, y1: 0, x2: 140, y2: 270 },
      { type: 'curbLine', x1: 300, y1: 0, x2: 300, y2: 270 },
      { type: 'curbLine', x1: 140, y1: 360, x2: 140, y2: CANVAS.h },
      { type: 'curbLine', x1: 300, y1: 360, x2: 300, y2: CANVAS.h },
    ],
  }
}

function narrowStreetScene() {
  return {
    elements: [
      { type: 'grass', x: 0, y: 0, w: 80, h: CANVAS.h },
      { type: 'grass', x: 280, y: 0, w: 80, h: CANVAS.h },
      { type: 'road', x: 80, y: 0, w: 200, h: CANVAS.h },
      { type: 'curbLine', x1: 80, y1: 0, x2: 80, y2: CANVAS.h },
      { type: 'curbLine', x1: 280, y1: 0, x2: 280, y2: CANVAS.h },
    ],
  }
}

function wendeplatzScene() {
  // Wendeplatz en forma de "hongo": una zona ancha de maniobra (el bulbo) al
  // final de una calle angosta, para dar la vuelta con espacio de sobra.
  return {
    elements: [
      { type: 'grass', x: 0, y: 0, w: 40, h: CANVAS.h },
      { type: 'grass', x: 320, y: 0, w: 40, h: CANVAS.h },
      { type: 'grass', x: 40, y: 240, w: 80, h: 320 },
      { type: 'grass', x: 240, y: 240, w: 80, h: 320 },
      { type: 'road', x: 40, y: 0, w: 280, h: 240 },
      { type: 'road', x: 120, y: 240, w: 120, h: 320 },
      { type: 'curbLine', x1: 40, y1: 0, x2: 40, y2: 240 },
      { type: 'curbLine', x1: 320, y1: 0, x2: 320, y2: 240 },
      { type: 'curbLine', x1: 120, y1: 240, x2: 120, y2: CANVAS.h },
      { type: 'curbLine', x1: 240, y1: 240, x2: 240, y2: CANVAS.h },
    ],
  }
}

function straightRoadScene() {
  return {
    elements: [
      { type: 'road', x: 0, y: 0, w: 300, h: CANVAS.h },
      { type: 'grass', x: 300, y: 0, w: 60, h: CANVAS.h },
      { type: 'curbLine', x1: 300, y1: 0, x2: 300, y2: CANVAS.h },
      { type: 'laneLine', x1: 150, y1: 0, x2: 150, y2: CANVAS.h, dashed: true },
    ],
  }
}

function stopScene() {
  return {
    elements: [
      { type: 'road', x: 0, y: 0, w: 300, h: CANVAS.h },
      { type: 'road', x: 0, y: 60, w: CANVAS.w, h: 100 },
      { type: 'grass', x: 300, y: 0, w: 60, h: 60 },
      { type: 'grass', x: 300, y: 160, w: 60, h: 400 },
      { type: 'curbLine', x1: 300, y1: 160, x2: 300, y2: CANVAS.h },
      { type: 'laneLine', x1: 150, y1: 160, x2: 150, y2: CANVAS.h, dashed: true },
      { type: 'laneLine', x1: 0, y1: 110, x2: CANVAS.w, y2: 110, dashed: true },
      { type: 'stopLine', x: 155, y: 200, w: 140, h: 9 },
      { type: 'stopSign', x: 304, y: 176 },
    ],
  }
}

function curbRulesScene() {
  // El coche circula hacia ABAJO (sur): su lado derecho es el borde IZQUIERDO
  // de la pantalla (oeste), donde están todas las zonas prohibidas y el hueco legal.
  return {
    elements: [
      { type: 'road', x: 60, y: 0, w: 300, h: CANVAS.h },
      { type: 'grass', x: 0, y: 0, w: 60, h: 80 },
      { type: 'road', x: 0, y: 80, w: 60, h: 90 },
      { type: 'grass', x: 0, y: 170, w: 60, h: 390 },
      { type: 'curbLine', x1: 60, y1: 0, x2: 60, y2: 80 },
      { type: 'curbLine', x1: 60, y1: 170, x2: 60, y2: CANVAS.h },
      { type: 'distanceTag', x1: 84, y1: 172, x2: 84, y2: 228, text: '5 m' },
      { type: 'cross', x: 80, y: 250 },
      { type: 'yellowZone', x1: 64, y1: 280, x2: 64, y2: 350 },
      { type: 'cross', x: 80, y: 315 },
      { type: 'driveway', x: 0, y: 375, w: 60, h: 45 },
      { type: 'label', x: 4, y: 370, text: 'Einfahrt', size: 9 },
      { type: 'cross', x: 80, y: 397 },
      { type: 'check', x: 128, y: 478 },
    ],
  }
}

// --- Escenas de la Manöverprüfung de moto (pista de prácticas) ---

function spurgasseScene() {
  const cones = []
  for (let y = 160; y <= 440; y += 40) {
    cones.push({ type: 'cone', x: 162, y })
    cones.push({ type: 'cone', x: 198, y })
  }
  return {
    elements: [{ type: 'road', x: 0, y: 0, w: CANVAS.w, h: CANVAS.h }, ...cones],
  }
}

function slalomScene() {
  return {
    elements: [
      { type: 'road', x: 0, y: 0, w: CANVAS.w, h: CANVAS.h },
      { type: 'cone', x: 180, y: 100 },
      { type: 'cone', x: 180, y: 180 },
      { type: 'cone', x: 180, y: 260 },
      { type: 'cone', x: 180, y: 340 },
      { type: 'cone', x: 180, y: 420 },
    ],
  }
}

function achterScene() {
  return {
    elements: [
      { type: 'road', x: 0, y: 0, w: CANVAS.w, h: CANVAS.h },
      { type: 'circleOutline', x: 180, y: 175, r: 85 },
      { type: 'circleOutline', x: 180, y: 345, r: 85 },
      { type: 'cone', x: 180, y: 175 },
      { type: 'cone', x: 180, y: 345 },
    ],
  }
}

function motoBremsScene() {
  return {
    elements: [
      { type: 'road', x: 0, y: 0, w: CANVAS.w, h: CANVAS.h },
      { type: 'cone', x: 130, y: 320 },
      { type: 'cone', x: 230, y: 320 },
      { type: 'label', x: 244, y: 324, text: 'Bremspunkt', size: 9 },
      { type: 'stopLine', x: 120, y: 148, w: 120, h: 7 },
    ],
  }
}

function ausweichenScene() {
  return {
    elements: [
      { type: 'road', x: 0, y: 0, w: CANVAS.w, h: CANVAS.h },
      { type: 'cone', x: 140, y: 410 },
      { type: 'cone', x: 220, y: 410 },
      { type: 'obstacle', x: 185, y: 255, w: 60, h: 38 },
    ],
  }
}

export const MANEUVERS = [
  {
    id: 'seitwaerts_rueckwaerts',
    category: 'B',
    icon: '🅿️',
    title: { de: 'Seitwärts rückwärts (Längseinparken)', es: 'Aparcar en paralelo marcha atrás' },
    scene: parallelBaysScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Blinker setzen und parallel neben dem vorderen Auto anhalten, ca. 50 cm Abstand.',
          es: 'Paso 1: Pon el intermitente y detente en paralelo junto al coche de delante, a unos 50 cm.',
        },
        duration: 2000,
        keyframes: [
          { t: 0, x: 215, y: 330, angle: 0 },
          { t: 1, x: 215, y: 160, angle: 0 },
        ],
        wheel: 'straight',
        blinker: 'right',
      },
      {
        caption: {
          de: 'Schritt 2: Gerade rückwärts, bis dein Hinterrad auf Höhe des Hecks des vorderen Autos ist.',
          es: 'Paso 2: Recto marcha atrás hasta que tu rueda trasera esté a la altura de la parte trasera del coche de delante.',
        },
        duration: 1300,
        keyframes: [
          { t: 0, x: 215, y: 160, angle: 0 },
          { t: 1, x: 215, y: 184, angle: 0 },
        ],
        wheel: 'straight',
        reverse: true,
        blinker: 'right',
        guides: [{ x1: 239, y1: 208, x2: 288, y2: 208 }],
      },
      {
        caption: {
          de: 'Schritt 3: Lenkrad ganz nach rechts und rückwärts, bis das Auto in ca. 45° zur Lücke steht.',
          es: 'Paso 3: Volante a fondo a la derecha y marcha atrás hasta quedar a unos 45° respecto al hueco.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 215, y: 184, angle: 0 },
          { t: 0.5, x: 224, y: 208, angle: -20 },
          { t: 1, x: 238, y: 232, angle: -45 },
        ],
        wheel: 'right',
        reverse: true,
        blinker: 'right',
        guides: [
          { x1: 252, y1: 248, x2: 258, y2: 298 },
          { x1: 252, y1: 248, x2: 296, y2: 254 },
        ],
      },
      {
        caption: {
          de: 'Schritt 4: Sobald dein rechter Spiegel auf Höhe des Hecks des vorderen Autos ist: ganz nach links gegenlenken und weiter rückwärts.',
          es: 'Paso 4: Cuando tu retrovisor derecho quede a la altura de la trasera del coche de delante: contravolante a fondo a la izquierda y sigue atrás.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 238, y: 232, angle: -45 },
          { t: 0.45, x: 253, y: 247, angle: -27 },
          { t: 0.8, x: 263, y: 258, angle: -9 },
          { t: 1, x: 266, y: 262, angle: 0 },
        ],
        wheel: 'left',
        reverse: true,
      },
      {
        caption: {
          de: 'Schritt 5: Räder geradestellen und mittig ausrichten – ca. 10–20 cm vom Randstein.',
          es: 'Paso 5: Endereza las ruedas y céntrate en el hueco, a unos 10–20 cm del bordillo.',
        },
        duration: 1300,
        keyframes: [
          { t: 0, x: 266, y: 262, angle: 0 },
          { t: 1, x: 268, y: 252, angle: 0 },
        ],
        wheel: 'straight',
      },
    ],
  },
  {
    id: 'rechtwinklig_rueckwaerts',
    category: 'B',
    icon: '📐',
    title: { de: 'Rechtwinklig rückwärts parkieren', es: 'Aparcar marcha atrás en perpendicular' },
    scene: perpendicularBaysScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Blinker setzen und knapp an der Lücke vorbeifahren, bis dein Heck die Lücke passiert hat.',
          es: 'Paso 1: Pon el intermitente y pasa por delante del hueco hasta que tu parte trasera lo haya rebasado.',
        },
        duration: 2000,
        keyframes: [
          { t: 0, x: 150, y: 330, angle: 0 },
          { t: 1, x: 150, y: 148, angle: 0 },
        ],
        wheel: 'straight',
        blinker: 'right',
      },
      {
        caption: {
          de: 'Schritt 2: Lenkrad ganz nach rechts und langsam rückwärts – das Heck schwenkt in die Lücke.',
          es: 'Paso 2: Volante a fondo a la derecha y despacio marcha atrás: la trasera entra girando en el hueco.',
        },
        duration: 2400,
        keyframes: [
          { t: 0, x: 150, y: 148, angle: 0 },
          { t: 0.4, x: 162, y: 180, angle: -32 },
          { t: 0.75, x: 185, y: 202, angle: -63 },
          { t: 1, x: 208, y: 210, angle: -90 },
        ],
        wheel: 'right',
        reverse: true,
        blinker: 'right',
        guides: [
          { x1: 195, y1: 198, x2: 224, y2: 190 },
          { x1: 195, y1: 222, x2: 224, y2: 230 },
        ],
      },
      {
        caption: {
          de: 'Schritt 3: Räder geradestellen und gerade bis in die Lücke zurückfahren.',
          es: 'Paso 3: Endereza las ruedas y retrocede recto hasta el fondo de la plaza.',
        },
        duration: 1500,
        keyframes: [
          { t: 0, x: 208, y: 210, angle: -90 },
          { t: 1, x: 242, y: 210, angle: -90 },
        ],
        wheel: 'straight',
        reverse: true,
      },
      {
        caption: {
          de: 'Schritt 4: Fertig – Front zeigt zur Fahrbahn, so fährst du später sicher wieder aus.',
          es: 'Paso 4: Listo: el morro queda hacia el carril, así luego sales con visibilidad y seguridad.',
        },
        duration: 1300,
        keyframes: [
          { t: 0, x: 242, y: 210, angle: -90 },
          { t: 1, x: 242, y: 210, angle: -90 },
        ],
        wheel: null,
      },
    ],
  },
  {
    id: 'vorwaerts_parkieren',
    category: 'B',
    icon: '⬆️',
    title: { de: 'Vorwärts parkieren', es: 'Aparcar de frente' },
    scene: perpendicularBaysScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Blinker setzen und dich der Lücke nähern – etwas Abstand zur Parkreihe lassen.',
          es: 'Paso 1: Pon el intermitente y acércate al hueco, dejando algo de espacio con la fila de plazas.',
        },
        duration: 1700,
        keyframes: [
          { t: 0, x: 150, y: 340, angle: 0 },
          { t: 1, x: 150, y: 258, angle: 0 },
        ],
        wheel: 'straight',
        blinker: 'right',
      },
      {
        caption: {
          de: 'Schritt 2: Zügig nach rechts einlenken und vorwärts in die Lücke fahren.',
          es: 'Paso 2: Gira con decisión a la derecha y entra de frente en la plaza.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 150, y: 258, angle: 0 },
          { t: 0.45, x: 172, y: 233, angle: 38 },
          { t: 0.8, x: 200, y: 216, angle: 70 },
          { t: 1, x: 222, y: 210, angle: 90 },
        ],
        wheel: 'right',
        blinker: 'right',
      },
      {
        caption: {
          de: 'Schritt 3: Räder geradestellen und bis ans Ende der Lücke vorfahren.',
          es: 'Paso 3: Endereza las ruedas y avanza hasta el fondo de la plaza.',
        },
        duration: 1400,
        keyframes: [
          { t: 0, x: 222, y: 210, angle: 90 },
          { t: 1, x: 250, y: 210, angle: 90 },
        ],
        wheel: 'straight',
      },
    ],
  },
  {
    id: 'links_abbiegen_einspuren',
    category: 'B',
    icon: '⬅️',
    title: { de: 'Links abbiegen mit Einspuren', es: 'Girar a la izquierda y colocarse en el carril' },
    scene: junctionScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Spiegel – Blinker links – Sicherheitsblick, bevor du dich vorbereitest.',
          es: 'Paso 1: Espejo, intermitente izquierdo y mirada de seguridad antes de prepararte.',
        },
        duration: 1600,
        keyframes: [
          { t: 0, x: 260, y: 480, angle: 0 },
          { t: 1, x: 260, y: 400, angle: 0 },
        ],
        wheel: 'straight',
        blinker: 'left',
      },
      {
        caption: {
          de: 'Schritt 2: Einspuren – rücke nahe an die Mittellinie, um rechts vorbeizulassen.',
          es: 'Paso 2: Einspuren: colócate junto a la línea central para dejar pasar por la derecha.',
        },
        duration: 1800,
        keyframes: [
          { t: 0, x: 260, y: 400, angle: 0 },
          { t: 1, x: 236, y: 320, angle: 0 },
        ],
        wheel: 'straight',
        blinker: 'left',
      },
      {
        caption: {
          de: 'Schritt 3: Vortritt gewähren – den Gegenverkehr zuerst durchfahren lassen.',
          es: 'Paso 3: Cede el paso: deja pasar primero al tráfico que viene de frente.',
        },
        duration: 2000,
        keyframes: [
          { t: 0, x: 236, y: 320, angle: 0 },
          { t: 1, x: 236, y: 320, angle: 0 },
        ],
        wheel: 'straight',
        blinker: 'left',
        extraCars: [
          {
            color: '#c0392b',
            keyframes: [
              { t: 0, x: 180, y: 140, angle: 180 },
              { t: 1, x: 180, y: 430, angle: 180 },
            ],
          },
        ],
      },
      {
        caption: {
          de: 'Schritt 4: Jetzt abbiegen – zügig und mit weitem Bogen in die Seitenstrasse einfahren.',
          es: 'Paso 4: Ahora sí: gira con un arco amplio hacia la calle lateral.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 236, y: 320, angle: 0 },
          { t: 0.35, x: 222, y: 300, angle: -25 },
          { t: 0.7, x: 190, y: 285, angle: -58 },
          { t: 1, x: 148, y: 292, angle: -90 },
        ],
        wheel: 'left',
        blinker: 'left',
      },
      {
        caption: {
          de: 'Schritt 5: Sofort nach dem Abbiegen vorbereiten: Es folgt eine längere Strecke rückwärts.',
          es: 'Paso 5: Justo después de girar, prepárate: viene un tramo largo marcha atrás.',
        },
        duration: 1400,
        keyframes: [
          { t: 0, x: 148, y: 292, angle: -90 },
          { t: 1, x: 70, y: 292, angle: -90 },
        ],
        wheel: 'straight',
      },
    ],
  },
  {
    id: 'laengere_strecke_rueckwaerts',
    category: 'B',
    icon: '🔙',
    title: {
      de: 'Längere Strecke rückwärts (nach Linksabbiegen)',
      es: 'Tramo largo marcha atrás (tras girar a la izquierda)',
    },
    // Maniobra según el examen (ZH/TG), "über 20 m mit Spurwechsel":
    // subiendo por la calle principal (carril derecho), con la calle libre y
    // por orden del experto se cruza al carril IZQUIERDO (sentido contrario)
    // y se detiene. Desde ahí se retrocede: recto por ese carril y luego
    // doblando la esquina marcha atrás hasta quedar en el carril izquierdo
    // (norte) de la calle secundaria, con el morro hacia la principal.
    scene: junctionScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Der Experte sagt die Übung an. Spiegel, Blinker links – und nur weiterfahren, wenn die Strasse frei ist (kein Verkehr in Sicht).',
          es: 'Paso 1: El experto anuncia la maniobra. Espejo, intermitente izquierdo — y solo continúa si la calle está despejada (sin coches a la vista).',
        },
        duration: 1600,
        keyframes: [
          { t: 0, x: 260, y: 505, angle: 0 },
          { t: 1, x: 260, y: 435, angle: 0 },
        ],
        wheel: 'straight',
        blinker: 'left',
      },
      {
        caption: {
          de: 'Schritt 2: Spurwechsel auf die GEGENFAHRBAHN und links anhalten – nur auf Anweisung des Experten und bei freier Strasse.',
          es: 'Paso 2: Cruza al carril IZQUIERDO (sentido contrario) y párate allí. Esto solo se hace por orden del experto y con la calle libre.',
        },
        duration: 2400,
        keyframes: [
          { t: 0, x: 260, y: 435, angle: 0 },
          { t: 0.4, x: 232, y: 350, angle: -16 },
          { t: 0.75, x: 192, y: 255, angle: -6 },
          { t: 1, x: 180, y: 170, angle: 0 },
        ],
        wheel: 'left',
        blinker: 'left',
      },
      {
        caption: {
          de: 'Schritt 3: Rückwärtsgang einlegen, Oberkörper drehen und durch die Heckscheibe schauen.',
          es: 'Paso 3: Mete la marcha atrás, gira el cuerpo y mira por la luneta trasera.',
        },
        duration: 1400,
        keyframes: [
          { t: 0, x: 180, y: 170, angle: 0 },
          { t: 1, x: 180, y: 170, angle: 0 },
        ],
        wheel: 'straight',
        reverse: true,
      },
      {
        caption: {
          de: 'Schritt 4: Gerade rückwärts dem linken Fahrbahnrand entlang – langsam und mit Blick nach hinten.',
          es: 'Paso 4: Retrocede recto siguiendo el borde izquierdo, despacio y mirando hacia atrás.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 180, y: 170, angle: 0 },
          { t: 1, x: 180, y: 255, angle: 0 },
        ],
        wheel: 'straight',
        reverse: true,
      },
      {
        caption: {
          de: 'Schritt 5: Lenkrad nach links – das Heck schwenkt rückwärts um die Ecke in die Seitenstrasse.',
          es: 'Paso 5: Volante a la izquierda: la trasera dobla la esquina marcha atrás entrando en la calle secundaria.',
        },
        duration: 2600,
        keyframes: [
          { t: 0, x: 180, y: 255, angle: 0 },
          { t: 0.35, x: 158, y: 278, angle: 30 },
          { t: 0.7, x: 118, y: 291, angle: 65 },
          { t: 1, x: 88, y: 293, angle: 90 },
        ],
        wheel: 'left',
        reverse: true,
        guides: [
          { x1: 136, y1: 280, x2: 30, y2: 280 },
          { x1: 136, y1: 308, x2: 30, y2: 308 },
        ],
      },
      {
        caption: {
          de: 'Schritt 6: Geradestellen und im linken Fahrstreifen der Seitenstrasse anhalten – die Front zeigt zur Hauptstrasse.',
          es: 'Paso 6: Endereza y detente en el carril izquierdo de la calle secundaria, con el morro hacia la calle principal.',
        },
        duration: 1600,
        keyframes: [
          { t: 0, x: 88, y: 293, angle: 90 },
          { t: 1, x: 76, y: 293, angle: 90 },
        ],
        wheel: 'straight',
        reverse: true,
        braking: true,
        extraCars: [
          {
            color: '#c0392b',
            keyframes: [
              { t: 0, x: 60, y: 338, angle: 90 },
              { t: 1, x: 60, y: 338, angle: 90 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'umkehren_wenden',
    category: 'B',
    icon: '🔁',
    title: { de: 'Umkehren / Wenden (3-Punkte-Wende)', es: 'Cambio de sentido en 3 tiempos' },
    scene: narrowStreetScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Rückschau halten, dann das Lenkrad ganz nach links und langsam vorwärts bis kurz vor den Rand.',
          es: 'Paso 1: Mira que no venga nadie, gira el volante a fondo a la izquierda y avanza despacio hasta cerca del borde.',
        },
        duration: 2000,
        keyframes: [
          { t: 0, x: 180, y: 300, angle: 0 },
          { t: 0.5, x: 148, y: 262, angle: -35 },
          { t: 1, x: 112, y: 240, angle: -70 },
        ],
        wheel: 'left',
      },
      {
        caption: {
          de: 'Schritt 2: Lenkrad ganz nach rechts und rückwärts – das Auto dreht sich weiter in die neue Richtung.',
          es: 'Paso 2: Volante a fondo a la derecha y marcha atrás: el coche sigue rotando hacia el nuevo sentido.',
        },
        duration: 2400,
        keyframes: [
          { t: 0, x: 112, y: 240, angle: -70 },
          { t: 0.5, x: 165, y: 250, angle: -108 },
          { t: 1, x: 212, y: 240, angle: -140 },
        ],
        wheel: 'right',
        reverse: true,
      },
      {
        caption: {
          de: 'Schritt 3: Wieder nach links einlenken und vorwärts die Wende beenden.',
          es: 'Paso 3: Gira otra vez a la izquierda y avanza para terminar el cambio de sentido.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 212, y: 240, angle: -140 },
          { t: 0.5, x: 178, y: 295, angle: -163 },
          { t: 1, x: 140, y: 375, angle: -180 },
        ],
        wheel: 'left',
      },
    ],
  },
  {
    id: 'wendeplatz_kehrtwende',
    category: 'B',
    icon: '🔄',
    title: { de: 'Wenden auf dem Wendeplatz', es: 'Cambiar de sentido en el Wendeplatz' },
    // Cuando la calle termina en un Wendeplatz (zona ancha de maniobra), hay
    // espacio de sobra para dar la vuelta: con un solo arco amplio hacia
    // adelante (sin marcha atrás) si cabe, o con una 3-Punkte-Wende dentro
    // del propio Wendeplatz si el espacio es más justo.
    scene: wendeplatzScene(),
    variants: [
      {
        id: 'bogen',
        label: { de: 'Weiter Bogen', es: 'Arco amplio' },
        steps: [
          {
            caption: {
              de: 'Schritt 1: In den Wendeplatz einfahren – Tempo reduzieren, Blick auf die ganze Fläche.',
              es: 'Paso 1: Entra en el Wendeplatz, reduce la velocidad y mira toda la zona disponible.',
            },
            duration: 1600,
            keyframes: [
              { t: 0, x: 180, y: 520, angle: 0 },
              { t: 1, x: 180, y: 260, angle: 0 },
            ],
            wheel: 'straight',
          },
          {
            caption: {
              de: 'Schritt 2: Wenn genug Platz da ist: in einem einzigen weiten Bogen vorwärts wenden, ohne rückwärtszufahren.',
              es: 'Paso 2: Si hay espacio suficiente, da la vuelta en un solo arco amplio hacia adelante, sin necesidad de marcha atrás.',
            },
            duration: 3200,
            keyframes: [
              { t: 0, x: 180, y: 260, angle: 0 },
              { t: 0.3, x: 110, y: 205, angle: -55 },
              { t: 0.55, x: 70, y: 120, angle: -115 },
              { t: 0.8, x: 105, y: 55, angle: -160 },
              { t: 1, x: 180, y: 45, angle: -180 },
            ],
            wheel: 'left',
          },
          {
            caption: {
              de: 'Schritt 3: Geradestellen und in die Gegenrichtung aus dem Wendeplatz herausfahren.',
              es: 'Paso 3: Endereza el volante y sal del Wendeplatz en sentido contrario.',
            },
            duration: 1800,
            keyframes: [
              { t: 0, x: 180, y: 45, angle: -180 },
              { t: 1, x: 180, y: 520, angle: -180 },
            ],
            wheel: 'straight',
          },
        ],
      },
      {
        id: 'dreipunkt',
        label: { de: '3-Punkte-Wende', es: '3 puntos' },
        steps: [
          {
            caption: {
              de: 'Schritt 1: In den Wendeplatz einfahren, bis zur Mitte der Fläche.',
              es: 'Paso 1: Entra en el Wendeplatz hasta el centro de la zona.',
            },
            duration: 1600,
            keyframes: [
              { t: 0, x: 180, y: 520, angle: 0 },
              { t: 1, x: 180, y: 255, angle: 0 },
            ],
            wheel: 'straight',
          },
          {
            caption: {
              de: 'Schritt 2: Reicht der Platz nicht für einen Bogen: Lenkrad ganz nach links und vorwärts bis nahe an den Rand.',
              es: 'Paso 2: Si no alcanza el espacio para el arco: volante a fondo a la izquierda y avanza hasta cerca del borde.',
            },
            duration: 2200,
            keyframes: [
              { t: 0, x: 180, y: 255, angle: 0 },
              { t: 0.5, x: 138, y: 210, angle: -38 },
              { t: 1, x: 100, y: 175, angle: -75 },
            ],
            wheel: 'left',
          },
          {
            caption: {
              de: 'Schritt 3: Lenkrad ganz nach rechts und rückwärts – das Heck schwenkt zur anderen Seite.',
              es: 'Paso 3: Volante a fondo a la derecha y marcha atrás: la trasera gira hacia el otro lado.',
            },
            duration: 2400,
            keyframes: [
              { t: 0, x: 100, y: 175, angle: -75 },
              { t: 0.5, x: 168, y: 155, angle: -120 },
              { t: 1, x: 235, y: 175, angle: -165 },
            ],
            wheel: 'right',
            reverse: true,
          },
          {
            caption: {
              de: 'Schritt 4: Wieder nach links einlenken und vorwärts, bis du zur Ausfahrt zeigst.',
              es: 'Paso 4: Gira otra vez a la izquierda y avanza hasta quedar orientado hacia la salida.',
            },
            duration: 2000,
            keyframes: [
              { t: 0, x: 235, y: 175, angle: -165 },
              { t: 1, x: 180, y: 255, angle: -180 },
            ],
            wheel: 'left',
          },
          {
            caption: {
              de: 'Schritt 5: Geradestellen und in die Gegenrichtung aus dem Wendeplatz herausfahren.',
              es: 'Paso 5: Endereza el volante y sal del Wendeplatz en sentido contrario.',
            },
            duration: 1800,
            keyframes: [
              { t: 0, x: 180, y: 255, angle: -180 },
              { t: 1, x: 180, y: 520, angle: -180 },
            ],
            wheel: 'straight',
          },
        ],
      },
    ],
  },
  {
    id: 'vollstopp_stop',
    category: 'B',
    icon: '🛑',
    title: { de: 'Vollstopp beim Stopsignal', es: 'Parada completa en el STOP' },
    scene: stopScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Fahre kontrolliert auf das Stopsignal zu.',
          es: 'Paso 1: Acércate con control hacia la señal de STOP.',
        },
        duration: 2000,
        keyframes: [
          { t: 0, x: 222, y: 480, angle: 0 },
          { t: 1, x: 222, y: 305, angle: 0 },
        ],
        wheel: 'straight',
      },
      {
        caption: {
          de: 'Schritt 2: Vollständig anhalten – genau an der Haltelinie.',
          es: 'Paso 2: Detente por completo, justo en la línea de parada.',
        },
        duration: 1100,
        keyframes: [
          { t: 0, x: 222, y: 305, angle: 0 },
          { t: 1, x: 222, y: 248, angle: 0 },
        ],
        wheel: 'straight',
        braking: true,
      },
      {
        caption: {
          de: 'Schritt 3: Stehen bleiben und nach beiden Seiten schauen – auch wenn niemand kommt.',
          es: 'Paso 3: Permanece detenido y mira a ambos lados, aunque no venga nadie.',
        },
        duration: 1800,
        keyframes: [
          { t: 0, x: 222, y: 248, angle: 0 },
          { t: 1, x: 222, y: 248, angle: 0 },
        ],
        wheel: 'straight',
        braking: true,
      },
      {
        caption: {
          de: 'Schritt 4: Ist die Kreuzung frei, weiterfahren.',
          es: 'Paso 4: Si el cruce está libre, continúa.',
        },
        duration: 1600,
        keyframes: [
          { t: 0, x: 222, y: 248, angle: 0 },
          { t: 1, x: 222, y: 50, angle: 0 },
        ],
        wheel: 'straight',
      },
    ],
  },
  {
    id: 'vollbremsung',
    category: 'B',
    icon: '🚨',
    title: { de: 'Vollbremsung auf Kommando', es: 'Frenada de emergencia por orden del experto' },
    scene: straightRoadScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Der Experte kann jederzeit "Vollbremsung!" ansagen – das ist normal.',
          es: 'Paso 1: El experto puede pedir de repente "¡Vollbremsung!" (frenada de emergencia). Es normal.',
        },
        duration: 1800,
        keyframes: [
          { t: 0, x: 222, y: 470, angle: 0 },
          { t: 1, x: 222, y: 330, angle: 0 },
        ],
        wheel: 'straight',
        callout: { de: 'Vollbremsung!', es: '¡Frenada!' },
      },
      {
        caption: {
          de: 'Schritt 2: Beide Bremsen fest und geradeaus – nicht einlenken.',
          es: 'Paso 2: Frena con firmeza y en línea recta, sin girar el volante.',
        },
        duration: 1100,
        keyframes: [
          { t: 0, x: 222, y: 330, angle: 0 },
          { t: 0.6, x: 222, y: 262, angle: 0 },
          { t: 1, x: 222, y: 240, angle: 0 },
        ],
        wheel: 'straight',
        braking: true,
      },
      {
        caption: {
          de: 'Schritt 3: Das Fahrzeug steht kontrolliert und gerade still.',
          es: 'Paso 3: El coche queda detenido, controlado y en línea recta.',
        },
        duration: 1400,
        keyframes: [
          { t: 0, x: 222, y: 240, angle: 0 },
          { t: 1, x: 222, y: 240, angle: 0 },
        ],
        wheel: 'straight',
        braking: true,
      },
    ],
  },
  {
    id: 'anhalten_strassenrand',
    category: 'B',
    icon: '📍',
    title: { de: '"Anhalten" am Strassenrand', es: 'Parar en el borde ("Anhalten")' },
    scene: curbRulesScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Der Experte sagt "Anhalten" – suche einen erlaubten Ort. Nicht bei der Verzweigung und keine 5 m danach...',
          es: 'Paso 1: El experto dice "Anhalten" (detente). Busca un sitio permitido: no en el cruce ni a menos de 5 m de la esquina...',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 102, y: 30, angle: 180 },
          { t: 1, x: 102, y: 235, angle: 180 },
        ],
        wheel: 'straight',
      },
      {
        caption: {
          de: 'Schritt 2: ...nicht auf einer gelben Linie und nicht vor einer Einfahrt.',
          es: 'Paso 2: ...ni sobre una línea amarilla, ni delante de una entrada de casa.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 102, y: 235, angle: 180 },
          { t: 1, x: 102, y: 405, angle: 180 },
        ],
        wheel: 'straight',
      },
      {
        caption: {
          de: 'Schritt 3: Freier Rand, keine gelbe Linie, weit genug von allem – blinken und hier anhalten!',
          es: 'Paso 3: Borde libre, sin línea amarilla y lejos de todo: intermitente ¡y aquí sí!',
        },
        duration: 1700,
        keyframes: [
          { t: 0, x: 102, y: 405, angle: 180 },
          { t: 0.6, x: 90, y: 448, angle: 178 },
          { t: 1, x: 84, y: 478, angle: 180 },
        ],
        wheel: null,
        blinker: 'right',
        braking: true,
      },
    ],
  },
  {
    id: 'abstand_2sekunden',
    category: 'B',
    icon: '📏',
    title: { de: 'Abstand: die 2-Sekunden-Regel', es: 'Distancia: la regla de los 2 segundos' },
    scene: straightRoadScene(),
    steps: [
      {
        caption: {
          de: 'Zu nah: Wenn der Vordermann bremst, reicht deine Reaktionszeit nicht aus.',
          es: 'Demasiado cerca: si el de delante frena, no te da tiempo a reaccionar.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 222, y: 370, angle: 0 },
          { t: 1, x: 222, y: 210, angle: 0 },
        ],
        wheel: 'straight',
        gapBadge: 'cross',
        extraCars: [
          {
            color: '#c0392b',
            keyframes: [
              { t: 0, x: 222, y: 285, angle: 0 },
              { t: 1, x: 222, y: 125, angle: 0 },
            ],
          },
        ],
      },
      {
        caption: {
          de: 'Richtig: mindestens 2 Sekunden Abstand – zähle "21, 22" ab einem festen Punkt.',
          es: 'Correcto: al menos 2 segundos de distancia — cuenta "21, 22" desde un punto fijo.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 222, y: 430, angle: 0 },
          { t: 1, x: 222, y: 270, angle: 0 },
        ],
        wheel: 'straight',
        gapBadge: 'check',
        extraCars: [
          {
            color: '#3f5aa3',
            keyframes: [
              { t: 0, x: 222, y: 215, angle: 0 },
              { t: 1, x: 222, y: 55, angle: 0 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'moto_spurgasse',
    category: 'A',
    vehicle: 'moto',
    icon: '🛤️',
    title: { de: 'Spurgasse (Langsamfahren)', es: 'Spurgasse (circuito lento)' },
    scene: spurgasseScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Langsam anfahren – Kupplung am Schleifpunkt, Füsse auf die Rasten.',
          es: 'Paso 1: Arranca despacio: embrague en el punto de fricción y pies a las estriberas.',
        },
        duration: 1800,
        keyframes: [
          { t: 0, x: 180, y: 515, angle: 0 },
          { t: 1, x: 180, y: 450, angle: 0 },
        ],
      },
      {
        caption: {
          de: 'Schritt 2: Im Schritttempo durch die Gasse – Blick weit nach vorne, Tempo mit der Hinterradbremse dosieren.',
          es: 'Paso 2: Cruza el pasillo a paso de peatón: mirada lejos, dosifica con el freno trasero.',
        },
        duration: 5000,
        keyframes: [
          { t: 0, x: 180, y: 450, angle: 0 },
          { t: 0.3, x: 181.5, y: 370, angle: 1.5 },
          { t: 0.55, x: 178.5, y: 300, angle: -1.5 },
          { t: 0.8, x: 181, y: 230, angle: 1 },
          { t: 1, x: 180, y: 160, angle: 0 },
        ],
      },
      {
        caption: {
          de: 'Schritt 3: Am Ende sauber herausfahren – nicht die Füsse absetzen!',
          es: 'Paso 3: Sal limpio al final. ¡Sin poner los pies en el suelo!',
        },
        duration: 1500,
        keyframes: [
          { t: 0, x: 180, y: 160, angle: 0 },
          { t: 1, x: 180, y: 80, angle: 0 },
        ],
      },
    ],
  },
  {
    id: 'moto_slalom',
    category: 'A',
    vehicle: 'moto',
    icon: '〰️',
    title: { de: 'Slalom', es: 'Slalom' },
    scene: slalomScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Mit gleichmässigem Tempo einfahren und die erste Pylone aussen passieren.',
          es: 'Paso 1: Entra con ritmo constante y pasa el primer cono por fuera.',
        },
        duration: 2000,
        keyframes: [
          { t: 0, x: 180, y: 515, angle: 0 },
          { t: 0.5, x: 152, y: 460, angle: -12 },
          { t: 1, x: 148, y: 420, angle: 0 },
        ],
        steer: -12,
      },
      {
        caption: {
          de: 'Schritt 2: Blick immer zur übernächsten Pylone – der Oberkörper bleibt locker.',
          es: 'Paso 2: Mira siempre al cono siguiente al próximo; el torso, relajado.',
        },
        duration: 3600,
        keyframes: [
          { t: 0, x: 148, y: 420, angle: 0 },
          { t: 0.125, x: 180, y: 380, angle: 28 },
          { t: 0.25, x: 212, y: 340, angle: 0 },
          { t: 0.375, x: 180, y: 300, angle: -28 },
          { t: 0.5, x: 148, y: 260, angle: 0 },
          { t: 0.625, x: 180, y: 220, angle: 28 },
          { t: 0.75, x: 212, y: 180, angle: 0 },
          { t: 0.875, x: 180, y: 140, angle: -28 },
          { t: 1, x: 148, y: 100, angle: 0 },
        ],
      },
      {
        caption: {
          de: 'Schritt 3: Nach der letzten Pylone gerade ausfahren.',
          es: 'Paso 3: Tras el último cono, sal recto y estable.',
        },
        duration: 1500,
        keyframes: [
          { t: 0, x: 148, y: 100, angle: 0 },
          { t: 0.6, x: 162, y: 60, angle: 10 },
          { t: 1, x: 170, y: 30, angle: 0 },
        ],
      },
    ],
  },
  {
    id: 'moto_achterfahren',
    category: 'A',
    vehicle: 'moto',
    icon: '8️⃣',
    title: { de: 'Achterfahren', es: 'El ocho (Achterfahren)' },
    scene: achterScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Erste Schlaufe links – Kopf drehen und in die Kurve schauen, konstantes Gas.',
          es: 'Paso 1: Primer bucle a la izquierda: gira la cabeza y mira al interior de la curva, gas constante.',
        },
        duration: 4200,
        keyframes: [
          { t: 0, x: 180, y: 260, angle: 90 },
          { t: 0.125, x: 240, y: 235, angle: 45 },
          { t: 0.25, x: 265, y: 175, angle: 0 },
          { t: 0.375, x: 240, y: 115, angle: -45 },
          { t: 0.5, x: 180, y: 90, angle: -90 },
          { t: 0.625, x: 120, y: 115, angle: -135 },
          { t: 0.75, x: 95, y: 175, angle: -180 },
          { t: 0.875, x: 120, y: 235, angle: -225 },
          { t: 1, x: 180, y: 260, angle: -270 },
        ],
        steer: -18,
      },
      {
        caption: {
          de: 'Schritt 2: Weich auf die rechte Schlaufe wechseln – Tempo über die Hinterradbremse regeln.',
          es: 'Paso 2: Cambia con suavidad al bucle derecho; regula el ritmo con el freno trasero.',
        },
        duration: 4200,
        keyframes: [
          { t: 0, x: 180, y: 260, angle: 90 },
          { t: 0.125, x: 240, y: 285, angle: 135 },
          { t: 0.25, x: 265, y: 345, angle: 180 },
          { t: 0.375, x: 240, y: 405, angle: 225 },
          { t: 0.5, x: 180, y: 430, angle: 270 },
          { t: 0.625, x: 120, y: 405, angle: 315 },
          { t: 0.75, x: 95, y: 345, angle: 360 },
          { t: 0.875, x: 120, y: 285, angle: 405 },
          { t: 1, x: 180, y: 260, angle: 450 },
        ],
        steer: 18,
      },
      {
        caption: {
          de: 'Schritt 3: Die Acht sauber schliessen und gerade ausfahren.',
          es: 'Paso 3: Cierra el ocho limpio y sal recto.',
        },
        duration: 1800,
        keyframes: [
          { t: 0, x: 180, y: 260, angle: 90 },
          { t: 0.4, x: 226, y: 244, angle: 50 },
          { t: 0.75, x: 250, y: 208, angle: 15 },
          { t: 1, x: 252, y: 165, angle: 0 },
        ],
      },
    ],
  },
  {
    id: 'moto_vollbremsung',
    category: 'A',
    vehicle: 'moto',
    icon: '🛑',
    title: { de: 'Vollbremsung', es: 'Frenada de emergencia' },
    scene: motoBremsScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Zügig und aufrecht auf den Bremspunkt zufahren.',
          es: 'Paso 1: Acelera con decisión y llega recto y erguido al punto de frenado.',
        },
        duration: 1800,
        keyframes: [
          { t: 0, x: 180, y: 520, angle: 0 },
          { t: 1, x: 180, y: 330, angle: 0 },
        ],
      },
      {
        caption: {
          de: 'Schritt 2: Beide Bremsen – vorne kräftig und progressiv, hinten dosiert. Lenker gerade!',
          es: 'Paso 2: Ambos frenos: delante fuerte y progresivo, detrás dosificado. ¡Manillar recto!',
        },
        duration: 1300,
        keyframes: [
          { t: 0, x: 180, y: 330, angle: 0 },
          { t: 0.6, x: 180, y: 225, angle: 0 },
          { t: 1, x: 180, y: 192, angle: 0 },
        ],
        braking: true,
      },
      {
        caption: {
          de: 'Schritt 3: Kontrolliert vor der Linie stehen – erst am Schluss einen Fuss absetzen.',
          es: 'Paso 3: Detente controlado antes de la línea; pon el pie al suelo solo al final.',
        },
        duration: 1500,
        keyframes: [
          { t: 0, x: 180, y: 192, angle: 0 },
          { t: 1, x: 180, y: 192, angle: 0 },
        ],
        braking: true,
      },
    ],
  },
  {
    id: 'moto_ausweichen',
    category: 'A',
    vehicle: 'moto',
    icon: '↪️',
    title: { de: 'Ausweichen', es: 'Esquivar un obstáculo' },
    scene: ausweichenScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Mit stabilem Tempo geradeaus auf das Hindernis zufahren.',
          es: 'Paso 1: Acércate recto al obstáculo con velocidad estable.',
        },
        duration: 1700,
        keyframes: [
          { t: 0, x: 180, y: 520, angle: 0 },
          { t: 1, x: 180, y: 410, angle: 0 },
        ],
      },
      {
        caption: {
          de: 'Schritt 2: Mit zwei kurzen Lenkimpulsen ausweichen – schau in die Lücke, nie auf das Hindernis!',
          es: 'Paso 2: Esquiva con dos golpes suaves de manillar. ¡Mira al hueco, nunca al obstáculo!',
        },
        duration: 1900,
        keyframes: [
          { t: 0, x: 180, y: 410, angle: 0 },
          { t: 0.35, x: 160, y: 365, angle: -20 },
          { t: 0.7, x: 140, y: 320, angle: -8 },
          { t: 1, x: 136, y: 265, angle: 0 },
        ],
        steer: -15,
      },
      {
        caption: {
          de: 'Schritt 3: Am Hindernis vorbei – zurück auf die Linie und stabilisieren.',
          es: 'Paso 3: Pasado el obstáculo, vuelve a tu línea y estabiliza la moto.',
        },
        duration: 1900,
        keyframes: [
          { t: 0, x: 136, y: 265, angle: 0 },
          { t: 0.35, x: 148, y: 205, angle: 18 },
          { t: 0.7, x: 172, y: 160, angle: 8 },
          { t: 1, x: 178, y: 110, angle: 0 },
        ],
        steer: 15,
      },
    ],
  },
]

export function maneuversForCategory(category) {
  return MANEUVERS.filter((m) => m.category === category)
}
