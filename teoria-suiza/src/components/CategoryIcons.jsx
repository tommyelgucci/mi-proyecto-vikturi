/** Íconos propios (reemplazan los emojis nativos 🚗/🏍️ en el selector de categoría). */
export function CarIcon({ className }) {
  return (
    <svg viewBox="0 0 680 480" className={className} aria-hidden="true">
      <path
        d="M150 320 Q150 260 210 245 L245 175 Q260 150 295 150 L430 150 Q465 150 480 175 L510 245 Q560 255 565 310 L570 340 Q570 365 545 365 L520 365 Q520 400 485 400 Q450 400 450 365 L280 365 Q280 400 245 400 Q210 400 210 365 L165 365 Q145 365 145 345 Z"
        fill="#D7263D"
      />
      <path
        d="M270 240 L290 185 Q298 172 315 172 L410 172 Q427 172 435 185 L455 240 Z"
        fill="#8ec1f0"
      />
      <line x1="362" y1="172" x2="362" y2="240" stroke="#1a1d24" strokeWidth="4" />
      <rect x="470" y="270" width="42" height="26" rx="5" fill="#f2e29b" />
      <circle cx="245" cy="365" r="62" fill="#1a1d24" />
      <circle cx="245" cy="365" r="30" fill="#8a8f99" />
      <circle cx="485" cy="365" r="62" fill="#1a1d24" />
      <circle cx="485" cy="365" r="30" fill="#8a8f99" />
    </svg>
  )
}

export function MotoIcon({ className }) {
  return (
    <svg viewBox="0 0 680 480" className={className} aria-hidden="true">
      <circle cx="215" cy="345" r="80" fill="#1a1d24" />
      <circle cx="215" cy="345" r="45" fill="#ffffff" />
      <circle cx="215" cy="345" r="18" fill="#8a8f99" />
      <circle cx="500" cy="345" r="80" fill="#1a1d24" />
      <circle cx="500" cy="345" r="45" fill="#ffffff" />
      <circle cx="500" cy="345" r="18" fill="#8a8f99" />
      <rect x="230" y="185" width="150" height="45" rx="12" fill="#1a1d24" />
      <path d="M455 165 L470 250 L440 250 Z" fill="#D7263D" />
      <line x1="460" y1="180" x2="500" y2="345" stroke="#D7263D" strokeWidth="16" strokeLinecap="round" />
      <line x1="455" y1="150" x2="465" y2="195" stroke="#D7263D" strokeWidth="14" strokeLinecap="round" />
      <rect x="400" y="138" width="70" height="14" rx="7" fill="#D7263D" />
      <rect x="400" y="136" width="34" height="16" rx="7" fill="#1a1d24" />
      <circle cx="488" cy="200" r="22" fill="#D7263D" />
      <path d="M488 178 A22 22 0 0 1 510 200 L488 200 Z" fill="#f2e29b" />
      <rect x="180" y="235" width="230" height="16" rx="8" fill="#D7263D" />
      <path d="M330 208 Q400 195 455 205 L448 245 L335 245 Z" fill="#D7263D" />
      <line x1="255" y1="250" x2="215" y2="345" stroke="#D7263D" strokeWidth="14" strokeLinecap="round" />
      <line x1="255" y1="250" x2="330" y2="330" stroke="#D7263D" strokeWidth="14" strokeLinecap="round" />
      <line x1="330" y1="330" x2="360" y2="250" stroke="#D7263D" strokeWidth="14" strokeLinecap="round" />
      <path
        d="M320 290 Q360 320 420 315 L445 300 L460 315 Q400 345 310 320 L230 350 Q210 340 218 325 Z"
        fill="#c3c8d1"
      />
      <ellipse cx="390" cy="290" rx="55" ry="32" fill="#c3c8d1" />
      <g fill="#8a8f99">
        <rect x="378" y="228" width="44" height="10" rx="2" />
        <rect x="374" y="240" width="52" height="8" />
        <rect x="376" y="250" width="48" height="8" />
        <rect x="378" y="260" width="44" height="8" />
        <rect x="380" y="270" width="40" height="8" />
      </g>
      <g stroke="#ffffff" strokeWidth="2">
        <line x1="376" y1="244" x2="424" y2="244" />
        <line x1="377" y1="254" x2="423" y2="254" />
        <line x1="379" y1="264" x2="421" y2="264" />
        <line x1="381" y1="272" x2="419" y2="272" />
      </g>
    </svg>
  )
}
