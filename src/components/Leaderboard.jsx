import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import mapBg from '../assets/registration-map.jpg' // Using map background for consistency

export default function Leaderboard() {
    const navigate = useNavigate()
    const [leaders, setLeaders] = useState([])
    const [loading, setLoading] = useState(true)
    const [winnerDeclared, setWinnerDeclared] = useState(false)
    const [myParticipant, setMyParticipant] = useState(null)
    const myId = localStorage.getItem('pirateHuntDocId')

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('participants')
                    .select('*')
                    .not('completion_time', 'is', null)
                    .order('current_phase', { ascending: false })
                    .order('completion_duration', { ascending: true })
                    .limit(50)

                if (data && !error) {
                    setLeaders(data)
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error)
            } finally {
                setLoading(false)
            }
        }

        const fetchGameState = async () => {
            const { data } = await supabase.from('game_state').select('*').single()
            if (data) {
                setWinnerDeclared(data.phase3_winner_declared || data.winner_declared === true)
            }
        }

        const fetchMyParticipant = async () => {
            if (!myId) return
            const { data } = await supabase.from('participants').select('*').eq('participant_id', myId).single()
            if (data) setMyParticipant(data)
        }

        fetchLeaderboard()
        fetchGameState()
        fetchMyParticipant()

        // Realtime Subscription
        const channel = supabase.channel('leaderboard_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, (payload) => {
                fetchLeaderboard()
                if (payload.new && payload.new.participant_id === myId) {
                    setMyParticipant(payload.new)
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state' }, (payload) => {
                if (payload.new) setWinnerDeclared(payload.new.phase3_winner_declared || payload.new.winner_declared === true)
            })
            .subscribe()

        return () => supabase.removeChannel(channel)
    }, [])

    const getRankMedal = (index) => {
        if (index === 0) return '🥇'
        if (index === 1) return '🥈'
        if (index === 2) return '🥉'
        return `${index + 1}`
    }

    const formatTime = (isoString) => {
        if (!isoString) return '--:--'
        const date = new Date(isoString)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }

    return (
        <div className="w-full min-h-screen relative flex items-center justify-center px-4 py-12 bg-[#0a1a2e] overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                    src={mapBg}
                    alt="Ancient Map"
                    className="w-full h-full object-cover opacity-60 sepia-[0.3] brightness-50 contrast-125 saturate-[0.7] scale-110"
                />
                <div className="absolute inset-0 bg-[#0a101d]/80" />
            </div>

            <motion.div
                className="w-full max-w-4xl relative z-20 flex flex-col pt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* HUNT CONCLUDED BANNER */}
                <AnimatePresence>
                    {winnerDeclared && (
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-900/80 border-2 border-red-500/50 rounded-2xl mb-8 p-4 text-center backdrop-blur-md shadow-[0_0_30px_rgba(255,0,0,0.3)]"
                        >
                            <h2 className="text-white text-2xl md:text-3xl font-black tracking-[0.3em] font-serif uppercase">
                                HUNT CONCLUDED
                            </h2>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {myParticipant?.current_quest_index >= 6 && myParticipant?.current_phase !== 4 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0a101d]/90 border-2 border-pirate-gold rounded-3xl p-6 text-center mb-8 md:mb-12 shadow-[0_0_40px_rgba(212,175,55,0.4)] backdrop-blur-md"
                        >
                            <h2 className="text-2xl md:text-3xl font-serif text-pirate-gold mb-2 tracking-widest uppercase font-black">
                                Phase {myParticipant.current_phase} Completed!
                            </h2>
                            <p className="text-white/80 font-mono mb-6 max-w-2xl mx-auto">
                                You fought bravely! But alas, another crew claimed the top spot for this phase. Review the ranks below before advancing!
                            </p>
                            <button
                                onClick={async () => {
                                    const nextPhase = myParticipant.current_phase + 1;
                                    const isFinal = nextPhase > 3;
                                    const updateData = {
                                        current_phase: isFinal ? 4 : nextPhase,
                                        current_quest_index: 1,
                                        letters_collected: []
                                    };
                                    await supabase.from('participants').update(updateData).eq('participant_id', myId);
                                    navigate('/tasks');
                                }}
                                className="bg-pirate-gold text-[#0a101d] px-8 py-3 rounded-xl font-black font-serif uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform"
                            >
                                {myParticipant.current_phase === 3 ? 'Conclude Journey' : `Proceed to Phase ${myParticipant.current_phase + 1}`}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center mb-8 md:mb-12">
                    <motion.div
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="text-5xl md:text-7xl mb-4 drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                    >
                        🏴‍☠️
                    </motion.div>
                    <h1 className="text-3xl md:text-5xl font-serif text-pirate-gold font-black uppercase tracking-widest drop-shadow-[0_4px_10px_rgba(212,175,55,0.4)]">
                        Captain's Log
                    </h1>
                    <p className="text-[#fdf5e6]/80 font-serif text-lg tracking-[0.2em] uppercase mt-4">
                        Top Treasure Hunters
                    </p>
                </div>

                <div className="bg-[#fdf5e6]/10 border-2 border-pirate-gold/30 rounded-3xl backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                    {/* Desktop View Table: Shown on larger screens */}
                    <div className="hidden md:block overflow-x-auto no-scrollbar">
                        <table className="w-full text-left font-serif">
                            <thead className="bg-[#2c1810]/80 text-pirate-gold border-b-2 border-pirate-gold/40">
                                <tr>
                                    <th className="p-4 md:p-6 text-xl tracking-widest text-center w-24">Rank</th>
                                    <th className="p-4 md:p-6 text-xl tracking-widest">Captain</th>
                                    <th className="p-4 md:p-6 text-xl tracking-widest">Roll No</th>
                                    <th className="p-4 md:p-6 text-xl tracking-widest hidden lg:table-cell">Branch</th>
                                    <th className="p-4 md:p-6 text-xl tracking-widest text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-pirate-gold animate-pulse text-xl tracking-widest">
                                            Unrolling the records...
                                        </td>
                                    </tr>
                                ) : leaders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-white/50 text-xl tracking-widest italic">
                                            No sailors have claimed the treasure yet.
                                        </td>
                                    </tr>
                                ) : (
                                    leaders.map((leader, index) => (
                                        <motion.tr
                                            key={leader.id}
                                            className="border-b border-pirate-gold/10 hover:bg-pirate-gold/10 transition-colors"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <td className="p-4 md:p-6 text-center text-3xl font-black drop-shadow-md pb-4">
                                                {getRankMedal(index)}
                                            </td>
                                            <td className="p-4 md:p-6 text-[#fdf5e6] text-xl font-bold uppercase tracking-wide">
                                                {leader.name}
                                            </td>
                                            <td className="p-4 md:p-6 text-pirate-gold/80 font-bold font-mono text-lg">
                                                {leader.roll_number || '---'}
                                            </td>
                                            <td className="p-4 md:p-6 text-white/80 hidden lg:table-cell uppercase tracking-wider">
                                                {leader.branch || '---'} {leader.phase1_completed ? '(P1 Winner)' : leader.phase2_completed ? '(P2 Winner)' : leader.phase3_winner ? '(P3 Winner)' : '(Finished)'}
                                            </td>
                                            <td className="p-4 md:p-6 text-[#fdf5e6] text-right font-mono text-lg font-bold">
                                                {formatTime(leader.completion_time)}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Card-based layout for 320px-480px */}
                    <div className="md:hidden flex flex-col divide-y divide-pirate-gold/10">
                        {loading ? (
                            <div className="p-12 text-center text-pirate-gold animate-pulse text-lg tracking-widest">
                                Unrolling the records...
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {leaders.map((leader, index) => (
                                    <motion.div
                                        key={leader.id}
                                        className={`p-6 flex flex-col gap-4 relative overflow-hidden border-b border-pirate-gold/10 ${index === 0 ? 'bg-pirate-gold/5' : ''}`}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
                                                    {getRankMedal(index)}
                                                </span>
                                                <div className="flex flex-col">
                                                    <span className="text-[#fdf5e6] font-serif font-black text-xl uppercase tracking-widest leading-none mb-1">
                                                        {leader.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-pirate-gold/70 font-mono text-xs tracking-widest uppercase">
                                                            {leader.roll_number || '---'}
                                                        </span>
                                                        <span className="text-white/30 text-xs">|</span>
                                                        <span className="text-white/50 font-serif italic text-xs uppercase tracking-tighter">
                                                            {leader.branch || 'Crew'} {leader.phase1_completed ? '(P1 Winner)' : leader.phase2_completed ? '(P2 Winner)' : leader.phase3_winner ? '(P3 Winner)' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <div className="bg-[#2c1810]/80 px-3 py-1.5 rounded-lg border border-pirate-gold/40 shadow-lg">
                                                    <span className="text-pirate-gold font-mono text-sm font-black whitespace-nowrap">
                                                        {formatTime(leader.completion_time)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subtle highlight for top 3 */}
                                        {index < 3 && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pirate-gold/15 via-transparent to-transparent pointer-events-none" />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </motion.div>

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
