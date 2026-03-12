import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import tasksBg from '../assets/registration-map.jpg'

export default function TasksPage({ onLeaderboard, initialParticipant, initialGameState }) {
    const [gameState, setGameState] = useState(initialGameState || { current_phase: 2, phase1_winner_declared: true, phase2_winner_declared: false, phase3_winner_declared: false })
    const [participant, setParticipant] = useState(initialParticipant || null)
    const [clues, setClues] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoaded, setIsLoaded] = useState(!!initialParticipant)
    const [expandedQuestId, setExpandedQuestId] = useState(initialParticipant?.current_quest_index >= 5 ? 5 : (initialParticipant?.current_quest_index || 1))
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [transitionMessage, setTransitionMessage] = useState('')
    const [showInstructions, setShowInstructions] = useState(false)
    const navigate = useNavigate()

    const participantId = localStorage.getItem('pirateHuntDocId')

    useEffect(() => {
        if (!participantId) {
            navigate('/')
            return
        }

        // If data wasn't passed in (e.g. direct refresh in development), fetch it
        const fetchData = async () => {
            if (!participant || !gameState.current_word) {
                const { data: gs } = await supabase.from('game_state').select('*').single()
                const { data: p } = await supabase.from('participants').select('*').eq('participant_id', participantId).single()

                if (gs) setGameState(gs)
                if (p) {
                    setParticipant(p)
                    setExpandedQuestId(p.current_quest_index >= 5 ? 5 : p.current_quest_index)
                    setIsLoaded(true)
                } else {
                    navigate('/')
                }
            }
        }

        fetchData()

        // 3. Real-time Subscription for Game State
        const gameStateChannel = supabase.channel('game_state_changes')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_state' }, payload => {
                const data = payload.new
                setGameState(data)
            })
            .subscribe()

        // 4. Real-time Subscription for Participant
        const participantChannel = supabase.channel(`participant_${participantId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'participants', filter: `participant_id=eq.${participantId}` }, payload => {
                const data = payload.new
                setParticipant(data)
                if (data.current_phase !== 4) {
                    setExpandedQuestId(data.current_quest_index >= 5 ? 5 : data.current_quest_index)
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(gameStateChannel)
            supabase.removeChannel(participantChannel)
        }
    }, [participantId, navigate])

    useEffect(() => {
        if (!participant || participant.current_phase === 4) return

        if (participant.current_quest_index >= 6) {
            navigate('/leaderboard')
            return
        }

        const fetchClues = async () => {
            try {
                const { data, error } = await supabase
                    .from('clues')
                    .select('*')
                    .eq('phase_number', participant.current_phase)
                    .order('quest_number', { ascending: true })
                    .limit(5)

                if (data && !error && data.length > 0) {
                    const formattedQuests = data.map(c => ({
                        clue: c.clue_text,
                        id: c.quest_number,
                        answer: c.answer
                    }))
                    setClues(formattedQuests)
                } else {
                    setClues([])
                }
            } catch (err) {
                console.error("Error fetching clues: ", err)
                setClues([])
            } finally {
                setIsLoaded(true)
            }
        }
        fetchClues()
    }, [participant?.current_phase, navigate])

    const currentQuest = participant?.current_quest_index || 1
    const lettersCollected = participant?.letters_collected || []
    const progress = lettersCollected.length

    // Derived target string based on user phase - following prompt requirements
    const targetWord = gameState.current_word || '7H3N4'
    const targetLetters = targetWord.split('')

    const handleSumbitLetter = async (e) => {
        e.preventDefault()
        if (isSubmitting || !participant) return

        setIsSubmitting(true)
        setErrorMsg('')

        if (progress >= targetLetters.length || participant.current_phase === 4) {
            setIsSubmitting(false)
            return
        }

        // Fetch latest game state to check if phase is closed or winner declared
        const { data: gs, error: gsError } = await supabase.from('game_state').select('*').single()

        // Block Phase 1 submissions if winner declared
        if (gs && participant.current_phase === 1 && gs.phase1_winner_declared) {
            setErrorMsg('Phase 1 is closed. Please refresh for Phase 2!')
            setTimeout(() => setErrorMsg(''), 5000)
            setIsSubmitting(false)
            return
        }

        // Block submissions if hunt is completed
        if (gs && gs.winner_declared === true && gs.phase3_winner_declared === true) {
            setErrorMsg('Hunt Concluded! The treasure has been claimed.')
            setTimeout(() => setErrorMsg(''), 5000)
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

        if (cleanedInput === correctAnswer) {
            const newLetters = [...lettersCollected, cleanedInput]
            const nextQuestNum = currentQuest + 1
            const isFinishedPhase = currentQuest >= 5

            setInputValue('')

            try {
                let updateData = {
                    letters_collected: newLetters,
                    current_quest_index: nextQuestNum
                }

                if (isFinishedPhase) {
                    const now = new Date()

                    // Ensure duration is accurately derived for all phase winners and Phase 3 finishers
                    if (participant.start_time) {
                        const start = new Date(participant.start_time)
                        updateData.completion_duration = Math.floor((now - start) / 1000)
                    }

                    if (participant.current_phase === 1) {
                        updateData.phase1_time = now.toISOString()

                        const { data: isWinner, error: rpcErr1 } = await supabase.rpc('declare_phase_winner', {
                            p_participant_id: participantId,
                            p_phase_number: 1
                        })
                        if (rpcErr1) console.error('declare_phase_winner P1 error:', rpcErr1)

                        if (isWinner) {
                            updateData.phase1_completed = true
                            updateData.current_phase = 4 // Terminal State
                            updateData.completion_time = now.toISOString()
                        }
                    } else if (participant.current_phase === 2) {
                        updateData.phase2_time = now.toISOString()

                        const { data: isWinner, error: rpcErr2 } = await supabase.rpc('declare_phase_winner', {
                            p_participant_id: participantId,
                            p_phase_number: 2
                        })
                        if (rpcErr2) console.error('declare_phase_winner P2 error:', rpcErr2)

                        if (isWinner) {
                            updateData.phase2_completed = true
                            updateData.current_phase = 4 // Terminal State
                            updateData.completion_time = now.toISOString()
                        }
                    } else if (participant.current_phase === 3) {
                        updateData.phase3_time = now.toISOString()
                        updateData.completion_time = now.toISOString()

                        const { data: isWinner, error: rpcErr3 } = await supabase.rpc('declare_phase_winner', {
                            p_participant_id: participantId,
                            p_phase_number: 3
                        })
                        if (rpcErr3) console.error('declare_phase_winner P3 error:', rpcErr3)

                        if (isWinner) {
                            updateData.phase3_winner = true
                            updateData.phase3_completed = true
                            updateData.current_phase = 4 // Terminal State
                        }
                    }
                }

                const { error: updateError } = await supabase
                    .from('participants')
                    .update(updateData)
                    .eq('participant_id', participantId)

                if (updateError) throw updateError

                // Instantly update the local state so the next question renders immediately!
                setParticipant(prev => ({
                    ...prev,
                    ...updateData
                }))

                // Automatically expand the newly unlocked question
                if (updateData.current_phase !== 4) {
                    setExpandedQuestId(Math.min(updateData.current_quest_index, 5))
                }

                if (isFinishedPhase && updateData.current_phase !== 4) {
                    setTimeout(() => navigate('/leaderboard'), 1000)
                }

            } catch (err) {
                console.error("Error updating participant progress:", err)
                setErrorMsg('Network error. Try again.')
            } finally {
                setTimeout(() => setIsSubmitting(false), 500)
            }
        } else {
            setErrorMsg('Incorrect answer. Keep searching!')
            setTimeout(() => setErrorMsg(''), 3000)
            setTimeout(() => setIsSubmitting(false), 500)
        }
    }

    if (!isLoaded) return (
        <div className="w-full h-screen bg-[#0a1a2e] flex flex-col items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
            >
                🧭
            </motion.div>
            <div className="text-2xl animate-pulse text-pirate-gold font-serif tracking-widest uppercase">Charting Course...</div>
        </div>
    )

    return (
        <div className="w-full min-h-screen relative flex flex-col items-center py-8 px-4 md:py-12 md:px-8 bg-[#0a1a2e] overflow-y-auto no-scrollbar">
            {/* Three-dot Menu Button */}
            <div className="fixed top-4 right-4 z-[60]">
                <button
                    onClick={() => setShowInstructions(true)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0a101d]/70 border-2 border-pirate-gold/40 text-pirate-gold text-3xl hover:bg-pirate-gold/20 transition-all shadow-lg active:scale-90 touch-manipulation"
                >
                    ⋮
                </button>
            </div>

            {/* Instructions Modal */}
            <AnimatePresence>
                {showInstructions && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowInstructions(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[#0a1a2e] border-2 border-pirate-gold rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(212,175,55,0.3)] z-10"
                        >
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="absolute top-4 right-4 text-pirate-gold/50 hover:text-pirate-gold text-2xl transition-colors"
                            >
                                ✕
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <span className="text-5xl mb-4 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">📜</span>
                                <h2 className="text-2xl md:text-3xl font-serif font-black text-pirate-gold uppercase tracking-widest mb-6">
                                    Captain's Orders
                                </h2>

                                <div className="space-y-4 text-left w-full mb-8 font-serif">
                                    <div className="flex gap-4">
                                        <span className="text-pirate-gold">1.</span>
                                        <p className="text-[#fdf5e6]/80 text-sm md:text-base leading-relaxed">
                                            Solve the riddles to find the hidden locations across the island.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-pirate-gold">2.</span>
                                        <p className="text-[#fdf5e6]/80 text-sm md:text-base leading-relaxed">
                                            Each location holds a single secret letter. Collect all letters to form the target word.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-pirate-gold">3.</span>
                                        <p className="text-[#fdf5e6]/80 text-sm md:text-base leading-relaxed">
                                            Enter the found letter in the quest box to unlock the next leg of your journey.
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-pirate-gold">4.</span>
                                        <p className="text-[#fdf5e6]/80 text-sm md:text-base leading-relaxed">
                                            Be the first to finish and claim the ultimate sovereign's prize!
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col w-full gap-4">
                                    <button
                                        onClick={() => navigate('/map')}
                                        className="w-full bg-pirate-gold text-[#0a101d] font-black font-serif uppercase tracking-widest py-4 rounded-xl hover:bg-[#ffcc33] transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <span>🗺️</span> View Map
                                    </button>
                                    <button
                                        onClick={() => setShowInstructions(false)}
                                        className="w-full bg-white/5 text-[#fdf5e6]/60 font-serif uppercase tracking-widest py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Background Image Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src={tasksBg}
                    alt="Parchment Background"
                    className="w-full h-full object-cover opacity-90 sepia-[0.2] brightness-75 contrast-125 saturate-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a101d] via-transparent to-[#0a101d]/60" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(10,26,46,0.9)]" />
            </div>

            {/* Transition Overlay */}
            <AnimatePresence>
                {transitionMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a101d]/90 backdrop-blur-md px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="bg-black/60 border-2 border-pirate-gold/80 p-8 sm:p-12 rounded-3xl text-center max-w-lg shadow-[0_0_60px_rgba(212,175,55,0.4)] backdrop-blur-lg backdrop-saturate-150"
                        >
                            <motion.span
                                className="text-6xl sm:text-7xl mb-6 block drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            >
                                ⚓
                            </motion.span>
                            <h2 className="text-2xl sm:text-3xl font-serif font-black text-pirate-gold mb-4 uppercase tracking-widest leading-tight">
                                {transitionMessage}
                            </h2>
                            <p className="text-[#fdf5e6]/70 italic tracking-wide text-sm sm:text-base font-serif">
                                Prepare yourselves for the next leg of the journey!
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Interface */}
            <AnimatePresence mode="wait">
                {participant?.current_phase === 4 ? (
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
                            {participant?.phase1_completed ? "Phase 1 Winner!" : participant?.phase2_completed ? "Phase 2 Winner!" : participant?.phase3_winner ? "Phase 3 Winner!" : "Treasure Hunt Completed!"}
                        </h1>

                        {participant?.phase1_completed && (
                            <p className="text-white text-lg font-mono mb-4 text-center max-w-md">
                                You are the triumphant winner of Phase 1! As the sovereign, you rest while your crew battles in subsequent phases.
                            </p>
                        )}

                        {participant?.phase2_completed && (
                            <p className="text-white text-lg font-mono mb-4 text-center max-w-md">
                                You are the triumphant winner of Phase 2! As the sovereign, you rest while your crew battles in Phase 3.
                            </p>
                        )}

                        {participant?.phase3_winner && (
                            <p className="text-white text-lg font-mono mb-4 text-center max-w-md">
                                All Hail! You have claimed the ultimate treasure and won Phase 3!
                            </p>
                        )}

                        {participant?.completion_duration && (
                            <div className="text-white text-xl md:text-2xl font-mono mb-6 bg-[#0a101d]/60 px-6 py-2 rounded-full border border-pirate-gold/30">
                                Time Taken: {Math.floor(participant.completion_duration / 60)}m {(participant.completion_duration % 60).toString().padStart(2, '0')}s
                            </div>
                        )}

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
                                Phase {participant?.current_phase || 1}
                            </h1>

                            {/* Letters Progress Bar */}
                            <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-5 justify-center mt-6 md:mt-8 mb-4 max-w-full overflow-hidden">
                                {targetLetters.map((letter, i) => {
                                    const isRevealed = i < progress
                                    return (
                                        <div
                                            key={i}
                                            className="w-10 h-14 sm:w-12 sm:h-16 md:w-16 md:h-20 border-b-4 border-pirate-gold flex items-center justify-center bg-[#0a101d]/40 backdrop-blur-sm rounded-t-lg shadow-inner flex-shrink-0"
                                        >
                                            {isRevealed ? (
                                                <motion.span
                                                    className="text-2xl sm:text-3xl md:text-4xl font-black text-pirate-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", damping: 12 }}
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
                                                                            <span>📜</span> Riddle
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
                                                                            disabled={!inputValue || isSubmitting}
                                                                            className="w-full mt-2 px-6 py-4 md:py-3 bg-pirate-gold text-[#2c1810] font-black font-serif uppercase tracking-widest rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ffcc33] transition-colors shadow-md active:scale-95"
                                                                            whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                                                                        >
                                                                            {isSubmitting ? 'Unlocking...' : 'Unlock'}
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
