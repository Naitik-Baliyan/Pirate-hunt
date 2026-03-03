import React, { useState, useEffect } from 'react';
import { User, LogOut, Shield, Award, Crosshair, Trophy } from 'lucide-react';
import { getUser, getProgress, clearProgress } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [progress, setProgress] = useState({ level: 1, score: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        setUser(getUser());
        setProgress(getProgress());
    }, []);

    const handleLogout = () => {
        clearProgress();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-parchment pb-32">
            <header className="bg-ocean-blue text-white p-12 rounded-b-[3rem] shadow-xl flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <Trophy className="w-64 h-64 -translate-x-20 -translate-y-20" />
                </div>

                <div className="w-24 h-24 bg-white/20 rounded-full border-4 border-white/30 flex items-center justify-center mb-4 relative z-10">
                    <User className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-black relative z-10 uppercase tracking-tight">{user?.name || 'Recruit'}</h1>
                <p className="opacity-70 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 bg-white/10 px-4 py-1 rounded-full relative z-10">
                    {user?.branch || 'Explorer'}
                </p>
            </header>

            <div className="p-8 space-y-4">
                <div className="parchment-card p-6 flex items-center gap-4 border-b-4 border-amber-200">
                    <div className="bg-sky-blue/20 p-3 rounded-2xl text-ocean-blue">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Roll Number</h3>
                        <p className="text-slate-800 font-black text-lg">{user?.rollNumber || 'Not documented'}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="parchment-card p-6 flex flex-col items-center border-b-4 border-amber-200">
                        <Crosshair className="w-5 h-5 text-ocean-blue mb-2" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Level</h3>
                        <p className="text-2xl font-black text-slate-800">{progress.level}</p>
                    </div>
                    <div className="parchment-card p-6 flex flex-col items-center border-b-4 border-amber-200">
                        <Trophy className="w-5 h-5 text-amber-500 mb-2" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</h3>
                        <p className="text-2xl font-black text-slate-800">{progress.score}</p>
                    </div>
                </div>

                <div className="parchment-card p-6 flex items-center gap-4 border-b-4 border-amber-200">
                    <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Title</h3>
                        <p className="text-slate-800 font-black text-lg">
                            {progress.level > 3 ? 'Master Voyager' : 'Novice Sailor'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full h-16 bg-red-50 text-red-600 font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 border-2 border-red-100 mt-8 shadow-sm active:scale-95 transition-transform"
                >
                    <LogOut className="w-5 h-5" />
                    Abandon Voyage
                </button>
            </div>

            <BottomNav />
        </div>
    );
};

export default Profile;
