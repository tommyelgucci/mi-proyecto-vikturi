import { useLang, t, LANGS } from '../i18n'
import { IconSwiss, IconSun, IconMoon } from './Icons'
import { CarIcon, MotoIcon } from './CategoryIcons'

export default function Header({ onBack, title, category, theme, onToggleTheme, profile, onProfiles }) {
  const { lang, setLang } = useLang()

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-b from-swiss to-swiss-dark text-white shadow-float">
      <div className="mx-auto flex max-w-xl items-center gap-2.5 px-4 py-3">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label={t('back', lang)}
            className="-ml-1 rounded-full p-1.5 text-xl leading-none transition-colors hover:bg-white/15 active:bg-white/25"
          >
            ←
          </button>
        ) : (
          <IconSwiss className="h-5 w-5" aria-hidden />
        )}
        <h1 className="min-w-0 flex-1 truncate text-lg font-bold tracking-tight">
          {title || t('appName', lang)}
          {category && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold align-middle backdrop-blur-sm">
              {category === 'B' ? <CarIcon className="h-3.5 w-auto" /> : <MotoIcon className="h-3.5 w-auto" />}
              {category === 'B' ? 'B' : 'A'}
            </span>
          )}
        </h1>
        {onProfiles && (
          <button
            onClick={onProfiles}
            aria-label={t('profilesTitle', lang)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-base ring-1 ring-white/30 transition-transform hover:bg-white/25 active:scale-90"
          >
            {profile?.emoji || '🚗'}
          </button>
        )}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            aria-label={t('toggleTheme', lang)}
            className="rounded-full p-1.5 text-lg leading-none transition-colors hover:bg-white/15 active:bg-white/25"
          >
            {theme === 'dark' ? <IconSun className="h-[18px] w-[18px]" /> : <IconMoon className="h-[18px] w-[18px]" />}
          </button>
        )}
        <div className="relative">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Sprache / Idioma / Langue / Lingua / Language"
            className="appearance-none rounded-full border border-white/40 bg-white/10 py-1 pl-3 pr-7 text-sm font-semibold text-white outline-none backdrop-blur-sm hover:bg-white/20 focus:bg-white/20"
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
