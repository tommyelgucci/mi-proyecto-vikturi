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

// El examen real: 50 preguntas, máx. 15 puntos de penalización, 45 minutos.
// Con un banco menor, se escala proporcionalmente.
export function examConfig(category) {
  const pool = questionsForCategory(category)
  const size = Math.min(50, pool.length)
  const maxPenalty = Math.round((15 * size) / 50)
  const timeLimitSec = Math.round((45 * 60 * size) / 50)
  return { pool, size, maxPenalty, timeLimitSec }
}
