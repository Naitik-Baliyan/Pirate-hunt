import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BootScreen from './components/BootScreen'
import StoryPage from './components/StoryPage'
import RegistrationPage from './components/RegistrationPage'
import BackgroundMusic from './components/BackgroundMusic'

export default function App() {
  const [currentPage, setCurrentPage] = useState('boot') // boot, story, registration

  const handleBootComplete = () => {
    setCurrentPage('story')
  }

  const handleStartHunt = () => {
    setCurrentPage('registration')
  }

  return (
    <div className="w-full h-screen bg-[#0a101d] overflow-hidden relative filmic-grading">
      {/* Cinematic Film Effects */}
      <div className="film-grain" />
      <div className="atmospheric-dust">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="dust-mote"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <BackgroundMusic />
      <div className="fixed inset-0 pointer-events-none z-[100] cinematic-vignette" />

      <AnimatePresence mode="wait">
        {currentPage === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-screen"
          >
            <BootScreen onBootComplete={handleBootComplete} />
          </motion.div>
        )}

        {currentPage === 'story' && (
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
        )}

        {currentPage === 'registration' && (
          <motion.div
            key="registration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <RegistrationPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

