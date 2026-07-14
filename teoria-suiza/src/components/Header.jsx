import { useLang, t } from '../i18n'

export default function Header({ onBack, title, category }) {
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
        <div className="flex overflow-hidden rounded-full border border-white/40 text-sm font-semibold">
          {['de', 'es'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 transition-colors ${
                lang === l ? 'bg-white text-swiss' : 'text-white hover:bg-white/15'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
