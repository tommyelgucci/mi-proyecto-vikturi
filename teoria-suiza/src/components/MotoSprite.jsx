/**
 * Motocicleta con piloto vista desde arriba, mismo lenguaje visual que CarSprite.
 * Dibujada centrada en (0,0), morro hacia ARRIBA (angle 0 = norte).
 * Dimensiones locales: ~22 de ancho (hombros) × ~52 de largo.
 * `steer`: giro del manillar/rueda delantera en grados (negativo = izquierda).
 */
export default function MotoSprite({ x = 0, y = 0, angle = 0, color = '#ffffff', braking = false, steer = 0 }) {
  const steerStyle = {
    transform: `rotate(${steer}deg)`,
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transition: 'transform 0.45s ease',
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {/* sombra */}
      <ellipse cx={1} cy={1.5} rx={12} ry={27} fill="rgba(0,0,0,0.25)" />
      {/* rueda trasera */}
      <rect x={-2.8} y={18} width={5.6} height={13} rx={2.5} fill="#1c2024" />
      {/* luz de freno */}
      <rect x={-4} y={28.5} width={8} height={3} rx={1.5} fill={braking ? '#ff2d2d' : '#a33'} />
      {braking && <rect x={-4} y={28.5} width={8} height={3} rx={1.5} fill="#ff2d2d" opacity={0.6} filter="url(#glow)" />}
      {/* rueda delantera + guardabarros: giran con el manillar */}
      <g style={steerStyle}>
        <rect x={-2.8} y={-26} width={5.6} height={14} rx={2.5} fill="#1c2024" />
        <rect x={-3.6} y={-24} width={7.2} height={7} rx={2.5} fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth={0.7} />
      </g>
      {/* faro */}
      <rect x={-3.5} y={-13.5} width={7} height={3} rx={1.5} fill="#ffe9a8" />
      {/* cuerpo / depósito */}
      <path
        d="M -5 -12 Q 0 -15 5 -12 L 6.5 6 Q 0 10 -6.5 6 Z"
        fill={color}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={0.8}
      />
      {/* manillar: gira con la dirección */}
      <g
        style={{
          transform: `rotate(${steer * 0.8}deg)`,
          transformBox: 'fill-box',
          transformOrigin: 'center',
          transition: 'transform 0.45s ease',
        }}
      >
        <rect x={-11} y={-10.5} width={22} height={2.6} rx={1.3} fill="#2b3238" />
        <rect x={-11.5} y={-11} width={4} height={3.6} rx={1.5} fill="#4a545c" />
        <rect x={7.5} y={-11} width={4} height={3.6} rx={1.5} fill="#4a545c" />
      </g>
      {/* piloto: hombros y casco */}
      <ellipse cx={0} cy={9} rx={10.5} ry={8} fill="#2f6db3" stroke="rgba(0,0,0,0.25)" strokeWidth={0.8} />
      <ellipse cx={-9} cy={3} rx={2.6} ry={4.5} fill="#2f6db3" transform="rotate(20 -9 3)" />
      <ellipse cx={9} cy={3} rx={2.6} ry={4.5} fill="#2f6db3" transform="rotate(-20 9 3)" />
      <circle cx={0} cy={5} r={5.6} fill="#e8ecef" stroke="rgba(0,0,0,0.25)" strokeWidth={0.8} />
      <path d="M -4.5 2 A 5.6 5.6 0 0 1 4.5 2" fill="none" stroke="#33454f" strokeWidth={2.2} />
    </g>
  )
}
