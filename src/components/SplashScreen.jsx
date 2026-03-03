import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ShipIcon = () => (
    <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-2xl">
        <path
            d="M30,130 Q100,160 170,130 L160,160 Q100,180 40,160 Z"
            fill="#4A2C08"
            stroke="#221100"
            strokeWidth="2"
        />
        <path d="M100,130 L100,40" stroke="#4A2C08" strokeWidth="4" />
        <path d="M100,50 L160,90 L100,110 Z" fill="#F0E68C" stroke="#BDB76B" strokeWidth="2" />
        <path d="M100,45 L40,85 L100,105 Z" fill="#FFF8DC" stroke="#DEB887" strokeWidth="2" />
        <path d="M60,150 Q100,160 140,150" fill="none" stroke="#66CAFF" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

const SplashScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/register');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="h-screen w-full bg-nautical-gradient flex flex-col items-center justify-center text-white overflow-hidden p-6 text-center relative">
            {/* Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="sparkle absolute w-2 h-2 bg-gold rounded-full"
                        style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 0.5}s`,
                            opacity: 0.4
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 1,
                    ease: [0.34, 1.56, 0.64, 1]
                }}
                className="mb-8 relative"
            >
                {/* Gold Glow behind ship */}
                <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full scale-150 -z-10" />

                <div className="float-game">
                    <ShipIcon />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                className="relative"
            >
                <h2 className="text-xl font-bold tracking-[0.3em] uppercase mb-2 text-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    E-Cell MIET
                </h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-lg italic mb-6 opacity-80"
                >
                    presents
                </motion.p>
                <h1 className="text-5xl font-black tracking-tight mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] bg-gradient-to-b from-white to-sky-100 bg-clip-text text-transparent">
                    TREASURE HUNT
                </h1>

                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-sm font-black tracking-[0.4em] text-gold/80"
                >
                    INITIALIZING ADVENTURE...
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
