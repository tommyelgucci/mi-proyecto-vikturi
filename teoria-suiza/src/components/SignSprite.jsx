/**
 * Renderizador paramétrico de señales de tráfico suizas.
 * Representaciones SIMPLIFICADAS con fines de estudio (no reproducciones oficiales).
 *
 * Cada señal se describe con { shape, pictogram?, text?, subtext?, slashes?, tint? }.
 * Los pictogramas se dibujan en un cuadro local centrado en (0,0) de ~60×60.
 */

const RED = '#d21f1f'
const BLUE = '#1660a8'
const GREEN = '#0c7c3f'
const YELLOW = '#ffd23f'
const GREY = '#8a9096'
const ORANGE = '#f07d00'
const INK = '#1c2024'

export const PICTOGRAMS = {
  exclamation: (c = INK) => (
    <g fill={c}>
      <rect x={-4} y={-24} width={8} height={30} rx={3.5} />
      <circle cx={0} cy={16} r={5} />
    </g>
  ),
  curveRight: (c = INK) => (
    <path d="M -8 24 L -8 2 Q -8 -10 4 -10 L 10 -10" fill="none" stroke={c} strokeWidth={9} strokeLinecap="round" />
  ),
  doubleCurve: (c = INK) => (
    <path
      d="M -6 24 L -6 10 Q -6 0 4 0 Q 12 0 12 -8 L 12 -14"
      fill="none"
      stroke={c}
      strokeWidth={8}
      strokeLinecap="round"
    />
  ),
  slippery: (c = INK) => (
    <g>
      <g fill={c} transform="translate(0 -10) rotate(-16)">
        <rect x={-16} y={-7} width={32} height={11} rx={4.5} />
        <rect x={-9} y={-13} width={17} height={8} rx={3} />
        <circle cx={-9} cy={6} r={4} />
        <circle cx={9} cy={6} r={4} />
      </g>
      <g stroke={c} fill="none" strokeWidth={3.6} strokeLinecap="round">
        <path d="M -14 8 q 5 4 0 8 q -5 4 0 8" />
        <path d="M 4 8 q 5 4 0 8 q -5 4 0 8" />
      </g>
    </g>
  ),
  bumps: (c = INK) => (
    <path d="M -24 8 L -16 8 A 8 7 0 0 1 0 8 L 2 8 A 8 7 0 0 1 18 8 L 24 8" fill={c} stroke="none" />
  ),
  narrow: (c = INK) => (
    <g fill={c}>
      <path d="M -16 -24 L -10 -2 L -10 24 L -16 24 Z" />
      <path d="M 16 -24 L 10 -2 L 10 24 L 16 24 Z" />
    </g>
  ),
  worker: (c = INK) => (
    <g fill={c}>
      <circle cx={-2} cy={-16} r={6} />
      <path d="M -10 -6 L 6 -2 L 4 8 L -12 4 Z" />
      <rect x={-14} y={4} width={5} height={16} rx={2} transform="rotate(14 -14 4)" />
      <rect x={0} y={0} width={4} height={22} rx={2} transform="rotate(-38 0 0)" />
      <path d="M 6 16 Q 18 12 24 20 L 4 22 Z" />
    </g>
  ),
  children: (c = INK) => (
    <g fill={c}>
      <circle cx={-10} cy={-14} r={6} />
      <path d="M -16 -6 L -2 -4 L -6 6 L -10 16 L -16 14 L -13 4 L -20 8 Z" />
      <circle cx={12} cy={-8} r={5} />
      <path d="M 6 0 L 18 2 L 15 10 L 18 20 L 12 20 L 10 10 L 5 14 Z" />
    </g>
  ),
  pedestrian: (c = INK) => (
    <g fill={c}>
      <circle cx={2} cy={-18} r={6} />
      <path d="M -6 -8 L 10 -6 L 8 4 L 12 20 L 6 20 L 2 8 L -4 20 L -10 18 L -2 2 Z" />
    </g>
  ),
  footpath: (c = '#fff') => (
    <g fill={c}>
      <circle cx={-6} cy={-18} r={6} />
      <path d="M -13 -8 L 2 -7 L 0 6 L 2 22 L -4 22 L -6 8 L -10 22 L -16 20 L -12 2 Z" />
      <circle cx={12} cy={-4} r={4} />
      <path d="M 7 3 L 17 3 L 16 12 L 18 22 L 13 22 L 12 13 L 9 22 L 5 21 L 7 10 Z" />
    </g>
  ),
  bike: (c = INK) => (
    <g stroke={c} fill="none" strokeWidth={3.4}>
      <circle cx={-13} cy={8} r={10} />
      <circle cx={13} cy={8} r={10} />
      <path d="M -13 8 L -5 -8 L 9 -8 L 13 8 M -5 -8 L 4 8 L -13 8" />
      <path d="M 7 -12 L 12 -12" strokeLinecap="round" />
    </g>
  ),
  deer: (c = INK) => (
    <g fill={c}>
      <path d="M -20 14 L -12 -2 L 2 -6 L 14 -4 L 22 6 L 16 8 L 12 20 L 7 20 L 8 8 L -6 8 L -12 20 L -17 20 Z" />
      <circle cx={16} cy={-8} r={4.5} />
      <path d="M 17 -12 L 13 -24 M 17 -12 L 20 -24 M 15 -19 L 10 -21 M 18 -18 L 24 -21" stroke={c} strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  ),
  oncoming: (c = INK) => (
    <g fill={c}>
      <path d="M -10 -22 L -18 -6 L -13 -6 L -13 22 L -7 22 L -7 -6 L -2 -6 Z" />
      <path d="M 10 22 L 2 6 L 7 6 L 7 -22 L 13 -22 L 13 6 L 18 6 Z" fill={RED} />
    </g>
  ),
  oncomingBlack: (c = INK) => (
    <g fill={c}>
      <path d="M -10 -22 L -18 -6 L -13 -6 L -13 22 L -7 22 L -7 -6 L -2 -6 Z" />
      <path d="M 10 22 L 2 6 L 7 6 L 7 -22 L 13 -22 L 13 6 L 18 6 Z" />
    </g>
  ),
  trafficLight: (c = INK) => (
    <g>
      <rect x={-9} y={-24} width={18} height={44} rx={4} fill={c} />
      <circle cx={0} cy={-14} r={5} fill="#ff5252" />
      <circle cx={0} cy={-2} r={5} fill={YELLOW} />
      <circle cx={0} cy={10} r={5} fill="#57c05e" />
    </g>
  ),
  crossX: (c = INK) => (
    <path d="M -18 -18 L 18 18 M 18 -18 L -18 18" stroke={c} strokeWidth={9} strokeLinecap="round" fill="none" />
  ),
  bar: () => <rect x={-30} y={-7} width={60} height={14} rx={2} fill="#fff" />,
  car: (c = INK) => (
    <g fill={c}>
      <path d="M -18 12 L -18 0 Q -18 -12 -8 -14 L 8 -14 Q 18 -12 18 0 L 18 12 Z" />
      <rect x={-20} y={10} width={8} height={6} rx={2} />
      <rect x={12} y={10} width={8} height={6} rx={2} />
      <path d="M -10 -10 L 10 -10 L 12 -2 L -12 -2 Z" fill="#fff" opacity={0.9} />
    </g>
  ),
  motorcycle: (c = INK) => (
    <g>
      <g stroke={c} fill="none" strokeWidth={3.4}>
        <circle cx={-15} cy={10} r={9} />
        <circle cx={15} cy={10} r={9} />
      </g>
      <g fill={c}>
        <path d="M -15 8 L -6 -4 L 8 -4 L 15 8 L 0 10 Z" />
        <rect x={-2} y={-10} width={14} height={5} rx={2} transform="rotate(-24 -2 -10)" />
        <rect x={11} y={-16} width={9} height={4} rx={2} />
      </g>
    </g>
  ),
  overtake: () => (
    <g>
      <g fill={RED} transform="translate(-11 0) scale(0.62)">
        <path d="M -18 12 L -18 0 Q -18 -12 -8 -14 L 8 -14 Q 18 -12 18 0 L 18 12 Z" />
        <rect x={-20} y={10} width={8} height={6} rx={2} />
        <rect x={12} y={10} width={8} height={6} rx={2} />
      </g>
      <g fill={INK} transform="translate(11 0) scale(0.62)">
        <path d="M -18 12 L -18 0 Q -18 -12 -8 -14 L 8 -14 Q 18 -12 18 0 L 18 12 Z" />
        <rect x={-20} y={10} width={8} height={6} rx={2} />
        <rect x={12} y={10} width={8} height={6} rx={2} />
      </g>
    </g>
  ),
  arrowUp: (c = '#fff') => <path d="M 0 -22 L -13 2 L -5 2 L -5 22 L 5 22 L 5 2 L 13 2 Z" fill={c} />,
  arrowRight: (c = '#fff') => (
    <path d="M 0 -22 L -13 2 L -5 2 L -5 22 L 5 22 L 5 2 L 13 2 Z" fill={c} transform="rotate(90)" />
  ),
  arrowLeft: (c = '#fff') => (
    <path d="M 0 -22 L -13 2 L -5 2 L -5 22 L 5 22 L 5 2 L 13 2 Z" fill={c} transform="rotate(-90)" />
  ),
  arrowBentRight: (c = INK) => (
    <g fill={c}>
      <path d="M -12 22 L -12 0 Q -12 -8 -4 -8 L 6 -8 L 6 -16 L 20 -5 L 6 6 L 6 -1 L -4 -1 Q -5 -1 -5 0 L -5 22 Z" />
    </g>
  ),
  arrowBentLeft: (c = INK) => (
    <g fill={c} transform="scale(-1 1)">
      <path d="M -12 22 L -12 0 Q -12 -8 -4 -8 L 6 -8 L 6 -16 L 20 -5 L 6 6 L 6 -1 L -4 -1 Q -5 -1 -5 0 L -5 22 Z" />
    </g>
  ),
  uturn: (c = INK) => (
    <g fill="none" stroke={c} strokeWidth={7}>
      <path d="M 10 20 L 10 -6 Q 10 -16 0 -16 Q -10 -16 -10 -6 L -10 4" />
      <path d="M -17 -2 L -10 10 L -3 -2" fill={c} stroke="none" />
    </g>
  ),
  roundabout: (c = '#fff') => (
    <g fill="none" stroke={c} strokeWidth={6}>
      <path d="M 0 -16 A 16 16 0 1 0 14 -8" />
      <path d="M 6 -20 L 16 -12 L 4 -6 Z" fill={c} stroke="none" />
    </g>
  ),
  autobahn: (c = '#fff') => (
    <g fill={c}>
      <path d="M -15 24 L -5 -18 L -1 -18 L -7 24 Z" />
      <path d="M 15 24 L 5 -18 L 1 -18 L 7 24 Z" />
      <path d="M -24 2 Q 0 -12 24 2 L 24 -6 Q 0 -20 -24 -6 Z" />
    </g>
  ),
  tunnel: (c = '#fff') => (
    <g fill={c}>
      <path d="M -18 20 L -18 0 Q -18 -18 0 -18 Q 18 -18 18 0 L 18 20 L 10 20 L 10 0 Q 10 -10 0 -10 Q -10 -10 -10 0 L -10 20 Z" />
    </g>
  ),
  deadend: () => (
    <g>
      <rect x={-4.5} y={-8} width={9} height={28} fill="#fff" />
      <rect x={-16} y={-16} width={32} height={9} fill={RED} />
    </g>
  ),
  hospital: (c = '#fff') => (
    <g fill={c}>
      <rect x={-14} y={-18} width={8} height={36} rx={2} />
      <rect x={6} y={-18} width={8} height={36} rx={2} />
      <rect x={-10} y={-4} width={20} height={8} />
    </g>
  ),
  wegweiser: (fg) => (
    <g>
      <path d="M -34 -6 L -22 -18 L -10 -6 L -16 -6 L -16 12 L -28 12 L -28 -6 Z" fill={fg} transform="translate(0 -4)" />
      <rect x={-2} y={-16} width={36} height={7} rx={2} fill={fg} />
      <rect x={-2} y={-3} width={30} height={7} rx={2} fill={fg} />
      <rect x={-2} y={10} width={24} height={7} rx={2} fill={fg} />
    </g>
  ),
}

function Slash({ count }) {
  return (
    <g stroke={RED} strokeWidth={8} strokeLinecap="round">
      <line x1={-33} y1={-33} x2={33} y2={33} />
      {count > 1 && <line x1={33} y1={-33} x2={-33} y2={33} />}
    </g>
  )
}

function GreyStripes() {
  return (
    <g stroke={GREY} strokeWidth={5} strokeLinecap="round">
      <line x1={-30} y1={30} x2={30} y2={-30} />
      <line x1={-34} y1={18} x2={18} y2={-34} />
      <line x1={-18} y1={34} x2={34} y2={-18} />
    </g>
  )
}

function SignText({ text, subtext, color = INK, size = 34 }) {
  return (
    <g>
      <text
        x={0}
        y={subtext ? size * 0.28 : size * 0.36}
        textAnchor="middle"
        fontSize={size}
        fontWeight="800"
        fill={color}
        fontFamily="system-ui, sans-serif"
      >
        {text}
      </text>
      {subtext && (
        <text x={0} y={size * 0.72} textAnchor="middle" fontSize={9} fontWeight="700" fill={RED} fontFamily="system-ui, sans-serif">
          {subtext}
        </text>
      )}
    </g>
  )
}

/** Dibuja el contenido (pictograma/texto) de una señal. */
function Content({ draw, color, scale = 1, dy = 0 }) {
  const pic = draw.pictogram ? PICTOGRAMS[draw.pictogram] : null
  return (
    <g transform={`translate(60 ${60 + dy}) scale(${scale})`}>
      {pic && pic(color)}
      {draw.text && <SignText text={draw.text} subtext={draw.subtext} color={color} size={draw.textSize || 34} />}
      {draw.slashes && <Slash count={draw.slashes} />}
      {draw.stripes && <GreyStripes />}
    </g>
  )
}

export default function SignSprite({ draw, size = 96 }) {
  let body = null
  switch (draw.shape) {
    case 'triangle':
      body = (
        <>
          <path d="M 60 6 L 114 108 L 6 108 Z" fill={RED} stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
          <path d="M 60 26 L 99 100 L 21 100 Z" fill="#fff" />
          <Content draw={draw} color={INK} scale={0.68} dy={14} />
        </>
      )
      break
    case 'triangleInverted':
      body = (
        <>
          <path d="M 6 14 L 114 14 L 60 112 Z" fill={RED} stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
          <path d="M 22 22 L 98 22 L 60 92 Z" fill="#fff" />
        </>
      )
      break
    case 'octagon':
      body = (
        <>
          <path
            d="M 38 8 L 82 8 L 112 38 L 112 82 L 82 112 L 38 112 L 8 82 L 8 38 Z"
            fill={RED}
            stroke="#fff"
            strokeWidth={4}
          />
          <text x={60} y={73} textAnchor="middle" fontSize={32} fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif">
            STOP
          </text>
        </>
      )
      break
    case 'circleRed':
      body = (
        <>
          <circle cx={60} cy={60} r={54} fill={draw.tint === 'blue' ? BLUE : '#fff'} stroke={RED} strokeWidth={11} />
          <Content draw={draw} color={draw.tint === 'blue' ? '#fff' : INK} scale={0.72} />
        </>
      )
      break
    case 'circleRedFull':
      body = (
        <>
          <circle cx={60} cy={60} r={54} fill={RED} stroke="#fff" strokeWidth={3} />
          <Content draw={draw} color="#fff" scale={0.72} />
        </>
      )
      break
    case 'circleBlue':
      body = (
        <>
          <circle cx={60} cy={60} r={54} fill={BLUE} stroke="#fff" strokeWidth={3} />
          <Content draw={draw} color="#fff" scale={0.72} />
        </>
      )
      break
    case 'circleGrey':
      body = (
        <>
          <circle cx={60} cy={60} r={54} fill="#fff" stroke={GREY} strokeWidth={7} />
          <Content draw={draw} color={GREY} scale={0.72} />
        </>
      )
      break
    case 'squareBlue':
      body = (
        <>
          <rect x={8} y={8} width={104} height={104} rx={10} fill={BLUE} stroke="#fff" strokeWidth={3} />
          <Content draw={draw} color="#fff" scale={0.78} />
        </>
      )
      break
    case 'squareGreen':
      body = (
        <>
          <rect x={8} y={8} width={104} height={104} rx={10} fill={GREEN} stroke="#fff" strokeWidth={3} />
          <Content draw={draw} color="#fff" scale={0.78} />
        </>
      )
      break
    case 'squareWhite':
      body = (
        <>
          <rect x={8} y={8} width={104} height={104} rx={10} fill="#fff" stroke={INK} strokeWidth={3} />
          <Content draw={draw} color={INK} scale={0.78} />
        </>
      )
      break
    case 'diamondYellow':
      body = (
        <>
          <rect x={22} y={22} width={76} height={76} rx={8} fill="#fff" stroke="#c9ced3" strokeWidth={2} transform="rotate(45 60 60)" />
          <rect x={38} y={38} width={44} height={44} rx={4} fill={YELLOW} transform="rotate(45 60 60)" />
          {draw.stripes && <Content draw={{ stripes: true }} color={GREY} scale={0.72} />}
        </>
      )
      break
    case 'banner': {
      const bg = { green: GREEN, blue: BLUE, white: '#fff', orange: ORANGE }[draw.tint || 'blue']
      const fg = draw.tint === 'white' ? INK : '#fff'
      body = (
        <>
          <rect x={4} y={22} width={112} height={76} rx={8} fill={bg} stroke={draw.tint === 'white' ? INK : '#fff'} strokeWidth={3} />
          <Content draw={{ pictogram: 'wegweiser' }} color={fg} scale={0.9} />
        </>
      )
      break
    }
    default:
      body = null
  }

  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
      {body}
    </svg>
  )
}
