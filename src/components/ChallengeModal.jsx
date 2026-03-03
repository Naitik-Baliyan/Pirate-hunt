import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, CheckCircle2, Award, Zap } from 'lucide-react';

const ChallengeModal = ({ isOpen, onClose, challenge, onCorrectAnswer }) => {
    const [answer, setAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.toLowerCase().trim() === challenge.answer.toLowerCase()) {
            setIsCorrect(true);
            setTimeout(() => {
                onCorrectAnswer();
                onClose();
                setAnswer('');
                setIsCorrect(null);
            }, 1200);
        } else {
            setIsCorrect(false);
            setTimeout(() => setIsCorrect(null), 1500);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: { type: "spring", damping: 12, stiffness: 200 }
                        }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm parchment-card p-10 z-[70] shadow-2xl border-4 border-gold bg-gradient-to-b from-parchment to-[#F7EACD]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 tap-target"
                        >
                            <X className="w-6 h-6 border-2 border-slate-200 rounded-full" />
                        </button>

                        <div className="flex flex-col items-center mb-8 relative">
                            <motion.div
                                initial={{ rotate: -15, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                className="bg-ocean-blue/10 p-5 rounded-full mb-4 border-4 border-gold/10 relative z-10"
                            >
                                <Zap className="w-10 h-10 text-ocean-blue sparkle fill-current" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-deep-ocean-blue tracking-tight text-center uppercase">
                                Quest Unlocked
                            </h2>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="h-1 bg-gold mt-2 rounded-full shadow-[0_2px_10px_rgba(255,215,0,0.5)]"
                            />
                        </div>

                        <div className="parchment-card/50 p-6 rounded-2xl mb-8 border-2 border-amber-50 shadow-inner bg-white/30 backdrop-blur-sm">
                            <p className="text-slate-800 font-bold text-center text-lg italic leading-relaxed uppercase tracking-tighter">
                                "{challenge.question}"
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 text-center">
                                    Your Secret Answer
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="TYPE YOUR ANSWER..."
                                    className={`w-full h-16 bg-white/60 border-2 rounded-2xl px-4 text-center focus:outline-none transition-all placeholder:text-slate-300 font-black text-lg ${isCorrect === true ? 'border-green-500 bg-green-50 text-green-700' :
                                            isCorrect === false ? 'border-red-500 bg-red-50 text-red-700 shake' :
                                                'border-slate-100 focus:border-gold focus:ring-4 focus:ring-gold/20'
                                        }`}
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.02 }}
                                type="submit"
                                className={`w-full h-20 rounded-3xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_15px_30px_rgba(255,215,0,0.2)] font-black text-lg uppercase tracking-widest relative overflow-hidden active:scale-95 ${isCorrect === true ? 'bg-green-500 text-white' : 'btn-gold sparkle-button'
                                    }`}
                            >
                                {isCorrect === true ? (
                                    <>
                                        Solved! <Award className="w-6 h-6" />
                                    </>
                                ) : (
                                    <>
                                        Submit Discovery
                                        <Zap className="w-5 h-5" />
                                        {/* Pulse effect */}
                                        <motion.div
                                            animate={{ opacity: [0, 0.5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="absolute inset-0 bg-white"
                                        />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <style>{`
                            @keyframes shake {
                                0%, 100% { transform: translateX(0); }
                                25% { transform: translateX(-8px); }
                                75% { transform: translateX(8px); }
                            }
                            .shake {
                                animation: shake 0.3s ease-in-out infinite;
                            }
                        `}</style>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChallengeModal;
