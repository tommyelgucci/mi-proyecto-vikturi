import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang, t } from '../i18n'
import { CANVAS } from '../data/maneuvers'
import CarSprite from './CarSprite'
import MotoSprite from './MotoSprite'
import { SceneElement, SceneDefs } from './SceneElements'

function easeInOutQuad(p) {
  return p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2
}

function sampleKeyframes(keyframes, progress) {
  const eased = easeInOutQuad(Math.min(1, Math.max(0, progress)))
  if (keyframes.length === 1) return keyframes[0]
  let i = 0
  while (i < keyframes.length - 2 && eased > keyframes[i + 1].t) i++
  const a = keyframes[i]
  const b = keyframes[i + 1]
  const span = b.t - a.t || 1
  const local = (eased - a.t) / span
  return {
    x: a.x + (b.x - a.x) * local,
    y: a.y + (b.y - a.y) * local,
    angle: a.angle + (b.angle - a.angle) * local,
  }
}

function WheelBadge({ wheel, reverse }) {
  if (!wheel && !reverse) return null
  return (
    <g transform="translate(12 460)">
      <rect width={78} height={62} rx={9} fill="#1c2024" stroke="#ffd23f" strokeWidth={2} strokeDasharray="5 4" />
      {wheel && (
        <g transform="translate(31 31)">
          <circle r={15} fill="none" stroke="#e9edf0" strokeWidth={2.5} />
          <circle r={3} fill="#e9edf0" />
          {[90, 210, 330].map((a) => (
            <line
              key={a}
              x1={0}
              y1={0}
              x2={0}
              y2={-15}
              stroke="#e9edf0"
              strokeWidth={2}
              transform={`rotate(${a})`}
            />
          ))}
          {wheel === 'left' && (
            <path
              d="M 0 -21 A 21 21 0 0 0 -21 0"
              stroke="#ffd23f"
              strokeWidth={2.8}
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#wheelArrow)"
            />
          )}
          {wheel === 'right' && (
            <path
              d="M 0 -21 A 21 21 0 0 1 21 0"
              stroke="#ffd23f"
              strokeWidth={2.8}
              fill="none"
              strokeLinecap="round"
              markerEnd="url(#wheelArrow)"
            />
          )}
        </g>
      )}
      {reverse && (
        <g transform="translate(62 14)">
          <circle r={10} fill="#d21f1f" />
          <text x={0} y={4} textAnchor="middle" fontSize={12} fontWeight="800" fill="#fff">
            R
          </text>
        </g>
      )}
    </g>
  )
}

export default function ManeuverPlayer({ maneuver, onBack }) {
  const { lang } = useLang()
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const hasVariants = !!maneuver.variants
  const [variantIndex, setVariantIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  const steps = hasVariants ? maneuver.variants[variantIndex].steps : maneuver.steps
  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  useEffect(() => {
    if (!playing || reducedMotion) return undefined

    function tick(now) {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const p = Math.min(1, elapsed / step.duration)
      setProgress(p)
      if (p >= 1) {
        const timeout = setTimeout(() => {
          if (!isLastStep) {
            setStepIndex((i) => i + 1)
            setProgress(0)
            startRef.current = null
            rafRef.current = requestAnimationFrame(tick)
          } else {
            setPlaying(false)
          }
        }, 450)
        rafRef.current = null
        return () => clearTimeout(timeout)
      }
      rafRef.current = requestAnimationFrame(tick)
      return undefined
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, stepIndex])

  function goToStep(i, finalPose = true) {
    setPlaying(false)
    startRef.current = null
    setStepIndex(i)
    setProgress(finalPose ? 1 : 0)
  }

  function handlePlay() {
    if (isLastStep && progress >= 1) {
      startRef.current = null
      setStepIndex(0)
      setProgress(0)
    } else if (progress >= 1) {
      startRef.current = null
      setProgress(0)
    } else {
      startRef.current = null
    }
    setPlaying(true)
  }

  function handleRestart() {
    setPlaying(false)
    startRef.current = null
    setStepIndex(0)
    setProgress(reducedMotion ? 1 : 0)
  }

  function selectVariant(i) {
    if (i === variantIndex) return
    setVariantIndex(i)
    setPlaying(false)
    startRef.current = null
    setStepIndex(0)
    setProgress(reducedMotion ? 1 : 0)
  }

  const egoPose = sampleKeyframes(step.keyframes, progress)

  return (
    <div className="mx-auto max-w-xl space-y-3 px-4 py-4">
      <button onClick={onBack} className="text-sm font-semibold text-swiss">
        ‹ {t('backToList', lang)}
      </button>

      {hasVariants && (
        <div className="flex gap-2">
          {maneuver.variants.map((v, i) => (
            <button
              key={v.id}
              onClick={() => selectVariant(i)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                i === variantIndex
                  ? 'bg-swiss text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 ring-1 ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {v.label[lang]}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <svg viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`} className="block w-full" style={{ maxHeight: '62vh' }}>
          <SceneDefs />
          <marker id="wheelArrow" markerWidth={7} markerHeight={7} refX={3.5} refY={3.5} orient="auto">
            <path d="M 0 0 L 7 3.5 L 0 7 Z" fill="#ffd23f" />
          </marker>
          {maneuver.scene.elements.map((el, i) => (
            <SceneElement key={i} el={el} />
          ))}

          {step.guides?.map((g, i) => (
            <g key={i}>
              <line
                x1={g.x1}
                y1={g.y1}
                x2={g.x2}
                y2={g.y2}
                stroke="#22c3dd"
                strokeWidth={2}
                strokeDasharray="7 6"
                strokeLinecap="round"
              />
              <circle cx={g.x2} cy={g.y2} r={3} fill="#22c3dd" />
            </g>
          ))}

          {step.extraCars?.map((ec, i) => {
            const pose = sampleKeyframes(ec.keyframes, progress)
            return (
              <CarSprite
                key={i}
                x={pose.x}
                y={pose.y}
                angle={pose.angle}
                color={ec.color}
                blinker={ec.blinker}
                reverseLights={ec.reverseLights}
                braking={ec.braking}
              />
            )
          })}

          {maneuver.vehicle === 'moto' ? (
            <MotoSprite
              x={egoPose.x}
              y={egoPose.y}
              angle={egoPose.angle}
              color="#ffffff"
              braking={!!step.braking}
              steer={step.steer ?? 0}
            />
          ) : (
            <CarSprite
              x={egoPose.x}
              y={egoPose.y}
              angle={egoPose.angle}
              color="#ffffff"
              blinker={step.blinker}
              reverseLights={!!step.reverse}
              braking={!!step.braking}
              showWheels
              steer={step.steer ?? (step.wheel === 'left' ? -30 : step.wheel === 'right' ? 30 : 0)}
            />
          )}

          {step.gapBadge && (
            <SceneElement
              el={{ type: step.gapBadge, x: egoPose.x + 26, y: egoPose.y - 46 }}
            />
          )}

          {step.callout && (
            <g transform={`translate(${egoPose.x + 20} ${egoPose.y - 70})`}>
              <rect x={0} y={0} width={100} height={30} rx={8} fill="#1c2024" />
              <polygon points="10,30 20,30 8,40" fill="#1c2024" />
              <text x={50} y={20} textAnchor="middle" fontSize={12} fontWeight="700" fill="#ffd23f">
                {step.callout[lang]}
              </text>
            </g>
          )}

          <WheelBadge wheel={step.wheel} reverse={!!step.reverse} />
        </svg>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-swiss">
          {t('step', lang)} {stepIndex + 1} {t('of', lang)} {steps.length}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-gray-800 dark:text-gray-200">{step.caption[lang]}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => goToStep(Math.max(0, stepIndex - 1))}
          disabled={stepIndex === 0}
          aria-label={t('prevStep', lang)}
          className="rounded-full bg-white dark:bg-gray-800 px-3.5 py-2.5 text-lg ring-1 ring-gray-300 dark:ring-gray-600 disabled:opacity-30"
        >
          ‹
        </button>

        {!reducedMotion && (
          <button
            onClick={playing ? () => setPlaying(false) : handlePlay}
            className="flex items-center gap-2 rounded-full bg-swiss px-5 py-2.5 font-semibold text-white hover:bg-swiss-dark"
          >
            {playing ? `⏸ ${t('pause', lang)}` : `▶ ${t('play', lang)}`}
          </button>
        )}

        <button
          onClick={handleRestart}
          aria-label={t('restart', lang)}
          className="rounded-full bg-white dark:bg-gray-800 px-3.5 py-2.5 text-lg ring-1 ring-gray-300 dark:ring-gray-600"
        >
          ⟲
        </button>

        <button
          onClick={() => goToStep(Math.min(steps.length - 1, stepIndex + 1))}
          disabled={isLastStep}
          aria-label={t('nextStep', lang)}
          className="rounded-full bg-white dark:bg-gray-800 px-3.5 py-2.5 text-lg ring-1 ring-gray-300 dark:ring-gray-600 disabled:opacity-30"
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-1.5 pt-1">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => goToStep(i)}
            aria-label={`${t('step', lang)} ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === stepIndex ? 'w-6 bg-swiss' : 'w-2 bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
