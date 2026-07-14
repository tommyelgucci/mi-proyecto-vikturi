import { useEffect, useMemo, useState } from 'react'
import { useLang, t } from '../i18n'
import { storage } from '../storage'
import { examConfig, shuffle, isAnswerCorrect } from '../utils'
import QuestionCard from './QuestionCard'

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function Exam({ category, onExit }) {
  const { lang } = useLang()
  const config = useMemo(() => examConfig(category), [category])
  const [phase, setPhase] = useState('intro') // intro | running | result
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { qid: [optionIds] }
  const [timeLeft, setTimeLeft] = useState(config.timeLimitSec)
  const [timedOut, setTimedOut] = useState(false)

  function start() {
    setQuestions(shuffle(config.pool).slice(0, config.size))
    setIndex(0)
    setAnswers({})
    setTimeLeft(config.timeLimitSec)
    setTimedOut(false)
    setPhase('running')
  }

  useEffect(() => {
    if (phase !== 'running') return
    const id = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          setTimedOut(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  const result = useMemo(() => {
    if (phase !== 'result') return null
    let penalty = 0
    let correct = 0
    const wrongQuestions = []
    for (const q of questions) {
      const sel = answers[q.id] || []
      if (isAnswerCorrect(q, sel)) correct += 1
      else {
        penalty += q.points || 3
        wrongQuestions.push(q)
      }
    }
    return { penalty, correct, wrongQuestions, passed: penalty <= config.maxPenalty }
  }, [phase, questions, answers, config.maxPenalty])

  function finish() {
    let penalty = 0
    for (const q of questions) {
      const sel = answers[q.id] || []
      const ok = isAnswerCorrect(q, sel)
      storage.recordAnswer(q.id, ok)
      if (ok) storage.removeFailed(q.id)
      else {
        storage.addFailed(q.id)
        penalty += q.points || 3
      }
    }
    storage.addExamResult({
      date: new Date().toISOString(),
      category,
      size: questions.length,
      penalty,
      maxPenalty: config.maxPenalty,
      passed: penalty <= config.maxPenalty,
    })
    setPhase('result')
  }

  useEffect(() => {
    if (timedOut && phase === 'running') finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedOut])

  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <p className="text-3xl">⏱️</p>
          <h2 className="mt-2 text-xl font-bold text-gray-900">{t('examIntroTitle', lang)}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
            <li>• {t('examIntro1', lang)}</li>
            <li>• {t('examIntro2', lang, { n: config.size, p: config.maxPenalty })}</li>
            <li>• {t('examIntro3', lang, { t: Math.round(config.timeLimitSec / 60) })}</li>
          </ul>
        </div>
        <button
          onClick={start}
          className="w-full rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark"
        >
          {t('startExam', lang)} →
        </button>
      </div>
    )
  }

  if (phase === 'running') {
    const q = questions[index]
    const selected = answers[q.id] || []
    const answeredCount = questions.filter((qq) => (answers[qq.id] || []).length > 0).length

    function toggle(optId) {
      setAnswers((a) => {
        const sel = a[q.id] || []
        return { ...a, [q.id]: sel.includes(optId) ? sel.filter((s) => s !== optId) : [...sel, optId] }
      })
    }

    function trySubmit() {
      if (answeredCount < questions.length && !window.confirm(t('confirmSubmit', lang))) return
      finish()
    }

    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            {t('question', lang)} {index + 1} {t('of', lang)} {questions.length}
          </span>
          <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
            ⏳ {formatTime(timeLeft)}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-swiss transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>

        <QuestionCard question={q} selected={selected} onToggle={toggle} revealed={false} showTopic={false} />

        <div className="flex gap-2">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="rounded-xl bg-white px-4 py-3 font-semibold text-gray-700 ring-1 ring-gray-300 disabled:opacity-40"
          >
            ←
          </button>
          {index < questions.length - 1 ? (
            <button
              onClick={() => setIndex((i) => i + 1)}
              className="flex-1 rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark"
            >
              {t('next', lang)} →
            </button>
          ) : (
            <button
              onClick={trySubmit}
              className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
            >
              ✓ {t('submitExam', lang)}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-500">
          {answeredCount}/{questions.length} {t('answered', lang)}
          {answeredCount === questions.length && index < questions.length - 1 && (
            <button onClick={trySubmit} className="ml-2 font-semibold text-swiss underline">
              {t('submitExam', lang)}
            </button>
          )}
        </p>
      </div>
    )
  }

  // phase === 'result'
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-6">
      <div
        className={`rounded-2xl p-6 text-center shadow-sm ring-1 ${
          result.passed ? 'bg-green-50 ring-green-200' : 'bg-red-50 ring-red-200'
        }`}
      >
        {timedOut && <p className="mb-1 text-sm font-semibold text-orange-600">⏰ {t('timeUp', lang)}</p>}
        <p className="text-5xl">{result.passed ? '🎉' : '😓'}</p>
        <h2 className={`mt-2 text-2xl font-bold ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
          {result.passed ? t('passed', lang) : t('failed', lang)}
        </h2>
        <p className="mt-2 text-gray-700">
          {t('penaltyPoints', lang)}: <b>{result.penalty}</b> (max. {config.maxPenalty} {t('maxAllowed', lang)})
        </p>
        <p className="text-sm text-gray-500">
          {result.correct}/{questions.length} {t('correctAnswers', lang)}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={start}
          className="flex-1 rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark"
        >
          {t('newExam', lang)}
        </button>
        <button
          onClick={onExit}
          className="flex-1 rounded-xl bg-white py-3 font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
        >
          {t('backHome', lang)}
        </button>
      </div>

      {result.wrongQuestions.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-gray-900">
            ❌ {t('reviewErrors', lang)} ({result.wrongQuestions.length})
          </h3>
          {result.wrongQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} selected={answers[q.id] || []} onToggle={() => {}} revealed />
          ))}
        </div>
      )}
    </div>
  )
}
