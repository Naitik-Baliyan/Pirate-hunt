import { motion } from 'framer-motion'
import shipBg from '../assets/ship-bg.png'

export default function MaintenancePage() {
  return (
    <div className="w-full h-screen bg-[#0a101d] flex flex-col items-center justify-center relative overflow-hidden text-white">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={shipBg}
          alt="Ocean Voyage"
          className="w-full h-full object-cover opacity-40 brightness-50 contrast-125 saturate-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a101d]/60 via-transparent to-[#0a101d]" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 text-6xl opacity-10 filter blur-sm"
        animate={{ rotate: 360, y: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        🧭
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-20 text-6xl opacity-10 filter blur-sm"
        animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      >
        ⚓
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl md:text-9xl mb-8 drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]"
        >
          ⛓️
        </motion.div>

        <h1 className="text-4xl md:text-7xl font-serif font-black text-pirate-gold mb-4 tracking-[0.2em] uppercase drop-shadow-lg">
          Docked for Repairs
        </h1>

        <div className="w-24 h-1 bg-pirate-gold mb-8 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)]" />

        <p className="max-w-xl text-lg md:text-2xl font-serif italic text-white/70 leading-relaxed mb-12">
          "The winds have shifted and the hull needs mending. The Captain has ordered all sailors to remain ashore while we secure the cargo for Phase 2."
        </p>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pirate-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pirate-gold"></span>
            </span>
            <span className="text-pirate-gold font-mono tracking-widest uppercase text-sm">Status: Securing Vaults</span>
          </div>

          <p className="text-white/40 text-xs uppercase tracking-[0.5em] mt-8">
            Return when the tide rises
          </p>
        </div>
      </motion.div>

      {/* Animated Fog */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a101d] to-transparent pointer-events-none opacity-80" />
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 opacity-20"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
      />
    </div>
  )
}
