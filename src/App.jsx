import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './supabaseClient'
import BootScreen from './components/BootScreen'
import BackgroundMusic from './components/BackgroundMusic'
import ARDownloadScreen from './components/ARDownloadScreen'
import MaintenancePage from './components/MaintenancePage'

const StoryPage = lazy(() => import('./components/StoryPage'))
const RegistrationPage = lazy(() => import('./components/RegistrationPage'))
const HuntMap = lazy(() => import('./components/HuntMap'))
const RulesPage = lazy(() => import('./components/RulesPage'))
const TasksPage = lazy(() => import('./components/TasksPage'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const MapPage = lazy(() => import('./pages/MapPage'))

export default function App() {
  const [currentPage, setCurrentPage] = useState('maintenance')
  const [session, setSession] = useState({
    isLoaded: false,
    participant: null,
    gameState: null
  })

  useEffect(() => {
    // Emergency Reset via URL: ?reset=true
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('reset') === 'true') {
      localStorage.removeItem('pirateHuntDocId')
      window.location.href = window.location.origin
      return
    }

    const initializeApp = async () => {
      try {
        // Fetch Game State
        const { data: gs } = await supabase.from('game_state').select('*').single()

        // Check for session
        const savedId = localStorage.getItem('pirateHuntDocId')
        let participantData = null

        if (savedId) {
          const { data: p } = await supabase
            .from('participants')
            .select('*')
            .eq('participant_id', savedId)
            .single()
          participantData = p
        }

        setSession({
          isLoaded: true,
          participant: participantData,
          gameState: gs
        })

        // Check if maintenance is active from game state
        if (gs?.is_maintenance === true) {
          setCurrentPage('maintenance')
        }
      } catch (err) {
        console.error("Initialization failed:", err)
        setSession(prev => ({ ...prev, isLoaded: true }))
      }
    }

    initializeApp()
  }, [])

  const handleBootComplete = () => {
    if (session.participant) {
      setCurrentPage('tasks')
    } else {
      setCurrentPage('story')
    }
  }

  const handleStartHunt = () => {
    setCurrentPage('registration')
  }

  const handleRegistrationComplete = () => {
    setCurrentPage('ar-download')
  }

  const handleARContinue = () => {
    setCurrentPage('hunt')
  }

  const handleHuntComplete = () => {
    setCurrentPage('rules')
  }

  const handleRulesComplete = () => {
    setCurrentPage('tasks')
  }

  const handleLeaderboard = () => {
    setCurrentPage('leaderboard')
  }

  return (
    <Router>
      <div className="w-full h-screen bg-[#0a101d] overflow-hidden relative text-white">
        {/* Cinematic Film Effects */}
        <div className="film-grain" />
        <div className="filmic-grading fixed inset-0 pointer-events-none z-[110]" />
        <div className="atmospheric-dust">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="dust-mote"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <BackgroundMusic />
        <div className="fixed inset-0 pointer-events-none z-[100] cinematic-vignette" />

        <Routes>
          <Route path="/" element={
            <AnimatePresence mode="wait">
              {currentPage === 'maintenance' && (
                <motion.div
                  key="maintenance"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-screen"
                >
                  <MaintenancePage />
                </motion.div>
              )}

              {currentPage === 'boot' && (
                <motion.div
                  key="boot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-screen"
                >
                  <BootScreen
                    onBootComplete={handleBootComplete}
                    isDataLoaded={session.isLoaded}
                  />
                </motion.div>
              )}

              {currentPage === 'story' && (
                <Suspense fallback={<div className="w-full h-screen bg-[#0a101d]" />}>
                  <motion.div
                    key="story"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full"
                  >
                    <StoryPage onStartHunt={handleStartHunt} />
                  </motion.div>
                </Suspense>
              )}

              {currentPage === 'registration' && (
                <Suspense fallback={<div className="w-full h-screen bg-[#0a101d]" />}>
                  <motion.div
                    key="registration"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full"
                  >
                    <RegistrationPage onComplete={handleRegistrationComplete} />
                  </motion.div>
                </Suspense>
              )}

              {currentPage === 'ar-download' && (
                <motion.div
                  key="ar-download"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-screen"
                >
                  <ARDownloadScreen onContinue={handleARContinue} />
                </motion.div>
              )}

              {currentPage === 'hunt' && (
                <Suspense fallback={<div className="w-full h-screen bg-[#0a101d]" />}>
                  <motion.div
                    key="hunt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-screen"
                  >
                    <HuntMap onComplete={handleHuntComplete} />
                  </motion.div>
                </Suspense>
              )}

              {currentPage === 'rules' && (
                <Suspense fallback={<div className="w-full h-screen bg-[#0a101d]" />}>
                  <motion.div
                    key="rules"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-screen"
                  >
                    <RulesPage onContinue={handleRulesComplete} />
                  </motion.div>
                </Suspense>
              )}

              {currentPage === 'tasks' && (
                <Suspense fallback={<div className="w-full h-screen bg-[#0a101d]" />}>
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-screen"
                  >
                    <TasksPage
                      onLeaderboard={handleLeaderboard}
                      initialParticipant={session.participant}
                      initialGameState={session.gameState}
                    />
                  </motion.div>
                </Suspense>
              )}
            </AnimatePresence>
          } />

          <Route path="/leaderboard" element={
            <Suspense fallback={<div className="w-full h-screen bg-[#0a101d]" />}>
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-screen overflow-y-auto"
              >
                <Leaderboard />
              </motion.div>
            </Suspense>
          } />

          <Route path="/map" element={
            <Suspense fallback={<div className="w-full h-screen bg-[#0a101d]" />}>
              <motion.div
                key="map-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-screen"
              >
                <MapPage />
              </motion.div>
            </Suspense>
          } />
        </Routes>
      </div>
    </Router>
  )
}

