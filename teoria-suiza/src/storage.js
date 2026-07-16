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

// Repetición espaciada (SRS): niveles 0–5 con intervalos crecientes en días.
const SRS_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30]
const DAY_MS = 24 * 60 * 60 * 1000

function srsKey(module) {
  return module + 'Srs' // 'firstaidSrs' | 'signsSrs'
}

// Migra las antiguas listas de "sabidas" (arrays de ids) al formato SRS.
function readSrs(module) {
  const key = srsKey(module)
  const existing = read(key, null)
  if (existing) return existing
  const legacy = read(module + 'Known', [])
  const srs = {}
  for (const id of legacy) srs[id] = { level: 3, due: Date.now() + SRS_INTERVALS_DAYS[3] * DAY_MS }
  if (legacy.length > 0) write(key, srs)
  return srs
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export const storage = {
  getLang: () => read('lang', 'de'),
  setLang: (v) => write('lang', v),

  getTheme() {
    const saved = read('theme', null)
    if (saved === 'light' || saved === 'dark') return saved
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  },
  setTheme: (v) => write('theme', v),

  // Backup: exportar/importar todas las claves chfahren.*
  exportAll() {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(PREFIX)) data[key] = localStorage.getItem(key)
    }
    return JSON.stringify({ app: 'chfahren', version: 1, exported: new Date().toISOString(), data })
  },
  importAll(json) {
    const parsed = JSON.parse(json)
    if (!parsed || parsed.app !== 'chfahren' || typeof parsed.data !== 'object') {
      throw new Error('invalid backup')
    }
    const entries = Object.entries(parsed.data).filter(([k]) => k.startsWith(PREFIX))
    if (entries.length === 0) throw new Error('empty backup')
    for (const [k, v] of entries) localStorage.setItem(k, v)
  },

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
    storage.touchStudyDay()
  },

  // racha de estudio: días (YYYY-MM-DD) con actividad, últimos 90
  touchStudyDay() {
    const days = read('studyDays', [])
    const today = todayKey()
    if (!days.includes(today)) {
      days.push(today)
      days.sort()
      write('studyDays', days.slice(-90))
    }
  },
  getStudyDays: () => read('studyDays', []),
  getStreak() {
    const days = new Set(read('studyDays', []))
    let streak = 0
    const cursor = new Date()
    // la racha puede terminar hoy o ayer (si hoy aún no se ha estudiado)
    if (!days.has(todayKey())) cursor.setDate(cursor.getDate() - 1)
    while (days.has(cursor.toISOString().slice(0, 10))) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    }
    return streak
  },

  // --- SRS para flashcards (module: 'firstaid' | 'signs') ---
  srsGet: (module) => readSrs(module),
  srsDueIds(module, allIds) {
    const srs = readSrs(module)
    const now = Date.now()
    return allIds.filter((id) => !srs[id] || srs[id].due <= now)
  },
  srsPromote(module, id) {
    const srs = readSrs(module)
    const level = Math.min((srs[id]?.level ?? 0) + 1, SRS_INTERVALS_DAYS.length - 1)
    srs[id] = { level, due: Date.now() + SRS_INTERVALS_DAYS[level] * DAY_MS }
    write(srsKey(module), srs)
    storage.touchStudyDay()
  },
  srsDemote(module, id) {
    const srs = readSrs(module)
    srs[id] = { level: 0, due: Date.now() }
    write(srsKey(module), srs)
    storage.touchStudyDay()
  },
  srsReset(module) {
    write(srsKey(module), {})
    write(module + 'Known', [])
  },
  srsNextDue(module) {
    const srs = readSrs(module)
    const now = Date.now()
    const future = Object.values(srs)
      .map((e) => e.due)
      .filter((d) => d > now)
    return future.length ? Math.min(...future) : null
  },
  srsCounts(module, allIds) {
    const srs = readSrs(module)
    let inReview = 0
    let mastered = 0
    for (const id of allIds) {
      const e = srs[id]
      if (e && e.level >= 1) inReview += 1
      if (e && e.level >= 3) mastered += 1
    }
    return { inReview, mastered }
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
