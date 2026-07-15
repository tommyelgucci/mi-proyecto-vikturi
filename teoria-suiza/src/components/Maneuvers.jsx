import { useState } from 'react'
import { useLang, t } from '../i18n'
import { maneuversForCategory } from '../data/maneuvers'
import ManeuverPlayer from './ManeuverPlayer'

export default function Maneuvers({ category }) {
  const { lang } = useLang()
  const [active, setActive] = useState(null)
  const list = maneuversForCategory(category)

  if (active) {
    return <ManeuverPlayer maneuver={active} onBack={() => setActive(null)} />
  }

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center text-sm text-gray-500">{t('maneuversComingSoon', lang)}</div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-3 px-4 py-4">
      {list.map((m) => (
        <button
          key={m.id}
          onClick={() => setActive(m)}
          className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          <span className="text-3xl">{m.icon}</span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-gray-900">{m.title[lang]}</span>
            <span className="block text-sm text-gray-500">
              {m.steps.length} {t('steps', lang)}
            </span>
          </span>
          <span className="text-gray-300">›</span>
        </button>
      ))}
    </div>
  )
}
