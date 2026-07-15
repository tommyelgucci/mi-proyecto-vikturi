import CarSprite from './CarSprite'
import { ROAD, GRASS, CURB } from '../data/maneuvers'

function ArrowHead({ x, y, angle }) {
  return (
    <polygon
      points="0,-9 -6.5,4.5 6.5,4.5"
      fill="#e9edf0"
      transform={`translate(${x} ${y}) rotate(${angle})`}
    />
  )
}

function ArrowBranch({ from, to, angle }) {
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke="#e9edf0" strokeWidth={5} strokeLinecap="round" />
      <ArrowHead x={to[0]} y={to[1]} angle={angle} />
    </g>
  )
}

/** Flecha vial pintada en el carril (kind: straight/left/right/straightLeft/straightRight/trident). */
function LaneArrow({ x, y, kind }) {
  const trunk = <line x1={0} y1={34} x2={0} y2={kind === 'left' || kind === 'right' ? 6 : 10} stroke="#e9edf0" strokeWidth={5} strokeLinecap="round" />
  const branches = []
  if (kind === 'straight' || kind === 'straightLeft' || kind === 'straightRight' || kind === 'trident') {
    branches.push(<ArrowBranch key="s" from={[0, 10]} to={[0, -12]} angle={0} />)
  }
  if (kind === 'left' || kind === 'straightLeft' || kind === 'trident') {
    branches.push(<ArrowBranch key="l" from={kind === 'left' ? [0, 6] : [0, 10]} to={[-17, -12]} angle={-42} />)
  }
  if (kind === 'right' || kind === 'straightRight' || kind === 'trident') {
    branches.push(<ArrowBranch key="r" from={kind === 'right' ? [0, 6] : [0, 10]} to={[17, -12]} angle={42} />)
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      {trunk}
      {branches}
    </g>
  )
}

function Dashes({ x1, y1, x2, y2, color = '#fff', width = 2 }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeDasharray="10 8"
      strokeLinecap="round"
    />
  )
}

/** Dibuja un único elemento estático de escena (calzada, aceras, señales, coches aparcados…). */
export function SceneElement({ el }) {
  switch (el.type) {
    case 'road':
      return <rect x={el.x} y={el.y} width={el.w} height={el.h} fill={ROAD} />
    case 'grass':
      return <rect x={el.x} y={el.y} width={el.w} height={el.h} fill={GRASS} />
    case 'curbLine':
      return <line x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} stroke={CURB} strokeWidth={3} />
    case 'laneLine':
      return el.dashed ? (
        <Dashes x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} color="#e9edf0" width={2.5} />
      ) : (
        <line x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} stroke="#e9edf0" strokeWidth={2.5} />
      )
    case 'yellowZone':
      return <Dashes x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} color="#ffd23f" width={4} />
    case 'stopLine':
      return <rect x={el.x} y={el.y} width={el.w} height={el.h} fill="#fff" />
    case 'crosswalk': {
      const stripes = []
      const n = Math.max(1, Math.round(el.w / 10))
      for (let i = 0; i < n; i++) {
        stripes.push(
          <rect key={i} x={el.x + i * (el.w / n)} y={el.y} width={el.w / n - 4} height={el.h} fill="#e9edf0" />,
        )
      }
      return <g>{stripes}</g>
    }
    case 'driveway':
      return (
        <g>
          <rect x={el.x} y={el.y} width={el.w} height={el.h} fill="#8a8f95" />
          <rect x={el.x} y={el.y} width={el.w} height={el.h} fill="url(#hatch)" />
        </g>
      )
    case 'stopSign':
      return (
        <g transform={`translate(${el.x} ${el.y})`}>
          <polygon
            points="8,0 20,0 28,8 28,20 20,28 8,28 0,20 0,8"
            fill="#d21f1f"
            stroke="#fff"
            strokeWidth={1.5}
          />
          <text x={14} y={18} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#fff">
            STOP
          </text>
        </g>
      )
    case 'bayOutline':
      return (
        <rect
          x={el.x - el.w / 2}
          y={el.y - el.h / 2}
          width={el.w}
          height={el.h}
          fill="none"
          stroke="#e9edf0"
          strokeWidth={2}
          strokeDasharray="6 5"
          rx={3}
          transform={`rotate(${el.angle || 0} ${el.x} ${el.y})`}
        />
      )
    case 'parkedCar':
      return <CarSprite x={el.x} y={el.y} angle={el.angle} color={el.color} />
    case 'label':
      return (
        <text x={el.x} y={el.y} fontSize={el.size || 10} fill="#2b3238" fontWeight="600">
          {el.text}
        </text>
      )
    case 'distanceTag': {
      const midY = (el.y1 + el.y2) / 2
      return (
        <g stroke="#1fb6c9" strokeWidth={1.5} fill="none">
          <line x1={el.x1 - 12} y1={el.y1} x2={el.x1 - 12} y2={el.y2} markerStart="url(#arrowStart)" markerEnd="url(#arrowEnd)" />
          <text x={el.x1 - 18} y={midY} textAnchor="end" fontSize={10} fill="#0e7d8c" fontWeight="700" stroke="none">
            {el.text}
          </text>
        </g>
      )
    }
    case 'ring':
      // corona circular de calzada (rotondas)
      return (
        <g>
          <circle cx={el.x} cy={el.y} r={(el.rOuter + el.rInner) / 2} fill="none" stroke={ROAD} strokeWidth={el.rOuter - el.rInner} />
          <circle cx={el.x} cy={el.y} r={el.rInner} fill={GRASS} stroke={CURB} strokeWidth={2.5} />
          <circle cx={el.x} cy={el.y} r={el.rOuter} fill="none" stroke={CURB} strokeWidth={2.5} />
        </g>
      )
    case 'tram':
      return (
        <g transform={`translate(${el.x} ${el.y}) rotate(${el.angle || 0})`}>
          <rect x={-16} y={-52} width={32} height={104} rx={8} fill={el.color || '#2f6db3'} stroke="rgba(0,0,0,0.25)" strokeWidth={1.5} />
          <rect x={-11} y={-44} width={22} height={12} rx={3} fill="#33454f" />
          <rect x={-11} y={-26} width={22} height={14} rx={3} fill="#33454f" />
          <rect x={-11} y={-6} width={22} height={14} rx={3} fill="#33454f" />
          <rect x={-11} y={14} width={22} height={14} rx={3} fill="#33454f" />
          <rect x={-11} y={34} width={22} height={12} rx={3} fill="#33454f" />
          <line x1={-14} y1={0} x2={14} y2={0} stroke="rgba(0,0,0,0.25)" strokeWidth={1.5} />
        </g>
      )
    case 'rail':
      return (
        <g stroke="#c7ccd1" strokeWidth={2}>
          <line x1={el.x1} y1={el.y1 - 6} x2={el.x2} y2={el.y2 - 6} />
          <line x1={el.x1} y1={el.y1 + 6} x2={el.x2} y2={el.y2 + 6} />
        </g>
      )
    case 'cone':
      return (
        <g transform={`translate(${el.x} ${el.y})`}>
          <circle r={6} fill="#e8590c" />
          <circle r={3.6} fill="#ff8a3d" />
          <circle r={1.6} fill="#ffd9b8" />
        </g>
      )
    case 'circleOutline':
      return (
        <circle
          cx={el.x}
          cy={el.y}
          r={el.r}
          fill="none"
          stroke="#e9edf0"
          strokeWidth={2}
          strokeDasharray="8 7"
          opacity={0.65}
        />
      )
    case 'obstacle':
      return (
        <g>
          <rect
            x={el.x - el.w / 2}
            y={el.y - el.h / 2}
            width={el.w}
            height={el.h}
            rx={4}
            fill="#343a41"
            stroke="#ffd23f"
            strokeWidth={2}
            strokeDasharray="6 5"
          />
          <text x={el.x} y={el.y + 4.5} textAnchor="middle" fontSize={13} fontWeight="800" fill="#ffd23f">
            !
          </text>
        </g>
      )
    case 'check':
      return (
        <g transform={`translate(${el.x} ${el.y})`}>
          <circle r={11} fill="#1fa25c" />
          <path d="M -5 0 L -1.5 4.5 L 5.5 -4.5" stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )
    case 'laneArrow':
      return <LaneArrow x={el.x} y={el.y} kind={el.kind} />
    case 'trafficLight':
      return (
        <g transform={`translate(${el.x} ${el.y})`}>
          <rect x={-8} y={-2} width={16} height={44} rx={3} fill="#33383e" stroke="rgba(0,0,0,0.25)" strokeWidth={1} />
          <circle cx={0} cy={7} r={5.2} fill="#d21f1f" />
          <circle cx={0} cy={19} r={5.2} fill="#ffb300" />
          <circle cx={0} cy={31} r={5.2} fill="#1fa25c" />
        </g>
      )
    case 'cross':
      return (
        <g transform={`translate(${el.x} ${el.y})`}>
          <circle r={11} fill="#d21f1f" />
          <path d="M -4.5 -4.5 L 4.5 4.5 M 4.5 -4.5 L -4.5 4.5" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
        </g>
      )
    default:
      return null
  }
}

export function SceneDefs() {
  return (
    <defs>
      <pattern id="hatch" patternUnits="userSpaceOnUse" width={8} height={8} patternTransform="rotate(45)">
        <line x1={0} y1={0} x2={0} y2={8} stroke="#c7ccd1" strokeWidth={2.5} />
      </pattern>
      <marker id="arrowStart" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto-start-reverse">
        <path d="M 4 0 L 8 8 L 0 8 Z" fill="#1fb6c9" />
      </marker>
      <marker id="arrowEnd" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto">
        <path d="M 4 0 L 8 8 L 0 8 Z" fill="#1fb6c9" />
      </marker>
    </defs>
  )
}
