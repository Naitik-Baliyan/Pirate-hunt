import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import storyBg from '../assets/story-bg.png'

export default function StoryPage({ onStartHunt }) {
  const storyParagraphs = [
    "Long ago, explorers searched oceans for hidden treasures...",
    "Today, the treasure is not buried in sand...",
    "It is hidden across this campus.",
    "AR markers hold the clues.",
    "Only the sharpest explorers will unlock the final vault."
  ]

  const [currentParaIndex, setCurrentParaIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const typingTimerRef = useRef(null)

  const currentFullText = storyParagraphs[currentParaIndex]

  // Typewriter effect
  useEffect(() => {
    setDisplayedText("")
    setIsTyping(true)
    let charIndex = 0

    const typeChar = () => {
      if (charIndex < currentFullText.length) {
        setDisplayedText(currentFullText.slice(0, charIndex + 1))
        charIndex++
        typingTimerRef.current = setTimeout(typeChar, 35) // Speed of typing
      } else {
        setIsTyping(false)
      }
    }

    typeChar()

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    }
  }, [currentParaIndex])

  const handleInteraction = () => {
    if (isTyping) {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      setDisplayedText(currentFullText)
      setIsTyping(false)
    } else {
      if (currentParaIndex < storyParagraphs.length - 1) {
        setCurrentParaIndex(prev => prev + 1)
      } else {
        onStartHunt()
      }
    }
  }

  return (
    <div
      className="w-full h-screen relative flex items-center justify-center overflow-hidden cursor-pointer touch-none bg-[#0a1a2e]"
      onClick={handleInteraction}
    >
      {/* Background Layer: Story Map Blend */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={storyBg}
          alt="Voyage Map"
          className="w-full h-full object-cover opacity-70 brightness-90 contrast-110 saturate-[0.8] scale-105"
          style={{ willChange: 'transform' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1a2e]/80 via-transparent to-[#0a1a2e]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(10,26,46,0.9)]" />
      </div>

      {/* Content Layer: Story Text */}
      <div className="relative z-20 w-full max-w-2xl px-10 text-center select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentParaIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            <p className="text-2xl md:text-3xl font-serif leading-relaxed text-[#ffcc33] drop-shadow-[0_4px_8px_rgba(0,0,0,1)] uppercase tracking-wide">
              {displayedText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-[2px] h-[28px] md:h-[34px] bg-[#ffcc33] ml-2 align-middle shadow-[0_0_10px_rgba(255,204,51,0.6)]"
                />
              )}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Interaction Hint */}
        <motion.div
          className="mt-16 md:mt-24 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTyping ? 0 : 1 }}
          transition={{ duration: 1.5 }}
        >
          <p className="text-[#ffcc33]/40 font-serif text-xs md:text-sm tracking-[0.4em] uppercase">
            {currentParaIndex === storyParagraphs.length - 1 ? "Begin the hunt" : "Tap the map to cruise"}
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[#ffcc33]/30 text-lg md:text-xl"
          >
            ⚓
          </motion.div>
        </motion.div>
      </div>

      {/* Cinematic Borders */}
      <div className="absolute top-0 left-0 w-full h-[15vh] bg-gradient-to-b from-black via-black/40 to-transparent pointer-events-none z-30 opacity-90" />
      <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-30 opacity-90" />
    </div>
  )
}


