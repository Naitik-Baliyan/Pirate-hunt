import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import shipBg from '../assets/ship-bg.png' // I will copy the cinematic ship here
import captainImg from '../assets/jack_sparrow2.png' // I will copy the captain here
import mapTexture from '../assets/story-bg.png' // Use the map texture for the banner

export default function BootScreen({ onBootComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onBootComplete()
    }, 7000) // Increased to 7 seconds for a more cinematic build-up
    return () => clearTimeout(timer)
  }, [onBootComplete])

  return (
    <div className="w-full h-screen bg-[#0a1a2e] flex items-center justify-center overflow-hidden relative">
      {/* 1. Cinematic Background with Deep Parallax */}
      <motion.div
        className="absolute inset-0 z-0 animate-ocean"
        initial={{ scale: 1.25, opacity: 0, x: -50 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 3 } }}
        style={{ willChange: 'transform, opacity' }}
      >
        <img
          src={shipBg}
          alt="Ocean Voyage"
          className="w-full h-full object-cover brightness-105 contrast-125 saturate-[0.8]"
        />
        {/* Volumetric Light/Fog Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a2e]/80 via-transparent to-white/10" />
      </motion.div>

      {/* Cinematic Light Leaks */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[15] mix-blend-screen opacity-20"
        animate={{ opacity: [0.1, 0.3, 0.1], x: [-50, 50] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <div className="absolute inset-x-[-20%] top-[-10%] h-[150%] bg-gradient-to-r from-transparent via-orange-400/20 to-transparent rotate-[35deg] blur-3xl" />
      </motion.div>

      {/* Global Cinematic Vignette Layer */}
      <div className="cinematic-vignette z-10" />

      {/* 2. Pirate Captain with Photorealistic Cinematic Grading */}
      <motion.div
        className="absolute z-20 w-72 md:w-[600px] pointer-events-none -bottom-5 -left-5 md:-bottom-10 md:-left-20"
        initial={{ x: -400, y: 100, opacity: 0, rotate: -15, scale: 0.8, filter: 'blur(10px)' }}
        animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{
          delay: 0.8,
          duration: 2.8,
          type: "spring",
          stiffness: 20,
          damping: 12
        }}
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <div className="relative">
          {/* Rim Light / Glow Integration */}
          <div
            className="absolute inset-0 bg-white/10 blur-[40px] md:blur-[90px] rounded-full scale-110 -z-10 mix-blend-soft-light"
            style={{ willChange: 'filter' }}
          />

          <img
            src={captainImg}
            alt="Captain"
            className="w-full drop-shadow-[20px_20px_40px_rgba(0,0,0,0.8)] md:drop-shadow-[60px_60px_100px_rgba(0,0,0,0.95)] filter brightness-[1.05] contrast-[1.4] saturate-[0.75] sepia-[0.1]"
          />

          {/* Subtle Action Rim Highlighting (Procedural) */}
          <div className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Realistic Splash / Mist Cloud */}
          <motion.div
            className="absolute bottom-[-15%] left-[-15%] right-[-15%] h-[60%] bg-white/5 blur-[50px] md:blur-[100px] rounded-[50%] -z-10 mix-blend-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1.1 }}
            transition={{ delay: 1.8, duration: 1.5 }}
            style={{ willChange: 'transform, opacity, filter' }}
          />
        </div>
      </motion.div>

      {/* 3. Cinematic Parchment Banner Unfold */}
      <div className="absolute top-[21%] md:top-[28%] left-0 w-full z-40 flex flex-col items-center px-4 md:px-6 pointer-events-none">
        <motion.div
          className="relative w-full flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glowing Aura behind the banner with flicker */}
          <motion.div
            className="absolute inset-x-0 h-full bg-pirate-gold/25 blur-[40px] md:blur-[60px] rounded-full -z-10"
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative w-max max-w-full">
            {/* Banner Background with Map Texture and Burned Edges Effect */}
            <motion.div
              className="relative overflow-visible bg-[#f4e4bc] border-y-[4px] md:border-y-[6px] border-[#8b6a1f] shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
              initial={{ width: 0 }}
              animate={{ width: "fit-content" }}
              transition={{ delay: 3, duration: 1.5, ease: "circOut" }}
            >
              {/* Map Texture Overlay */}
              <img
                src={mapTexture}
                alt="texture"
                className="absolute inset-0 w-full h-full object-cover opacity-40 sepia contrast-125"
              />

              {/* Parchment Creases / Folds */}
              <div className="absolute inset-y-0 left-1/4 w-[1px] bg-black/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]" />
              <div className="absolute inset-y-0 right-1/4 w-[1px] bg-black/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]" />

              {/* Gold Leaf Accents / Grain */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gold-dust.png')] opacity-20 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#8b6a1f]/40 via-transparent to-[#8b6a1f]/40" />

              {/* 4. Banner Text with Premium Cinematic Styling */}
              <motion.div
                className="relative px-6 py-6 sm:px-16 md:px-48 lg:px-64 md:py-10 text-center min-w-[260px] sm:min-w-[500px] lg:min-w-[800px]"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 4, duration: 2 }}
              >
                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 w-full">
                  <motion.div
                    className="flex items-center gap-2 md:gap-3 mb-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.2, duration: 0.8 }}
                  >
                    <div className="h-[1.5px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-[#8b6a1f]" />
                    <span className="text-[10px] sm:text-xs md:text-sm font-serif tracking-[0.3em] sm:tracking-[0.6em] text-[#8b6a1f] uppercase font-black whitespace-nowrap">ENTERING THE VAULT</span>
                    <div className="h-[1.5px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-[#8b6a1f]" />
                  </motion.div>

                  <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter text-[#2c1810] uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] leading-none w-full">
                    <span className="relative inline-block">
                      E-Cell MIET
                      {/* Subtle gold shine sweep */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 pointer-events-none"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ delay: 4, duration: 3, repeat: Infinity, repeatDelay: 4 }}
                      />
                    </span>
                  </h1>

                  <div className="flex items-center gap-3 md:gap-5 w-full mt-2 md:mt-3 max-w-sm md:max-w-lg mx-auto">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#8b6a1f]/60 to-[#8b6a1f]" />
                    <span className="text-sm sm:text-base md:text-3xl font-serif text-[#2c1810] italic lowercase opacity-80 font-bold tracking-widest whitespace-nowrap">presents</span>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#8b6a1f]/60 to-[#8b6a1f]" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Banner Decorative Scrolls (Ends) - Heavy Wood Cylinders */}
            <motion.div
              className="absolute -left-4 top-[-15%] bottom-[-15%] w-8 bg-gradient-to-r from-[#2c1810] via-[#5d4037] to-[#2c1810] border-[3px] border-[#8b6a1f] rounded-full shadow-2xl z-50 overflow-hidden"
              initial={{ scaleY: 0, rotate: -20 }}
              animate={{ scaleY: 1, rotate: 0 }}
              transition={{ delay: 2, duration: 1.5 }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30" />
              <div className="h-full w-full bg-gradient-to-b from-black/40 via-transparent to-black/40" />
            </motion.div>

            <motion.div
              className="absolute -right-4 top-[-15%] bottom-[-15%] w-8 bg-gradient-to-r from-[#2c1810] via-[#5d4037] to-[#2c1810] border-[3px] border-[#8b6a1f] rounded-full shadow-2xl z-50 overflow-hidden"
              initial={{ scaleY: 0, rotate: 20 }}
              animate={{ scaleY: 1, rotate: 0 }}
              transition={{ delay: 2, duration: 1.5 }}
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30" />
              <div className="h-full w-full bg-gradient-to-b from-black/40 via-transparent to-black/40" />
            </motion.div>
          </div>

          {/* Golden Embers around the banner */}
          <motion.div
            className="absolute -inset-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-pirate-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"
                animate={{
                  y: [0, -60, -120],
                  x: [0, Math.random() * 80 - 40, Math.random() * 120 - 60],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.2, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 4 + (i * 0.3),
                  ease: "easeInOut"
                }}
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  bottom: '20%'
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Intro Fog / Mist */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"
        animate={{ opacity: [0.2, 0.4, 0.2], x: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
