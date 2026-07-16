import { useEffect, useState } from 'react'
import { LangContext, t } from './i18n'
import { storage } from './storage'
import Header from './components/Header'
import Home from './components/Home'
import Study from './components/Study'
import Exam from './components/Exam'
import Review from './components/Review'
import Tips from './components/Tips'
import Maneuvers from './components/Maneuvers'
import FirstAid from './components/FirstAid'
import Signs from './components/Signs'
import Stats from './components/Stats'

export default function App() {
  const [lang, setLangState] = useState(storage.getLang)
  const [category, setCategoryState] = useState(() => storage.getCategory() || 'B')
  const [view, setView] = useState('home')
  const [theme, setThemeState] = useState(storage.getTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    storage.setTheme(next)
    setThemeState(next)
  }

  const setLang = (l) => {
    storage.setLang(l)
    setLangState(l)
  }
  const setCategory = (c) => {
    storage.setCategory(c)
    setCategoryState(c)
  }

  const titles = {
    home: null,
    study: t('menuStudy', lang),
    exam: t('menuExam', lang),
    review: t('menuReview', lang),
    tips: t('menuTips', lang),
    maneuvers: t('menuManeuvers', lang),
    firstaid: t('menuFirstAid', lang),
    signs: t('menuSigns', lang),
    stats: t('menuStats', lang),
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-gray-100 pb-8 dark:bg-gray-950">
        <Header
          title={titles[view]}
          category={view !== 'home' && view !== 'firstaid' && view !== 'signs' && view !== 'stats' ? category : null}
          onBack={view !== 'home' ? () => setView('home') : null}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        {view === 'home' && <Home category={category} setCategory={setCategory} navigate={setView} />}
        {view === 'study' && <Study category={category} />}
        {view === 'exam' && <Exam category={category} onExit={() => setView('home')} />}
        {view === 'review' && <Review />}
        {view === 'tips' && <Tips category={category} />}
        {view === 'maneuvers' && <Maneuvers category={category} />}
        {view === 'firstaid' && <FirstAid />}
        {view === 'signs' && <Signs />}
        {view === 'stats' && <Stats />}
      </div>
    </LangContext.Provider>
  )
}
