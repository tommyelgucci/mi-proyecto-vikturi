const PREFIX = 'chfahren.'

// Claves globales del dispositivo (compartidas entre perfiles).
// Todo lo demás (progreso) vive bajo el prefijo del perfil activo: chfahren.p.<id>.<clave>
const GLOBAL_KEYS = new Set(['lang', 'theme', 'profiles', 'activeProfile'])

function gread(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function gwrite(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // localStorage lleno o bloqueado: la app sigue funcionando sin persistencia
  }
}

let activeId = 'default'

// Crea el registro de perfiles si no existe y migra el progreso legacy
// (claves chfahren.<x> sin prefijo de perfil) al perfil «default».
function ensureProfiles() {
  try {
    let profiles = gread('profiles', null)
    if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
      profiles = [{ id: 'default', name: '', emoji: '🚗' }]
      gwrite('profiles', profiles)
      gwrite('activeProfile', 'default')
      // migración única: mover el progreso existente al perfil default
      const legacy = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key || !key.startsWith(PREFIX)) continue
        const rest = key.slice(PREFIX.length)
        if (GLOBAL_KEYS.has(rest) || rest.startsWith('p.')) continue
        legacy.push([key, rest])
      }
      for (const [fullKey, rest] of legacy) {
        const value = localStorage.getItem(fullKey)
        localStorage.setItem(PREFIX + 'p.default.' + rest, value)
        localStorage.removeItem(fullKey)
      }
    }
    const active = gread('activeProfile', 'default')
    activeId = profiles.some((p) => p.id === active) ? active : profiles[0].id
  } catch {
    activeId = 'default'
  }
}

ensureProfiles()

function pkey(key) {
  return PREFIX + 'p.' + activeId + '.' + key
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(pkey(key))
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(pkey(key), JSON.stringify(value))
  } catch {
    // sin persistencia
  }
}

// Repetición espaciada (SRS): niveles 0–5 con intervalos crecientes en días.
const SRS_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30]
const DAY_MS = 24 * 60 * 60 * 1000

function srsKey(module) {
  return module + 'Srs' // 'firstaidSrs' | 'signsSrs' | 'vkuSrs'
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

// Valida que el valor de un backup tenga el tipo esperado para su clave,
// para que un archivo corrupto o manipulado a mano no escriba datos con una
// forma inesperada que rompa algo más tarde en otro punto de la app.
const ARRAY_KEYS = new Set(['failed', 'examHistory', 'studyDays'])
function isValidEntryShape(rest, rawValue) {
  let value
  try {
    value = JSON.parse(rawValue)
  } catch {
    return false
  }
  if (rest === 'lang' || rest === 'theme' || rest === 'category') {
    return value === null || typeof value === 'string'
  }
  if (rest.endsWith('Checked') || ARRAY_KEYS.has(rest)) {
    return Array.isArray(value)
  }
  if (rest.endsWith('Srs') || rest === 'stats' || rest === 'dailyCount') {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }
  // claves desconocidas (versiones futuras): aceptar cualquier JSON válido
  return true
}

export const storage = {
  getLang: () => gread('lang', 'de'),
  setLang: (v) => gwrite('lang', v),

  getTheme() {
    const saved = gread('theme', null)
    if (saved === 'light' || saved === 'dark') return saved
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  },
  setTheme: (v) => gwrite('theme', v),

  // --- Perfiles locales ---
  getProfiles: () => gread('profiles', [{ id: 'default', name: '', emoji: '🚗' }]),
  getActiveProfile() {
    const profiles = storage.getProfiles()
    return profiles.find((p) => p.id === activeId) || profiles[0]
  },
  setActiveProfile(id) {
    const profiles = storage.getProfiles()
    if (profiles.some((p) => p.id === id)) {
      gwrite('activeProfile', id)
      activeId = id
    }
  },
  createProfile(name, emoji) {
    const profiles = storage.getProfiles()
    const id = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    profiles.push({ id, name: name || '', emoji: emoji || '🚗' })
    gwrite('profiles', profiles)
    return id
  },
  updateProfile(id, patch) {
    const profiles = storage.getProfiles().map((p) => (p.id === id ? { ...p, ...patch } : p))
    gwrite('profiles', profiles)
  },
  deleteProfile(id) {
    const profiles = storage.getProfiles()
    if (profiles.length <= 1) return false
    // borrar el progreso del perfil
    const prefix = PREFIX + 'p.' + id + '.'
    const toRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) toRemove.push(key)
    }
    for (const key of toRemove) localStorage.removeItem(key)
    const remaining = profiles.filter((p) => p.id !== id)
    gwrite('profiles', remaining)
    if (activeId === id) {
      gwrite('activeProfile', remaining[0].id)
      activeId = remaining[0].id
    }
    return true
  },

  // Backup: exportar/importar el progreso del PERFIL ACTIVO.
  // Formato compatible con backups antiguos (claves chfahren.<x>).
  exportAll() {
    const data = {}
    const prefix = PREFIX + 'p.' + activeId + '.'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        data[PREFIX + key.slice(prefix.length)] = localStorage.getItem(key)
      }
    }
    data[PREFIX + 'lang'] = JSON.stringify(storage.getLang())
    data[PREFIX + 'theme'] = JSON.stringify(storage.getTheme())
    return JSON.stringify({ app: 'chfahren', version: 2, exported: new Date().toISOString(), data })
  },
  importAll(json) {
    const parsed = JSON.parse(json)
    if (!parsed || parsed.app !== 'chfahren' || typeof parsed.data !== 'object') {
      throw new Error('invalid backup')
    }
    const entries = Object.entries(parsed.data).filter(([k]) => k.startsWith(PREFIX))
    if (entries.length === 0) throw new Error('empty backup')
    let imported = 0
    let skipped = 0
    for (const [k, v] of entries) {
      const rest = k.slice(PREFIX.length)
      if (rest.startsWith('p.') || rest === 'profiles' || rest === 'activeProfile') continue
      if (!isValidEntryShape(rest, v)) {
        skipped += 1
        continue
      }
      if (rest === 'lang' || rest === 'theme') {
        localStorage.setItem(PREFIX + rest, v)
      } else {
        localStorage.setItem(pkey(rest), v)
      }
      imported += 1
    }
    if (imported === 0) throw new Error('no valid entries')
    return { imported, skipped }
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
    // contador de respuestas del día (objetivo diario)
    const daily = read('dailyCount', { day: today, count: 0 })
    const next = daily.day === today ? { day: today, count: daily.count + 1 } : { day: today, count: 1 }
    write('dailyCount', next)
  },
  getDailyCount() {
    const daily = read('dailyCount', { day: todayKey(), count: 0 })
    return daily.day === todayKey() ? daily.count : 0
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

  // --- SRS para flashcards (module: 'firstaid' | 'signs' | 'vku') ---
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

  // checklists persistentes por módulo
  getChecked: (module) => read(module + 'Checked', []),
  setChecked: (module, ids) => write(module + 'Checked', ids),

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
