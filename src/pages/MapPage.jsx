import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import mapBg from '../assets/registration-map.jpg'

const locations = [
    { id: 1, name: "Azim premji", x: 25, y: 15 },
    { id: 2, name: "B-block", x: 75, y: 32 },
    { id: 3, name: "p-Block", x: 25, y: 50 },
    { id: 4, name: "Lovers point", x: 75, y: 68 },
    { id: 5, name: "raman block", x: 50, y: 85 },
]

export default function MapPage() {
    const navigate = useNavigate()

    return (
        <div className="w-full h-screen relative flex items-center justify-center bg-[#0a1a2e] overflow-hidden">

            {/* Background Layer: Map */}
            <div className="absolute inset-0 z-0">
                <img
                    src={mapBg}
                    alt="Ancient Map"
                    className="w-full h-full object-cover opacity-60 sepia-[0.3] brightness-50 contrast-125 saturate-[0.7]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2e] via-transparent to-[#0a1a2e]/40" />
                <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(10,26,46,0.9)]" />
            </div>

            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 z-50 bg-[#0a101d]/80 border-2 border-pirate-gold text-pirate-gold px-4 py-2 rounded-xl font-serif font-bold uppercase tracking-widest hover:bg-pirate-gold hover:text-[#0a101d] transition-all flex items-center gap-2"
            >
                <span>←</span> Back to Quest
            </motion.button>

            <motion.div
                className="relative z-10 w-full h-full max-w-6xl max-h-[90vh] mx-auto p-4 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl text-pirate-gold font-serif drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)] tracking-widest uppercase mb-2">
                        Treasure Map
                    </h1>
                    <div className="h-1 w-48 bg-gradient-to-r from-transparent via-pirate-gold to-transparent mx-auto" />
                </div>

                <div className="relative w-full aspect-square md:aspect-video max-w-4xl border-4 border-[#2c1810] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    {/* Simplified Map Visualization */}
                    <div className="absolute inset-0 bg-[#f4e4bc]/10 backdrop-blur-[2px]" />

                    {/* Decorative Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <motion.path
                            d="M 25 15 L 75 32 L 25 50 L 75 68 L 50 85"
                            fill="none"
                            stroke="#d4af37"
                            strokeWidth="0.8"
                            strokeDasharray="4, 4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                        />
                    </svg>

                    {locations.map((loc, index) => (
                        <div
                            key={loc.id}
                            className="absolute"
                            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                        >
                            <motion.div
                                className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1 * index + 0.5
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {/* Marker */}
                                <div className="w-10 h-10 md:w-14 md:h-14 bg-red-800 border-4 border-pirate-gold rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.7)]">
                                    <span className="text-white font-black font-serif text-base md:text-2xl drop-shadow-md">X</span>

                                    {/* Pulse effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-4 border-red-500"
                                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>

                                {/* Label */}
                                <div className="mt-2 px-3 py-1 bg-[#0a101d]/90 border-2 border-pirate-gold/40 rounded-xl shadow-2xl backdrop-blur-md">
                                    <span className="text-pirate-gold font-serif text-[10px] sm:text-xs md:text-base tracking-widest uppercase font-black">
                                        {loc.name}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-pirate-gold/60 font-serif italic text-center max-w-lg">
                    "Follow the marked paths to find the hidden letters. Each 'X' holds a secret of the island."
                </div>
            </motion.div>

            {/* Cinematic Vignette */}
            <div className="fixed inset-0 pointer-events-none z-20 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
        </div>
    )
}
