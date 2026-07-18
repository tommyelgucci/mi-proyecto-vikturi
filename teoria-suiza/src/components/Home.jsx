import { useLang, t } from '../i18n'
import { storage } from '../storage'
import { questionsForCategory, readinessScore } from '../utils'
import { maneuversForCategory } from '../data/maneuvers'
import { topicLabel } from '../data/topics'
import ProgressRing from './ProgressRing'
import { CarIcon, MotoIcon } from './CategoryIcons'
import {
  IconFirstAid,
  IconBookOpen,
  IconStopwatch,
  IconRetry,
  IconWarningSign,
  IconThoughtBubble,
  IconSteeringWheel,
  IconTarget,
  IconIdCard,
  IconGraduationCap,
  IconBarChart,
  IconFlame,
  IconStack,
  IconCheck,
  IconCross,
} from './Icons'

const DAILY_GOAL = 20

function CategoryButton({ active, onClick, icon, label, sub }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 p-4 transition-all active:scale-[0.98] ${
        active ? 'border-swiss bg-red-50 shadow-card dark:bg-red-900/30' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
    >
      {icon}
      <span className="font-bold text-gray-900 dark:text-gray-100">{label}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{sub}</span>
    </button>
  )
}

const CHIP_TINTS = {
  red: 'bg-red-100 dark:bg-red-900/40',
  amber: 'bg-amber-100 dark:bg-amber-900/40',
  blue: 'bg-sky-100 dark:bg-sky-900/40',
  green: 'bg-emerald-100 dark:bg-emerald-900/40',
}

const CHIP_TEXT = {
  red: 'text-swiss dark:text-red-300',
  amber: 'text-amber-600 dark:text-amber-300',
  blue: 'text-sky-600 dark:text-sky-300',
  green: 'text-emerald-600 dark:text-emerald-300',
}

function MenuButton({ onClick, icon, label, sub, badge, tint = 'red' }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-2xl bg-white dark:bg-gray-800 p-3.5 text-left shadow-card ring-1 ring-gray-200/70 dark:ring-gray-700 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98]"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${CHIP_TINTS[tint]} ${CHIP_TEXT[tint]}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold leading-snug text-gray-900 dark:text-gray-100">{label}</span>
        <span className="block text-[13px] leading-snug text-gray-500 dark:text-gray-400">{sub}</span>
      </span>
      {badge != null && badge > 0 && (
        <span className="rounded-full bg-swiss px-2.5 py-0.5 text-sm font-bold text-white">{badge}</span>
      )}
      <span className="text-gray-300">›</span>
    </button>
  )
}

function GroupLabel({ children }) {
  return (
    <p className="px-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
      {children}
    </p>
  )
}

function Hero({ profile, category, navigate }) {
  const { lang } = useLang()
  const stats = storage.getStats()
  const history = storage.getExamHistory()
  const pool = questionsForCategory(category)
  const { score, level, weakTopics } = readinessScore(stats, history, pool)
  const streak = storage.getStreak()
  const daily = storage.getDailyCount()
  const dailyPct = Math.min(100, Math.round((100 * daily) / DAILY_GOAL))

  const levelText =
    level === 'ready' ? t('readinessReady', lang) : level === 'ontrack' ? t('readinessOntrack', lang) : t('readinessStart', lang)
  const ringColor = level === 'ready' ? '#2ecc71' : level === 'ontrack' ? '#f6b93b' : '#da291c'
  const name = profile?.name ? ` ${profile.name}` : ''

  return (
    <button
      onClick={() => navigate('stats')}
      className="block w-full rounded-3xl bg-white p-4 text-left shadow-card ring-1 ring-gray-200/70 transition-all active:scale-[0.99] dark:bg-gray-800 dark:ring-gray-700"
    >
      <div className="flex items-center gap-4">
        <ProgressRing value={score ?? 4} size={84} stroke={8} color={ringColor}>
          <span className="text-lg font-extrabold text-gray-900 dark:text-gray-100">
            {score != null ? `${score}` : '·'}
          </span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold leading-tight text-gray-900 dark:text-gray-100">
            {t('greeting', lang, { name })} {profile?.emoji}
          </p>
          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
            {score != null ? levelText : t('readinessEmpty', lang)}
          </p>
          {weakTopics.length > 0 && (
            <p className="mt-1 truncate text-xs text-gray-400 dark:text-gray-500">
              {t('weakTopicsLabel', lang)} {weakTopics.map((tp) => topicLabel(tp, lang)).join(' · ')}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
        <span className="flex items-center gap-1 text-sm font-bold text-gray-800 dark:text-gray-200">
          <IconFlame className={`h-4 w-4 ${streak > 0 ? 'flame text-swiss' : 'text-gray-300 dark:text-gray-600'}`} /> {streak}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-swiss to-gold transition-all duration-700"
            style={{ width: `${dailyPct}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {t('dailyGoal', lang)} {Math.min(daily, DAILY_GOAL)}/{DAILY_GOAL}
        </span>
      </div>
    </button>
  )
}

export default function Home({ category, setCategory, navigate, profile }) {
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
  const maneuverCount = maneuversForCategory(category).length

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-5">
      <Hero profile={profile} category={category} navigate={navigate} />

      <div className="flex gap-3">
        <CategoryButton
          active={category === 'B'}
          onClick={() => setCategory('B')}
          icon={<CarIcon className="h-9 w-auto" />}
          label={t('car', lang)}
          sub={t('carSub', lang)}
        />
        <CategoryButton
          active={category === 'A'}
          onClick={() => setCategory('A')}
          icon={<MotoIcon className="h-9 w-auto" />}
          label={t('moto', lang)}
          sub={t('motoSub', lang)}
        />
      </div>

      <div className="flex items-center justify-between rounded-xl bg-white dark:bg-gray-800 px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300 shadow-card ring-1 ring-gray-200/70 dark:ring-gray-700">
        <span className="inline-flex items-center gap-1">
          <IconStack className="h-3.5 w-3.5" /> {pool.length} {t('categoryQuestions', lang)}
        </span>
        <span>
          {seen} {t('progressSeen', lang)} · {mastered} {t('progressMastered', lang)}
        </span>
      </div>

      <div className="space-y-2.5">
        <GroupLabel>{t('groupBefore', lang)}</GroupLabel>
        <MenuButton
          onClick={() => navigate('firstaid')}
          icon={<IconFirstAid className="h-6 w-6" />}
          label={t('menuFirstAid', lang)}
          sub={t('menuFirstAidSub', lang)}
          tint="red"
        />

        <GroupLabel>{t('groupTheory', lang)}</GroupLabel>
        <MenuButton onClick={() => navigate('study')} icon={<IconBookOpen className="h-6 w-6" />} label={t('menuStudy', lang)} sub={t('menuStudySub', lang)} tint="blue" />
        <MenuButton onClick={() => navigate('exam')} icon={<IconStopwatch className="h-6 w-6" />} label={t('menuExam', lang)} sub={t('menuExamSub', lang)} tint="blue" />
        <MenuButton
          onClick={() => navigate('review')}
          icon={<IconRetry className="h-6 w-6" />}
          label={t('menuReview', lang)}
          sub={t('menuReviewSub', lang)}
          badge={failedCount}
          tint="blue"
        />
        <MenuButton
          onClick={() => navigate('signs')}
          icon={<IconWarningSign className="h-6 w-6" />}
          label={t('menuSigns', lang)}
          sub={t('menuSignsSub', lang)}
          tint="blue"
        />

        <GroupLabel>{t('groupPractical', lang)}</GroupLabel>
        <MenuButton onClick={() => navigate('vku')} icon={<IconThoughtBubble className="h-6 w-6" />} label={t('menuVku', lang)} sub={t('menuVkuSub', lang)} tint="green" />
        <MenuButton
          onClick={() => navigate('maneuvers')}
          icon={<IconSteeringWheel className="h-6 w-6" />}
          label={t('menuManeuvers', lang)}
          sub={t('menuManeuversSub', lang)}
          badge={maneuverCount}
          tint="green"
        />
        <MenuButton onClick={() => navigate('tips')} icon={<IconTarget className="h-6 w-6" />} label={t('menuTips', lang)} sub={t('menuTipsSub', lang)} tint="green" />

        <GroupLabel>{t('groupSpecial', lang)}</GroupLabel>
        <MenuButton
          onClick={() => navigate('kontrollfahrt')}
          icon={<IconIdCard className="h-6 w-6" />}
          label={t('menuKontrollfahrt', lang)}
          sub={t('menuKontrollfahrtSub', lang)}
          tint="amber"
        />
        <MenuButton onClick={() => navigate('wab')} icon={<IconGraduationCap className="h-6 w-6" />} label={t('menuWab', lang)} sub={t('menuWabSub', lang)} tint="amber" />

        <div className="pt-1">
          <MenuButton
            onClick={() => navigate('stats')}
            icon={<IconBarChart className="h-6 w-6" />}
            label={t('menuStats', lang)}
            sub={t('menuStatsSub', lang)}
            tint="red"
          />
        </div>
      </div>

      {lastExam && (
        <p className="flex items-center justify-center gap-1 text-center text-xs text-gray-500 dark:text-gray-400">
          {t('lastExam', lang)}:{' '}
          {lastExam.passed ? (
            <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <IconCross className="h-3.5 w-3.5 text-red-500" />
          )}{' '}
          {lastExam.penalty}/{lastExam.maxPenalty} {t('points', lang)}
        </p>
      )}

      <p className="pt-2 text-center text-[11px] leading-relaxed text-gray-400">{t('disclaimer', lang)}</p>
      <p className="text-center text-[11px]">
        <a href="./privacy.html" target="_blank" rel="noreferrer" className="text-gray-400 underline hover:text-swiss">
          {t('privacyPolicy', lang)}
        </a>
      </p>
    </div>
  )
}
