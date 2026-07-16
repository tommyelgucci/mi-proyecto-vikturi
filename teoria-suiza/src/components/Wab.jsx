import { useState } from 'react'
import { useLang, t, tr } from '../i18n'
import { WAB_SECTIONS, WAB_LINKS } from '../data/wab'

export default function Wab() {
  const { lang } = useLang()
  const [open, setOpen] = useState('probe')

  return (
    <div className="mx-auto max-w-xl space-y-5 px-4 py-5">
      <div className="rounded-2xl bg-red-50 dark:bg-red-900/30 p-4 text-sm leading-relaxed text-red-900 dark:text-red-200 ring-1 ring-red-200 dark:ring-red-800">
        🎓 {t('wabIntro', lang)}
      </div>

      <div className="space-y-3">
        {WAB_SECTIONS.map((section) => {
          const isOpen = open === section.id
          return (
            <div key={section.id} className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
              <button
                onClick={() => setOpen(isOpen ? null : section.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="text-2xl">{section.icon}</span>
                <span className="flex-1 font-semibold text-gray-900 dark:text-gray-100">{tr(section.title, lang)}</span>
                <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
              </button>
              {isOpen && (
                <ul className="space-y-3 border-t border-gray-100 dark:border-gray-700 p-4 pt-3">
                  {section.bullets.map((b, i) => (
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

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <h3 className="mb-2 font-bold text-gray-900 dark:text-gray-100">🔗 {t('officialLinks', lang)}</h3>
        <ul className="space-y-1.5">
          {WAB_LINKS.map((l) => (
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
