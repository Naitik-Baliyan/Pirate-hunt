import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { db } from '../firebase/firebaseConfig'
import { collection, query, where, orderBy, limit, getDocs, doc, onSnapshot } from 'firebase/firestore'
import mapBg from '../assets/registration-map.jpg' // Using map background for consistency

export default function Leaderboard({ phase }) {
    const [leaders, setLeaders] = useState([])
    const [loading, setLoading] = useState(true)
    const [winnerDeclared, setWinnerDeclared] = useState(false)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true)
            try {
                const completedField = phase === 1 ? 'phase1Completed' : 'phase2Completed'
                const timeField = phase === 1 ? 'phase1Time' : 'phase2Time'

                const q = query(
                    collection(db, 'treasure_hunt_participants'),
                    where(completedField, '==', true),
                    orderBy(timeField, 'asc'),
                    limit(20)
                )

                const querySnapshot = await getDocs(q)
                const participants = []
                querySnapshot.forEach((doc) => {
                    participants.push({ id: doc.id, ...doc.data() })
                })

                setLeaders(participants)
            } catch (error) {
                console.error("Error fetching leaderboard:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchLeaderboard()

        // Listener for Game Control (to check if hunt is concluded)
        const unsubControl = onSnapshot(doc(db, 'gameControl', 'currentPhase'), (docSnap) => {
            if (docSnap.exists()) {
                setWinnerDeclared(docSnap.data().winnerDeclared || false)
            }
        }, (err) => console.error(err))

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchLeaderboard, 30000)
        return () => {
            clearInterval(interval)
            unsubControl()
        }
    }, [phase])

    const getRankMedal = (index) => {
        if (index === 0) return '🥇'
        if (index === 1) return '🥈'
        if (index === 2) return '🥉'
        return `${index + 1}`
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return '--:--'
        const date = timestamp.toDate()
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
                        Top Treasure Hunters - Phase {phase}
                    </p>
                </div>

                <div className="bg-[#fdf5e6]/10 border-2 border-pirate-gold/30 rounded-3xl backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left font-serif min-w-[600px]">
                            <thead className="bg-[#2c1810]/80 text-pirate-gold border-b-2 border-pirate-gold/40">
                                <tr>
                                    <th className="p-4 md:p-6 text-xl tracking-widest text-center w-24">Rank</th>
                                    <th className="p-4 md:p-6 text-xl tracking-widest">Captain</th>
                                    <th className="p-4 md:p-6 text-xl tracking-widest">Roll No</th>
                                    <th className="p-4 md:p-6 text-xl tracking-widest hidden md:table-cell">Branch</th>
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
                                                {leader.rollNumber}
                                            </td>
                                            <td className="p-4 md:p-6 text-white/80 hidden md:table-cell uppercase tracking-wider">
                                                {leader.branch}
                                            </td>
                                            <td className="p-4 md:p-6 text-[#fdf5e6] text-right font-mono text-lg font-bold">
                                                {formatTime(phase === 1 ? leader.phase1Time : leader.phase2Time)}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
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
