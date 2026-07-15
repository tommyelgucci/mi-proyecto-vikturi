// Animaciones de maniobras: datos puros consumidos por ManeuverPlayer.
//
// Sistema de coordenadas: SVG viewBox 0 0 360 560 (retrato). Y crece hacia abajo.
// Ángulo del coche: 0 = apunta "arriba" (norte). Positivo = gira en sentido horario
// (hacia la derecha/este). Negativo = sentido antihorario (hacia la izquierda/oeste).
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
      { type: 'parkedCar', x: 260, y: 150, angle: 90, color: '#c0392b' },
      { type: 'parkedCar', x: 260, y: 270, angle: 90, color: '#3f5aa3' },
      { type: 'laneLine', x1: 190, y1: 0, x2: 190, y2: CANVAS.h, dashed: true },
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
      { type: 'grass', x: 300, y: 0, w: 60, h: CANVAS.h },
      { type: 'curbLine', x1: 300, y1: 0, x2: 300, y2: CANVAS.h },
      { type: 'laneLine', x1: 150, y1: 0, x2: 150, y2: 340, dashed: true },
      { type: 'stopLine', x: 60, y: 372, w: 180, h: 10 },
      { type: 'stopSign', x: 40, y: 360 },
    ],
  }
}

function curbRulesScene() {
  return {
    elements: [
      { type: 'road', x: 0, y: 0, w: 300, h: CANVAS.h },
      { type: 'grass', x: 300, y: 0, w: 60, h: CANVAS.h },
      { type: 'curbLine', x1: 300, y1: 0, x2: 300, y2: CANVAS.h },
      { type: 'crosswalk', x: 260, y: 10, w: 40, h: 55 },
      { type: 'distanceTag', x1: 300, y1: 65, x2: 300, y2: 130, text: '< 5 m' },
      { type: 'cross', x: 285, y: 97 },
      { type: 'yellowZone', x1: 300, y1: 160, x2: 300, y2: 235 },
      { type: 'cross', x: 285, y: 197 },
      { type: 'driveway', x: 262, y: 262, w: 38, h: 45 },
      { type: 'cross', x: 285, y: 284 },
      { type: 'label', x: 250, y: 250, text: 'Einfahrt', size: 9 },
      { type: 'check', x: 285, y: 385 },
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
          de: 'Schritt 1: Wähle die Parklücke und setze den Blinker.',
          es: 'Paso 1: Elige el hueco donde vas a aparcar y pon el intermitente.',
        },
        duration: 1800,
        keyframes: [
          { t: 0, x: 210, y: 175, angle: 0 },
          { t: 1, x: 210, y: 175, angle: 0 },
        ],
        wheel: 'straight',
        blinker: 'right',
      },
      {
        caption: {
          de: 'Schritt 2: Fahre langsam geradeaus rückwärts, bis dein Spiegel auf Höhe des Aussenspiegels des vorderen Autos ist.',
          es: 'Paso 2: Retrocede despacio en línea recta hasta que tu retrovisor quede a la altura del retrovisor del coche de delante.',
        },
        duration: 1500,
        keyframes: [
          { t: 0, x: 210, y: 175, angle: 0 },
          { t: 1, x: 210, y: 200, angle: 0 },
        ],
        wheel: 'straight',
        reverse: true,
        blinker: 'right',
      },
      {
        caption: {
          de: 'Schritt 3: Lenkrad ganz nach rechts einschlagen und weiter rückwärts in die Lücke fahren.',
          es: 'Paso 3: Gira el volante a fondo a la derecha y sigue marcha atrás hacia el hueco.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 210, y: 200, angle: 0 },
          { t: 0.5, x: 240, y: 225, angle: 32 },
          { t: 1, x: 267, y: 253, angle: 78 },
        ],
        wheel: 'right',
        reverse: true,
        blinker: 'right',
        guides: [
          { x1: 249, y1: 236, x2: 270, y2: 210 },
          { x1: 258, y1: 261, x2: 300, y2: 236 },
        ],
      },
      {
        caption: {
          de: 'Schritt 4: Gegenlenken, geradestellen und die Lücke mittig einnehmen.',
          es: 'Paso 4: Contravuelta, endereza el volante y céntrate en el hueco.',
        },
        duration: 1800,
        keyframes: [
          { t: 0, x: 267, y: 253, angle: 78 },
          { t: 0.6, x: 271, y: 257, angle: 30 },
          { t: 1, x: 270, y: 255, angle: 2 },
        ],
        wheel: 'left',
        reverse: true,
      },
    ],
  },
  {
    id: 'rechtwinklig_rueckwaerts',
    category: 'B',
    icon: '📐',
    title: { de: 'Rechtwinklig rückwärts', es: 'Aparcar marcha atrás en perpendicular' },
    scene: perpendicularBaysScene(),
    steps: [
      {
        caption: {
          de: 'Schritt 1: Fahre knapp an der Lücke vorbei und setze den Blinker.',
          es: 'Paso 1: Pasa justo por delante del hueco y pon el intermitente.',
        },
        duration: 1800,
        keyframes: [
          { t: 0, x: 150, y: 150, angle: 0 },
          { t: 1, x: 150, y: 235, angle: 0 },
        ],
        wheel: 'straight',
        blinker: 'right',
      },
      {
        caption: {
          de: 'Schritt 2: Lenkrad ganz einschlagen und rückwärts in die Lücke einfahren.',
          es: 'Paso 2: Gira el volante a fondo y retrocede hacia el hueco.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 150, y: 235, angle: 0 },
          { t: 0.5, x: 195, y: 222, angle: 45 },
          { t: 1, x: 240, y: 213, angle: 90 },
        ],
        wheel: 'right',
        reverse: true,
        blinker: 'right',
        guides: [
          { x1: 222, y1: 197, x2: 260, y2: 187 },
          { x1: 222, y1: 233, x2: 260, y2: 233 },
        ],
      },
      {
        caption: {
          de: 'Schritt 3: Lenkrad geradestellen und gerade zu Ende einparken.',
          es: 'Paso 3: Endereza el volante y termina de entrar recto.',
        },
        duration: 1400,
        keyframes: [
          { t: 0, x: 240, y: 213, angle: 90 },
          { t: 1, x: 262, y: 210, angle: 90 },
        ],
        wheel: 'straight',
        reverse: true,
      },
      {
        caption: {
          de: 'Schritt 4: Fahrzeug zentrieren und Abstand zu beiden Seiten prüfen.',
          es: 'Paso 4: Centra el coche en la plaza y revisa la distancia a ambos lados.',
        },
        duration: 1200,
        keyframes: [
          { t: 0, x: 262, y: 210, angle: 90 },
          { t: 1, x: 262, y: 210, angle: 90 },
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
          de: 'Schritt 1: Nähere dich der Lücke und setze den Blinker.',
          es: 'Paso 1: Acércate al hueco y activa el intermitente.',
        },
        duration: 1600,
        keyframes: [
          { t: 0, x: 150, y: 120, angle: 0 },
          { t: 1, x: 150, y: 180, angle: 0 },
        ],
        wheel: 'straight',
        blinker: 'right',
      },
      {
        caption: {
          de: 'Schritt 2: Lenke in die Lücke ein und fahre vorwärts hinein.',
          es: 'Paso 2: Gira hacia el hueco y entra de frente.',
        },
        duration: 2000,
        keyframes: [
          { t: 0, x: 150, y: 180, angle: 0 },
          { t: 0.5, x: 197, y: 197, angle: 45 },
          { t: 1, x: 253, y: 210, angle: 90 },
        ],
        wheel: 'right',
        blinker: 'right',
      },
      {
        caption: {
          de: 'Schritt 3: Lenkrad geradestellen und bis zum Ende der Lücke vorfahren.',
          es: 'Paso 3: Endereza el volante y avanza hasta el fondo de la plaza.',
        },
        duration: 1200,
        keyframes: [
          { t: 0, x: 253, y: 210, angle: 90 },
          { t: 1, x: 268, y: 210, angle: 90 },
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
          { t: 1, x: 225, y: 320, angle: 0 },
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
          { t: 0, x: 225, y: 320, angle: 0 },
          { t: 1, x: 225, y: 320, angle: 0 },
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
          { t: 0, x: 225, y: 320, angle: 0 },
          { t: 0.5, x: 185, y: 293, angle: -45 },
          { t: 1, x: 110, y: 275, angle: -90 },
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
          { t: 0, x: 110, y: 275, angle: -90 },
          { t: 1, x: 65, y: 272, angle: -90 },
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
          { t: 0, x: 245, y: 120, angle: 0 },
          { t: 1, x: 245, y: 120, angle: 0 },
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
          { t: 0, x: 245, y: 120, angle: 0 },
          { t: 1, x: 245, y: 320, angle: 0 },
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
          { t: 0, x: 245, y: 320, angle: 0 },
          { t: 1, x: 245, y: 320, angle: 0 },
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
          { t: 0, x: 245, y: 320, angle: 0 },
          { t: 1, x: 245, y: 470, angle: 0 },
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
          de: 'Schritt 1: Rückschau halten, dann das Lenkrad ganz nach links einschlagen.',
          es: 'Paso 1: Mira que no vengan vehículos y gira el volante a fondo a la izquierda.',
        },
        duration: 2000,
        keyframes: [
          { t: 0, x: 180, y: 280, angle: 0 },
          { t: 0.5, x: 145, y: 258, angle: -35 },
          { t: 1, x: 105, y: 240, angle: -70 },
        ],
        wheel: 'left',
      },
      {
        caption: {
          de: 'Schritt 2: Kurz vor dem Rand anhalten, Lenkrad ganz nach rechts und rückwärts fahren.',
          es: 'Paso 2: Detente cerca del borde, gira el volante a fondo a la derecha y retrocede.',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 105, y: 240, angle: -70 },
          { t: 0.5, x: 155, y: 258, angle: -20 },
          { t: 1, x: 225, y: 290, angle: 45 },
        ],
        wheel: 'right',
        reverse: true,
      },
      {
        caption: {
          de: 'Schritt 3: Nochmals nach links einlenken und vorwärts die Wende beenden.',
          es: 'Paso 3: Gira otra vez a la izquierda y avanza para terminar el cambio de sentido.',
        },
        duration: 2000,
        keyframes: [
          { t: 0, x: 225, y: 290, angle: 45 },
          { t: 0.5, x: 200, y: 268, angle: 100 },
          { t: 1, x: 180, y: 250, angle: 180 },
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
          { t: 0, x: 200, y: 150, angle: 0 },
          { t: 1, x: 200, y: 330, angle: 0 },
        ],
        wheel: 'straight',
      },
      {
        caption: {
          de: 'Schritt 2: Vollständig anhalten – genau an der Haltelinie.',
          es: 'Paso 2: Detente por completo, justo en la línea de parada.',
        },
        duration: 1000,
        keyframes: [
          { t: 0, x: 200, y: 330, angle: 0 },
          { t: 1, x: 200, y: 367, angle: 0 },
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
          { t: 0, x: 200, y: 367, angle: 0 },
          { t: 1, x: 200, y: 367, angle: 0 },
        ],
        wheel: 'straight',
        braking: true,
      },
      {
        caption: {
          de: 'Schritt 4: Ist die Kreuzung frei, weiterfahren.',
          es: 'Paso 4: Si el cruce está libre, continúa.',
        },
        duration: 1400,
        keyframes: [
          { t: 0, x: 200, y: 367, angle: 0 },
          { t: 1, x: 200, y: 420, angle: 0 },
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
          { t: 0, x: 200, y: 120, angle: 0 },
          { t: 1, x: 200, y: 220, angle: 0 },
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
          { t: 0, x: 200, y: 220, angle: 0 },
          { t: 0.6, x: 200, y: 258, angle: 0 },
          { t: 1, x: 200, y: 278, angle: 0 },
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
          { t: 0, x: 200, y: 278, angle: 0 },
          { t: 1, x: 200, y: 278, angle: 0 },
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
          de: 'Schritt 1: Der Experte sagt "Anhalten" – suche einen erlaubten Ort. Nicht direkt bei einer Kreuzung...',
          es: 'Paso 1: El experto dice "Anhalten" (¡detente!). Busca un lugar permitido. No justo en una esquina...',
        },
        duration: 2200,
        keyframes: [
          { t: 0, x: 240, y: 20, angle: 0 },
          { t: 1, x: 240, y: 150, angle: 0 },
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
          { t: 0, x: 240, y: 150, angle: 0 },
          { t: 1, x: 240, y: 320, angle: 0 },
        ],
        wheel: 'straight',
      },
      {
        caption: {
          de: 'Schritt 3: Freier Rand, keine gelbe Linie, mehr als 5 m von der Ecke entfernt – hier anhalten!',
          es: 'Paso 3: Borde libre, sin línea amarilla y a más de 5 m de la esquina: ¡aquí sí!',
        },
        duration: 1400,
        keyframes: [
          { t: 0, x: 240, y: 320, angle: 0 },
          { t: 1, x: 240, y: 385, angle: 0 },
        ],
        wheel: 'straight',
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
          { t: 0, x: 200, y: 160, angle: 0 },
          { t: 1, x: 200, y: 320, angle: 0 },
        ],
        wheel: 'straight',
        gapBadge: 'cross',
        extraCars: [
          {
            color: '#c0392b',
            keyframes: [
              { t: 0, x: 200, y: 100, angle: 0 },
              { t: 1, x: 200, y: 260, angle: 0 },
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
          { t: 0, x: 200, y: 40, angle: 0 },
          { t: 1, x: 200, y: 200, angle: 0 },
        ],
        wheel: 'straight',
        gapBadge: 'check',
        extraCars: [
          {
            color: '#3f5aa3',
            keyframes: [
              { t: 0, x: 200, y: 100, angle: 0 },
              { t: 1, x: 200, y: 260, angle: 0 },
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
