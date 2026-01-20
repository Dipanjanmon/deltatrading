import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, User, ShieldCheck, Eye, EyeOff, KeyRound, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const generateStrongPassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let newPassword = "";
        for (let i = 0; i < 16; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);
        toast.success("Strong password suggested!", { icon: '🔐' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (pin.length !== 4) {
            setError("PIN must be 4 digits");
            setLoading(false);
            return;
        }
        try {
            const success = await register(username, password, pin);
            if (success) {
                toast.success('Account created successfully! Please log in.');
                navigate('/login');
            } else {
                setError('Registration failed');
                setLoading(false);
            }
        } catch (err) {
            const errorMessage = (typeof err.response?.data === 'string' ? err.response.data : err.response?.data?.message) || err.message || 'Registration failed';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex text-white font-sans selection:bg-blue-500/30">
            {/* Left Side - Brand & Visuals */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden glass-panel border-r border-white/5 items-center justify-center p-12">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/80 via-[#1e1b4b]/80 to-[#1e3a8a]/20 opacity-90"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>

                <div className="relative z-10 max-w-lg">
                    <Link to="/" className="flex items-center gap-3 mb-12 group">
                        <img
                            src="/deltatrading_logo_geometric_1768213069953.png"
                            alt="DeltaTrading Logo"
                            className="h-12 w-12 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-transform group-hover:scale-110"
                        />
                        <span className="text-3xl font-black tracking-tight text-white">
                            Delta<span className="text-blue-500">Trading</span>
                        </span>
                    </Link>

                    <h1 className="text-5xl font-black tracking-tighter mb-6 leading-[1.1]">
                        Join the Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Trading.</span>
                    </h1>
                    <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                        Create your account today and get <span className="text-white font-bold">$10,000</span> in virtual capital to start your journey. No credit card required.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-4">
                            <ShieldCheck className="text-blue-500 mb-3" size={24} />
                            <h3 className="font-bold text-white mb-1">Risk Free</h3>
                            <p className="text-xs text-slate-400">Practice without losing real money.</p>
                        </div>
                        <div className="glass-card p-4">
                            <TrendingUp className="text-emerald-500 mb-3" size={24} />
                            <h3 className="font-bold text-white mb-1">Real Data</h3>
                            <p className="text-xs text-slate-400">Live market prices and charts.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-10 relative overflow-y-auto">
                {/* Mobile absolute logo */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/deltatrading_logo_geometric_1768213069953.png" alt="Logo" className="h-8 w-8" />
                    </Link>
                </div>

                <div className="w-full max-w-sm space-y-6 my-auto">
                    <div className="text-center lg:text-left pt-10 lg:pt-0">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h2>
                        <p className="text-slate-400">Start your trading journey in seconds.</p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
                            <ShieldCheck size={16} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">Username</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full glass-interactive rounded-xl px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-800/50"
                                    placeholder="Choose a username"
                                    required
                                    autoComplete="off"
                                />
                                <div className="absolute right-3.5 top-3.5 text-slate-500 pointer-events-none">
                                    <User size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-slate-300">Password</label>
                                <button
                                    type="button"
                                    onClick={generateStrongPassword}
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold"
                                >
                                    <KeyRound size={12} /> Suggest Strong
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full glass-interactive rounded-xl px-4 py-3.5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-slate-800/50"
                                    placeholder="Min 8 characters"
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

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300">4-Digit Security PIN</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="4"
                                    value={pin}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val)) setPin(val);
                                    }}
                                    className="w-full glass-interactive rounded-xl px-4 py-3.5 text-white outline-none placeholder:text-slate-600 font-mono tracking-widest focus:border-blue-500/50 focus:bg-slate-800/50"
                                    placeholder="0000"
                                    required
                                />
                                <div className="absolute right-3.5 top-3.5 text-slate-500 pointer-events-none">
                                    <ShieldCheck size={20} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl py-3.5 transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>Create Account <ArrowRight size={18} /></>
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
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-blue-500 hover:text-blue-400">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
