import { useMemo } from 'react'

const COLORS = ['#da291c', '#f6b93b', '#2ecc71', '#3498db', '#9b59b6', '#e67e22']

// Confeti festivo en CSS puro (sin librerías). Se renderiza una vez y cae
// durante ~3 s; respeta prefers-reduced-motion vía la clase de animación.
export default function Confetti({ count = 44 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 2.2 + Math.random() * 1.4,
        size: 6 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
        spin: Math.random() > 0.5 ? 1 : -1,
        drift: (Math.random() - 0.5) * 120,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece absolute top-[-4%] block rounded-[2px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.45,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--confetti-drift': `${p.drift}px`,
            '--confetti-spin': `${p.spin * 720}deg`,
          }}
        />
      ))}
    </div>
  )
}
