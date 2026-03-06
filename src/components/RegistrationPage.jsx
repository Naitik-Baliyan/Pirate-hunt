import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from '../firebase/firebaseConfig'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import mapBg from '../assets/registration-map.jpg'

export default function RegistrationPage({ onComplete }) {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    branch: ''
  })

  const [participantID, setParticipantID] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Generate participant ID
  const generateParticipantID = () => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `PIRATE-${timestamp}-${random}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validation
      if (!formData.fullName.trim() || !formData.rollNumber.trim() || !formData.branch.trim()) {
        setError('Please fill in all required fields.')
        setIsLoading(false)
        return
      }

      // Generate participant ID (for display purposes)
      const newParticipantID = generateParticipantID()
      setParticipantID(newParticipantID)

      // Save to Firestore
      const treasureHuntRef = collection(db, 'treasure_hunt_participants')
      const docData = {
        name: formData.fullName,
        rollNumber: formData.rollNumber,
        branch: formData.branch,
        startTime: serverTimestamp(),
        currentPhase: 1,
        currentQuest: 0,
        lettersCollected: [],
        phase1Completed: false,
        phase1Time: null,
        phase2Completed: false,
        phase2Time: null,
        participantID: newParticipantID // Store the generated ID just in case
      }

      const docRef = await addDoc(treasureHuntRef, docData)

      // Save doc.id to localStorage so TasksPage can act over it
      localStorage.setItem('pirateHuntDocId', docRef.id)

      // Show success
      setSuccess(true)
      setFormData({
        fullName: '',
        rollNumber: '',
        branch: ''
      })

      // Reset after 8 seconds to give more time to see ID, then proceed if onComplete is provided
      setTimeout(() => {
        if (onComplete) {
          onComplete(newParticipantID)
        } else {
          setSuccess(false)
          setParticipantID('')
        }
      }, 7000)

    } catch (err) {
      console.error('Registration error:', err)
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen relative flex items-center justify-center px-6 py-12 bg-[#0a1a2e] overflow-hidden">
      {/* Shared Background Layer: Map Blend */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={mapBg}
          alt="Ancient Map"
          className="w-full h-full object-cover opacity-60 sepia-[0.3] brightness-50 contrast-125 saturate-[0.7] scale-110"
          style={{ willChange: 'transform' }}
          loading="lazy"
        />
        {/* Cinematic Overlays: Blending Ocean depth with the map */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2e] via-transparent to-[#0a1a2e]/40" />
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(10,26,46,0.9)]" />
      </div>

      {/* Decorative floating elements */}
      <motion.div
        className="absolute top-10 left-10 text-6xl opacity-10 z-10 hidden md:block"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        🧭
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 text-5xl opacity-10 z-10 hidden md:block"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        ⚓
      </motion.div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success-screen"
            className="max-w-2xl w-full text-center relative z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-8"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-7xl drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">🏴‍☠️</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-serif text-pirate-gold mb-6 drop-shadow-lg tracking-tight">
              WELCOME EXPLORER!
            </h1>

            <p className="text-xl md:text-2xl text-pirate-gold font-serif mb-10 tracking-[0.2em] uppercase drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
              Your legend begins today.
            </p>

            <div className="bg-[#f4e4bc]/30 border-2 border-pirate-gold/40 rounded-3xl p-8 mb-10 backdrop-blur-2xl shadow-2xl border-dashed">
              <p className="text-[#2c1810]/60 font-serif text-sm mb-4 uppercase tracking-[0.3em] font-bold">Credentials Secured</p>
              <p className="terminal-text text-[#2c1810] text-3xl md:text-4xl break-all tracking-widest font-black drop-shadow-sm">
                {participantID}
              </p>
            </div>

            <p className="text-pirate-gold/50 font-serif text-sm italic tracking-widest">
              Keep this ID safe. The vault hunt awaits.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="registration-form"
            className="max-w-2xl w-full relative z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-serif text-pirate-gold text-center mb-2 drop-shadow-[0_4px_10px_rgba(212,175,55,0.4)] tracking-wider">
              TREASURE VAULT
            </h1>

            <p className="text-center text-pirate-gold/60 font-serif text-lg mb-10 tracking-[0.2em] uppercase">
              Enlist your crew to begin
            </p>

            {/* Error message */}
            {error && (
              <motion.div
                className="mb-8 p-4 bg-red-600/20 border-2 border-red-500/50 rounded-lg text-white text-center backdrop-blur-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            {/* Form Card: Parchment Aesthetic */}
            <div className="relative group overflow-hidden bg-[#fdf5e6]/20 border-2 border-white/20 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border-t-white/40 border-l-white/40" style={{ willChange: 'backdrop-filter, transform' }}>
              {/* Tactical Paper Texture / Grain - Reduced numOctaves for mobile */}
              <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

              <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-white text-sm font-serif mb-2 uppercase tracking-[0.2em] font-bold drop-shadow-md">
                    Captain's Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-[#fdf5e6]/10 border-2 border-white/10 rounded-2xl text-white font-serif focus:outline-none focus:border-pirate-gold focus:ring-4 focus:ring-pirate-gold/20 transition-all placeholder:text-white/20 backdrop-blur-sm"
                    placeholder="Full Name"
                    required
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-white text-sm font-serif mb-2 uppercase tracking-[0.2em] font-bold drop-shadow-md">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-[#fdf5e6]/10 border-2 border-white/10 rounded-2xl text-white font-serif focus:outline-none focus:border-pirate-gold focus:ring-4 focus:ring-pirate-gold/20 transition-all placeholder:text-white/20 backdrop-blur-sm"
                    placeholder="E.g. 23Bxxx"
                    required
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-white text-sm font-serif mb-2 uppercase tracking-[0.2em] font-bold drop-shadow-md">
                    Branch / Department
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-[#fdf5e6]/10 border-2 border-white/10 rounded-2xl text-white font-serif focus:outline-none focus:border-pirate-gold focus:ring-4 focus:ring-pirate-gold/20 transition-all placeholder:text-white/20 backdrop-blur-sm"
                    placeholder="E.g. CSE"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 pt-4">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full group relative overflow-hidden bg-pirate-gold px-8 py-5 rounded-2xl font-black text-black uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all"
                    whileHover={!isLoading ? { scale: 1.01, backgroundColor: '#ffcc33', boxShadow: '0 25px 50px rgba(212,175,55,0.5)' } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    <span className="relative z-10 text-xl drop-shadow-sm font-black">
                      {isLoading ? 'ENLISTING...' : 'ENLIST NOW'}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-white/30 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"
                    />
                  </motion.button>
                </div>
              </form>
            </div>

            {/* Footer note */}
            <p className="text-center text-pirate-gold/40 font-serif text-sm mt-12 italic tracking-widest">
              May the winds of fortune guide your path.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


