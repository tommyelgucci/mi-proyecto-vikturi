import { useState } from 'react'
import { LangContext, t } from './i18n'
import { storage } from './storage'
import Header from './components/Header'
import Home from './components/Home'
import Study from './components/Study'
import Exam from './components/Exam'
import Review from './components/Review'
import Tips from './components/Tips'

export default function App() {
  const [lang, setLangState] = useState(storage.getLang)
  const [category, setCategoryState] = useState(() => storage.getCategory() || 'B')
  const [view, setView] = useState('home')

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
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-gray-100 pb-8">
        <Header
          title={titles[view]}
          category={view !== 'home' ? category : null}
          onBack={view !== 'home' ? () => setView('home') : null}
        />
        {view === 'home' && <Home category={category} setCategory={setCategory} navigate={setView} />}
        {view === 'study' && <Study category={category} />}
        {view === 'exam' && <Exam category={category} onExit={() => setView('home')} />}
        {view === 'review' && <Review />}
        {view === 'tips' && <Tips category={category} />}
      </div>
    </LangContext.Provider>
  )
}
