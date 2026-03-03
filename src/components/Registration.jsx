import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Anchor, User, IdCard, Building, Ship } from 'lucide-react';
import { saveUser } from '../utils/storage';

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        branch: ''
    });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.rollNumber && formData.branch) {
            saveUser(formData);
            navigate('/map');
        }
    };

    return (
        <div className="min-h-screen bg-sky-blue flex items-center justify-center p-6 bg-nautical-gradient relative overflow-hidden">
            {/* Drifting Clouds */}
            <div className="absolute top-[10%] left-0 w-32 h-16 cloud opacity-20">
                <svg viewBox="0 0 24 24" fill="white"><path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.412,0.045-0.812,0.131-1.197C11.558,12.13,10.8,12,10,12c-2.761,0-5,2.239-5,5c0,2.761,2.239,5,5,5h7.5c2.485,0,4.5-2.015,4.5-4.5S20.485,13,18,13C17.828,13,17.661,13.012,17.5,13.035z" /></svg>
            </div>
            <div className="absolute top-[30%] left-[-50px] w-48 h-20 cloud opacity-10" style={{ animationDelay: '10s', animationDuration: '45s' }}>
                <svg viewBox="0 0 24 24" fill="white"><path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.412,0.045-0.812,0.131-1.197C11.558,12.13,10.8,12,10,12c-2.761,0-5,2.239-5,5c0,2.761,2.239,5,5,5h7.5c2.485,0,4.5-2.015,4.5-4.5S20.485,13,18,13C17.828,13,17.661,13.012,17.5,13.035z" /></svg>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="parchment-card w-full max-w-md p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-[#8B4513]/10"
            >
                <div className="absolute top-0 left-0 w-20 h-20 opacity-5">
                    <Anchor className="w-full h-full text-blue-900 rotate-[-15deg]" />
                </div>

                <div className="flex flex-col items-center mb-8 relative">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="bg-ocean-blue/10 p-4 rounded-full mb-4"
                    >
                        <Ship className="w-10 h-10 text-ocean-blue" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-deep-ocean-blue tracking-tight uppercase">Crew Registry</h1>
                    <div className="w-16 h-1 bg-gold mt-2 rounded-full" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Explorer's Name</label>
                        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                required
                                type="text"
                                placeholder="Captain Jack"
                                className="w-full h-14 bg-white/60 border-2 border-slate-200 rounded-xl pl-11 pr-4 focus:ring-4 focus:ring-gold/20 focus:border-gold outline-none transition-all placeholder:text-slate-300 font-bold"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </motion.div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Roll Number</label>
                        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                required
                                type="text"
                                placeholder="Your ID"
                                className="w-full h-14 bg-white/60 border-2 border-slate-200 rounded-xl pl-11 pr-4 focus:ring-4 focus:ring-gold/20 focus:border-gold outline-none transition-all placeholder:text-slate-300 font-bold"
                                value={formData.rollNumber}
                                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                            />
                        </motion.div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Branch & Year</label>
                        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                required
                                type="text"
                                placeholder="CSE - 3rd Year"
                                className="w-full h-14 bg-white/60 border-2 border-slate-200 rounded-xl pl-11 pr-4 focus:ring-4 focus:ring-gold/20 focus:border-gold outline-none transition-all placeholder:text-slate-300 font-bold"
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                            />
                        </motion.div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 1.05 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        type="submit"
                        className="w-full btn-gold h-16 text-lg mt-4 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(255,215,0,0.3)] font-black uppercase tracking-wider breathe overflow-hidden relative group"
                    >
                        <span className="relative z-10">BEGIN THE VOYAGE</span>
                        <Anchor className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />

                        {/* Wave Ripple Effect (static hover) */}
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Registration;
