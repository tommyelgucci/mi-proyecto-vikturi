import { useState } from 'react'
import { useLang, t, tr } from '../i18n'
import { maneuversForCategory } from '../data/maneuvers'
import ManeuverPlayer from './ManeuverPlayer'
import { Icon } from './Icons'

export default function Maneuvers({ category }) {
  const { lang } = useLang()
  const [active, setActive] = useState(null)
  const list = maneuversForCategory(category)

  if (active) {
    return <ManeuverPlayer maneuver={active} onBack={() => setActive(null)} />
  }

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">{t('maneuversComingSoon', lang)}</div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-3 px-4 py-4">
      {list.map((m) => (
        <button
          key={m.id}
          onClick={() => setActive(m)}
          className="flex w-full items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 p-4 text-left shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-swiss dark:bg-red-900/40 dark:text-red-300">
            <Icon name={m.icon} className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-gray-900 dark:text-gray-100">{tr(m.title, lang)}</span>
            <span className="block text-sm text-gray-500 dark:text-gray-400">
              {m.variants ? `${m.variants.length} ${t('techniques', lang)}` : `${m.steps.length} ${t('steps', lang)}`}
            </span>
          </span>
          <span className="text-gray-300">›</span>
        </button>
      ))}
    </div>
  )
}
