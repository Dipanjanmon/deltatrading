import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Activity, Shield, Zap, Globe, BarChart2, CheckCircle, TrendingUp, Users, Smartphone, Layers, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage() {
    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
            <Navbar />

            {/* Hero Section - Futuristic & Premium */}
            <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-40 container mx-auto px-6 overflow-hidden">
                {/* Background Glow */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10"
                ></motion.div>

                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Left Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="flex-1 text-left z-10"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-interactive text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-2xl shadow-emerald-900/10">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Market Simulation v2.0
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9] md:leading-[1]">
                            Master the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 animate-gradient-x">Markets.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 mb-10 max-w-lg leading-relaxed font-light">
                            Zero risk using <span className="text-white font-bold">$10,000</span> virtual capital.<br />
                            Compete in weekly leagues. Earn XP. Level up.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-center text-lg flex items-center justify-center gap-2 group transform active:scale-95">
                                Start Trading For Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/about" className="w-full sm:w-auto px-8 py-4 glass-interactive text-white font-bold rounded-2xl transition-all text-center text-lg active:scale-95">
                                View Demo
                            </Link>
                        </motion.div>

                        {/* Stats Ticker */}
                        <motion.div variants={fadeInUp} className="mt-16 flex items-center gap-8 border-t border-white/5 pt-8 opacity-70">
                            <div>
                                <p className="text-3xl font-bold text-white font-mono">10M+</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Simulated Trades</p>
                            </div>
                            <div className="h-8 w-px bg-slate-800"></div>
                            <div>
                                <p className="text-3xl font-bold text-white font-mono">$5B+</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Volume Traded</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Image - 3D Dashboard Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotateY: -20 }}
                        animate={{ opacity: 1, x: 0, rotateY: -12 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="flex-1 relative w-full perspective-[2000px] mt-12 lg:mt-0"
                    >
                        {/* Using generated image hero_dashboard_mockup */}
                        <motion.div
                            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
                            transition={{ duration: 0.5 }}
                            className="relative rounded-3xl glass-card overflow-hidden transform rotate-y-[-12deg] rotate-x-[5deg] group cursor-pointer z-10 w-full"
                        >
                            <img
                                src="/hero_dashboard_mockup.webp"
                                alt="DeltaTrading Dashboard"
                                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                onError={(e) => { e.target.src = '/cyber_fintech_dashboard_1768211443946.png' }} // Fallback
                            />
                            {/* Glass overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
                        </motion.div>

                        {/* Floating Mobile App */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="absolute -bottom-10 left-4 md:-left-10 w-40 md:w-64 glass-card p-1 transform translate-z-[50px] animate-float z-20"
                        >
                            <img
                                src="/trading_mobile_app_mockup.png"
                                alt="Mobile App"
                                className="w-full h-auto rounded-2xl shadow-2xl"
                                onError={(e) => { e.target.src = 'https://placehold.co/300x600/1e293b/10b981?text=Mobile+App' }}
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Scrolling Ticker */}
            <div className="w-full glass-panel overflow-hidden py-4">
                <div className="flex animate-scroll whitespace-nowrap gap-16 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {["NASDAQ", "NYSE", "CRYPTO", "FOREX", "COMMODITIES", "FUTURES", "OPTIONS"].map((item, i) => (
                        <span key={i} className="text-2xl font-black text-slate-400 mx-4">{item}</span>
                    ))}
                    {["NASDAQ", "NYSE", "CRYPTO", "FOREX", "COMMODITIES", "FUTURES", "OPTIONS"].map((item, i) => (
                        <span key={`dup-${i}`} className="text-2xl font-black text-slate-400 mx-4">{item}</span>
                    ))}
                </div>
            </div>

            {/* Gamification Features - Premium Bento Grid */}
            <section className="py-32 bg-transparent relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-1/2 right-0 w-[50vw] h-[50vh] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-interactive text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <Zap size={12} className="fill-blue-400" /> Next Gen Trading
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter text-white">
                            Trading just got <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-gradient-x">Addictive.</span>
                        </h2>
                        <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
                            Not just charts and numbers. DeltaTrading introduces XP, Levels, and Badges to make your journey rewarding.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]"
                    >
                        {/* Featured Large Card - XP System */}
                        <motion.div variants={fadeInUp} className="md:col-span-8 glass-card p-10 md:p-14 relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110">
                                <Award size={300} className="text-emerald-500 rotate-12" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-8">
                                        <TrendingUp size={14} /> Level Up System
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                                        Earn XP for <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Every Trade.</span>
                                    </h3>
                                    <p className="text-slate-400 text-lg max-w-lg leading-relaxed mb-8">
                                        Every correct prediction, every smart diversification, and every login earns you Experience Points. Climb the ranks from Novice to <span className="text-emerald-400 font-bold">Market Wizard</span>.
                                    </p>
                                </div>

                                {/* XP Bar Simulation with Animation */}
                                <div className="max-w-xl bg-slate-900/40 rounded-2xl p-4 border border-white/5 backdrop-blur-sm group-hover:border-emerald-500/20 transition-colors">
                                    <div className="flex justify-between text-sm font-bold text-slate-300 mb-2">
                                        <span>Level 5</span>
                                        <span className="text-emerald-400">2,450 / 3,000 XP</span>
                                    </div>
                                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "82%" }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2 - Rare Badges */}
                        <motion.div variants={fadeInUp} className="md:col-span-4 glass-card p-10 flex flex-col justify-center relative overflow-hidden group hover:border-yellow-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[50px] group-hover:bg-yellow-500/20 transition-all"></div>

                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-8 text-yellow-400 ring-1 ring-yellow-500/30"
                            >
                                <Award size={32} />
                            </motion.div>
                            <h3 className="text-3xl font-bold mb-4 text-white">Rare Badges</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Unlock &quot;Diamond Hands&quot;, &quot;Rocket Man&quot;, and other exclusive badges to show off on your profile.
                            </p>
                        </motion.div>

                        {/* Card 3 - Weekly Leagues */}
                        <motion.div variants={fadeInUp} className="md:col-span-4 glass-card p-10 flex flex-col justify-center relative overflow-hidden group hover:border-blue-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] group-hover:bg-blue-500/20 transition-all"></div>

                            <motion.div
                                whileHover={{ scale: 1.1, rotate: -10 }}
                                className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mb-8 text-blue-400 ring-1 ring-blue-500/30"
                            >
                                <Users size={32} />
                            </motion.div>
                            <h3 className="text-3xl font-bold mb-4 text-white">Weekly Leagues</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Join the weekly sprint. Everyone starts fresh on Monday. Top traders win virtual prizes on Friday.
                            </p>
                        </motion.div>

                        {/* Card 4 - New Decorative / Stat Card to fill grid */}
                        <motion.div variants={fadeInUp} className="md:col-span-8 glass-card p-10 flex items-center justify-between relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">Ready to compete?</h3>
                                    <p className="text-slate-400">Join 10,000+ traders on the leaderboard today.</p>
                                </div>
                                <Link to="/leaderboard" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-white/10 hover:shadow-emerald-400/20 hover:-translate-y-1 transform">
                                    View Leaderboard
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-40 bg-transparent relative overflow-hidden text-center" >
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-4xl md:text-7xl lg:text-9xl font-black mb-10 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800">
                            READY TO <br /> TRADE?
                        </h2>
                        <Link to="/register">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-16 py-6 bg-white text-black rounded-full font-black text-2xl transition-all hover:bg-emerald-400 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                            >
                                Create Free Account
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section >

            <Footer />
        </div >
    );
}
