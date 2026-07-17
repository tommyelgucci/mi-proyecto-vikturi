import { useMemo, useState } from 'react'
import questions from '../data/questions.json'
import { useLang, t } from '../i18n'
import { storage } from '../storage'
import { shuffle, isAnswerCorrect } from '../utils'
import QuestionCard from './QuestionCard'
import { IconConfetti, IconRetry, IconCheck, IconCross } from './Icons'

export default function Review() {
  const { lang } = useLang()
  // Instantánea al montar: así la lista no cambia bajo los pies del usuario
  const [queue] = useState(() => {
    const failedIds = new Set(storage.getFailed())
    return shuffle(questions.filter((q) => failedIds.has(q.id)))
  })
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState([])
  const [revealed, setRevealed] = useState(false)

  const question = queue[index]

  if (queue.length === 0 || index >= queue.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
          <IconConfetti className="mx-auto h-10 w-10 text-swiss" />
          <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">{t('noFailed', lang)}</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('noFailedSub', lang)}</p>
        </div>
      </div>
    )
  }

  function toggle(optId) {
    setSelected((sel) => (sel.includes(optId) ? sel.filter((s) => s !== optId) : [...sel, optId]))
  }

  function checkAnswer() {
    const ok = isAnswerCorrect(question, selected)
    storage.recordAnswer(question.id, ok)
    if (ok) storage.removeFailed(question.id)
    setRevealed(true)
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-4">
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {t('question', lang)} {index + 1} {t('of', lang)} {queue.length}
        </span>
        <span className="inline-flex items-center gap-1">
          <IconRetry className="h-3.5 w-3.5" /> {queue.length} {t('failedCount', lang)}
        </span>
      </div>
      <p className="text-xs text-gray-400">{t('reviewHint', lang)}</p>

      <QuestionCard question={question} selected={selected} onToggle={toggle} revealed={revealed} />

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
          onClick={checkAnswer}
          disabled={selected.length === 0}
          className="w-full rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark disabled:opacity-40"
        >
          {t('check', lang)}
        </button>
      )}
    </div>
  )
}
