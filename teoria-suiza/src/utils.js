import questions from './data/questions.json'

export function shuffle(array) {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function questionsForCategory(category) {
  return questions.filter((q) => q.category === 'both' || q.category === category)
}

export function isAnswerCorrect(question, selectedIds) {
  const correctIds = question.options.filter((o) => o.correct).map((o) => o.id)
  if (selectedIds.length !== correctIds.length) return false
  return correctIds.every((id) => selectedIds.includes(id))
}

export function hasMultipleCorrect(question) {
  return question.options.filter((o) => o.correct).length > 1
}

// Audio en alemán: lee el texto en voz alta con la síntesis del navegador.
export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speakDe(text) {
  if (!canSpeak() || !text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'de-CH'
  const voices = window.speechSynthesis.getVoices()
  const voice = voices.find((v) => v.lang === 'de-CH') || voices.find((v) => v.lang?.startsWith('de'))
  if (voice) utterance.voice = voice
  utterance.rate = 0.95
  window.speechSynthesis.speak(utterance)
}

// El examen real: 50 preguntas, máx. 15 puntos de penalización, 45 minutos.
// Con un banco menor, se escala proporcionalmente.
export function examConfig(category) {
  const pool = questionsForCategory(category)
  const size = Math.min(50, pool.length)
  const maxPenalty = Math.round((15 * size) / 50)
  const timeLimitSec = Math.round((45 * 60 * size) / 50)
  return { pool, size, maxPenalty, timeLimitSec }
}

// Preparación para el examen (0–100) a partir del progreso guardado.
// Combina: cobertura del banco (40%), acierto global (35%) y últimos simulacros (25%).
// Función pura para poder testearla: recibe datos, no lee storage.
export function readinessScore(stats, history, pool) {
  const answered = pool.filter((q) => stats[q.id]?.seen > 0)
  if (answered.length < 10) return { score: null, level: 'start', weakTopics: [] }

  const coverage = answered.length / pool.length
  let correct = 0
  let total = 0
  const byTopic = {}
  for (const q of answered) {
    const s = stats[q.id]
    correct += s.correct
    total += s.correct + s.wrong
    const agg = byTopic[q.topic] || { correct: 0, total: 0 }
    agg.correct += s.correct
    agg.total += s.correct + s.wrong
    byTopic[q.topic] = agg
  }
  const accuracy = total > 0 ? correct / total : 0

  const lastExams = history.slice(-3)
  const examScore = lastExams.length
    ? lastExams.filter((e) => e.passed).length / lastExams.length
    : accuracy // sin simulacros aún: usa el acierto como aproximación

  const score = Math.round(100 * (0.4 * coverage + 0.35 * accuracy + 0.25 * examScore))
  const level = score >= 75 ? 'ready' : score >= 45 ? 'ontrack' : 'start'

  const weakTopics = Object.entries(byTopic)
    .filter(([, v]) => v.total >= 3 && v.correct / v.total < 0.6)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
    .slice(0, 3)
    .map(([topic]) => topic)

  return { score, level, weakTopics }
}
