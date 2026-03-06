import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import shipBg from '../assets/ship-bg.png' // I will copy the cinematic ship here
import captainImg from '../assets/jack_sparrow2.png' // I will copy the captain here
import mapTexture from '../assets/story-bg.png' // Use the map texture for the banner

export default function BootScreen({ onBootComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onBootComplete()
    }, 4500) // 4.5 seconds for the full cinematic intro
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

      {/* 3. Parchment Banner Unfold */}
      <div className="absolute top-[15%] md:top-[25%] left-0 w-full z-30 flex flex-col items-center px-6 pointer-events-none">
        <motion.div
          className="relative overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "fit-content", opacity: 1 }}
          transition={{ delay: 2, duration: 1, ease: "easeInOut" }}
        >
          <div className="relative p-1">
            {/* Banner Background with Map Texture */}
            <motion.div
              className="absolute inset-0 bg-[#f4e4bc] border-y-4 border-[#8b6a1f] shadow-2xl"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 2, duration: 1, ease: "easeInOut" }}
              style={{ originX: 0.5 }}
            >
              <img
                src={mapTexture}
                alt="texture"
                className="absolute inset-0 w-full h-full object-cover opacity-20 sepia contrast-150"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#8b6a1f]/10 via-transparent to-[#8b6a1f]/10" />
            </motion.div>

            {/* 4. Banner Text */}
            <motion.div
              className="relative px-6 py-4 sm:px-12 md:px-24 md:py-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
            >
              <h1 className="text-lg leading-tight sm:text-xl md:text-3xl font-serif font-black tracking-[0.1em] text-[#2c1810] uppercase drop-shadow-sm flex flex-col md:flex-row items-center justify-center">
                <span>E-Cell MIET</span>
                <span className="md:ml-3 mt-1 md:mt-0 text-sm md:text-xl font-normal opacity-80">Presents</span>
              </h1>
            </motion.div>
          </div>

          {/* Banner Decorative Scrolls (Ends) */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-2 bg-[#5d4037] border-l-2 border-[#3d2b22]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          />
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-2 bg-[#5d4037] border-r-2 border-[#3d2b22]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          />
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
