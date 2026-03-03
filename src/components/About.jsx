import React from 'react';
import { motion } from 'framer-motion';
import { Info, Linkedin, Instagram, Ship, Compass, Anchor } from 'lucide-react';
import BottomNav from './BottomNav';

const About = () => {
    return (
        <div className="min-h-screen bg-parchment pb-32">
            <header className="p-8 pb-4 flex flex-col items-center">
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                    className="bg-sky-blue/20 p-5 rounded-full border-4 border-sky-blue/30 mb-4"
                >
                    <Info className="w-12 h-12 text-ocean-blue" />
                </motion.div>
                <h1 className="text-3xl font-black text-deep-ocean-blue uppercase tracking-tighter">About the Vessel</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1 italic">E-Cell MIET Registry</p>
            </header>

            <main className="p-6 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="parchment-card p-6 border-b-4 border-amber-200 shadow-xl relative overflow-hidden"
                >
                    <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                        <Ship className="w-32 h-32" />
                    </div>

                    <h3 className="text-xl font-black text-ocean-blue mb-3 uppercase flex items-center gap-2">
                        <Compass className="w-5 h-5" />
                        Our Mission
                    </h3>
                    <p className="text-slate-700 font-medium leading-relaxed">
                        E-Cell MIET is the innovation and entrepreneurship cell of MIET.
                        We build a culture where students don’t just learn — they create.
                    </p>
                    <p className="text-slate-700 font-medium mt-4 leading-relaxed">
                        Through hackathons, workshops, startup sessions, and real-world challenges,
                        we help turn ideas into action. This treasure hunt is more than a game — it’s a mindset.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="parchment-card p-6 border-b-4 border-amber-200 shadow-xl"
                >
                    <h3 className="text-xl font-black text-ocean-blue mb-4 uppercase flex items-center gap-2">
                        <Anchor className="w-5 h-5" />
                        Connect With Us
                    </h3>

                    <div className="space-y-4">
                        <a
                            href="https://www.linkedin.com/company/entrepreneurship-cell-miet/posts/?feedView=all"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white/50 rounded-xl border-2 border-slate-100 hover:border-ocean-blue transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <Linkedin className="w-6 h-6 text-[#0077B5]" />
                                <span className="font-bold text-slate-800">LinkedIn</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-ocean-blue group-hover:text-white transition-colors">
                                <Info className="w-4 h-4" />
                            </div>
                        </a>

                        <a
                            href="https://www.instagram.com/ecell__miet?igsh=eGRxODBienNmYzl6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white/50 rounded-xl border-2 border-slate-100 hover:border-ocean-blue transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <Instagram className="w-6 h-6 text-[#E4405F]" />
                                <span className="font-bold text-slate-800">Instagram</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-ocean-blue group-hover:text-white transition-colors">
                                <Info className="w-4 h-4" />
                            </div>
                        </a>
                    </div>
                </motion.div>

                <div className="text-center pt-8">
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">A Production of MIET</p>
                    <p className="text-slate-300 font-medium text-[8px] mt-2 uppercase tracking-widest">Designed for discovery</p>
                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default About;
