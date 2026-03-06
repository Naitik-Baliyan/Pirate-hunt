import { motion } from 'framer-motion'
// Note: Using registration-map.jpg as a placeholder. 
// You can replace this import with the new image you provided by saving it to the assets folder!
import rulesBg from '../assets/registration-map.jpg'

function RuleItem({ icon, title, desc }) {
    return (
        <motion.div
            className="flex items-start gap-4"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <span className="text-3xl md:text-4xl drop-shadow-md py-1">{icon}</span>
            <div>
                <h3 className="text-pirate-gold font-bold font-serif text-lg md:text-xl tracking-wide uppercase drop-shadow-sm">{title}</h3>
                <p className="text-[#2c1810] md:text-[#fdf5e6] font-serif mt-1 object-cover md:bg-[#0a101d]/60 bg-[#fdf5e6]/60 backdrop-blur-sm p-3 rounded-lg border border-pirate-gold/20 shadow-sm md:shadow-none leading-relaxed text-sm md:text-base md:p-0 md:bg-transparent md:backdrop-blur-none md:border-none font-medium md:font-normal">
                    {desc}
                </p>
            </div>
        </motion.div>
    )
}

export default function RulesPage({ onContinue }) {
    return (
        <div className="w-full min-h-screen relative flex flex-col items-center bg-[#0a1a2e] overflow-hidden py-8 px-4 md:py-12 md:px-8 z-20">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src={rulesBg}
                    alt="Parchment Background"
                    className="w-full h-full object-cover md:object-cover sm:object-fill opacity-90 sepia-[0.3] brightness-75 contrast-125 saturate-[0.8]"
                />
                {/* Gradient overlays to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a101d] via-transparent to-[#0a101d]/60" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(10,26,46,0.9)]" />
            </div>

            {/* Scrollable Content Container */}
            <motion.div
                className="relative z-10 w-full max-w-4xl h-full flex-1 overflow-y-auto no-scrollbar rounded-2xl md:p-8 p-4 bg-transparent md:bg-[#0a101d]/70 md:backdrop-blur-md md:border md:border-pirate-gold/30 shadow-none md:shadow-[0_0_40px_rgba(0,0,0,0.8)] pb-12"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            >
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-4xl md:text-6xl font-serif text-[rgb(44,24,16)] md:text-pirate-gold drop-shadow-lg md:drop-shadow-[0_4px_10px_rgba(212,175,55,0.4)] tracking-widest uppercase font-black">
                        The Pirate Code
                    </h1>
                    <p className="text-[rgb(44,24,16)] font-bold md:font-normal md:text-pirate-gold/70 font-serif mt-2 tracking-widest uppercase text-sm md:text-base">
                        Rules of the Hunt
                    </p>
                </div>

                {/* Rules Section */}
                <div className="space-y-6 md:space-y-8 mb-12">
                    <RuleItem
                        icon="⚓"
                        title="Eligibility"
                        desc="Only sailors from the B.Tech and MCA fleets are permitted to join this quest. All other travelers must remain ashore."
                    />
                    <RuleItem
                        icon="🧭"
                        title="Solo Voyage"
                        desc="This treasure hunt is a solo expedition. Every pirate must rely on their own wit and courage — forming crews or helping fellow hunters is strictly forbidden."
                    />
                    <RuleItem
                        icon="🗝"
                        title="No Sharing of Secrets"
                        desc="True pirates earn their treasure. Sharing clues, codes, or locations with others will be considered breaking the Pirate Code."
                    />
                    <RuleItem
                        icon="⏳"
                        title="Race for the Treasure"
                        desc="The hunt follows the law of the seas: First Come, First Serve. The fastest pirates to complete the journey and unlock the final treasure will claim victory."
                    />
                    <RuleItem
                        icon="📜"
                        title="Follow the Trail"
                        desc="Every clue leads to a hidden AR marker somewhere on campus. Scan the marker, reveal the secret code, and enter it on the website to unlock the next location."
                    />
                    <RuleItem
                        icon="🏆"
                        title="Claim the Treasure"
                        desc="The first 3 pirates who complete the full quest will be crowned the champions of the hunt and honored during the Industria Event."
                    />
                </div>

                {/* Finishing Line */}
                <motion.div
                    className="text-center mt-12 mb-12 bg-[#2c1810]/10 md:bg-pirate-gold/10 p-6 md:p-8 rounded-2xl border-t-2 border-b-2 border-[#2c1810]/40 md:border-pirate-gold/50 backdrop-blur-sm"
                    whileHover={{ scale: 1.01 }}
                >
                    <p className="text-lg md:text-2xl font-serif text-[#2c1810] md:text-pirate-gold tracking-widest drop-shadow-md italic font-bold">
                        ⚓ “The seas favor the bold. Decode the clues, sail the campus, and claim the treasure.”
                    </p>
                </motion.div>

                {/* Tap to Continue Button */}
                <div className="flex justify-center mt-8 pb-8">
                    <motion.button
                        onClick={onContinue}
                        className="group relative px-8 py-5 bg-pirate-gold text-[#2c1810] font-black font-serif uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.4)] border-2 border-pirate-gold/50 transition-all flex items-center gap-3 overflow-hidden"
                        whileHover={{ scale: 1.05, backgroundColor: "#ffcc33" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                    >
                        <span className="relative z-10 drop-shadow-sm text-lg md:text-xl">Accept Terms & Continue</span>
                        <span className="relative z-10 text-2xl">📜</span>
                        <motion.div
                            className="absolute inset-0 bg-white/40 -translate-x-full transition-transform duration-700 group-hover:translate-x-full"
                        />
                    </motion.button>
                </div>
            </motion.div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}
