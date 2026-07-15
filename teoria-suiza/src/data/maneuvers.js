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
    title: { de: 'Längere Strecke rückwärts', es: 'Tramo largo marcha atrás' },
    scene: straightRoadScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Dreh dich um und schau durch die Heckscheibe – nicht nur in die Spiegel.',
          es: 'Paso 1: Gira el cuerpo y mira por la luneta trasera, no solo por los espejos.',
        },
        duration: 1400,
        keyframes: [
          { t: 0, x: 262, y: 120, angle: 0 },
          { t: 1, x: 262, y: 120, angle: 0 },
        ],
        wheel: 'straight',
        reverse: true,
      },
      {
        caption: {
          de: 'Schritt 2: Langsam und geradeaus rückwärts, nah am rechten Rand entlang.',
          es: 'Paso 2: Retrocede despacio y recto, pegado al borde derecho.',
        },
        duration: 2600,
        keyframes: [
          { t: 0, x: 262, y: 120, angle: 0 },
          { t: 1, x: 262, y: 320, angle: 0 },
        ],
        wheel: 'straight',
        reverse: true,
      },
      {
        caption: {
          de: 'Schritt 3: Auf halbem Weg anhalten und nochmals umschauen.',
          es: 'Paso 3: Detente a medio camino y vuelve a mirar hacia atrás.',
        },
        duration: 1200,
        keyframes: [
          { t: 0, x: 262, y: 320, angle: 0 },
          { t: 1, x: 262, y: 320, angle: 0 },
        ],
        wheel: 'straight',
        reverse: true,
        braking: true,
      },
      {
        caption: {
          de: 'Schritt 4: Weiter geradeaus rückwärts bis zum Ende der Strecke.',
          es: 'Paso 4: Continúa recto marcha atrás hasta el final del tramo.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 262, y: 320, angle: 0 },
          { t: 1, x: 262, y: 470, angle: 0 },
        ],
        wheel: 'straight',
        reverse: true,
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
]

export function maneuversForCategory(category) {
  return MANEUVERS.filter((m) => m.category === category)
}
