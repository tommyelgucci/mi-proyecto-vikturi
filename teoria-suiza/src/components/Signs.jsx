import { useMemo, useState } from 'react'
import { useLang, t } from '../i18n'
import { storage } from '../storage'
import { shuffle, canSpeak, speakDe } from '../utils'
import { SIGN_CATEGORIES, SIGNS } from '../data/signs'
import SignSprite from './SignSprite'

const QUIZ_SIZE = 10

function HubCard({ onClick, emoji, label, sub, badge }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 p-4 text-left shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600"
    >
      <span className="text-3xl">{emoji}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-gray-900 dark:text-gray-100">{label}</span>
        <span className="block text-sm text-gray-500 dark:text-gray-400">{sub}</span>
      </span>
      {badge != null && badge > 0 && (
        <span className="rounded-full bg-swiss px-2.5 py-0.5 text-sm font-bold text-white">{badge}</span>
      )}
      <span className="text-gray-300">›</span>
    </button>
  )
}

function Explore() {
  const { lang } = useLang()
  const [category, setCategory] = useState(SIGN_CATEGORIES[0].id)
  const [openSign, setOpenSign] = useState(null)
  const signs = SIGNS.filter((s) => s.category === category)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
        {SIGN_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setCategory(c.id)
              setOpenSign(null)
            }}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              category === c.id ? 'bg-swiss text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700'
            }`}
          >
            {c.label[lang]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {signs.map((sign) => (
          <button
            key={sign.id}
            onClick={() => setOpenSign(openSign === sign.id ? null : sign.id)}
            className={`flex flex-col items-center gap-1 rounded-2xl bg-white dark:bg-gray-800 p-2.5 shadow-sm ring-1 transition-colors ${
              openSign === sign.id ? 'ring-swiss' : 'ring-gray-200 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <SignSprite draw={sign.draw} size={72} />
            <span className="text-center text-[10px] leading-tight text-gray-600 dark:text-gray-300">{sign.name[lang]}</span>
          </button>
        ))}
      </div>

      {openSign && (
        <SignDetail sign={SIGNS.find((s) => s.id === openSign)} />
      )}
    </div>
  )
}

function SignDetail({ sign }) {
  const { lang } = useLang()
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-swiss/40">
      <SignSprite draw={sign.draw} size={80} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="min-w-0 flex-1 font-bold text-gray-900 dark:text-gray-100">{sign.name[lang]}</p>
          {canSpeak() && (
            <button
              onClick={() => speakDe(`${sign.name.de}. ${sign.meaning.de}`)}
              aria-label={t('listenDe', lang)}
              className="shrink-0 rounded-full text-base opacity-70 hover:opacity-100"
            >
              🔊
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-400">{sign.name[lang === 'de' ? 'es' : 'de']}</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{sign.meaning[lang]}</p>
      </div>
    </div>
  )
}

function Flashcards() {
  const { lang } = useLang()
  const [deck, setDeck] = useState(() => {
    const dueIds = new Set(storage.srsDueIds('signs', SIGNS.map((s) => s.id)))
    return shuffle(SIGNS.filter((s) => dueIds.has(s.id)))
  })
  const [flipped, setFlipped] = useState(false)
  const { inReview } = storage.srsCounts('signs', SIGNS.map((s) => s.id))
  const sign = deck[0]

  function markKnown() {
    storage.srsPromote('signs', sign.id)
    setDeck((d) => d.slice(1))
    setFlipped(false)
  }

  function repeatLater() {
    storage.srsDemote('signs', sign.id)
    setDeck((d) => [...d.slice(1), d[0]])
    setFlipped(false)
  }

  if (!sign) {
    const nextDue = storage.srsNextDue('signs')
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <p className="text-4xl">🎉</p>
        <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">{t('allCaughtUp', lang)}</p>
        {nextDue && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('nextReview', lang)}: {new Date(nextDue).toLocaleDateString(lang === 'de' ? 'de-CH' : 'es-ES')}
          </p>
        )}
        <button
          onClick={() => {
            setDeck(shuffle([...SIGNS]))
            setFlipped(false)
          }}
          className="mt-4 rounded-xl bg-swiss px-5 py-2.5 font-semibold text-white hover:bg-swiss-dark"
        >
          {t('practiceAnyway', lang)}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          🃏 {deck.length} {t('dueToday', lang)}
        </span>
        <span className="flex items-center gap-2">
          {canSpeak() && (
            <button
              onClick={() => speakDe(`${sign.name.de}. ${sign.meaning.de}`)}
              aria-label={t('listenDe', lang)}
              className="rounded-full text-base opacity-70 hover:opacity-100"
            >
              🔊
            </button>
          )}
          ✓ {inReview}/{SIGNS.length} {t('cardsLearned', lang)}
        </span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className={`flex min-h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center shadow-sm ring-1 transition-colors ${
          flipped ? 'bg-red-50 dark:bg-red-900/30 ring-swiss/40' : 'bg-white dark:bg-gray-800 ring-gray-200 dark:ring-gray-700'
        }`}
      >
        {flipped ? (
          <>
            <span className="text-lg font-bold leading-snug text-swiss-dark dark:text-red-300">{sign.name[lang]}</span>
            <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{sign.meaning[lang]}</span>
          </>
        ) : (
          <SignSprite draw={sign.draw} size={130} />
        )}
        <span className="mt-1 text-xs text-gray-400">👆 {t('tapToFlip', lang)}</span>
      </button>

      <div className="flex gap-2">
        <button
          onClick={repeatLater}
          className="flex-1 rounded-xl bg-white dark:bg-gray-800 py-3 font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          ↻ {t('repeatCard', lang)}
        </button>
        <button
          onClick={markKnown}
          className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
        >
          ✓ {t('iKnowIt', lang)}
        </button>
      </div>
    </div>
  )
}

function buildQuizRounds() {
  const pool = shuffle(SIGNS).slice(0, QUIZ_SIZE)
  return pool.map((sign) => {
    const sameCat = SIGNS.filter((s) => s.category === sign.category && s.id !== sign.id)
    const others = SIGNS.filter((s) => s.category !== sign.category && s.id !== sign.id)
    const distractors = shuffle(sameCat).slice(0, 3)
    if (distractors.length < 3) distractors.push(...shuffle(others).slice(0, 3 - distractors.length))
    return { sign, options: shuffle([sign, ...distractors]) }
  })
}

function Quiz() {
  const { lang } = useLang()
  const [round, setRound] = useState(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rounds = useMemo(() => buildQuizRounds(), [round])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  const current = rounds[index]
  const done = index >= rounds.length

  if (done) {
    const msg = score >= 8 ? t('quizMsgGreat', lang) : score >= 5 ? t('quizMsgOk', lang) : t('quizMsgLow', lang)
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <p className="text-4xl">{score >= 8 ? '🏆' : score >= 5 ? '👍' : '📖'}</p>
        <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('quizResult', lang)}: {score}/{rounds.length}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{msg}</p>
        <button
          onClick={() => {
            setRound((r) => r + 1)
            setIndex(0)
            setPicked(null)
            setScore(0)
          }}
          className="mt-4 rounded-xl bg-swiss px-5 py-2.5 font-semibold text-white hover:bg-swiss-dark"
        >
          {t('quizAgain', lang)}
        </button>
      </div>
    )
  }

  const revealed = picked !== null
  const isCorrect = revealed && picked === current.sign.id

  function pick(id) {
    if (revealed) return
    setPicked(id)
    storage.touchStudyDay()
    if (id === current.sign.id) setScore((s) => s + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {t('question', lang)} {index + 1} {t('of', lang)} {rounds.length}
        </span>
        <span>✓ {score}</span>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <p className="text-center font-semibold text-gray-900 dark:text-gray-100">{t('whatSign', lang)}</p>
        <div className="mt-2 flex justify-center">
          <SignSprite draw={current.sign.draw} size={120} />
        </div>
        <div className="mt-3 space-y-2">
          {current.options.map((opt) => {
            let cls = 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500'
            if (revealed) {
              if (opt.id === current.sign.id) cls = 'border-green-500 bg-green-50 dark:bg-green-900/30'
              else if (opt.id === picked) cls = 'border-red-500 bg-red-50 dark:bg-red-900/30'
              else cls = 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 opacity-60'
            }
            return (
              <button
                key={opt.id}
                disabled={revealed}
                onClick={() => pick(opt.id)}
                className={`w-full rounded-xl border p-3 text-left text-sm text-gray-800 dark:text-gray-200 transition-colors ${cls}`}
              >
                {opt.name[lang]}
              </button>
            )
          })}
        </div>
        {revealed && (
          <div className="mt-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 p-3 text-sm text-blue-900 dark:text-blue-200">
            <p className="mb-1 font-semibold">💡 {t('explanation', lang)}</p>
            <p>{current.sign.meaning[lang]}</p>
          </div>
        )}
      </div>

      {revealed && (
        <p className={`text-center text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? `✅ ${t('correct', lang)}` : `❌ ${t('wrong', lang)}`}
        </p>
      )}

      {revealed && (
        <button
          onClick={() => {
            setIndex((i) => i + 1)
            setPicked(null)
          }}
          className="w-full rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark"
        >
          {t('next', lang)} →
        </button>
      )}
    </div>
  )
}

export default function Signs() {
  const { lang } = useLang()
  const [view, setView] = useState('hub') // hub | explore | cards | quiz
  const unknown = storage.srsDueIds('signs', SIGNS.map((s) => s.id)).length

  if (view !== 'hub') {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-4">
        <button onClick={() => setView('hub')} className="text-sm font-semibold text-swiss">
          ‹ {t('menuSigns', lang)}
        </button>
        {view === 'explore' && <Explore />}
        {view === 'cards' && <Flashcards />}
        {view === 'quiz' && <Quiz />}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-5">
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700">
        🚸 {t('signsIntro', lang)}
      </div>
      <div className="space-y-3">
        <HubCard onClick={() => setView('explore')} emoji="📚" label={t('signsExplore', lang)} sub={t('signsExploreSub', lang)} />
        <HubCard
          onClick={() => setView('cards')}
          emoji="🃏"
          label={t('faCardsTitle', lang)}
          sub={t('signsCardsSub', lang)}
          badge={unknown}
        />
        <HubCard onClick={() => setView('quiz')} emoji="❓" label={t('faQuizTitle', lang)} sub={t('signsQuizSub', lang)} />
      </div>
    </div>
  )
}
