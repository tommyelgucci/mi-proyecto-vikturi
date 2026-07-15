import { DIAGRAMS } from '../data/diagrams'
import { SceneElement, SceneDefs } from './SceneElements'
import CarSprite from './CarSprite'

/** Diagrama estático de una situación de prioridad (para preguntas del examen). */
export default function SceneDiagram({ id }) {
  const d = DIAGRAMS[id]
  if (!d) return null
  return (
    <svg viewBox="0 0 360 360" className="mx-auto block w-full max-w-[280px] rounded-xl">
      <SceneDefs />
      <marker id="diagArrow" markerWidth={8} markerHeight={8} refX={4} refY={4} orient="auto">
        <path d="M 0 0 L 8 4 L 0 8 Z" fill="#22c3dd" />
      </marker>
      {d.elements.map((el, i) => (
        <SceneElement key={i} el={el} />
      ))}
      {d.arrows?.map((a, i) => (
        <path
          key={i}
          d={a.path}
          fill="none"
          stroke="#22c3dd"
          strokeWidth={4}
          strokeDasharray="9 7"
          strokeLinecap="round"
          markerEnd="url(#diagArrow)"
        />
      ))}
      {d.cars.map((c) =>
        c.kind === 'tram' ? (
          <g key={c.label}>
            <SceneElement el={{ type: 'tram', x: c.x, y: c.y, angle: c.angle }} />
            <g transform={`translate(${c.x} ${c.y})`}>
              <circle r={12} fill="#fff" stroke="rgba(0,0,0,0.35)" strokeWidth={1.5} />
              <text y={5.5} textAnchor="middle" fontSize={15} fontWeight="800" fill="#1c2024" fontFamily="system-ui, sans-serif">
                {c.label}
              </text>
            </g>
          </g>
        ) : (
          <CarSprite key={c.label} x={c.x} y={c.y} angle={c.angle} color={c.color} label={c.label} />
        ),
      )}
    </svg>
  )
}
