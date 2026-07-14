import { createContext, useContext } from 'react'

export const LangContext = createContext({ lang: 'de', setLang: () => {} })
export const useLang = () => useContext(LangContext)

export const STRINGS = {
  appName: { de: 'CH Fahren', es: 'CH Fahren' },
  tagline: { de: 'Theorie & Praxis für die Schweizer Führerprüfung', es: 'Teoría y práctica para el examen de conducir suizo' },
  car: { de: 'Auto', es: 'Coche' },
  carSub: { de: 'Kategorie B', es: 'Categoría B' },
  moto: { de: 'Motorrad', es: 'Moto' },
  motoSub: { de: 'Kategorie A / A1', es: 'Categoría A / A1' },
  menuStudy: { de: 'Lernmodus', es: 'Modo estudio' },
  menuStudySub: { de: 'Fragen mit sofortigem Feedback', es: 'Preguntas con feedback inmediato' },
  menuExam: { de: 'Prüfungssimulation', es: 'Simulacro de examen' },
  menuExamSub: { de: 'Wie am echten Prüfungstag', es: 'Como el examen real' },
  menuReview: { de: 'Fehler wiederholen', es: 'Repasar falladas' },
  menuReviewSub: { de: 'Deine falsch beantworteten Fragen', es: 'Tus preguntas falladas' },
  menuTips: { de: 'Praxis-Tipps', es: 'Consejos prácticos' },
  menuTipsSub: { de: 'Für die praktische Prüfung', es: 'Para el examen práctico' },
  back: { de: 'Zurück', es: 'Volver' },
  check: { de: 'Prüfen', es: 'Comprobar' },
  next: { de: 'Weiter', es: 'Siguiente' },
  correct: { de: 'Richtig!', es: '¡Correcto!' },
  wrong: { de: 'Leider falsch', es: 'Incorrecto' },
  explanation: { de: 'Erklärung', es: 'Explicación' },
  multiHint: { de: 'Mehrere Antworten können richtig sein', es: 'Puede haber varias respuestas correctas' },
  allTopics: { de: 'Alle Themen', es: 'Todos los temas' },
  question: { de: 'Frage', es: 'Pregunta' },
  of: { de: 'von', es: 'de' },
  progressSeen: { de: 'gesehen', es: 'vistas' },
  progressMastered: { de: 'beherrscht', es: 'dominadas' },
  examIntroTitle: { de: 'Prüfungssimulation', es: 'Simulacro de examen' },
  examIntro1: {
    de: 'Die echte Basistheorieprüfung hat 50 Fragen. Bestanden ist sie mit höchstens 15 Fehlerpunkten.',
    es: 'El examen teórico básico real tiene 50 preguntas. Se aprueba con un máximo de 15 puntos de penalización.',
  },
  examIntro2: {
    de: 'Diese Simulation nutzt {n} Fragen aus dem aktuellen Fragenkatalog; die Bestehensgrenze ist proportional: max. {p} Fehlerpunkte.',
    es: 'Esta simulación usa {n} preguntas del banco actual; el aprobado es proporcional: máx. {p} puntos de penalización.',
  },
  examIntro3: {
    de: 'Kein Feedback während der Prüfung – Auswertung am Schluss. Zeitlimit: {t} Minuten.',
    es: 'Sin feedback durante el examen: la corrección llega al final. Tiempo límite: {t} minutos.',
  },
  startExam: { de: 'Prüfung starten', es: 'Empezar examen' },
  submitExam: { de: 'Abgeben', es: 'Entregar' },
  quitExam: { de: 'Abbrechen', es: 'Salir' },
  confirmQuit: { de: 'Prüfung wirklich abbrechen?', es: '¿Seguro que quieres salir del examen?' },
  confirmSubmit: { de: 'Es gibt noch unbeantwortete Fragen. Trotzdem abgeben?', es: 'Aún hay preguntas sin responder. ¿Entregar de todos modos?' },
  timeUp: { de: 'Zeit abgelaufen!', es: '¡Se acabó el tiempo!' },
  passed: { de: 'Bestanden!', es: '¡Aprobado!' },
  failed: { de: 'Nicht bestanden', es: 'No aprobado' },
  penaltyPoints: { de: 'Fehlerpunkte', es: 'Puntos de penalización' },
  maxAllowed: { de: 'erlaubt', es: 'permitidos' },
  correctAnswers: { de: 'richtig beantwortet', es: 'respondidas bien' },
  reviewErrors: { de: 'Fehler ansehen', es: 'Revisar errores' },
  newExam: { de: 'Neue Prüfung', es: 'Nuevo examen' },
  backHome: { de: 'Zum Hauptmenü', es: 'Al menú principal' },
  yourAnswer: { de: 'Deine Antwort', es: 'Tu respuesta' },
  noFailed: { de: 'Keine falschen Fragen – super! 🎉', es: 'No tienes preguntas falladas. ¡Genial! 🎉' },
  noFailedSub: {
    de: 'Fragen, die du im Lern- oder Prüfungsmodus falsch beantwortest, landen hier.',
    es: 'Las preguntas que falles en modo estudio o examen aparecerán aquí.',
  },
  reviewHint: {
    de: 'Richtig beantwortete Fragen werden aus der Liste entfernt.',
    es: 'Las preguntas que respondas bien se eliminan de la lista.',
  },
  failedCount: { de: 'Fragen zu wiederholen', es: 'preguntas por repasar' },
  lastExam: { de: 'Letzte Prüfung', es: 'Último examen' },
  points: { de: 'Punkte', es: 'puntos' },
  studyDone: { de: 'Alle Fragen durchgearbeitet! 🎉', es: '¡Has repasado todas las preguntas! 🎉' },
  studyAgain: { de: 'Nochmals durchgehen', es: 'Volver a empezar' },
  disclaimer: {
    de: 'Übungsfragen ohne Gewähr, basierend auf SVG/VRV/SSV. Kein offizielles Prüfungsmaterial (ASA).',
    es: 'Preguntas de práctica sin garantía, basadas en SVG/VRV/SSV. No es material oficial del examen (ASA).',
  },
  minutes: { de: 'Min.', es: 'min' },
  timeLeft: { de: 'Restzeit', es: 'Tiempo restante' },
  answered: { de: 'beantwortet', es: 'respondidas' },
  categoryQuestions: { de: 'Fragen im Katalog', es: 'preguntas en el banco' },
}

export function t(key, lang, vars) {
  let s = (STRINGS[key] && STRINGS[key][lang]) || key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
  }
  return s
}
