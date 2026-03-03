import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Map, Trophy, User, Crosshair, HelpCircle, Compass } from 'lucide-react';
import BottomNav from './BottomNav';
import ChallengeModal from './ChallengeModal';
import { getUser, getProgress, saveProgress } from '../utils/storage';

const MapHub = () => {
    const [user, setUser] = useState(null);
    const [progress, setProgress] = useState({ level: 1, score: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Parallax motion values
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);
    const rotateX = useTransform(y, [0, 1], [3, -3]);
    const rotateY = useTransform(x, [0, 1], [-3, 3]);

    useEffect(() => {
        const storedUser = getUser();
        const storedProgress = getProgress();
        setUser(storedUser);
        setProgress(storedProgress);
    }, []);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) / rect.width;
        const mouseY = (event.clientY - rect.top) / rect.height;
        x.set(mouseX);
        y.set(mouseY);
    };

    const challenges = [
        {
            title: "The Old Oak Riddle",
            question: "I have branches, but no fruit, trunk, or leaves. What am I?",
            answer: "bank"
        },
        {
            title: "The Sunlit Fountain",
            question: "I can run, but never walk. I have a mouth, but never speak. What am I?",
            answer: "river"
        },
        {
            title: "The Silent Watchman",
            question: "I have no voice, but I can show you the world. What am I?",
            answer: "mirror"
        }
    ];

    const isAllCompleted = progress.level > challenges.length;
    const currentChallenge = !isAllCompleted ? challenges[progress.level - 1] : null;

    const handleCorrectAnswer = () => {
        const nextLevel = progress.level + 1;
        const nextScore = progress.score + 100;
        setProgress({ level: nextLevel, score: nextScore });
        saveProgress(nextLevel, nextScore);

        // If this was the final challenge, redirect to leaderboard
        if (nextLevel > challenges.length) {
            setTimeout(() => {
                navigate('/leaderboard');
            }, 1500); // Small delay to let success state show
        }
    };

    return (
        <div
            className="min-h-screen bg-parchment flex flex-col pb-32 overflow-hidden perspective-1000"
            onMouseMove={handleMouseMove}
        >
            {/* Drifting Clouds Background */}
            <div className="absolute top-[20%] left-[-100px] w-64 h-20 cloud opacity-20 pointer-events-none">
                <svg viewBox="0 0 24 24" fill="sky-blue"><path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.412,0.045-0.812,0.131-1.197C11.558,12.13,10.8,12,10,12c-2.761,0-5,2.239-5,5c0,2.761,2.239,5,5,5h7.5c2.485,0,4.5-2.015,4.5-4.5S20.485,13,18,13C17.828,13,17.661,13.012,17.5,13.035z" /></svg>
            </div>

            {/* Header Dashboard */}
            <header className="bg-ocean-blue text-white p-6 rounded-b-[3rem] shadow-[0_10px_30px_rgba(0,0,0,0.15)] relative overflow-hidden z-10">
                <div className="absolute top-[-20px] right-[-20px] opacity-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                    >
                        <Compass className="w-56 h-56" />
                    </motion.div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="bg-white/20 p-2.5 rounded-full border-2 border-white/30"
                    >
                        <User className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] leading-none mb-1">Explorer</h2>
                        <h1 className="text-xl font-black truncate max-w-[200px] uppercase">{user?.name || 'Recruit'}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                    <div className="bg-white/15 backdrop-blur-md p-4 rounded-3xl border border-white/20 flex flex-col items-center">
                        <Crosshair className="w-5 h-5 text-gold mb-1" />
                        <span className="text-[10px] uppercase font-black opacity-50 tracking-widest">Level</span>
                        <span className="text-2xl font-black">
                            {isAllCompleted ? challenges.length : progress.level}
                        </span>
                    </div>
                    <div className="bg-white/15 backdrop-blur-md p-4 rounded-3xl border border-white/20 flex flex-col items-center text-gold">
                        <Trophy className="w-5 h-5 mb-1" />
                        <span className="text-[10px] uppercase font-black opacity-50 tracking-widest text-white">Score</span>
                        <span className="text-2xl font-black">{progress.score}</span>
                    </div>
                </div>
            </header>

            {/* Main Content with Micro-Parallax */}
            <main className="flex-1 p-6 flex flex-col items-center justify-center relative">
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="w-full max-w-sm relative group"
                >
                    <div className="absolute inset-0 bg-ocean-blue opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-1000 -z-10" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="parchment-card p-10 flex flex-col items-center border-[6px] border-amber-300 shadow-2xl relative"
                    >
                        <div className="bg-orange-50 p-6 rounded-full border-4 border-amber-200 mb-8 float-game shadow-inner">
                            {isAllCompleted ? <Trophy className="w-16 h-16 text-amber-600" /> : <Map className="w-16 h-16 text-amber-600" />}
                        </div>

                        <h3 className="text-2xl font-black text-amber-900 mb-2 text-center uppercase tracking-tighter">
                            {isAllCompleted ? "Voyage Finished" : "Current Destination"}
                        </h3>
                        <p className="text-amber-700 font-bold mb-8 opacity-80 uppercase tracking-widest text-xs italic bg-amber-100/50 px-4 py-1 rounded-full text-center">
                            {isAllCompleted ? "All riddles solved!" : currentChallenge?.title}
                        </p>

                        {isAllCompleted ? (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => navigate('/leaderboard')}
                                className="w-full btn-gold h-16 flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(255,215,0,0.4)] text-lg font-black uppercase tracking-tighter relative overflow-hidden"
                            >
                                <span className="relative z-10">VIEW SHIP RANKINGS</span>
                                <Trophy className="w-6 h-6 relative z-10" />
                            </motion.button>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setIsModalOpen(true)}
                                className="w-full btn-gold h-16 flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(255,215,0,0.4)] text-lg font-black uppercase tracking-tighter relative overflow-hidden"
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-full z-0"
                                />
                                <span className="relative z-10">START CHALLENGE</span>
                                <Crosshair className="w-6 h-6 relative z-10 sparkle" />
                            </motion.button>
                        )}
                    </motion.div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="mt-12 flex items-center gap-12 opacity-15">
                    <HelpCircle className="w-10 h-10 text-amber-900" />
                    <Compass className="w-14 h-14 text-amber-900 animate-spin-slow rotate-[45deg]" />
                    <Trophy className="w-10 h-10 text-amber-900" />
                </div>
            </main>

            {!isAllCompleted && (
                <ChallengeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    challenge={currentChallenge}
                    onCorrectAnswer={handleCorrectAnswer}
                />
            )}

            <BottomNav />

            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default MapHub;
