import { motion } from 'framer-motion'
import mapBg from '../assets/registration-map.jpg'

export default function ARDownloadScreen({ onContinue }) {
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2e] via-transparent to-[#0a1a2e]/40" />
                <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(10,26,46,0.9)]" />
            </div>

            <motion.div
                className="max-w-2xl w-full text-center relative z-20 flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    className="mb-6"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <span className="text-6xl md:text-7xl drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">🧭</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-serif text-pirate-gold mb-4 drop-shadow-lg tracking-tight">
                    PREPARE FOR THE HUNT
                </h1>

                <p className="text-xl md:text-2xl text-pirate-gold font-serif mb-6 tracking-[0.1em] uppercase drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
                    To begin the AR Treasure Hunt, you must install the official scanning application.
                </p>

                <div className="bg-[#f4e4bc]/10 border-2 border-pirate-gold/30 rounded-3xl p-6 md:p-8 mb-10 w-full backdrop-blur-md shadow-xl border-dashed">
                    <p className="text-[#fdf5e6]/90 text-lg md:text-xl font-serif leading-relaxed tracking-wide">
                        This app will allow you to scan the AR markers hidden across the campus and reveal secret codes required to unlock the next clues.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6 w-full">
                    <motion.a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto relative overflow-hidden bg-pirate-gold px-10 py-5 rounded-2xl font-black text-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-3 group"
                        whileHover={{ scale: 1.02, backgroundColor: '#ffcc33', boxShadow: '0 25px 50px rgba(212,175,55,0.5)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="text-2xl">📱</span>
                        <span className="relative z-10 text-lg md:text-xl drop-shadow-sm font-black text-center whitespace-nowrap">
                            Download AR Scanner
                        </span>
                        <motion.div
                            className="absolute inset-0 bg-white/30 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"
                        />
                    </motion.a>

                    <p className="text-pirate-gold/70 font-serif text-sm italic tracking-widest uppercase">
                        Install the app and return here to continue your adventure.
                    </p>

                    <motion.button
                        onClick={onContinue}
                        className="w-full md:w-auto mt-2 px-10 py-4 rounded-xl border-2 border-pirate-gold/50 text-pirate-gold font-bold uppercase tracking-[0.2em] transition-all hover:bg-pirate-gold hover:text-black hover:border-pirate-gold"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        I Have Installed the App
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}
