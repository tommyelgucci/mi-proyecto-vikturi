/**
 * Coche visto desde arriba, estilo plano y limpio.
 * Dibujado centrado en (0,0), apuntando hacia ARRIBA (angle 0 = norte).
 * Dimensiones locales: 36 de ancho × 72 de largo.
 * `steer`: giro de las ruedas delanteras en grados (negativo = izquierda).
 */
export default function CarSprite({
  x = 0,
  y = 0,
  angle = 0,
  color = '#ffffff',
  blinker = null, // 'left' | 'right' | 'both' (luces de emergencia) | null
  reverseLights = false,
  braking = false,
  steer = 0,
  showWheels = false,
  label = null,
}) {
  const frontWheelStyle = {
    transform: `rotate(${steer}deg)`,
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transition: 'transform 0.45s ease',
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {/* sombra */}
      <rect x={-18} y={-36} width={36} height={72} rx={11} fill="rgba(0,0,0,0.25)" transform="translate(1.5 1.5)" />
      {/* ruedas: sobresalen un poco del cuerpo; las delanteras giran con el volante */}
      {showWheels && (
        <>
          <rect x={-22.5} y={-27} width={6.5} height={14} rx={2.5} fill="#1c2024" style={frontWheelStyle} />
          <rect x={16} y={-27} width={6.5} height={14} rx={2.5} fill="#1c2024" style={frontWheelStyle} />
          <rect x={-22.5} y={14} width={6.5} height={14} rx={2.5} fill="#1c2024" />
          <rect x={16} y={14} width={6.5} height={14} rx={2.5} fill="#1c2024" />
        </>
      )}
      {/* retrovisores */}
      <rect x={-21.5} y={-16} width={5} height={3.5} rx={1.5} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth={0.5} />
      <rect x={16.5} y={-16} width={5} height={3.5} rx={1.5} fill={color} stroke="rgba(0,0,0,0.15)" strokeWidth={0.5} />
      {/* carrocería */}
      <rect x={-18} y={-36} width={36} height={72} rx={11} fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
      {/* parabrisas delantero */}
      <path d="M -13 -14 Q 0 -20 13 -14 L 12 -6 Q 0 -10 -12 -6 Z" fill="#33454f" />
      {/* techo */}
      <rect x={-12.5} y={-6} width={25} height={22} rx={4} fill={color} stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />
      {/* luneta trasera */}
      <path d="M -12 18 Q 0 22 12 18 L 13 26 Q 0 30 -13 26 Z" fill="#33454f" />
      {/* capó: línea sutil */}
      <path d="M -12 -26 Q 0 -30 12 -26" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1} />
      {/* luces delanteras */}
      <rect x={-14} y={-35.5} width={8} height={3} rx={1.5} fill="#ffe9a8" />
      <rect x={6} y={-35.5} width={8} height={3} rx={1.5} fill="#ffe9a8" />
      {/* luces traseras (freno) */}
      <rect x={-14} y={32.5} width={8} height={3} rx={1.5} fill={braking ? '#ff2d2d' : '#a33'} />
      <rect x={6} y={32.5} width={8} height={3} rx={1.5} fill={braking ? '#ff2d2d' : '#a33'} />
      {braking && (
        <>
          <rect x={-14} y={32.5} width={8} height={3} rx={1.5} fill="#ff2d2d" opacity={0.6} filter="url(#glow)" />
          <rect x={6} y={32.5} width={8} height={3} rx={1.5} fill="#ff2d2d" opacity={0.6} filter="url(#glow)" />
        </>
      )}
      {/* luces de marcha atrás */}
      {reverseLights && (
        <>
          <rect x={-6} y={32.5} width={4.5} height={3} rx={1} fill="#fff" filter="url(#glow)" />
          <rect x={1.5} y={32.5} width={4.5} height={3} rx={1} fill="#fff" filter="url(#glow)" />
        </>
      )}
      {/* intermitentes: las 2 esquinas del lado activo, o las 4 en emergencia ('both') */}
      {(blinker === 'left' || blinker === 'both') && (
        <>
          <circle cx={-15.5} cy={-33} r={3.2} fill="#ffb300" className="blink" />
          <circle cx={-15.5} cy={33} r={3.2} fill="#ffb300" className="blink" />
        </>
      )}
      {(blinker === 'right' || blinker === 'both') && (
        <>
          <circle cx={15.5} cy={-33} r={3.2} fill="#ffb300" className="blink" />
          <circle cx={15.5} cy={33} r={3.2} fill="#ffb300" className="blink" />
        </>
      )}
      {/* letra identificadora (para diagramas de prioridad); contrarrota para quedar siempre derecha */}
      {label && (
        <g transform={`rotate(${-angle}) translate(0 4)`}>
          <circle r={11} fill="#fff" stroke="rgba(0,0,0,0.35)" strokeWidth={1.5} />
          <text y={5} textAnchor="middle" fontSize={14} fontWeight="800" fill="#1c2024" fontFamily="system-ui, sans-serif">
            {label}
          </text>
        </g>
      )}
    </g>
  )
}
