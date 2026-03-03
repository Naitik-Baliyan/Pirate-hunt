import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Map, User, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const NavItem = ({ icon: Icon, label, path, active }) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center tap-target relative transition-colors duration-300 ${active ? 'text-ocean-blue' : 'text-slate-400'}`}
        >
            <motion.div
                animate={{
                    scale: active ? 1.25 : 1,
                    y: active ? -4 : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                <Icon className={`w-6 h-6 ${active ? 'fill-sky-blue/20 stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
            </motion.div>

            <motion.span
                animate={{ opacity: active ? 1 : 0.6, y: active ? 2 : 0 }}
                className="text-[10px] font-black mt-1 uppercase tracking-[0.15em]"
            >
                {label}
            </motion.span>

            {active && (
                <motion.div
                    layoutId="nav-dot"
                    className="absolute -top-1 w-1 h-1 bg-ocean-blue rounded-full shadow-[0_0_10px_rgba(0,119,190,0.8)]"
                />
            )}
        </button>
    );
};

const BottomNav = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Conditionally hide leaderboard from bottom nav as requested
    // but keep the structure clean for Map, Profile, and About.

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md h-20 bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-white/40 flex justify-around items-center px-4 z-50">
            <NavItem icon={Map} label="Map" path="/map" active={currentPath === '/map'} />
            <NavItem icon={User} label="Profile" path="/profile" active={currentPath === '/profile'} />
            <NavItem icon={Info} label="About" path="/about" active={currentPath === '/about'} />
        </div>
    );
};

export default BottomNav;
