import { useLang, t, LANGS } from '../i18n'

export default function Header({ onBack, title, category, theme, onToggleTheme }) {
  const { lang, setLang } = useLang()

  return (
    <header className="sticky top-0 z-10 bg-swiss text-white shadow-md">
      <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-3">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label={t('back', lang)}
            className="-ml-1 rounded-full p-1.5 text-xl leading-none hover:bg-white/15 active:bg-white/25"
          >
            ←
          </button>
        ) : (
          <span className="text-xl" aria-hidden>
            🇨🇭
          </span>
        )}
        <h1 className="min-w-0 flex-1 truncate text-lg font-bold">
          {title || t('appName', lang)}
          {category && (
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold align-middle">
              {category === 'B' ? '🚗 B' : '🏍️ A'}
            </span>
          )}
        </h1>
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            aria-label={t('toggleTheme', lang)}
            className="rounded-full p-1.5 text-lg leading-none hover:bg-white/15 active:bg-white/25"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        )}
        <div className="relative">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Sprache / Idioma / Langue / Lingua / Language"
            className="appearance-none rounded-full border border-white/40 bg-transparent py-1 pl-3 pr-7 text-sm font-semibold text-white outline-none hover:bg-white/15 focus:bg-white/15"
          >
            {LANGS.map((l) => (
              <option key={l.id} value={l.id} className="text-gray-900">
                {l.label} · {l.name}
              </option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/80">
            ▾
          </span>
        </div>
      </div>
    </header>
  )
}
