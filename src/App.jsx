import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BootScreen from './components/BootScreen'
import BackgroundMusic from './components/BackgroundMusic'

const StoryPage = lazy(() => import('./components/StoryPage'))
const RegistrationPage = lazy(() => import('./components/RegistrationPage'))

export default function App() {
  const [currentPage, setCurrentPage] = useState('boot') // boot, story, registration

  const handleBootComplete = () => {
    setCurrentPage('story')
  }

  const handleStartHunt = () => {
    setCurrentPage('registration')
  }

  return (
    <div className="w-full h-screen bg-[#0a101d] overflow-hidden relative">
      {/* Cinematic Film Effects */}
      <div className="film-grain" />
      <div className="filmic-grading fixed inset-0 pointer-events-none z-[110]" />
      <div className="atmospheric-dust">
        {/* Reduced dust count for better mobile performance (from 20 to 10) */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="dust-mote"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`, // Slightly smaller dots
              height: `${Math.random() * 3 + 1}px`,
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
              <RegistrationPage />
            </motion.div>
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  )
}

