import { useMemo, useState } from 'react'
import { useLang, t, tr } from '../i18n'
import { TOPICS } from '../data/topics'
import { storage } from '../storage'
import { questionsForCategory, shuffle, isAnswerCorrect } from '../utils'
import QuestionCard from './QuestionCard'
import { IconCheck, IconCross } from './Icons'

export default function Study({ category, initialTopic }) {
  const { lang } = useLang()
  const [topic, setTopic] = useState(initialTopic || 'all')
  const [round, setRound] = useState(0) // fuerza rebarajar al reiniciar
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState([])
  const [revealed, setRevealed] = useState(false)

  const pool = useMemo(() => {
    const qs = questionsForCategory(category).filter((q) => topic === 'all' || q.topic === topic)
    return shuffle(qs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, topic, round])

  const availableTopics = useMemo(() => {
    const ids = new Set(questionsForCategory(category).map((q) => q.topic))
    return TOPICS.filter((tp) => ids.has(tp.id))
  }, [category])

  const question = pool[index]
  const done = index >= pool.length

  function selectTopic(id) {
    setTopic(id)
    setIndex(0)
    setSelected([])
    setRevealed(false)
  }

  function toggle(optId) {
    setSelected((sel) => (sel.includes(optId) ? sel.filter((s) => s !== optId) : [...sel, optId]))
  }

  function checkAnswer() {
    const ok = isAnswerCorrect(question, selected)
    storage.recordAnswer(question.id, ok)
    if (ok) storage.removeFailed(question.id)
    else storage.addFailed(question.id)
    setRevealed(true)
  }

  function nextQuestion() {
    setIndex((i) => i + 1)
    setSelected([])
    setRevealed(false)
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-4">
      <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
        <button
          onClick={() => selectTopic('all')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
            topic === 'all' ? 'bg-swiss text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700'
          }`}
        >
          {t('allTopics', lang)}
        </button>
        {availableTopics.map((tp) => (
          <button
            key={tp.id}
            onClick={() => selectTopic(tp.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              topic === tp.id ? 'bg-swiss text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700'
            }`}
          >
            {tr(tp.label, lang)}
          </button>
        ))}
      </div>

      {done ? (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 text-center shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('studyDone', lang)}</p>
          <button
            onClick={() => {
              setRound((r) => r + 1)
              setIndex(0)
              setSelected([])
              setRevealed(false)
            }}
            className="mt-4 rounded-xl bg-swiss px-5 py-2.5 font-semibold text-white hover:bg-swiss-dark"
          >
            {t('studyAgain', lang)}
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('question', lang)} {index + 1} {t('of', lang)} {pool.length}
          </p>

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
              onClick={nextQuestion}
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
        </>
      )}
    </div>
  )
}
