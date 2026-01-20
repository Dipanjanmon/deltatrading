import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Lock, ArrowRight, User, Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await login(username, password);
            if (success) {
                toast.success('Welcome back!');
                navigate('/dashboard');
            } else {
                setError('Invalid credentials');
                setLoading(false);
            }
        } catch (err) {
            setError(err.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex text-white font-sans selection:bg-emerald-500/30">
            {/* Left Side - Brand & Visuals */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden glass-panel border-r border-white/5 items-center justify-center p-12">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/80 via-slate-900/80 to-emerald-900/20 opacity-90"></div>
                <div className="absolute -top-[20%] -left-[20%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>

                <div className="relative z-10 max-w-lg">
                    <Link to="/" className="flex items-center gap-3 mb-12 group">
                        <img
                            src="/deltatrading_logo_geometric_1768213069953.png"
                            alt="DeltaTrading Logo"
                            className="h-12 w-12 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform group-hover:scale-110"
                        />
                        <span className="text-3xl font-black tracking-tight text-white">
                            Delta<span className="text-emerald-500">Trading</span>
                        </span>
                    </Link>

                    <h1 className="text-5xl font-black tracking-tighter mb-6 leading-[1.1]">
                        Master the Markets <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Risk Free.</span>
                    </h1>
                    <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                        Join thousands of traders simulating strategies with real-time market data. Analyze, predict, and climb the leaderboard.
                    </p>

                    {/* Testimonial / Social Proof */}
                    <div className="glass-card p-6">
                        <div className="flex gap-1 text-yellow-500 mb-3">
                            {[1, 2, 3, 4, 5].map(i => <TrendingUp key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-slate-300 italic mb-4">&quot;The best platform to learn trading without the fear of losing money. The gamification makes it addictive!&quot;</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs">
                                JD
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm">John Doe</p>
                                <p className="text-xs text-slate-500">Pro Trader • Level 12</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-20 relative">
                {/* Mobile absolute logo */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/deltatrading_logo_geometric_1768213069953.png" alt="Logo" className="h-8 w-8" />
                    </Link>
                </div>

                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back</h2>
                        <p className="text-slate-400">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
                            <Lock size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Username</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full glass-interactive rounded-xl px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-800/50"
                                    placeholder="Enter your username"
                                    required
                                />
                                <div className="absolute right-3.5 top-3.5 text-slate-500 pointer-events-none">
                                    <User size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-300">Password</label>
                                <a href="#" className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full glass-interactive rounded-xl px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-slate-800/50"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-3.5 transition-all transform active:scale-[0.98] shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>Sign In <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-transparent text-slate-500">Or continue with</span></div>
                    </div>

                    <a
                        href="http://localhost:8081/oauth2/authorization/google"
                        className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold rounded-xl px-4 py-3 hover:bg-slate-200 transition-all"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </a>

                    <p className="text-center text-sm text-slate-400">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="font-bold text-emerald-500 hover:text-emerald-400">Create free account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
