import { useRef, useState } from 'react'
import { useLang, t, tr, dateLocale } from '../i18n'
import { storage } from '../storage'
import questions from '../data/questions.json'
import { TOPICS } from '../data/topics'
import { FIRSTAID_CARDS } from '../data/firstaid'
import { SIGNS } from '../data/signs'
import ProgressRing from './ProgressRing'

function StatTile({ emoji, value, label, ring }) {
  return (
    <div className="flex-1 rounded-2xl bg-white dark:bg-gray-800 p-3 text-center shadow-card ring-1 ring-gray-200/70 dark:ring-gray-700">
      {ring != null ? (
        <div className="flex justify-center">
          <ProgressRing value={ring} size={52} stroke={5} color="#da291c">
            <span className="text-sm">{emoji}</span>
          </ProgressRing>
        </div>
      ) : (
        <div className="text-2xl">{emoji}</div>
      )}
      <div className="mt-0.5 text-xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
      <div className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  )
}

function TopicBars() {
  const { lang } = useLang()
  const stats = storage.getStats()

  const byTopic = {}
  for (const q of questions) {
    const s = stats[q.id]
    if (!s || s.seen === 0) continue
    const agg = byTopic[q.topic] || { correct: 0, wrong: 0 }
    agg.correct += s.correct
    agg.wrong += s.wrong
    byTopic[q.topic] = agg
  }

  const rows = TOPICS.filter((tp) => byTopic[tp.id])
    .map((tp) => {
      const { correct, wrong } = byTopic[tp.id]
      return { topic: tp, pct: Math.round((100 * correct) / (correct + wrong)), total: correct + wrong }
    })
    .sort((a, b) => a.pct - b.pct)

  if (rows.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">{t('noStatsYet', lang)}</p>
  }

  return (
    <div className="space-y-2.5">
      {rows.map(({ topic, pct, total }) => (
        <div key={topic.id}>
          <div className="mb-0.5 flex items-baseline justify-between text-xs">
            <span className="font-medium text-gray-700 dark:text-gray-300">{tr(topic.label, lang)}</span>
            <span className="text-gray-500 dark:text-gray-400">
              {pct}% · {total}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                pct >= 80
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : pct >= 55
                    ? 'bg-gradient-to-r from-amber-300 to-amber-500'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${Math.max(pct, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Backup() {
  const { lang } = useLang()
  const [text, setText] = useState('')
  const [msg, setMsg] = useState(null)
  const textareaRef = useRef(null)

  function doExport() {
    const json = storage.exportAll()
    setText(json)
    setMsg(null)
    // intento de descarga; en iOS desde Archivos puede no funcionar, por eso también queda el textarea
    try {
      const blob = new Blob([json], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `chfahren-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      // sin descarga: el usuario copia el texto
    }
  }

  async function doCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setMsg(t('copiedMsg', lang))
    } catch {
      textareaRef.current?.select()
      document.execCommand('copy')
      setMsg(t('copiedMsg', lang))
    }
  }

  function doImport() {
    if (!window.confirm(t('importConfirm', lang))) return
    try {
      const { skipped } = storage.importAll(text.trim())
      setMsg(skipped > 0 ? t('importPartial', lang, { n: skipped }) : t('importDone', lang))
      setTimeout(() => window.location.reload(), skipped > 0 ? 1800 : 600)
    } catch {
      setMsg(t('importError', lang))
    }
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-gray-100">💾 {t('backupTitle', lang)}</h3>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{t('backupHint', lang)}</p>
      <div className="flex gap-2">
        <button
          onClick={doExport}
          className="flex-1 rounded-xl bg-swiss py-2.5 text-sm font-semibold text-white hover:bg-swiss-dark"
        >
          ⬇️ {t('exportBtn', lang)}
        </button>
        <button
          onClick={doImport}
          disabled={!text.trim()}
          className="flex-1 rounded-xl bg-white dark:bg-gray-700 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 ring-1 ring-gray-300 dark:ring-gray-600 disabled:opacity-40"
        >
          ⬆️ {t('importBtn', lang)}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setMsg(null)
        }}
        placeholder={t('pasteHere', lang)}
        rows={3}
        className="mt-3 w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2 font-mono text-[10px] text-gray-700 dark:text-gray-300"
      />
      <div className="mt-1 flex items-center justify-between">
        {text.trim() ? (
          <button onClick={doCopy} className="text-xs font-semibold text-swiss underline">
            📋 {t('copyBtn', lang)}
          </button>
        ) : (
          <span />
        )}
        {msg && <span className="text-xs font-medium text-green-600 dark:text-green-400">{msg}</span>}
      </div>
    </div>
  )
}

export default function Stats() {
  const { lang } = useLang()
  const streak = storage.getStreak()
  const daysStudied = storage.getStudyDays().length
  const stats = storage.getStats()
  const answered = Object.values(stats).reduce((sum, s) => sum + s.seen, 0)
  const history = storage.getExamHistory().slice(-10).reverse()
  const fa = storage.srsCounts('firstaid', FIRSTAID_CARDS.map((c) => c.id))
  const sg = storage.srsCounts('signs', SIGNS.map((s) => s.id))

  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-4">
      <div className="flex gap-3">
        <StatTile emoji="🔥" value={streak} label={t('streakDays', lang)} ring={Math.min(100, storage.getDailyCount() * 5)} />
        <StatTile emoji="📅" value={daysStudied} label={t('daysStudied', lang)} />
        <StatTile emoji="✍️" value={answered} label={t('answeredTotal', lang)} />
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">📚 {t('byTopic', lang)}</h3>
        <p className="mb-3 text-xs text-gray-400">{t('byTopicHint', lang)}</p>
        <TopicBars />
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <h3 className="mb-3 font-bold text-gray-900 dark:text-gray-100">⏱️ {t('examHistoryTitle', lang)}</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('noStatsYet', lang)}</p>
        ) : (
          <ul className="space-y-2">
            {history.map((e, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  {new Date(e.date).toLocaleDateString(dateLocale(lang))} ·{' '}
                  {e.category === 'B' ? '🚗' : '🏍️'}
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {e.penalty}/{e.maxPenalty} {t('points', lang)} {e.passed ? '✅' : '❌'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <h3 className="mb-3 font-bold text-gray-900 dark:text-gray-100">🃏 {t('cardsProgress', lang)}</h3>
        <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex justify-between">
            <span>⛑️ Nothelfer</span>
            <span>
              {fa.inReview}/{FIRSTAID_CARDS.length} · {fa.mastered} {t('mastered', lang)}
            </span>
          </li>
          <li className="flex justify-between">
            <span>🚸 {t('menuSigns', lang)}</span>
            <span>
              {sg.inReview}/{SIGNS.length} · {sg.mastered} {t('mastered', lang)}
            </span>
          </li>
        </ul>
      </div>

      <Backup />
    </div>
  )
}
