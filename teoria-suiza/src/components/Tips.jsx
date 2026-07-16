import { useState } from 'react'
import tips from '../data/tips.json'
import { useLang } from '../i18n'

export default function Tips({ category }) {
  const { lang } = useLang()
  const [open, setOpen] = useState(null)
  const sections = tips.filter((s) => s.category === category || s.category === 'both')

  return (
    <div className="mx-auto max-w-xl space-y-3 px-4 py-4">
      {sections.map((section) => {
        const isOpen = open === section.id
        return (
          <div key={section.id} className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
            <button
              onClick={() => setOpen(isOpen ? null : section.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="text-2xl">{section.icon}</span>
              <span className="flex-1 font-semibold text-gray-900 dark:text-gray-100">{section.title[lang]}</span>
              <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {isOpen && (
              <ul className="space-y-3 border-t border-gray-100 dark:border-gray-700 p-4 pt-3">
                {section.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    <span className="text-swiss">•</span>
                    <span>{tip[lang]}</span>
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
