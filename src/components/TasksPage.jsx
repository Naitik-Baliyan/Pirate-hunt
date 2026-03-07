import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import tasksBg from '../assets/registration-map.jpg'

export default function TasksPage({ onLeaderboard }) {
    const [targetWord, setTargetWord] = useState('ECELL')
    const [phaseCompleted, setPhaseCompleted] = useState(false)
    const [duration, setDuration] = useState(0)
    const [startTime, setStartTime] = useState(null)
    const [winnerDeclared, setWinnerDeclared] = useState(false)
    const [lettersCollected, setLettersCollected] = useState([])
    const [clues, setClues] = useState([])

    const [inputValue, setInputValue] = useState('')
    const [currentQuest, setCurrentQuest] = useState(1) // Source of truth for quest progress
    const [errorMsg, setErrorMsg] = useState('')
    const [showCompletion, setShowCompletion] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [expandedQuestId, setExpandedQuestId] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const participantId = localStorage.getItem('pirateHuntDocId')

    useEffect(() => {
        if (!participantId) {
            console.error("No participant ID found. Redirecting might be needed.")
            setIsLoaded(true)
            return
        }

        // 1. Initial Fetch for Game Control
        const fetchGameControl = async () => {
            const { data, error } = await supabase
                .from('game_state')
                .select('*')
                .single()

            if (data && !error) {
                setPhase(data.current_phase || 1)
                setTargetWord(data.current_word || 'IDEAS')
                setWinnerDeclared(data.winner_declared || false)
            }
        }
        fetchGameControl()

        // 2. Initial Fetch for Participant
        const fetchParticipant = async () => {
            const { data, error } = await supabase
                .from('participants')
                .select('*')
                .eq('id', participantId)
                .single()

            if (data && !error) {
                setLettersCollected(data.letters_collected || [])
                const savedQuest = data.current_quest || 1
                setCurrentQuest(savedQuest)
                setExpandedQuestId(savedQuest >= 5 ? 5 : savedQuest)

                // Simplified completion check
                if (data.completion_duration !== null && data.completion_duration !== undefined) {
                    setDuration(data.completion_duration)
                    setPhaseCompleted(true)
                    setShowCompletion(true)
                }

                // Track start time
                if (data.start_time) {
                    setStartTime(new Date(data.start_time))
                } else if (!data.completion_duration) {
                    // Record start time if not already set and not finished
                    const now = new Date()
                    supabase.from('participants').update({ start_time: now.toISOString() }).eq('id', participantId).then(() => {
                        setStartTime(now)
                    })
                }
            }
            if (!isLoaded) setIsLoaded(true)
        }
        fetchParticipant()

        // 3. Real-time Subscription for Game State
        const gameStateChannel = supabase.channel('game_state_changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state' }, payload => {
                const data = payload.new
                setPhase(data.current_phase || 1)
                setTargetWord(data.current_word || 'IDEAS')
                setWinnerDeclared(data.winner_declared || false)
            })
            .subscribe()

        // 4. Real-time Subscription for Participant
        const participantChannel = supabase.channel(`participant_${participantId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'participants', filter: `id=eq.${participantId}` }, payload => {
                const data = payload.new
                setLettersCollected(data.letters_collected || [])
                const savedQuest = data.current_quest || 1
                setCurrentQuest(savedQuest)
                setExpandedQuestId(savedQuest >= 5 ? 5 : savedQuest)

                if (data.completion_duration) {
                    setDuration(data.completion_duration)
                    setShowCompletion(true)
                    setPhaseCompleted(true)
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(gameStateChannel)
            supabase.removeChannel(participantChannel)
        }
    }, [participantId])

    // Dynamic Clues Fetcher
    useEffect(() => {
        const fetchClues = async () => {
            try {
                const { data, error } = await supabase
                    .from('clues')
                    .select('*')
                    .order('quest_number', { ascending: true })
                    .limit(5)

                if (data && !error) {
                    // Map clues to the expected quest structure
                    const formattedQuests = data.map(c => ({
                        clue: c.clue_text,
                        location: c.location,
                        id: c.quest_number,
                        answer: c.answer // Added answer for validation
                    }))
                    setClues(formattedQuests)
                } else {
                    setClues([])
                }
            } catch (err) {
                console.error("Error fetching clues: ", err)
                setClues([])
            }
        }
        fetchClues()
    }, []) // Logic simplified, fetch all 5 at once

    const progress = lettersCollected.length
    const targetLetters = targetWord?.split('') || []

    // Removed auto-redirect. Now handled by manual button in UI.

    const handleSumbitLetter = async (e) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)
        setErrorMsg('')

        if (winnerDeclared) {
            setErrorMsg('Hunt Concluded!')
            setTimeout(() => { setErrorMsg(''); setIsSubmitting(false) }, 3000)
            return
        }

        if (progress >= targetLetters.length || !participantId) {
            setIsSubmitting(false)
            return
        }

        const currentClue = clues.find(c => c.id === currentQuest)
        if (!currentClue) {
            setErrorMsg('Quest data missing. Please refresh.')
            setIsSubmitting(false)
            return
        }

        const cleanedInput = inputValue.trim().toUpperCase()
        const correctAnswer = currentClue.answer?.trim().toUpperCase()

        console.log("User input:", cleanedInput)
        console.log("Correct answer:", correctAnswer)

        if (cleanedInput === correctAnswer) {
            console.log("Quest unlocked")
            const newLetters = [...lettersCollected, cleanedInput]
            const nextQuestNum = currentQuest + 1
            const isFinished = currentQuest >= 5

            setInputValue('')

            try {
                const updateData = {
                    letters_collected: newLetters,
                    current_quest: currentQuest + 1
                }

                if (isFinished) {
                    const compTime = new Date()
                    const startDT = startTime || new Date()
                    const durSeconds = Math.floor((compTime - startDT) / 1000)

                    updateData.completion_time = compTime.toISOString()
                    updateData.completion_duration = durSeconds
                    setDuration(durSeconds)

                    if (!winnerDeclared) {
                        await supabase
                            .from('game_state')
                            .update({ winner_declared: true })
                            .eq('id', 1)
                    }
                }

                const { error: updateError } = await supabase
                    .from('participants')
                    .update(updateData)
                    .eq('id', participantId)

                if (updateError) throw updateError

                // Immediately update local state
                if (isFinished) {
                    setShowCompletion(true)
                    setPhaseCompleted(true)
                }
                setCurrentQuest(nextQuestNum)
                setLettersCollected(newLetters)
                setExpandedQuestId(nextQuestNum > 5 ? 5 : nextQuestNum)

                setTimeout(() => setIsSubmitting(false), 500)
            } catch (err) {
                console.error("Error updating participant progress:", err)
                setErrorMsg('Network error. Try again.')
                setTimeout(() => setIsSubmitting(false), 500)
            }
        } else {
            console.log("Incorrect answer")
            setErrorMsg('Incorrect letter. Keep searching!')
            setTimeout(() => setErrorMsg(''), 3000)
            setTimeout(() => setIsSubmitting(false), 500)
        }
    }

    if (!isLoaded) return (
        <div className="w-full h-screen bg-[#0a1a2e] flex items-center justify-center">
            <div className="text-3xl animate-pulse text-pirate-gold">Navigating the seas...</div>
        </div>
    )

    return (
        <div className="w-full min-h-screen relative flex flex-col items-center py-8 px-4 md:py-12 md:px-8 bg-[#0a1a2e] overflow-y-auto no-scrollbar">
            {/* Background Image Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src={tasksBg}
                    alt="Parchment Background"
                    className="w-full h-full object-cover md:object-cover sm:object-fill opacity-90 sepia-[0.3] brightness-75 contrast-125 saturate-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a101d] via-transparent to-[#0a101d]/60" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(10,26,46,0.9)]" />
            </div>

            {/* Main Interface */}
            <AnimatePresence mode="wait">
                {showCompletion ? (
                    <motion.div
                        key="completion"
                        className="relative z-10 w-full max-w-2xl flex flex-col items-center justify-center min-h-[70vh] text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, type: "spring" }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="text-7xl md:text-9xl drop-shadow-[0_0_30px_rgba(212,175,55,0.8)] mb-6"
                        >
                            🏴‍☠️
                        </motion.div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-pirate-gold mb-4 drop-shadow-lg tracking-widest uppercase leading-tight px-4">
                            Treasure Hunt Completed!
                        </h1>

                        <div className="text-white text-xl md:text-2xl font-mono mb-6 bg-[#0a101d]/60 px-6 py-2 rounded-full border border-pirate-gold/30">
                            Time Taken: {Math.floor(duration / 60)}m {(duration % 60).toString().padStart(2, '0')}s
                        </div>

                        <motion.div
                            className="bg-[#0a101d]/80 border-2 border-pirate-gold rounded-3xl p-6 md:p-12 my-6 md:my-8 backdrop-blur-md shadow-[0_0_50px_rgba(212,175,55,0.3)] w-full max-w-sm md:max-w-none"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="flex flex-wrap gap-3 md:gap-8 justify-center mb-0 md:mb-6">
                                {targetLetters.map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        className="text-4xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.5 + (i * 0.3), type: "spring" }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.p
                            className="text-[#fdf5e6] text-xl md:text-2xl font-serif italic tracking-wide mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 3.5, duration: 2 }}
                        >
                            "Every great industry begins with an <span className="text-pirate-gold font-bold not-italic">{targetWord}</span>."
                        </motion.p>

                        <motion.button
                            onClick={() => navigate('/leaderboard')}
                            className="bg-pirate-gold text-[#0a101d] px-8 py-4 rounded-xl font-black font-serif uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:bg-[#ffcc33] hover:scale-105 transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 4.5 }}
                        >
                            Check Leaderboard
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="quest-list"
                        className="relative z-10 w-full max-w-4xl px-2 sm:px-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-center mb-6 md:mb-8">
                            <h1 className="text-[rgb(44,24,16)] text-3xl sm:text-4xl md:text-6xl md:text-pirate-gold drop-shadow-lg md:drop-shadow-[0_4px_10px_rgba(212,175,55,0.4)] tracking-[0.15em] uppercase font-black leading-tight">
                                Treasure Hunt
                            </h1>

                            {/* Letters Progress Bar */}
                            <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-5 justify-center mt-6 md:mt-8 mb-4 max-w-full overflow-hidden">
                                {targetLetters.map((letter, i) => {
                                    const isRevealed = i < progress
                                    return (
                                        <div
                                            key={i}
                                            className="w-10 h-14 sm:w-14 sm:h-18 md:w-16 md:h-20 border-b-4 border-pirate-gold flex items-center justify-center bg-[#0a101d]/40 backdrop-blur-sm rounded-t-lg shadow-inner flex-shrink-0"
                                        >
                                            {isRevealed ? (
                                                <motion.span
                                                    className="text-2xl sm:text-3xl md:text-4xl font-black text-pirate-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring" }}
                                                >
                                                    {lettersCollected[i]}
                                                </motion.span>
                                            ) : (
                                                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-pirate-gold/30">_</span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            <p className="text-[rgb(44,24,16)] font-bold md:font-normal md:text-pirate-gold/70 font-serif mt-2 tracking-widest uppercase text-[10px] sm:text-xs md:text-base">
                                Collect the hidden letters
                            </p>
                        </div>

                        {/* Quests Container */}
                        <div className="space-y-4 md:space-y-8 pb-12">
                            {(!clues || !Array.isArray(clues) || clues.length === 0) ? (
                                <div className="flex flex-col items-center justify-center p-8 md:p-12 opacity-80 backdrop-blur-md bg-[#0a101d]/40 rounded-3xl border-2 border-dashed border-pirate-gold/30">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="text-5xl md:text-6xl mb-4 md:mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
                                    >
                                        🧭
                                    </motion.div>
                                    <p className="text-pirate-gold font-serif text-lg md:text-2xl tracking-widest text-center animate-pulse drop-shadow-md">
                                        Searching the seas...
                                    </p>
                                </div>
                            ) : (
                                clues.slice(0, currentQuest).map((clueData, index) => {
                                    const id = clueData.id
                                    const isCompleted = id < currentQuest
                                    const isActive = id === currentQuest
                                    const isLocked = id > currentQuest
                                    const isExpanded = expandedQuestId === id

                                    return (
                                        <motion.div
                                            key={id}
                                            onClick={() => setExpandedQuestId(isExpanded ? null : id)}
                                            className={`border-2 p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-md transition-all duration-500 overflow-hidden relative cursor-pointer ${isActive ? 'bg-[#f4e4bc]/90 md:bg-[#f4e4bc]/20 border-pirate-gold/80 shadow-[0_0_30px_rgba(212,175,55,0.2)]' :
                                                isCompleted ? 'bg-[#0a101d]/60 border-pirate-gold/30 opacity-70' :
                                                    'bg-[#0a101d]/40 border-[#2c1810]/50 opacity-50 grayscale'
                                                }`}
                                            initial={isActive ? { scale: 0.95, opacity: 0 } : false}
                                            animate={isActive ? { scale: 1, opacity: 1 } : false}
                                        >
                                            {/* Golden highlight gradient for active card */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-pirate-gold/10 via-transparent to-transparent pointer-events-none" />
                                            )}

                                            <div className="flex flex-col relative z-10">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 md:gap-3">
                                                        <h3 className={`font-black font-serif text-lg sm:text-xl md:text-2xl tracking-wide ${isActive || isCompleted ? 'text-[#2c1810] md:text-pirate-gold' : 'text-gray-500'}`}>
                                                            QUEST {id}
                                                        </h3>
                                                        {isCompleted && <span className="text-green-500 text-lg md:text-xl drop-shadow-sm">✔️</span>}
                                                        {isLocked && <span className="text-gray-500 text-lg md:text-xl">🔒</span>}
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                        className={`text-lg md:text-2xl ${isActive || isCompleted ? 'text-[#2c1810] md:text-pirate-gold' : 'text-gray-500'}`}
                                                    >
                                                        ▼
                                                    </motion.div>
                                                </div>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                            className="overflow-hidden flex flex-col md:flex-row md:items-start justify-between gap-4"
                                                        >
                                                            <div className="flex-1">
                                                                {(isActive || isCompleted) ? (
                                                                    <div className="space-y-4 pr-0 md:pr-6">
                                                                        <div className="flex gap-2 text-sm md:text-base uppercase tracking-widest font-bold text-[#2c1810]/70 md:text-pirate-gold/70 border-b border-[#2c1810]/20 md:border-pirate-gold/20 pb-2 inline-flex">
                                                                            <span>📍</span> Location Hint
                                                                        </div>
                                                                        <p className="text-lg md:text-xl font-serif text-[#2c1810] md:text-[#fdf5e6] italic leading-relaxed whitespace-pre-line drop-shadow-sm">
                                                                            "{clueData?.clue || 'Clue missing from scroll.'}"
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-[#2c1810]/60 md:text-gray-400 font-serif italic mt-2 text-sm md:text-base">
                                                                        Unlocks after completing Quest {index}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Action Area */}
                                                            <div
                                                                className="mt-6 md:mt-0 flex-shrink-0 w-full md:w-auto flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-[#2c1810]/20 md:border-pirate-gold/30 pt-6 md:pt-0 md:pl-8"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {isCompleted ? (
                                                                    <div className="flex flex-col items-center">
                                                                        <div className="w-16 h-16 rounded-full border-4 border-pirate-gold bg-[#0a101d] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                                                            <span className="text-3xl font-black text-pirate-gold">{lettersCollected[index]}</span>
                                                                        </div>
                                                                        <span className="mt-2 text-xs uppercase tracking-widest text-[#2c1810] md:text-pirate-gold/80 font-bold">Discovered</span>
                                                                    </div>
                                                                ) : isActive ? (
                                                                    <form onSubmit={handleSumbitLetter} className="flex flex-col w-full items-center gap-3">
                                                                        <label className="text-xs uppercase tracking-widest text-[#2c1810] md:text-pirate-gold/80 font-bold">Enter Found Letter</label>
                                                                        <input
                                                                            type="text"
                                                                            maxLength={1}
                                                                            value={inputValue}
                                                                            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                                                                            className="w-20 h-20 text-center text-4xl font-black uppercase bg-[#fdf5e6]/50 md:bg-[#0a101d]/60 border-2 border-[#2c1810] md:border-pirate-gold/50 rounded-xl text-[#2c1810] md:text-pirate-gold focus:outline-none focus:border-pirate-gold focus:ring-4 focus:ring-pirate-gold/20 shadow-inner"
                                                                            autoComplete="off"
                                                                        />
                                                                        <motion.button
                                                                            type="submit"
                                                                            disabled={!inputValue || winnerDeclared || isSubmitting}
                                                                            className="w-full mt-2 px-6 py-4 md:py-3 bg-pirate-gold text-[#2c1810] font-black font-serif uppercase tracking-widest rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ffcc33] transition-colors shadow-md active:scale-95"
                                                                            whileTap={(!winnerDeclared && !isSubmitting) ? { scale: 0.95 } : {}}
                                                                        >
                                                                            {winnerDeclared ? 'Concluded' : isSubmitting ? 'Unlocking...' : 'Unlock'}
                                                                        </motion.button>
                                                                        <AnimatePresence>
                                                                            {errorMsg && (
                                                                                <motion.p
                                                                                    initial={{ opacity: 0, y: -10 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    exit={{ opacity: 0 }}
                                                                                    className="text-red-600 md:text-red-400 text-sm font-bold absolute bottom-0 translate-y-full pt-2"
                                                                                >
                                                                                    {errorMsg}
                                                                                </motion.p>
                                                                            )}
                                                                        </AnimatePresence>
                                                                    </form>
                                                                ) : (
                                                                    <div className="w-16 h-16 flex items-center justify-center opacity-30">
                                                                        <span className="text-5xl">⚓</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    )
}
