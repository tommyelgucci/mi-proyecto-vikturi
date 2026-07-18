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

export function IconThoughtBubble({ className }) {
  return (
    <Svg className={className}>
      <path
        d="M8 5.2a4 4 0 0 1 6.7-1.6 3.6 3.6 0 0 1 4.6 3.9A3.8 3.8 0 0 1 17 15H9a4.5 4.5 0 0 1-1-8.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="18" r="1.3" fill="currentColor" />
      <circle cx="6" cy="20.5" r="0.8" fill="currentColor" />
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

export function IconGrid({ className }) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
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

/**
 * Fase 2: íconos de contenido (uno por maniobra/tema, hoy campos `icon`
 * con emoji en los datos). Mismo estilo que arriba. Se consumen vía el
 * lookup `ICON_MAP` + componente `<Icon name="..." />` al final del archivo,
 * porque algunos de esos datos son JSON puro y no pueden guardar JSX.
 */

export function IconParkingP({ className }) {
  return (
    <Svg className={className}>
      <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 7v10M9 7h4a3 3 0 0 1 0 6H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconRightAngle({ className }) {
  return (
    <Svg className={className}>
      <path d="M5 4v15h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="15" width="4" height="4" stroke="currentColor" strokeWidth="1.4" />
    </Svg>
  )
}

export function IconArrowUpBay({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 20V6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M7.5 10.5 12 5.5l4.5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="5" y1="20" x2="5" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="19" y1="20" x2="19" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconArrowLeft({ className }) {
  return (
    <Svg className={className}>
      <path d="M20 12H5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M9.5 7 4.5 12l5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  )
}

export function IconReverseArrow({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M9 8.5v7M9 8.5h2.3a2.3 2.3 0 0 1 0 4.6H9M11.3 13.1 14.5 15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  )
}

export function IconUTurn({ className }) {
  return (
    <Svg className={className}>
      <path d="M7 19V10a5 5 0 0 1 10 0v9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" fill="none" />
      <path d="M13.5 16 17 19.5 20.5 16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  )
}

export function IconStopOctagon({ className }) {
  return (
    <Svg className={className}>
      <path d="M8.5 3h7L20 7.5v9L15.5 21h-7L4 16.5v-9L8.5 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <line x1="7.5" y1="12" x2="16.5" y2="12" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  )
}

export function IconEmergencyBrake({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="12" y1="5.5" x2="12" y2="7.6" />
        <line x1="12" y1="16.4" x2="12" y2="18.5" />
        <line x1="5.5" y1="12" x2="7.6" y2="12" />
        <line x1="16.4" y1="12" x2="18.5" y2="12" />
      </g>
    </Svg>
  )
}

export function IconPin({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </Svg>
  )
}

export function IconRuler({ className }) {
  return (
    <Svg className={className}>
      <rect x="3" y="9.5" width="18" height="5" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <g stroke="currentColor" strokeWidth="1.3">
        <line x1="7" y1="9.5" x2="7" y2="12" />
        <line x1="11" y1="9.5" x2="11" y2="12.8" />
        <line x1="15" y1="9.5" x2="15" y2="12" />
      </g>
    </Svg>
  )
}

export function IconNarrowLane({ className }) {
  return (
    <Svg className={className}>
      <path d="M6 3 9 21M18 3 15 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.5 3" />
    </Svg>
  )
}

export function IconWave({ className }) {
  return (
    <Svg className={className}>
      <path d="M2 15c2-6 4-6 6 0s4 6 6 0 4-6 6 0" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </Svg>
  )
}

export function IconFigureEight({ className }) {
  return (
    <Svg className={className}>
      <path
        d="M7 15c-1.7 0-3-1.3-3-3s1.3-3 3-3c2.2 0 3.5 2 5 3 1.5-1 2.8-3 5-3 1.7 0 3 1.3 3 3s-1.3 3-3 3c-2.2 0-3.5-2-5-3-1.5 1-2.8 3-5 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function IconSwerve({ className }) {
  return (
    <Svg className={className}>
      <path d="M3 17h4c1.5 0 1.5-6 4-6h2c2.5 0 2.5 6 4 6h4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="1.6" fill="currentColor" />
    </Svg>
  )
}

export function IconPriorityRight({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 2 22 12 12 22 2 12 12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 7 17 12 12 17 7 12 12 7Z" fill="currentColor" />
    </Svg>
  )
}

export function IconRoundaboutWarn({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 6a6 6 0 0 1 5.6 4M18 8.2l1 2.6-2.7-.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 17a6 6 0 0 1-7-2.5M8 16l-1-2.6 2.8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  )
}

export function IconEye({ className }) {
  return (
    <Svg className={className}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </Svg>
  )
}

export function IconHighway({ className }) {
  return (
    <Svg className={className}>
      <path d="M8 21 10.5 3h3L16 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <path d="M12 16.5v-4M9.5 10 12 7.5 14.5 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  )
}

export function IconChecklist({ className }) {
  return (
    <Svg className={className}>
      <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="9" y="2.5" width="6" height="3" rx="1" fill="currentColor" />
      <path d="M8 10.5l1.3 1.3L12 9M8 15.5l1.3 1.3L12 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="13.5" y1="10.5" x2="16.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13.5" y1="15.5" x2="16.5" y2="15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  )
}

export function IconHelmet({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 14a8 8 0 1 1 16 0v3a2 2 0 0 1-2 2h-1v-4h-10v4H6a2 2 0 0 1-2-2v-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 13.5h5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconSignpost({ className }) {
  return (
    <Svg className={className}>
      <line x1="6" y1="21" x2="6" y2="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 6h8l2.5 2.5L14 11H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 12h6l-2 2.5 2 2.5H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconMegaphone({ className }) {
  return (
    <Svg className={className}>
      <path d="M3 10v4h3l7 4V6l-7 4H3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 9.5a3 3 0 0 1 0 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M19 14v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconMap({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 5.5 9 4l6 2 5-1.5v14L15 20l-6-2-5 1.5V5.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      <path d="M7 9c2 1 4 4 5 4s3-2 5-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </Svg>
  )
}

export function IconPedestrian({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="4.5" r="1.8" fill="currentColor" />
      <path d="M12 7v6M12 13l-3 5M12 13l3 5M9 10l-2 2M15 10l2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  )
}

export function IconSpeedGauge({ className }) {
  return (
    <Svg className={className}>
      <path d="M4 15a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M12 15 16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" />
      <line x1="4" y1="19" x2="20" y2="19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconTram({ className }) {
  return (
    <Svg className={className}>
      <rect x="4" y="4" width="16" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="4" y1="9.5" x2="20" y2="9.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="4" x2="12" y2="9.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="20" r="1.6" fill="currentColor" />
      <circle cx="16" cy="20" r="1.6" fill="currentColor" />
    </Svg>
  )
}

export function IconLaneChange({ className }) {
  return (
    <Svg className={className}>
      <line x1="7" y1="3" x2="7" y2="21" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 3" opacity="0.55" />
      <line x1="17" y1="3" x2="17" y2="21" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 3" opacity="0.55" />
      <path d="M7 17 17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 7h5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  )
}

export function IconNoEntry({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  )
}

export function IconNeighborhood({ className }) {
  return (
    <Svg className={className}>
      <path d="M3 20V11l5-4 5 4v9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <path d="M12 20v-6l4.5-3.5 4.5 3.5v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
      <line x1="3" y1="20" x2="21" y2="20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconGlobe({ className }) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <ellipse cx="12" cy="12" rx="3.5" ry="8.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3.5" y1="12" x2="20.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
    </Svg>
  )
}

export function IconGear({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1.6" fill="currentColor" />
      <path d="M6 17h12l-1.5 4h-9L6 17Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </Svg>
  )
}

export function IconLeaf({ className }) {
  return (
    <Svg className={className}>
      <path d="M19 5C10 5 5 10 5 17c0 .6.1 1.2.3 1.7C13 18 19 12 19 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 18c3-3 7-6 10-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  )
}

export function IconPhone({ className }) {
  return (
    <Svg className={className}>
      <path
        d="M5 4.5c0-1 .8-1.5 1.6-1.3l2.5.6c.6.1 1 .6 1 1.2l.2 2.6c0 .5-.2 1-.6 1.3l-1.4 1.1a13 13 0 0 0 6 6l1.1-1.4c.3-.4.8-.6 1.3-.6l2.6.2c.6 0 1.1.4 1.2 1l.6 2.5c.2.8-.3 1.6-1.3 1.6C12.5 20.8 3.2 11.5 5 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function IconStethoscope({ className }) {
  return (
    <Svg className={className}>
      <path d="M6 3v3.5M10 3v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6 6.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <path d="M8 6.5V14a5.5 5.5 0 0 0 11 0v-1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <circle cx="19.5" cy="11.3" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="17.5" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </Svg>
  )
}

export function IconRecoveryPosition({ className }) {
  return (
    <Svg className={className}>
      <circle cx="5" cy="9.5" r="1.8" fill="currentColor" />
      <path d="M6.5 10.3c2.5.8 4 2 6.5 2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M13 12.7c1.8.3 2.6-1.3 4.3-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M13 12.7c.6 1.7-.3 2.8 1 4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M6.5 10.3 5 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="2" y1="16.5" x2="21.5" y2="16.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </Svg>
  )
}

export function IconHeartPulse({ className }) {
  return (
    <Svg className={className}>
      <path
        d="M12 20s-7.5-4.5-9.5-9.5C1 6.5 3.5 3.5 7 3.5c2 0 3.7 1.1 5 3 1.3-1.9 3-3 5-3 3.5 0 6 3 4.5 7-2 5-9.5 9.5-9.5 9.5Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M4 12h3l1.5-2.5L11 14l1.5-3H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  )
}

export function IconBloodDrop({ className }) {
  return (
    <Svg className={className}>
      <path d="M12 3s6 7 6 11.5A6 6 0 0 1 6 14.5C6 10 12 3 12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    </Svg>
  )
}

export function IconScale({ className }) {
  return (
    <Svg className={className}>
      <line x1="12" y1="3" x2="12" y2="19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="5" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M5 7 2.5 12.5a2.5 2.5 0 0 0 5 0L5 7ZM19 7l-2.5 5.5a2.5 2.5 0 0 0 5 0L19 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M8.5 20h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  )
}

const ICON_MAP = {
  parkingP: IconParkingP,
  rightAngle: IconRightAngle,
  arrowUpBay: IconArrowUpBay,
  arrowLeft: IconArrowLeft,
  reverseArrow: IconReverseArrow,
  uTurn: IconUTurn,
  stopOctagon: IconStopOctagon,
  emergencyBrake: IconEmergencyBrake,
  pin: IconPin,
  ruler: IconRuler,
  narrowLane: IconNarrowLane,
  wave: IconWave,
  figureEight: IconFigureEight,
  swerve: IconSwerve,
  priorityRight: IconPriorityRight,
  roundaboutWarn: IconRoundaboutWarn,
  eye: IconEye,
  highway: IconHighway,
  checklist: IconChecklist,
  helmet: IconHelmet,
  signpost: IconSignpost,
  megaphone: IconMegaphone,
  map: IconMap,
  pedestrian: IconPedestrian,
  speedGauge: IconSpeedGauge,
  tram: IconTram,
  laneChange: IconLaneChange,
  noEntry: IconNoEntry,
  neighborhood: IconNeighborhood,
  globe: IconGlobe,
  gear: IconGear,
  leaf: IconLeaf,
  phone: IconPhone,
  stethoscope: IconStethoscope,
  recoveryPosition: IconRecoveryPosition,
  heartPulse: IconHeartPulse,
  bloodDrop: IconBloodDrop,
  scale: IconScale,
  idCard: IconIdCard,
  warningSign: IconWarningSign,
  thoughtBubble: IconThoughtBubble,
  graduationCap: IconGraduationCap,
  ambulance: IconAmbulance,
}

/** Ícono genérico para campos de datos (`icon: 'clave'` en .js/.json). */
export function Icon({ name, className }) {
  const Cmp = ICON_MAP[name]
  if (!Cmp) return null
  return <Cmp className={className} />
}
