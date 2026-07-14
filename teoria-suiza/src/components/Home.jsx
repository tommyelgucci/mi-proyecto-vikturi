import { useLang, t } from '../i18n'
import { storage } from '../storage'
import { questionsForCategory } from '../utils'

function CategoryButton({ active, onClick, emoji, label, sub }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 p-4 transition-colors ${
        active ? 'border-swiss bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <span className="text-4xl">{emoji}</span>
      <span className="font-bold text-gray-900">{label}</span>
      <span className="text-xs text-gray-500">{sub}</span>
    </button>
  )
}

function MenuButton({ onClick, emoji, label, sub, badge }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50 active:bg-gray-100"
    >
      <span className="text-3xl">{emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-gray-900">{label}</span>
        <span className="block text-sm text-gray-500">{sub}</span>
      </span>
      {badge != null && badge > 0 && (
        <span className="rounded-full bg-swiss px-2.5 py-0.5 text-sm font-bold text-white">{badge}</span>
      )}
      <span className="text-gray-300">›</span>
    </button>
  )
}

export default function Home({ category, setCategory, navigate }) {
  const { lang } = useLang()
  const failedCount = storage.getFailed().length
  const stats = storage.getStats()
  const pool = questionsForCategory(category)
  const seen = pool.filter((q) => stats[q.id]?.seen > 0).length
  const mastered = pool.filter((q) => {
    const s = stats[q.id]
    return s && s.correct > s.wrong
  }).length
  const history = storage.getExamHistory()
  const lastExam = history[history.length - 1]

  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-5">
      <p className="text-center text-sm text-gray-600">{t('tagline', lang)}</p>

      <div className="flex gap-3">
        <CategoryButton
          active={category === 'B'}
          onClick={() => setCategory('B')}
          emoji="🚗"
          label={t('car', lang)}
          sub={t('carSub', lang)}
        />
        <CategoryButton
          active={category === 'A'}
          onClick={() => setCategory('A')}
          emoji="🏍️"
          label={t('moto', lang)}
          sub={t('motoSub', lang)}
        />
      </div>

      <div className="flex items-center justify-between rounded-xl bg-white px-4 py-2.5 text-xs text-gray-600 ring-1 ring-gray-200">
        <span>
          📚 {pool.length} {t('categoryQuestions', lang)}
        </span>
        <span>
          {seen} {t('progressSeen', lang)} · {mastered} {t('progressMastered', lang)}
        </span>
      </div>

      <div className="space-y-3">
        <MenuButton onClick={() => navigate('study')} emoji="📖" label={t('menuStudy', lang)} sub={t('menuStudySub', lang)} />
        <MenuButton onClick={() => navigate('exam')} emoji="⏱️" label={t('menuExam', lang)} sub={t('menuExamSub', lang)} />
        <MenuButton
          onClick={() => navigate('review')}
          emoji="🔁"
          label={t('menuReview', lang)}
          sub={t('menuReviewSub', lang)}
          badge={failedCount}
        />
        <MenuButton onClick={() => navigate('tips')} emoji="🎯" label={t('menuTips', lang)} sub={t('menuTipsSub', lang)} />
      </div>

      {lastExam && (
        <p className="text-center text-xs text-gray-500">
          {t('lastExam', lang)}: {lastExam.passed ? '✅' : '❌'} {lastExam.penalty}/{lastExam.maxPenalty}{' '}
          {t('points', lang)}
        </p>
      )}

      <p className="pt-2 text-center text-[11px] leading-relaxed text-gray-400">{t('disclaimer', lang)}</p>
    </div>
  )
}
