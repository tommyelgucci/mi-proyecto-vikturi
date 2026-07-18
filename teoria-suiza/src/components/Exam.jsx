import { useEffect, useMemo, useState } from 'react'
import { useLang, t } from '../i18n'
import Confetti from './Confetti'
import { storage } from '../storage'
import { examConfig, shuffle, isAnswerCorrect } from '../utils'
import QuestionCard from './QuestionCard'
import { IconStopwatch, IconFlagMark, IconGrid, IconHourglass, IconCheck, IconConfetti, IconSadFace, IconAlarm, IconCross } from './Icons'

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function Overlay({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl sm:rounded-2xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default function Exam({ category, onExit }) {
  const { lang } = useLang()
  const config = useMemo(() => examConfig(category), [category])
  const [phase, setPhase] = useState('intro') // intro | running | result
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { qid: [optionIds] }
  const [flags, setFlags] = useState([]) // [qid]
  const [showNav, setShowNav] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [timeLeft, setTimeLeft] = useState(config.timeLimitSec)
  const [timedOut, setTimedOut] = useState(false)

  function start() {
    setQuestions(shuffle(config.pool).slice(0, config.size))
    setIndex(0)
    setAnswers({})
    setFlags([])
    setShowNav(false)
    setShowSummary(false)
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
    setShowNav(false)
    setShowSummary(false)
    setPhase('result')
  }

  useEffect(() => {
    if (timedOut && phase === 'running') finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedOut])

  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
          <IconStopwatch className="h-8 w-8 text-swiss" />
          <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">{t('examIntroTitle', lang)}</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <li>• {t('examIntro1', lang)}</li>
            <li>• {t('examIntro2', lang, { n: config.size, p: config.maxPenalty })}</li>
            <li>• {t('examIntro3', lang, { t: Math.round(config.timeLimitSec / 60) })}</li>
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">{t('independenceShort', lang)}</p>
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
    const isFlagged = flags.includes(q.id)

    function toggle(optId) {
      setAnswers((a) => {
        const sel = a[q.id] || []
        return { ...a, [q.id]: sel.includes(optId) ? sel.filter((s) => s !== optId) : [...sel, optId] }
      })
    }

    function toggleFlag() {
      setFlags((f) => (f.includes(q.id) ? f.filter((id) => id !== q.id) : [...f, q.id]))
    }

    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="min-w-0 flex-1 font-medium text-gray-700 dark:text-gray-300">
            {t('question', lang)} {index + 1} {t('of', lang)} {questions.length}
          </span>
          <button
            onClick={toggleFlag}
            aria-label={t('flagQuestion', lang)}
            className={`rounded-lg px-2.5 py-1.5 ring-1 transition-colors ${
              isFlagged
                ? 'bg-amber-100 text-amber-600 ring-amber-400 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-500'
                : 'bg-white text-gray-500 ring-gray-300 opacity-60 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-600'
            }`}
          >
            <IconFlagMark className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowNav(true)}
            aria-label={t('navigator', lang)}
            className="rounded-lg bg-white px-2.5 py-1.5 text-gray-600 ring-1 ring-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600"
          >
            <IconGrid className="h-4 w-4" />
          </button>
          <span className={`flex items-center gap-1 font-mono font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
            <IconHourglass className="h-4 w-4" /> {formatTime(timeLeft)}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
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
            className="rounded-xl bg-white px-4 py-3 font-semibold text-gray-700 ring-1 ring-gray-300 disabled:opacity-40 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600"
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
              onClick={() => setShowSummary(true)}
              className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
            >
              ✓ {t('submitExam', lang)}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {answeredCount}/{questions.length} {t('answered', lang)}
          {flags.length > 0 && (
            <span className="inline-flex items-center gap-0.5">
              {' '}
              · <IconFlagMark className="h-3 w-3" /> {flags.length}
            </span>
          )}
          <button onClick={() => setShowSummary(true)} className="ml-2 font-semibold text-swiss underline">
            {t('submitExam', lang)}
          </button>
        </p>

        {showNav && (
          <Overlay onClose={() => setShowNav(false)}>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{t('navigator', lang)}</p>
              <button
                onClick={() => setShowNav(false)}
                className="rounded-lg px-2 py-0.5 text-sm text-gray-500 ring-1 ring-gray-300 dark:text-gray-400 dark:ring-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {questions.map((qq, i) => {
                const answered = (answers[qq.id] || []).length > 0
                const flagged = flags.includes(qq.id)
                let cls = 'bg-gray-100 text-gray-500 ring-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:ring-gray-600'
                if (answered) cls = 'bg-green-100 text-green-800 ring-green-400 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-600'
                if (flagged) cls += ' !ring-2 !ring-amber-400'
                return (
                  <button
                    key={qq.id}
                    onClick={() => {
                      setIndex(i)
                      setShowNav(false)
                    }}
                    className={`relative rounded-lg py-1.5 text-xs font-semibold ring-1 ${cls} ${
                      i === index ? 'outline outline-2 outline-swiss' : ''
                    }`}
                  >
                    {i + 1}
                    {flagged && (
                      <IconFlagMark className="absolute -right-1 -top-1.5 h-2.5 w-2.5 text-amber-500" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-green-400" /> {t('answered', lang)}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-gray-200 ring-1 ring-gray-300 dark:bg-gray-600 dark:ring-gray-500" /> {t('unanswered', lang)}
              </span>
              <span className="inline-flex items-center gap-1">
                <IconFlagMark className="h-3 w-3 text-amber-500" /> {t('flagged', lang)}
              </span>
            </div>
          </Overlay>
        )}

        {showSummary && (
          <Overlay onClose={() => setShowSummary(false)}>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('submitSummaryTitle', lang)}</p>
            <div className="mt-3 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
              <p className="flex items-center gap-1.5">
                <IconCheck className="h-4 w-4 text-emerald-500" /> {answeredCount} {t('answered', lang)}
              </p>
              <p className={`flex items-center gap-1.5 ${questions.length - answeredCount > 0 ? 'font-semibold text-red-600' : ''}`}>
                <span className="h-3 w-3 rounded-sm ring-1 ring-gray-400" /> {questions.length - answeredCount} {t('unanswered', lang)}
              </p>
              <p className="flex items-center gap-1.5">
                <IconFlagMark className="h-4 w-4 text-amber-500" /> {flags.length} {t('flagged', lang)}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowSummary(false)}
                className="flex-1 rounded-xl bg-white py-3 font-semibold text-gray-700 ring-1 ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-600"
              >
                {t('keepReviewing', lang)}
              </button>
              <button
                onClick={finish}
                className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
              >
                ✓ {t('submitNow', lang)}
              </button>
            </div>
          </Overlay>
        )}
      </div>
    )
  }

  // phase === 'result'
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-6">
      {result.passed && <Confetti />}
      <div
        className={`rounded-2xl p-6 text-center shadow-sm ring-1 ${
          result.passed
            ? 'bg-green-50 ring-green-200 dark:bg-green-900/20 dark:ring-green-800'
            : 'bg-red-50 ring-red-200 dark:bg-red-900/20 dark:ring-red-800'
        }`}
      >
        {timedOut && (
          <p className="mb-1 flex items-center justify-center gap-1 text-sm font-semibold text-orange-600">
            <IconAlarm className="h-4 w-4" /> {t('timeUp', lang)}
          </p>
        )}
        <div className={`flex justify-center ${result.passed ? 'text-green-600' : 'text-red-500'}`}>
          {result.passed ? <IconConfetti className="h-14 w-14" /> : <IconSadFace className="h-14 w-14" />}
        </div>
        <h2 className={`mt-2 text-2xl font-bold ${result.passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
          {result.passed ? t('passed', lang) : t('failed', lang)}
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          {t('penaltyPoints', lang)}: <b>{result.penalty}</b> (max. {config.maxPenalty} {t('maxAllowed', lang)})
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
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
          className="flex-1 rounded-xl bg-white py-3 font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-700"
        >
          {t('backHome', lang)}
        </button>
      </div>

      {result.wrongQuestions.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-gray-100">
            <IconCross className="h-5 w-5 text-red-500" /> {t('reviewErrors', lang)} ({result.wrongQuestions.length})
          </h3>
          {result.wrongQuestions.map((q) => (
            <QuestionCard key={q.id} question={q} selected={answers[q.id] || []} onToggle={() => {}} revealed />
          ))}
        </div>
      )}
    </div>
  )
}
