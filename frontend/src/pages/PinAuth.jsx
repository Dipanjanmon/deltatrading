import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PinAuth() {
    const [pin, setPin] = useState(['', '', '', '']);
    const [mode, setMode] = useState('loading'); // loading, set, verify
    const { user, token, verifyPin: contextVerifyPin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            // Safety timeout: If user is not loaded within 2 seconds, redirect to login
            const timer = setTimeout(() => {
                if (!user && token) {
                    // Logic to handle stuck state
                    navigate('/login');
                }
            }, 2000);
            return () => clearTimeout(timer);
        }

        const checkPinStatus = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/pin/status/${user.username}`);
                setMode(res.data.hasPin ? 'verify' : 'set');
            } catch (error) {
                console.error("Error checking PIN status", error);
                toast.error("Session expired or invalid. Please login again.");
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }
        };

        checkPinStatus();
    }, [user, token, navigate]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 3) {
            document.getElementById(`pin-${index + 1}`).focus();
        }

        // Auto-submit when PIN is complete
        const pinValue = newPin.join('');
        if (pinValue.length === 4 && newPin.every(d => d !== '')) {
            submitPin(pinValue);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            document.getElementById(`pin-${index - 1}`).focus();
        }
    };

    const submitPin = async (pinValue) => {
        if (pinValue.length !== 4) {
            return; // Or show error
        }

        try {
            if (mode === 'set') {
                await axios.post('http://localhost:8081/api/pin/set', {
                    username: user.username,
                    pin: pinValue
                });
                toast.success("Security PIN set successfully!");
                contextVerifyPin();
                navigate('/dashboard');
            } else {
                await axios.post('http://localhost:8081/api/pin/verify', {
                    username: user.username,
                    pin: pinValue
                });
                toast.success("Identity Verified");
                contextVerifyPin();
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error("Invalid PIN. Please try again.", error);
            setPin(['', '', '', '']);
            document.getElementById('pin-0').focus();
        }
    };


    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

    const handleForgotPin = () => {
        toast("For security, please log in again to reset your PIN.", {
            icon: '🔒',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        // In a real app, this would redirect to a password verification page first
        // For now, we logout to force re-authentication (security measure)
        // Or we could implement a specific /reset-pin route that asks for password
        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    if (mode === 'loading') {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl w-full max-w-sm relative z-10">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700 shadow-lg">
                        {mode === 'set' ? <ShieldCheck className="text-emerald-400" size={32} /> : <Lock className="text-blue-400" size={32} />}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {mode === 'set' ? 'Create Security PIN' : 'Verify Identity'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {mode === 'set' ? 'Set a 4-digit PIN for extra security' : 'Enter your 4-digit security PIN'}
                    </p>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="flex justify-center gap-4 mb-8">
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                id={`pin-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-16 bg-slate-900 border border-slate-700 rounded-xl text-center text-2xl font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
                                autoComplete="off"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        {mode === 'set' ? 'Set PIN & Continue' : 'Unlock Dashboard'}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                {mode === 'verify' && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleForgotPin}
                            className="text-sm text-slate-500 hover:text-white transition-colors"
                        >
                            Forgot PIN?
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
