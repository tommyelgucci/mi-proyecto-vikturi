import { useMemo, useState } from 'react'
import { useLang, t } from '../i18n'
import { storage } from '../storage'
import { shuffle, isAnswerCorrect } from '../utils'
import { FIRSTAID_TOPICS, FIRSTAID_CARDS, FIRSTAID_QUESTIONS } from '../data/firstaid'
import QuestionCard from './QuestionCard'

const QUIZ_SIZE = 10

function HubCard({ onClick, emoji, label, sub, badge }) {
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

function Topics() {
  const { lang } = useLang()
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-3">
      {FIRSTAID_TOPICS.map((topic) => {
        const isOpen = open === topic.id
        return (
          <div key={topic.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <button
              onClick={() => setOpen(isOpen ? null : topic.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="text-2xl">{topic.icon}</span>
              <span className="flex-1 font-semibold text-gray-900">{topic.title[lang]}</span>
              <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {isOpen && (
              <ul className="space-y-3 border-t border-gray-100 p-4 pt-3">
                {topic.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                    <span className="text-swiss">•</span>
                    <span>{b[lang]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Flashcards() {
  const { lang } = useLang()
  const [deck, setDeck] = useState(() => {
    const known = new Set(storage.getFirstAidKnown())
    return shuffle(FIRSTAID_CARDS.filter((c) => !known.has(c.id)))
  })
  const [flipped, setFlipped] = useState(false)
  const knownCount = FIRSTAID_CARDS.length - deck.length

  const card = deck[0]

  function markKnown() {
    storage.addFirstAidKnown(card.id)
    setDeck((d) => d.slice(1))
    setFlipped(false)
  }

  function repeatLater() {
    setDeck((d) => [...d.slice(1), d[0]])
    setFlipped(false)
  }

  function restart() {
    storage.resetFirstAidKnown()
    setDeck(shuffle([...FIRSTAID_CARDS]))
    setFlipped(false)
  }

  if (!card) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
        <p className="text-4xl">🎉</p>
        <p className="mt-3 text-lg font-semibold text-gray-900">{t('cardsAllDone', lang)}</p>
        <p className="mt-1 text-sm text-gray-500">
          {FIRSTAID_CARDS.length}/{FIRSTAID_CARDS.length} {t('cardsLearned', lang)}
        </p>
        <button
          onClick={restart}
          className="mt-4 rounded-xl bg-swiss px-5 py-2.5 font-semibold text-white hover:bg-swiss-dark"
        >
          {t('cardsRestart', lang)}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {t('card', lang)} · {deck.length} ↻
        </span>
        <span>
          ✓ {knownCount}/{FIRSTAID_CARDS.length} {t('cardsLearned', lang)}
        </span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className={`flex min-h-56 w-full flex-col items-center justify-center rounded-2xl p-6 text-center shadow-sm ring-1 transition-colors ${
          flipped ? 'bg-red-50 ring-swiss/40' : 'bg-white ring-gray-200'
        }`}
      >
        <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {flipped ? '🚑' : '❓'}
        </span>
        <span className={`text-lg leading-snug ${flipped ? 'font-bold text-swiss-dark' : 'font-semibold text-gray-900'}`}>
          {flipped ? card.back[lang] : card.front[lang]}
        </span>
        <span className="mt-4 text-xs text-gray-400">👆 {t('tapToFlip', lang)}</span>
      </button>

      <div className="flex gap-2">
        <button
          onClick={repeatLater}
          className="flex-1 rounded-xl bg-white py-3 font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
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

function Quiz() {
  const { lang } = useLang()
  const [round, setRound] = useState(0)
  const questions = useMemo(
    () => shuffle(FIRSTAID_QUESTIONS).slice(0, QUIZ_SIZE),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round],
  )
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState([])
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  const question = questions[index]
  const done = index >= questions.length

  if (done) {
    const msg = score >= 8 ? t('quizMsgGreat', lang) : score >= 5 ? t('quizMsgOk', lang) : t('quizMsgLow', lang)
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
        <p className="text-4xl">{score >= 8 ? '🏆' : score >= 5 ? '👍' : '📖'}</p>
        <p className="mt-3 text-lg font-semibold text-gray-900">
          {t('quizResult', lang)}: {score}/{questions.length}
        </p>
        <p className="mt-1 text-sm text-gray-600">{msg}</p>
        <button
          onClick={() => {
            setRound((r) => r + 1)
            setIndex(0)
            setSelected([])
            setRevealed(false)
            setScore(0)
          }}
          className="mt-4 rounded-xl bg-swiss px-5 py-2.5 font-semibold text-white hover:bg-swiss-dark"
        >
          {t('quizAgain', lang)}
        </button>
      </div>
    )
  }

  function toggle(optId) {
    setSelected((sel) => (sel.includes(optId) ? sel.filter((s) => s !== optId) : [...sel, optId]))
  }

  function check() {
    if (isAnswerCorrect(question, selected)) setScore((s) => s + 1)
    setRevealed(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {t('question', lang)} {index + 1} {t('of', lang)} {questions.length}
        </span>
        <span>✓ {score}</span>
      </div>

      <QuestionCard question={question} selected={selected} onToggle={toggle} revealed={revealed} showTopic={false} />

      {revealed && (
        <p
          className={`text-center text-lg font-bold ${
            isAnswerCorrect(question, selected) ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isAnswerCorrect(question, selected) ? `✅ ${t('correct', lang)}` : `❌ ${t('wrong', lang)}`}
        </p>
      )}

      {revealed ? (
        <button
          onClick={() => {
            setIndex((i) => i + 1)
            setSelected([])
            setRevealed(false)
          }}
          className="w-full rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark"
        >
          {t('next', lang)} →
        </button>
      ) : (
        <button
          onClick={check}
          disabled={selected.length === 0}
          className="w-full rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark disabled:opacity-40"
        >
          {t('check', lang)}
        </button>
      )}
    </div>
  )
}

export default function FirstAid() {
  const { lang } = useLang()
  const [view, setView] = useState('hub') // hub | topics | cards | quiz
  const unknownCards = FIRSTAID_CARDS.length - storage.getFirstAidKnown().length

  if (view !== 'hub') {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-4">
        <button onClick={() => setView('hub')} className="text-sm font-semibold text-swiss">
          ‹ {t('menuFirstAid', lang)}
        </button>
        {view === 'topics' && <Topics />}
        {view === 'cards' && <Flashcards />}
        {view === 'quiz' && <Quiz />}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-5">
      <div className="rounded-2xl bg-red-50 p-4 text-sm leading-relaxed text-red-900 ring-1 ring-red-200">
        ⛑️ {t('faIntro', lang)}
      </div>
      <div className="space-y-3">
        <HubCard onClick={() => setView('topics')} emoji="📖" label={t('faTopics', lang)} sub={t('faTopicsSub', lang)} />
        <HubCard
          onClick={() => setView('cards')}
          emoji="🃏"
          label={t('faCardsTitle', lang)}
          sub={t('faCardsSub', lang)}
          badge={unknownCards}
        />
        <HubCard onClick={() => setView('quiz')} emoji="❓" label={t('faQuizTitle', lang)} sub={t('faQuizSub', lang)} />
      </div>
    </div>
  )
}
