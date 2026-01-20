import { Link, useLocation } from 'react-router-dom';
import { LogIn, LayoutDashboard, Menu, X, ChevronRight, TrendingUp, Wallet, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { token } = useAuth();
    const location = useLocation();

    const [userStats, setUserStats] = useState(null);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Fetch User Stats (Level/XP)
        const fetchUserStats = async () => {
            if (!token) return;
            try {
                // Decode username from token if not in context
                const payload = JSON.parse(atob(token.split('.')[1]));
                const username = payload.sub;

                const res = await fetch(`http://localhost:8081/api/users/${username}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserStats(data);
                }
            } catch (e) {
                console.error("Failed to fetch nav stats", e);
            }
        };
        fetchUserStats();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [token]);

    const menuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1]
            }
        },
        open: {
            opacity: 1,
            y: "0%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1]
            }
        }
    };

    const linkVariants = {
        closed: { opacity: 0, y: 20 },
        open: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.1 + (i * 0.1),
                ease: [0.76, 0, 0.24, 1]
            }
        })
    };

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel py-3' : 'bg-transparent py-4 md:py-6'}`}>
                <div className="max-w-screen-xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2 group z-50 relative">
                            <img
                                src="/deltatrading_logo_geometric_1768213069953.png"
                                alt="DeltaTrading Logo"
                                className="h-10 w-10 md:h-12 md:w-12 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-110"
                            />
                            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                Delta<span className="text-emerald-500">Trading</span>
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/leaderboard" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium flex items-center gap-2">
                                <Award size={18} /> Leaderboard
                            </Link>
                            {token && (
                                <Link to="/portfolio" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium flex items-center gap-2">
                                    <Wallet size={18} /> Portfolio
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center gap-4 z-50 relative">
                            {/* Desktop User Actions */}
                            <div className="hidden md:flex items-center gap-4">
                                {token ? (
                                    <>
                                        {/* Level Badge */}
                                        {userStats && (
                                            <div className="hidden lg:flex items-center gap-3 bg-slate-800/50 rounded-full pr-4 pl-1 py-1 border border-slate-700/50 backdrop-blur-sm">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-slate-900 font-black text-xs border-2 border-slate-800 shadow-lg">
                                                    {userStats.level || 1}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 mb-0.5">
                                                        <span>Level {userStats.level || 1}</span>
                                                        <span>{userStats.xp || 0} XP</span>
                                                    </div>
                                                    {/* XP Bar */}
                                                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                                            style={{ width: `${Math.min(100, ((userStats.xp || 0) % 1000) / 10)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <Link to="/dashboard">
                                            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm px-6 py-2.5 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40">
                                                <LayoutDashboard size={18} /> Dashboard
                                            </button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="text-slate-300 hover:text-white font-medium px-4">
                                            Log In
                                        </Link>
                                        <Link to="/register">
                                            <button className="bg-white text-[#0F172A] hover:bg-slate-200 font-bold rounded-xl text-sm px-6 py-3 transition-transform hover:scale-105 shadow-lg shadow-white/10">
                                                Register
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button - Hamburger */}
                            <button
                                className="md:hidden w-12 h-12 flex items-center justify-center rounded-full glass-interactive text-white transition-all active:scale-95"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Full Screen Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 bg-[#020617] z-40 flex flex-col pt-32 px-6 pb-10 overflow-y-auto"
                    >
                        {/* Background Elements */}
                        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                        <div className="flex flex-col gap-2 relative z-10 flex-1">
                            {token ? (
                                <>
                                    <div className="mb-8 p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 backdrop-blur-md">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-slate-900 font-black text-2xl border-4 border-[#020617] shadow-xl">
                                                {userStats?.level || 1}
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current Ranking</p>
                                                <p className="text-2xl font-bold text-white">Trader</p>
                                            </div>
                                        </div>
                                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                                style={{ width: `${Math.min(100, ((userStats?.xp || 0) % 1000) / 10)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            <span>Level {userStats?.level || 1}</span>
                                            <span>{userStats?.xp || 0} / {((Math.floor((userStats?.xp || 0) / 1000) + 1) * 1000)} XP</span>
                                        </div>
                                    </div>

                                    <motion.div custom={0} variants={linkVariants}>
                                        <Link to="/dashboard" className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800 hover:border-emerald-500/30 transition-all group mb-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                    <LayoutDashboard size={20} />
                                                </div>
                                                <span className="text-xl font-bold text-white">Dashboard</span>
                                            </div>
                                            <ChevronRight size={20} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    </motion.div>

                                    <motion.div custom={1} variants={linkVariants}>
                                        <Link to="/leaderboard" className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800 hover:border-yellow-500/30 transition-all group mb-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                                    <Award size={20} />
                                                </div>
                                                <span className="text-xl font-bold text-white">Leaderboard</span>
                                            </div>
                                            <ChevronRight size={20} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    </motion.div>

                                    <motion.div custom={2} variants={linkVariants}>
                                        <Link to="/portfolio" className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800 hover:border-blue-500/30 transition-all group mb-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                    <Wallet size={20} />
                                                </div>
                                                <span className="text-xl font-bold text-white">Portfolio</span>
                                            </div>
                                            <ChevronRight size={20} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    <motion.div custom={0} variants={linkVariants}>
                                        <h3 className="text-3xl font-black text-white mb-8 tracking-tight">Menu</h3>
                                    </motion.div>

                                    <motion.div custom={1} variants={linkVariants}>
                                        <Link to="/" className="flex items-center justify-between py-4 border-b border-slate-800 text-slate-300 hover:text-white group">
                                            <span className="text-2xl font-medium">Home</span>
                                            <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </motion.div>
                                    <motion.div custom={2} variants={linkVariants}>
                                        <Link to="/about" className="flex items-center justify-between py-4 border-b border-slate-800 text-slate-300 hover:text-white group">
                                            <span className="text-2xl font-medium">About</span>
                                            <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </motion.div>
                                    <motion.div custom={3} variants={linkVariants} className="mt-8 flex flex-col gap-4">
                                        <Link to="/login" className="w-full py-4 rounded-xl border border-slate-700 text-center font-bold text-white hover:bg-slate-800 transition-colors">
                                            Log In
                                        </Link>
                                        <Link to="/register" className="w-full py-4 rounded-xl bg-emerald-600 text-center font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
                                            Get Started
                                        </Link>
                                    </motion.div>
                                </>
                            )}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mt-8 text-slate-600 text-sm font-medium"
                        >
                            &copy; 2026 DeltaTrading Inc.
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
