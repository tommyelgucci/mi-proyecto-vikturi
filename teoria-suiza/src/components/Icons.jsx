/**
 * Set de íconos de línea propios (reemplazan emojis usados como elemento de
 * interfaz — ver guía 5.2.5 de Apple). Estilo consistente: viewBox 24x24,
 * trazo currentColor, para heredar el color del chip/texto donde se usen.
 * Los íconos "hero" (CarIcon/MotoIcon) viven aparte en CategoryIcons.jsx.
 */

function Svg({ className, children }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      {children}
    </svg>
  )
}

export function IconSwiss({ className }) {
  return (
    <Svg className={className}>
      <rect x="9" y="3" width="6" height="18" rx="1" fill="currentColor" />
      <rect x="3" y="9" width="18" height="6" rx="1" fill="currentColor" />
    </Svg>
  )
}

export function IconSun({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="4.5" />
        <line x1="12" y1="19.5" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4.5" y2="12" />
        <line x1="19.5" y1="12" x2="22" y2="12" />
        <line x1="4.9" y1="4.9" x2="6.6" y2="6.6" />
        <line x1="17.4" y1="17.4" x2="19.1" y2="19.1" />
        <line x1="4.9" y1="19.1" x2="6.6" y2="17.4" />
        <line x1="17.4" y1="6.6" x2="19.1" y2="4.9" />
      </g>
    </Svg>
  )
}

export function IconMoon({ className }) {
  return (
    <Svg className={className}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" fill="currentColor" />
    </Svg>
  )
}

export function IconSpeaker({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
      <path d="M16.5 9a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.5 7a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </Svg>
  )
}

export function IconFirstAid({ className }) {
  return (
    <Svg className={className}>
      <rect x="3" y="7" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10.5v5M9.5 13h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function IconBookOpen({ className }) {
  return (
    <Svg className={className}>
      <path
        d="M12 6.5c-1.8-1.3-4.4-1.7-8-1.2v12.5c3.6-.5 6.2-.1 8 1.2 1.8-1.3 4.4-1.7 8-1.2V5.3c-3.6-.5-6.2-.1-8 1.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <line x1="12" y1="6.5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.7" />
    </Svg>
  )
}

export function IconStack({ className }) {
  return (
    <Svg className={className}>
      <rect x="4" y="15" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="5" y="11" width="14" height="3" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="6" y="7" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </Svg>
  )
}

export function IconStopwatch({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8" />
      <line x1="12" y1="13" x2="12" y2="8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="13" x2="15" y2="14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="9.5" y1="2.5" x2="14.5" y2="2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="2.5" x2="12" y2="5" stroke="currentColor" strokeWidth="1.8" />
    </Svg>
  )
}

export function IconRetry({ className }) {
  return (
    <Svg className={className}>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M20 3v5h-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconWarningSign({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 3 2 20h20L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="12" y1="10" x2="12" y2="14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </Svg>
  )
}

export function IconBrain({ className }) {
  return (
    <Svg className={className}>
      <path
        d="M8 5a3.2 3.2 0 0 0-3 4.3A3 3 0 0 0 6 15h1.5M16 5a3.2 3.2 0 0 1 3 4.3A3 3 0 0 1 18 15h-1.5M8 5c0-1.7 1.8-3 4-3s4 1.3 4 3M8 5v10a4 4 0 0 0 4 4 4 4 0 0 0 4-4V5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function IconSteeringWheel({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <path d="M12 6v3.8M6.3 15.5l3.3-2M17.7 15.5l-3.3-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function IconTarget({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </Svg>
  )
}

export function IconIdCard({ className }) {
  return (
    <Svg className={className}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8" cy="12" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="13" y1="10" x2="18.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="13.2" x2="16.5" y2="13.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  )
}

export function IconGraduationCap({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 4 2 9l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 11.5V17c0 1 2.5 2.3 6 2.3s6-1.3 6-2.3v-5.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="21" y1="9.3" x2="21" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconBarChart({ className }) {
  return (
    <Svg className={className}>
      <line x1="4" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="6" y="12" width="3.4" height="8" rx="1" fill="currentColor" />
      <rect x="10.5" y="7" width="3.4" height="13" rx="1" fill="currentColor" />
      <rect x="15" y="15" width="3.4" height="5" rx="1" fill="currentColor" />
    </Svg>
  )
}

export function IconFlame({ className }) {
  return (
    <Svg className={className}>
      <path
        d="M12.5 2.8c-.6 2.4-2.3 4-4 5.8C6.9 10.3 5.5 12.3 5.5 15a6.5 6.5 0 0 0 13 0c0-2-1-3.6-2.3-4.9.2 1 .1 2.1-.4 3a3.4 3.4 0 0 1-6.6-1.1c0-1.9 1.2-3.3 2.4-4.6 1-1 2-2 1.4-3.7-.2-.5-.5-.7-.5-.9Z"
        fill="currentColor"
      />
    </Svg>
  )
}

export function IconExternalLink({ className }) {
  return (
    <Svg className={className}>
      <path
        d="M9 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 4h6v6M20 4 11 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconCards({ className }) {
  return (
    <Svg className={className}>
      <rect x="3" y="6" width="13" height="15" rx="2" transform="rotate(-8 9.5 13.5)" stroke="currentColor" strokeWidth="1.6" />
      <rect x="7" y="4" width="14" height="16" rx="2" fill="currentColor" opacity="0.12" />
      <rect x="7" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
    </Svg>
  )
}

export function IconTap({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.2" opacity="0.3" />
    </Svg>
  )
}

export function IconConfetti({ className }) {
  return (
    <Svg className={className}>
      <g fill="currentColor">
        <rect x="4" y="4" width="3" height="3" rx="0.5" transform="rotate(15 5.5 5.5)" />
        <rect x="17" y="3" width="3" height="3" rx="0.5" transform="rotate(-20 18.5 4.5)" />
        <circle cx="19" cy="12" r="1.6" />
        <circle cx="5" cy="16" r="1.6" />
        <rect x="10" y="17" width="3" height="3" rx="0.5" transform="rotate(25 11.5 18.5)" />
      </g>
      <path d="M9 15c2-4 5-7 9-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconQuestionBubble({ className }) {
  return (
    <Svg className={className}>
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M10 9c0-1.2 1-2 2-2s2 .8 2 2c0 1-1 1.3-1.7 2-.3.3-.3.6-.3 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="13.4" r="0.9" fill="currentColor" />
    </Svg>
  )
}

export function IconAmbulance({ className }) {
  return (
    <Svg className={className}>
      <rect x="2" y="10" width="14" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 12h3.5l2 3v2h-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7" cy="18.5" r="1.7" fill="currentColor" />
      <circle cx="17.5" cy="18.5" r="1.7" fill="currentColor" />
      <path d="M7 11.5v3.5M5.3 13.3h3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconBulb({ className }) {
  return (
    <Svg className={className}>
      <path d="M9 18h6M10 21h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function IconTrophy({ className }) {
  return (
    <Svg className={className}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path
        d="M7 5.5H4.5A2 2 0 0 0 4 9c.3 1.6 1.6 2.5 3 2.6M17 5.5h2.5A2 2 0 0 1 20 9c-.3 1.6-1.6 2.5-3 2.6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M10 13.5v2M14 13.5v2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 20h8M9 17.5h6v1a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 18.5v-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function IconThumbsUp({ className }) {
  return (
    <Svg className={className}>
      <path d="M7 11v9H4.5A1.5 1.5 0 0 1 3 18.5v-6A1.5 1.5 0 0 1 4.5 11H7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path
        d="M7 11l3.5-6.5c.4-.7 1.5-.5 1.5.3V9h5a2 2 0 0 1 2 2.4l-1.2 6A2 2 0 0 1 16 19H7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function IconCheck({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconCross({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  )
}

export function IconHourglass({ className }) {
  return (
    <Svg className={className}>
      <path d="M6 3h12M6 21h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M7 3v3.5c0 1.8 1.4 3.3 3.2 4l.8.5.8-.5c1.8-.7 3.2-2.2 3.2-4V3M17 21v-3.5c0-1.8-1.4-3.3-3.2-4l-.8-.5-.8.5c-1.8.7-3.2 2.2-3.2 4V21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function IconAlarm({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 9v4l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 4 3 6M19 4l2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9.5 2.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  )
}

export function IconFlagMark({ className }) {
  return (
    <Svg className={className}>
      <line x1="6" y1="3" x2="6" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 4h12l-3.5 4L18 12H6Z" fill="currentColor" />
    </Svg>
  )
}

export function IconSadFace({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8.7" cy="10" r="1.1" fill="currentColor" />
      <circle cx="15.3" cy="10" r="1.1" fill="currentColor" />
      <path d="M8.3 16c1-1.6 2.3-2.4 3.7-2.4s2.7.8 3.7 2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconPeople({ className }) {
  return (
    <Svg className={className}>
      <circle cx="8.5" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <path d="M3 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 15c2.4.2 4 1.8 4 4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </Svg>
  )
}

export function IconTrash({ className }) {
  return (
    <Svg className={className}>
      <path
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4L18 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  )
}

export function IconSave({ className }) {
  return (
    <Svg className={className}>
      <path d="M5 3h11l3 3v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="7" y="13" width="10" height="6.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7.5" y="4" width="6" height="4.5" stroke="currentColor" strokeWidth="1.5" />
    </Svg>
  )
}

export function IconDownload({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 4v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.5 11 12 15.5 16.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 18.5h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function IconUpload({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 19V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.5 12 12 7.5 16.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 18.5h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function IconCopy({ className }) {
  return (
    <Svg className={className}>
      <rect x="8" y="7" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 16H4.5A1.5 1.5 0 0 1 3 14.5v-10A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconCalendar({ className }) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="8" y1="3" x2="8" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16" y1="3" x2="16" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconPencil({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 20l1-4.5L15.5 5 19 8.5 8.5 19 4 20Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="13.5" y1="7" x2="17" y2="10.5" stroke="currentColor" strokeWidth="1.6" />
    </Svg>
  )
}
