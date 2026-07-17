import { Component } from 'react'
import { t } from '../i18n'
import { storage } from '../storage'

// Red de seguridad: si cualquier componente lanza durante el render (p. ej.
// un dato corrupto en localStorage), esto evita una pantalla en blanco total
// y ofrece una salida — reintentar o borrar los datos de este dispositivo.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const lang = storage.getLang()

    function reset() {
      if (window.confirm(t('errorResetConfirm', lang))) {
        try {
          localStorage.clear()
        } catch {
          // ignore
        }
        window.location.reload()
      }
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 px-6 text-center dark:bg-gray-950">
        <span className="text-5xl">⚠️</span>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('errorTitle', lang)}</h1>
        <p className="max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-300">{t('errorBody', lang)}</p>
        <div className="mt-2 flex w-full max-w-xs flex-col gap-2">
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-swiss py-3 font-semibold text-white hover:bg-swiss-dark"
          >
            {t('errorReload', lang)}
          </button>
          <button
            onClick={reset}
            className="rounded-xl bg-white py-3 font-semibold text-gray-600 ring-1 ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600"
          >
            {t('errorReset', lang)}
          </button>
        </div>
      </div>
    )
  }
}
