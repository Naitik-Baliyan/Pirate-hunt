import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const Leaderboard = () => {
    const navigate = useNavigate();

    const players = [
        { rank: 1, name: 'Captain Jack', score: 2500, time: '12m ago' },
        { rank: 2, name: 'Blackbeard', score: 2300, time: '45m ago' },
        { rank: 3, name: 'Anne Bonny', score: 2100, time: '1h ago' },
        { rank: 4, name: 'Will Turner', score: 1800, time: '3h ago' },
        { rank: 5, name: 'Elizabeth Swann', score: 1200, time: '5h ago' },
        { rank: 6, name: 'Davy Jones', score: 1100, time: '7h ago' },
        { rank: 7, name: 'Barbossa', score: 900, time: '10h ago' },
        { rank: 8, name: 'Ragetti', score: 500, time: '12h ago' },
    ];

    return (
        <div className="min-h-screen bg-parchment pb-32">
            <header className="bg-ocean-blue text-white p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate('/map')}
                        className="p-2 bg-white/10 rounded-full tap-target backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-black uppercase tracking-widest italic">Global Port Rankings</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <div className="p-6">
                <div className="parchment-card shadow-2xl p-4 overflow-hidden divide-y divide-amber-200">
                    {players.map((player, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={player.rank}
                            className={`flex items-center justify-between p-4 ${player.rank <= 3 ? 'bg-amber-50/50' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-lg ${player.rank === 1 ? 'bg-gold text-blue-900 border-2 border-amber-300' :
                                        player.rank === 2 ? 'bg-slate-200 text-slate-800' :
                                            player.rank === 3 ? 'bg-amber-100 text-amber-800' :
                                                'bg-slate-100 text-slate-400'
                                    }`}>
                                    {player.rank === 1 ? <Trophy className="w-5 h-5" /> : player.rank}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{player.name}</h3>
                                    <div className="flex items-center gap-1 opacity-60 text-[10px] font-bold uppercase">
                                        <Clock className="w-3 h-3" />
                                        {player.time}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-xl font-black text-ocean-blue leading-none">{player.score}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1">
                                    Gold <Star className="w-2.5 h-2.5 fill-current" />
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default Leaderboard;
