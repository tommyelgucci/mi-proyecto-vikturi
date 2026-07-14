const PREFIX = 'chfahren.'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // localStorage lleno o bloqueado: la app sigue funcionando sin persistencia
  }
}

export const storage = {
  getLang: () => read('lang', 'de'),
  setLang: (v) => write('lang', v),

  getCategory: () => read('category', null),
  setCategory: (v) => write('category', v),

  // stats: { [questionId]: { seen, correct, wrong } }
  getStats: () => read('stats', {}),
  recordAnswer(questionId, wasCorrect) {
    const stats = read('stats', {})
    const s = stats[questionId] || { seen: 0, correct: 0, wrong: 0 }
    s.seen += 1
    if (wasCorrect) s.correct += 1
    else s.wrong += 1
    stats[questionId] = s
    write('stats', stats)
  },

  // failed: array de ids de preguntas falladas
  getFailed: () => read('failed', []),
  addFailed(questionId) {
    const failed = read('failed', [])
    if (!failed.includes(questionId)) {
      failed.push(questionId)
      write('failed', failed)
    }
  },
  removeFailed(questionId) {
    write('failed', read('failed', []).filter((id) => id !== questionId))
  },

  // examHistory: [{ date, category, size, penalty, maxPenalty, passed }]
  getExamHistory: () => read('examHistory', []),
  addExamResult(result) {
    const history = read('examHistory', [])
    history.push(result)
    write('examHistory', history.slice(-20))
  },
}
