import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Map, Trophy, User, Crosshair, HelpCircle, Compass, Star, Zap } from 'lucide-react';
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
            title: "The Genesis",
            question: "Every founder begins somewhere small, A blank page before the rise and the fall. Where young minds arrive with dreams untold, Seek the halls where fresh journeys unfold.",
            answer: "First-Year Building"
        },
        {
            title: "Visionary Roots",
            question: "Every journey begins with learning first, But wisdom grows where vision is rehearsed. A titan of industry whose name stands tall, Find the block that honors his call.",
            answer: "Azim Premji Block"
        },
        {
            title: "Creation Hub",
            question: "Ideas alone are not enough to win, Innovation begins where tools spin. Circuits, wires, sparks of creation, Seek the lab of bold imagination.",
            answer: "IDEA Lab"
        },
        {
            title: "The Gateway",
            question: "The prototype stands ready and strong, But markets decide if you belong. Seek the bridge where careers begin, Where students prepare their next big win.",
            answer: "Placement Cell"
        },
        {
            title: "The Final Push",
            question: "You now hold the pieces of a powerful word. Rearrange your letters and find what they form. But something is still missing. Take your answer to the seat of campus leadership.",
            answer: "Admin Block"
        }
    ];

    const isAllCompleted = progress.level > challenges.length;
    const currentChallenge = !isAllCompleted ? challenges[progress.level - 1] : null;

    // Progression letters logic
    const getLettersFound = () => {
        const letters = [];
        if (progress.level > 1) letters.push("C");
        if (progress.level > 2) letters.push("E");
        if (progress.level > 3) letters.push("L");
        if (progress.level > 4) letters.push("E");
        return letters;
    };

    const lettersFound = getLettersFound();

    const handleCorrectAnswer = () => {
        const nextLevel = progress.level + 1;
        const nextScore = progress.score + 100;
        setProgress({ level: nextLevel, score: nextScore });
        saveProgress(nextLevel, nextScore);

        // Final reveal logic handled by rendering state
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
            <header className="bg-ocean-blue text-white p-6 rounded-b-[3rem] shadow-[0_10px_30px_rgba(0,0,0,0.15)] relative overflow-hidden z-20">
                <div className="absolute top-[-20px] right-[-20px] opacity-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                    >
                        <Compass className="w-56 h-56" />
                    </motion.div>
                </div>

                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="bg-white/20 p-2.5 rounded-full border-2 border-white/30"
                        >
                            <User className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                            <h2 className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em] leading-none mb-1">Founder</h2>
                            <h1 className="text-xl font-black truncate max-w-[150px] uppercase">{user?.name || 'Recruit'}</h1>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <h2 className="text-[8px] font-black opacity-60 uppercase tracking-widest leading-none mb-1">Vault Hunt</h2>
                        <h1 className="text-xs font-black text-gold uppercase tracking-tighter">Zero to One</h1>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                    <div className="bg-white/15 backdrop-blur-md p-4 rounded-3xl border border-white/20 flex flex-col items-center">
                        <Crosshair className="w-5 h-5 text-gold mb-1" />
                        <span className="text-[10px] uppercase font-black opacity-50 tracking-widest">Stage</span>
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

            {/* Collected Letters Sidebar/Indicator */}
            {!isAllCompleted && lettersFound.length > 0 && (
                <div className="px-6 pt-6 flex justify-center">
                    <div className="flex gap-2">
                        {lettersFound.map((letter, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="w-8 h-10 bg-white border-2 border-amber-300 rounded-lg flex items-center justify-center font-black text-amber-900 shadow-sm"
                            >
                                {letter}
                            </motion.div>
                        ))}
                        {[...Array(4 - lettersFound.length)].map((_, i) => (
                            <div key={i} className="w-8 h-10 border-2 border-dashed border-amber-200 rounded-lg flex items-center justify-center opacity-30">
                                <Star className="w-4 h-4 text-amber-200" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content with Micro-Parallax */}
            <main className="flex-1 p-6 flex flex-col items-center justify-center relative">
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="w-full max-w-sm relative group"
                >
                    <div className="absolute inset-0 bg-ocean-blue opacity-5 blur-3xl group-hover:opacity-10 transition-opacity duration-1000 -z-10" />

                    <AnimatePresence mode="wait">
                        {isAllCompleted ? (
                            <motion.div
                                key="final-reveal"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="parchment-card p-10 flex flex-col items-center border-[6px] border-amber-300 shadow-2xl relative overflow-hidden"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="bg-orange-50 p-6 rounded-full border-4 border-amber-200 mb-8 shadow-inner"
                                >
                                    <Trophy className="w-16 h-16 text-amber-600" />
                                </motion.div>

                                <h3 className="text-3xl font-black text-amber-900 mb-2 text-center uppercase tracking-tighter">
                                    Vault Unlocked
                                </h3>

                                <div className="flex gap-3 mb-6 mt-4">
                                    {["C", "E", "L", "E"].map((letter, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            className="w-10 h-14 bg-white border-2 border-amber-400 flex items-center justify-center font-black text-xl text-amber-900 shadow-bold"
                                        >
                                            {letter}
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    className="text-center space-y-4 mb-8"
                                >
                                    <p className="text-amber-700 font-bold text-xs italic leading-snug uppercase">
                                        You are close, but incomplete.<br />
                                        Every startup needs one final thing:
                                    </p>
                                    <p className="text-blue-900 font-black text-sm uppercase tracking-[0.3em]">
                                        Leadership.
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1.1, opacity: 1 }}
                                    transition={{ delay: 2, type: "spring", stiffness: 200 }}
                                    className="bg-gold text-blue-900 font-black text-4xl px-8 py-4 rounded-2xl shadow-[0_20px_40px_rgba(255,215,0,0.5)] mb-10 border-4 border-white/50 tracking-[0.2em] relative"
                                >
                                    <Zap className="absolute -top-4 -right-4 w-10 h-10 text-white fill-white sparkle" />
                                    ECELL
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2.5 }}
                                    className="text-amber-800 font-black text-[10px] uppercase tracking-widest mb-10 text-center"
                                >
                                    Welcome to the Spirit of E-Cell
                                </motion.p>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => navigate('/leaderboard')}
                                    className="w-full btn-gold h-16 flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(255,215,0,0.4)] text-lg font-black uppercase tracking-tighter relative overflow-hidden"
                                >
                                    <span className="relative z-10">VIEW RANKINGS</span>
                                    <Trophy className="w-6 h-6 relative z-10" />
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="challenge-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="parchment-card p-10 flex flex-col items-center border-[6px] border-amber-300 shadow-2xl relative"
                            >
                                <div className="bg-orange-50 p-6 rounded-full border-4 border-amber-200 mb-8 float-game shadow-inner">
                                    <Map className="w-16 h-16 text-amber-600" />
                                </div>

                                <h3 className="text-2xl font-black text-amber-900 mb-2 text-center uppercase tracking-tighter">
                                    Current Objective
                                </h3>
                                <p className="text-amber-700 font-bold mb-8 opacity-80 uppercase tracking-widest text-xs italic bg-amber-100/50 px-4 py-1 rounded-full text-center">
                                    {currentChallenge?.title}
                                </p>

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
                                    <span className="relative z-10">LOCATE CLUE</span>
                                    <Crosshair className="w-6 h-6 relative z-10 sparkle" />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Decorative Elements */}
                <div className="mt-12 flex items-center gap-12 opacity-15">
                    <HelpCircle className="w-10 h-10 text-amber-900" />
                    <Compass className="w-14 h-14 text-amber-900 animate-spin-slow rotate-[45deg]" />
                    <Star className="w-10 h-10 text-amber-900" />
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
                .shadow-bold {
                    box-shadow: 4px 4px 0px rgba(180, 83, 9, 0.2);
                }
            `}</style>
        </div>
    );
};

export default MapHub;
