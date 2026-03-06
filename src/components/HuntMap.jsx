import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import mapBg from '../assets/registration-map.jpg'

const locations = [
    { id: 1, name: "Azim Premji", x: 25, y: 15 },
    { id: 2, name: "B-block", x: 75, y: 32 },
    { id: 3, name: "P-block", x: 25, y: 50 },
    { id: 4, name: "Lovers Point", x: 75, y: 68 },
    { id: 5, name: "Raman Block", x: 50, y: 85 },
]

export default function HuntMap({ onComplete }) {
    const [isUnlocking, setIsUnlocking] = useState(true)

    useEffect(() => {
        // Map Unlocking screen duration
        const timer1 = setTimeout(() => {
            setIsUnlocking(false)
        }, 4500)

        // Auto transition to Tasks Page after 14 seconds (gives 9.5s to view paths and markers)
        const timer2 = setTimeout(() => {
            if (onComplete) onComplete()
        }, 14000)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [onComplete])

    // Generate SVG path string for connecting lines
    const pathData = locations.map((loc, i) => `${i === 0 ? 'M' : 'L'} ${loc.x} ${loc.y}`).join(' ')

    return (
        <div className="w-full h-screen relative flex items-center justify-center bg-[#0a1a2e] overflow-hidden">

            {/* Background Layer: Map */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                    src={mapBg}
                    alt="Ancient Map"
                    className="w-full h-full object-cover opacity-60 sepia-[0.3] brightness-50 contrast-125 saturate-[0.7] transform scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2e] via-transparent to-[#0a1a2e]/40" />
                <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(10,26,46,0.9)]" />
            </div>

            <AnimatePresence mode="wait">
                {isUnlocking ? (
                    <motion.div
                        key="unlocking"
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a101d] px-4"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    >
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-6xl text-pirate-gold font-serif drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
                                Map Unlocking...
                            </h1>
                            <p className="text-xl md:text-2xl text-pirate-gold/60 mt-6 tracking-widest font-serif uppercase">
                                The Journey Begins Soon
                            </p>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="map"
                        className="absolute inset-0 z-10 w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Dashed Path connecting points */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <motion.path
                                d={pathData}
                                fill="none"
                                stroke="#d4af37"
                                strokeWidth="0.5"
                                strokeDasharray="1.5, 1.5"
                                vectorEffect="non-scaling-stroke"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.6 }}
                                transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
                            />
                        </svg>

                        {/* Location Markers */}
                        {locations.map((loc, index) => (
                            <div
                                key={loc.id}
                                className="absolute"
                                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                            >
                                <div className="absolute top-0 left-0 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2">
                                    <motion.div
                                        className={`relative w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 border-[#2c1810] backdrop-blur-sm cursor-pointer z-20 ${loc.id === 5
                                            ? 'bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.8)]'
                                            : 'bg-pirate-gold/90 shadow-[0_0_15px_rgba(212,175,55,0.6)]'
                                            }`}
                                        initial={{ opacity: 0, scale: 0, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: 1 + index * 0.8
                                        }}
                                        whileHover={{ scale: 1.15 }}
                                    >
                                        {loc.id === 5 && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-2 border-red-500"
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                        )}
                                        <span className={`${loc.id === 5 ? 'text-white' : 'text-[#2c1810]'} font-black font-serif text-lg md:text-2xl drop-shadow-sm`}>
                                            {loc.id === 5 ? 'X' : loc.id}
                                        </span>
                                    </motion.div>

                                    <motion.div
                                        className="mt-3 px-3 py-1.5 md:px-4 md:py-2 bg-[#0a101d]/90 border border-pirate-gold/50 rounded-xl whitespace-nowrap shadow-xl z-30"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 1.3 + index * 0.8 }}
                                    >
                                        <span className="text-pirate-gold font-serif text-xs md:text-sm tracking-widest uppercase font-bold drop-shadow-md">
                                            {loc.name}
                                        </span>
                                    </motion.div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
