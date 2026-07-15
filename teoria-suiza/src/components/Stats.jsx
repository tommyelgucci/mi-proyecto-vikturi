import { useLang, t } from '../i18n'
import { storage } from '../storage'
import questions from '../data/questions.json'
import { TOPICS } from '../data/topics'
import { FIRSTAID_CARDS } from '../data/firstaid'
import { SIGNS } from '../data/signs'

function StatTile({ emoji, value, label }) {
  return (
    <div className="flex-1 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-gray-200">
      <div className="text-2xl">{emoji}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-[11px] leading-tight text-gray-500">{label}</div>
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
    return <p className="text-sm text-gray-500">{t('noStatsYet', lang)}</p>
  }

  return (
    <div className="space-y-2.5">
      {rows.map(({ topic, pct, total }) => (
        <div key={topic.id}>
          <div className="mb-0.5 flex items-baseline justify-between text-xs">
            <span className="font-medium text-gray-700">{topic.label[lang]}</span>
            <span className="text-gray-500">
              {pct}% · {total}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 55 ? 'bg-amber-400' : 'bg-red-500'}`}
              style={{ width: `${Math.max(pct, 4)}%` }}
            />
          </div>
        </div>
      ))}
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
        <StatTile emoji="🔥" value={streak} label={t('streakDays', lang)} />
        <StatTile emoji="📅" value={daysStudied} label={t('daysStudied', lang)} />
        <StatTile emoji="✍️" value={answered} label={t('answeredTotal', lang)} />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <h3 className="font-bold text-gray-900">📚 {t('byTopic', lang)}</h3>
        <p className="mb-3 text-xs text-gray-400">{t('byTopicHint', lang)}</p>
        <TopicBars />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <h3 className="mb-3 font-bold text-gray-900">⏱️ {t('examHistoryTitle', lang)}</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">{t('noStatsYet', lang)}</p>
        ) : (
          <ul className="space-y-2">
            {history.map((e, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {new Date(e.date).toLocaleDateString(lang === 'de' ? 'de-CH' : 'es-ES')} ·{' '}
                  {e.category === 'B' ? '🚗' : '🏍️'}
                </span>
                <span className="font-medium text-gray-800">
                  {e.penalty}/{e.maxPenalty} {t('points', lang)} {e.passed ? '✅' : '❌'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <h3 className="mb-3 font-bold text-gray-900">🃏 {t('cardsProgress', lang)}</h3>
        <ul className="space-y-1.5 text-sm text-gray-700">
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
    </div>
  )
}
