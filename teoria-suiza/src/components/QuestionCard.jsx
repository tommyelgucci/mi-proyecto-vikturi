import { useLang, t } from '../i18n'
import { topicLabel } from '../data/topics'
import { hasMultipleCorrect, canSpeak, speakDe } from '../utils'
import { SIGNS } from '../data/signs'
import SignSprite from './SignSprite'
import SceneDiagram from './SceneDiagram'

function QuestionImage({ image }) {
  if (!image) return null
  if (image.type === 'sign') {
    const sign = SIGNS.find((s) => s.id === image.id)
    return sign ? (
      <div className="my-3 flex justify-center">
        <SignSprite draw={sign.draw} size={110} />
      </div>
    ) : null
  }
  if (image.type === 'scene') {
    return (
      <div className="my-3">
        <SceneDiagram id={image.id} />
      </div>
    )
  }
  return null
}

/**
 * Tarjeta de pregunta compartida por los modos estudio, examen y repaso.
 * - selected: array de ids de opciones marcadas
 * - revealed: si true, muestra corrección (verde/rojo) y bloquea cambios
 */
export default function QuestionCard({ question, selected, onToggle, revealed, showTopic = true }) {
  const { lang } = useLang()
  const multi = hasMultipleCorrect(question)

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
      {showTopic && (
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {topicLabel(question.topic, lang)}
          </span>
          {question.category !== 'both' && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {question.category === 'B' ? '🚗' : '🏍️'} {question.category}
            </span>
          )}
        </div>
      )}

      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
          {question.question[lang]}
        </p>
        {canSpeak() && (
          <button
            onClick={() => speakDe(question.question.de)}
            aria-label={t('listenDe', lang)}
            title={t('listenDe', lang)}
            className="shrink-0 rounded-full p-1 text-lg leading-none opacity-60 hover:opacity-100"
          >
            🔊
          </button>
        )}
      </div>
      <QuestionImage image={question.image} />
      {multi && !revealed && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">☑︎ {t('multiHint', lang)}</p>}

      <div className="mt-4 space-y-2">
        {question.options.map((opt) => {
          const isSelected = selected.includes(opt.id)
          let cls =
            'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:border-gray-500'
          if (!revealed && isSelected)
            cls = 'border-swiss bg-red-50 ring-1 ring-swiss dark:bg-red-900/30'
          if (revealed) {
            if (opt.correct) cls = 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/30'
            else if (isSelected) cls = 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/30'
            else cls = 'border-gray-200 bg-gray-50 opacity-60 dark:border-gray-600 dark:bg-gray-700/50'
          }
          return (
            <button
              key={opt.id}
              disabled={revealed}
              onClick={() => onToggle(opt.id)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${cls}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                  isSelected
                    ? 'border-swiss bg-swiss text-white'
                    : 'border-gray-300 bg-white text-transparent dark:border-gray-500 dark:bg-gray-800'
                } ${revealed && opt.correct ? '!border-green-600 !bg-green-600 !text-white' : ''}`}
              >
                ✓
              </span>
              <span className="text-gray-800 dark:text-gray-200">{opt.text[lang]}</span>
              {revealed && isSelected && !opt.correct && <span className="ml-auto shrink-0">❌</span>}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-900/30 dark:text-blue-200">
          <p className="mb-1 font-semibold">💡 {t('explanation', lang)}</p>
          <p>{question.explanation[lang]}</p>
        </div>
      )}
    </div>
  )
}
