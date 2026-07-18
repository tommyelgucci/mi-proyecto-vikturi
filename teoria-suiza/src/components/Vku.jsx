import { useMemo, useState } from 'react'
import { useLang, t, tr, dateLocale } from '../i18n'
import { storage } from '../storage'
import { shuffle, isAnswerCorrect, canSpeak, speakDe } from '../utils'
import { VKU_BLOCKS, VKU_CARDS, VKU_QUESTIONS, VKU_LINKS } from '../data/vku'
import QuestionCard from './QuestionCard'
import Confetti from './Confetti'
import {
  IconThoughtBubble,
  IconBookOpen,
  IconCards,
  IconQuestionBubble,
  IconConfetti,
  IconBulb,
  IconTap,
  IconSpeaker,
  IconTrophy,
  IconThumbsUp,
  IconCheck,
  IconCross,
  IconExternalLink,
  Icon,
} from './Icons'

function HubCard({ onClick, icon, label, sub, badge }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 p-4 text-left shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600"
    >
      <span className="text-swiss dark:text-red-300">{icon}</span>
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

function Blocks() {
  const { lang } = useLang()
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-3">
      {VKU_BLOCKS.map((block) => {
        const isOpen = open === block.id
        return (
          <div key={block.id} className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
            <button
              onClick={() => setOpen(isOpen ? null : block.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-swiss dark:bg-red-900/40 dark:text-red-300">
                <Icon name={block.icon} className="h-5 w-5" />
              </span>
              <span className="flex-1 font-semibold text-gray-900 dark:text-gray-100">{tr(block.title, lang)}</span>
              <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {isOpen && (
              <ul className="space-y-3 border-t border-gray-100 dark:border-gray-700 p-4 pt-3">
                {block.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    <span className="text-swiss">•</span>
                    <span>{tr(b, lang)}</span>
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
    const dueIds = new Set(storage.srsDueIds('vku', VKU_CARDS.map((c) => c.id)))
    return shuffle(VKU_CARDS.filter((c) => dueIds.has(c.id)))
  })
  const [flipped, setFlipped] = useState(false)
  const { inReview } = storage.srsCounts('vku', VKU_CARDS.map((c) => c.id))

  const card = deck[0]

  if (!card) {
    const nextDue = storage.srsNextDue('vku')
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <IconConfetti className="mx-auto h-10 w-10 text-swiss" />
        <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">{t('allCaughtUp', lang)}</p>
        {nextDue && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('nextReview', lang)}: {new Date(nextDue).toLocaleDateString(dateLocale(lang))}
          </p>
        )}
        <button
          onClick={() => {
            setDeck(shuffle([...VKU_CARDS]))
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
        <span className="inline-flex items-center gap-1">
          <IconCards className="h-4 w-4" /> {deck.length} {t('dueToday', lang)}
        </span>
        <span className="flex items-center gap-2">
          {canSpeak() && (
            <button
              onClick={() => speakDe(flipped ? card.back.de : card.front.de)}
              aria-label={t('listenDe', lang)}
              className="rounded-full opacity-70 hover:opacity-100"
            >
              <IconSpeaker className="h-4 w-4" />
            </button>
          )}
          ✓ {inReview}/{VKU_CARDS.length} {t('cardsLearned', lang)}
        </span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className={`flex min-h-56 w-full flex-col items-center justify-center rounded-2xl p-6 text-center shadow-sm ring-1 transition-colors ${
          flipped ? 'bg-red-50 dark:bg-red-900/30 ring-swiss/40' : 'bg-white dark:bg-gray-800 ring-gray-200 dark:ring-gray-700'
        }`}
      >
        <span className="mb-2 text-gray-400">
          {flipped ? <IconBulb className="h-6 w-6" /> : <IconQuestionBubble className="h-6 w-6" />}
        </span>
        <span className={`text-lg leading-snug ${flipped ? 'font-bold text-swiss-dark dark:text-red-300' : 'font-semibold text-gray-900 dark:text-gray-100'}`}>
          {flipped ? tr(card.back, lang) : tr(card.front, lang)}
        </span>
        <span className="mt-4 inline-flex items-center gap-1 text-xs text-gray-400">
          <IconTap className="h-3.5 w-3.5" /> {t('tapToFlip', lang)}
        </span>
      </button>

      <div className="flex gap-2">
        <button
          onClick={() => {
            storage.srsDemote('vku', card.id)
            setDeck((d) => [...d.slice(1), d[0]])
            setFlipped(false)
          }}
          className="flex-1 rounded-xl bg-white dark:bg-gray-800 py-3 font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          ↻ {t('repeatCard', lang)}
        </button>
        <button
          onClick={() => {
            storage.srsPromote('vku', card.id)
            setDeck((d) => d.slice(1))
            setFlipped(false)
          }}
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
    () => shuffle(VKU_QUESTIONS),
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
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        {score >= questions.length * 0.8 && <Confetti />}
        <div className="flex justify-center text-swiss">
          {score >= 8 ? (
            <IconTrophy className="h-10 w-10" />
          ) : score >= 5 ? (
            <IconThumbsUp className="h-10 w-10" />
          ) : (
            <IconBookOpen className="h-10 w-10" />
          )}
        </div>
        <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('quizResult', lang)}: {score}/{questions.length}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{msg}</p>
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {t('question', lang)} {index + 1} {t('of', lang)} {questions.length}
        </span>
        <span>✓ {score}</span>
      </div>

      <QuestionCard
        question={question}
        selected={selected}
        onToggle={(optId) => setSelected((sel) => (sel.includes(optId) ? sel.filter((s) => s !== optId) : [...sel, optId]))}
        revealed={revealed}
        showTopic={false}
      />

      {revealed && (
        <p
          className={`flex items-center justify-center gap-1.5 text-center text-lg font-bold ${
            isAnswerCorrect(question, selected) ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isAnswerCorrect(question, selected) ? (
            <>
              <IconCheck className="h-5 w-5" /> {t('correct', lang)}
            </>
          ) : (
            <>
              <IconCross className="h-5 w-5" /> {t('wrong', lang)}
            </>
          )}
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
          onClick={() => {
            if (isAnswerCorrect(question, selected)) setScore((s) => s + 1)
            storage.touchStudyDay()
            setRevealed(true)
          }}
          disabled={selected.length === 0}
          className="w-full rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark disabled:opacity-40"
        >
          {t('check', lang)}
        </button>
      )}
    </div>
  )
}

export default function Vku() {
  const { lang } = useLang()
  const [view, setView] = useState('hub') // hub | blocks | cards | quiz
  const dueCards = storage.srsDueIds('vku', VKU_CARDS.map((c) => c.id)).length

  if (view !== 'hub') {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-4">
        <button onClick={() => setView('hub')} className="text-sm font-semibold text-swiss">
          ‹ {t('menuVku', lang)}
        </button>
        {view === 'blocks' && <Blocks />}
        {view === 'cards' && <Flashcards />}
        {view === 'quiz' && <Quiz />}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-5">
      <div className="flex items-start gap-2 rounded-2xl bg-red-50 dark:bg-red-900/30 p-4 text-sm leading-relaxed text-red-900 dark:text-red-200 ring-1 ring-red-200 dark:ring-red-800">
        <IconThoughtBubble className="mt-0.5 h-4 w-4 shrink-0" /> {t('vkuIntro', lang)}
      </div>
      <div className="space-y-3">
        <HubCard onClick={() => setView('blocks')} icon={<IconBookOpen className="h-8 w-8" />} label={t('vkuBlocksTitle', lang)} sub={t('vkuBlocksSub', lang)} />
        <HubCard
          onClick={() => setView('cards')}
          icon={<IconCards className="h-8 w-8" />}
          label={t('faCardsTitle', lang)}
          sub={t('faCardsSub', lang)}
          badge={dueCards}
        />
        <HubCard onClick={() => setView('quiz')} icon={<IconQuestionBubble className="h-8 w-8" />} label={t('faQuizTitle', lang)} sub={t('vkuQuizSub', lang)} />
      </div>
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <h3 className="mb-2 flex items-center gap-1.5 font-bold text-gray-900 dark:text-gray-100">
          <IconExternalLink className="h-5 w-5" /> {t('officialLinks', lang)}
        </h3>
        <ul className="space-y-1.5">
          {VKU_LINKS.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-swiss underline">
                {tr(l.label, lang)} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
