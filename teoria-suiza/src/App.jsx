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
import Kontrollfahrt from './components/Kontrollfahrt'
import Vku from './components/Vku'
import Wab from './components/Wab'
import Profiles from './components/Profiles'

export default function App() {
  const [lang, setLangState] = useState(storage.getLang)
  const [category, setCategoryState] = useState(() => storage.getCategory() || 'B')
  const [view, setView] = useState('home')
  const [studyTopic, setStudyTopic] = useState(null)
  const [theme, setThemeState] = useState(storage.getTheme)
  const [showProfiles, setShowProfiles] = useState(false)
  const profile = storage.getActiveProfile()

  // navegación con filtro de tema opcional (cross-links desde Kontrollfahrt)
  const go = (nextView, topic = null) => {
    setStudyTopic(topic)
    setView(nextView)
  }

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
    kontrollfahrt: t('menuKontrollfahrt', lang),
    vku: t('menuVku', lang),
    wab: t('menuWab', lang),
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-gray-100 pb-8 dark:bg-gray-950">
        <Header
          title={titles[view]}
          category={['home', 'firstaid', 'signs', 'stats', 'kontrollfahrt', 'vku', 'wab'].includes(view) ? null : category}
          onBack={view !== 'home' ? () => go('home') : null}
          theme={theme}
          onToggleTheme={toggleTheme}
          profile={profile}
          onProfiles={() => setShowProfiles(true)}
        />
        {showProfiles && <Profiles onClose={() => setShowProfiles(false)} />}
        <div key={view} className="view-in">
        {view === 'home' && <Home category={category} setCategory={setCategory} navigate={go} profile={profile} />}
        {view === 'study' && <Study key={studyTopic || 'all'} category={category} initialTopic={studyTopic} />}
        {view === 'exam' && <Exam category={category} onExit={() => setView('home')} />}
        {view === 'review' && <Review />}
        {view === 'tips' && <Tips category={category} />}
        {view === 'maneuvers' && <Maneuvers category={category} />}
        {view === 'firstaid' && <FirstAid />}
        {view === 'signs' && <Signs />}
        {view === 'stats' && <Stats />}
        {view === 'kontrollfahrt' && <Kontrollfahrt navigate={go} />}
        {view === 'vku' && <Vku />}
        {view === 'wab' && <Wab />}
        </div>
      </div>
    </LangContext.Provider>
  )
}
