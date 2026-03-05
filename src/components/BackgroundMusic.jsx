import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import musicFile from '../assets/background-music.mp3'

export default function BackgroundMusic() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)
    const audioRef = useRef(null)

    // Auto-play is restricted by browsers until user interaction.
    useEffect(() => {
        const handleFirstInteraction = () => {
            if (!hasInteracted) {
                setHasInteracted(true)
                setIsPlaying(true)
                if (audioRef.current) {
                    audioRef.current.play().catch(err => console.log("Audio play failed:", err))
                }
                window.removeEventListener('click', handleFirstInteraction)
            }
        }
        window.addEventListener('click', handleFirstInteraction)
        return () => window.removeEventListener('click', handleFirstInteraction)
    }, [hasInteracted])

    // Sync play state with audio element
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(err => console.log("Audio play failed:", err))
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying])

    return (
        <div className="fixed top-6 right-6 z-[1000] flex items-center gap-4">
            {/* Hidden HTML5 Audio Element */}
            <audio
                ref={audioRef}
                src={musicFile}
                loop
            />

            {/* Pirate Sound Toggle Button */}
            <div className="flex items-center gap-3">
                <AnimatePresence>
                    {!hasInteracted && (
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="text-pirate-gold text-xs font-serif uppercase tracking-[0.2em] bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-pirate-gold/30 shadow-2xl"
                        >
                            Activate Sound ⚓
                        </motion.span>
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsPlaying(!isPlaying)
                        if (!hasInteracted) setHasInteracted(true)
                    }}
                    className="relative p-3 rounded-full bg-[#f4e4bc]/5 border-[3px] border-[#8b6a1f]/40 backdrop-blur-3xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center justify-center group overflow-hidden"
                    whileHover={{ scale: 1.05, borderColor: '#d4af37' }}
                    whileTap={{ scale: 0.95 }}
                    title={isPlaying ? "Mute Music" : "Play Music"}
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                    />

                    <div className="relative z-10 text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {isPlaying ? (
                            <motion.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    color: ["#d4af37", "#f4e4bc", "#d4af37"]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="font-serif italic"
                            >
                                🔊
                            </motion.div>
                        ) : (
                            <span className="opacity-30 contrast-50 sepia shadow-inner">🔇</span>
                        )}
                    </div>

                    {/* Floating Notes when playing */}
                    <AnimatePresence>
                        {isPlaying && (
                            <motion.div
                                className="absolute -top-1 -right-1 text-[8px] text-pirate-gold/40"
                                animate={{ y: [-10, -30], x: [0, 10], opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                ♪
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    )
}
