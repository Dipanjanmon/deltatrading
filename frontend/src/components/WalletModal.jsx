import { useState } from 'react';
import axios from 'axios';
import { X, CreditCard, ArrowDownCircle, ArrowUpCircle, CheckCircle, Loader2, ShieldCheck, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import MoneySound from '../assets/MoneySoundEffect.mp3';

export default function WalletModal({ isOpen, onClose, onSuccess, user }) {
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('DEPOSIT'); // DEPOSIT or WITHDRAW
    const [step, setStep] = useState('AMOUNT'); // AMOUNT, PAYMENT, PROCESSING, SUCCESS
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleAmountSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount");
            return;
        }

        if (mode === 'DEPOSIT') {
            if (parseFloat(amount) > 1000000) {
                setError("Deposit limit exceeded. Max: $1,000,000");
                return;
            }
            setStep('PAYMENT');
        } else {
            // Withdraw flow
            if (parseFloat(amount) > user.balance) {
                setError("Insufficient funds");
                return;
            }
            processTransaction();
        }
    };

    const processTransaction = async () => {
        setStep('PROCESSING');
        setLoading(true);
        setError(''); // Clear previous errors

        try {
            // Artificial delay to simulate realistic payment gateway
            await new Promise(resolve => setTimeout(resolve, 2000));

            const endpoint = mode === 'DEPOSIT' ? 'deposit' : 'withdraw';
            const url = `http://localhost:8081/api/wallet/${endpoint}`;

            await axios.post(url, { amount: parseFloat(amount) }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setStep('SUCCESS');

            // Play success sound
            const audio = new Audio(MoneySound);
            audio.volume = 0.5;
            audio.play().catch(e => console.error("Error playing sound:", e));

            toast.success(`${mode === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} successful!`);
            onSuccess();

            // Auto close after success
            setTimeout(() => {
                onClose();
                resetState();
            }, 2000);

        } catch (err) {
            setStep(mode === 'DEPOSIT' ? 'PAYMENT' : 'AMOUNT'); // Go back
            const msg = err.response?.data || 'Transaction failed. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setAmount('');
        setStep('AMOUNT');
        setError('');
        setLoading(false);
        setMode('DEPOSIT');
    };

    const handleClose = () => {
        if (loading) return;
        onClose();
        resetState();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100]">
            <div className="glass-card w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden transform">
                <button
                    onClick={handleClose}
                    disabled={loading}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                >
                    <X size={20} />
                </button>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {mode === 'DEPOSIT' ? <ArrowDownCircle className="text-emerald-500" /> : <ArrowUpCircle className="text-amber-500" />}
                        {mode === 'DEPOSIT' ? 'Add Funds' : 'Withdraw Funds'}
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                        Secure Transaction • 256-bit Encryption
                    </p>
                </div>

                {step === 'AMOUNT' && (
                    <div className="space-y-6">
                        <div className="flex glass-panel rounded-lg p-1.5">
                            <button
                                onClick={() => setMode('DEPOSIT')}
                                className={`flex - 1 py - 2 rounded - md text - sm font - bold transition - all ${mode === 'DEPOSIT' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white'} `}
                            >
                                Deposit
                            </button>
                            <button
                                onClick={() => setMode('WITHDRAW')}
                                className={`flex - 1 py - 2 rounded - md text - sm font - bold transition - all ${mode === 'WITHDRAW' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-slate-400 hover:text-white'} `}
                            >
                                Withdraw
                            </button>
                        </div>

                        <form onSubmit={handleAmountSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                                    Amount ({mode === 'DEPOSIT' ? 'Max $1M' : 'Available Balance'})
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-lg">$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full glass-interactive rounded-xl pl-8 p-4 text-white placeholder:text-slate-600 focus:border-emerald-500/50 outline-none transition-all font-mono text-xl"
                                        placeholder="0.00"
                                        min="0.01"
                                        step="0.01"
                                        autoFocus
                                    />
                                </div>
                                {error && <p className="text-rose-500 text-xs mt-2 font-medium bg-rose-500/10 p-2 rounded border border-rose-500/20">{error}</p>}
                            </div>

                            <div className="glass-panel p-4 rounded-xl">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-slate-400">Current Balance</span>
                                    <span className="font-mono font-bold text-white">${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">{mode === 'DEPOSIT' ? 'Projected Balance' : 'Remaining Balance'}</span>
                                    <span className={`font - mono font - bold ${mode === 'DEPOSIT' ? 'text-emerald-400' : 'text-amber-400'} `}>
                                        ${amount ? (mode === 'DEPOSIT'
                                            ? (parseFloat(user?.balance || 0) + parseFloat(amount))
                                            : (parseFloat(user?.balance || 0) - parseFloat(amount))
                                        ).toLocaleString(undefined, { minimumFractionDigits: 2 }) : user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w - full py - 4 rounded - xl font - bold text - white text - sm tracking - wide transition - all active: scale - 95 shadow - lg ${mode === 'DEPOSIT' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20'} `}
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                )}

                {step === 'PAYMENT' && (
                    <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                        <div className="glass-panel p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-white">Payment Method</h3>
                                <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-blue-500 rounded  opacity-80"></div>
                                    <div className="w-8 h-5 bg-red-500 rounded opacity-80"></div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <input
                                    className="w-full glass-interactive rounded-lg p-3 text-sm text-white font-mono placeholder:text-slate-600"
                                    placeholder="0000 0000 0000 0000"
                                    defaultValue="4242 4242 4242 4242"
                                />
                                <div className="flex gap-3">
                                    <input
                                        className="w-full glass-interactive rounded-lg p-3 text-sm text-white font-mono placeholder:text-slate-600"
                                        placeholder="MM/YY"
                                        defaultValue="12/28"
                                    />
                                    <input
                                        className="w-full glass-interactive rounded-lg p-3 text-sm text-white font-mono placeholder:text-slate-600"
                                        placeholder="CVC"
                                        defaultValue="123"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-rose-500 text-xs font-medium bg-rose-500/10 p-2 rounded border border-rose-500/20">{error}</p>}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('AMOUNT')}
                                className="flex-1 py-3 rounded-xl font-bold text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all text-sm"
                            >
                                Back
                            </button>
                            <button
                                onClick={processTransaction}
                                className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={16} />
                                Pay ${parseFloat(amount).toLocaleString()}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'PROCESSING' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
                            <div className="w-20 h-20 border-4 border-t-emerald-500 border-r-emerald-500/50 border-b-emerald-500/10 border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                            <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Processing Secure Payment</h3>
                        <p className="text-slate-400 text-sm">Please do not close this window...</p>
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-emerald-500/20 border border-emerald-500/40">
                            <CheckCircle className="text-emerald-500" size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Transaction Successful!</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            ${parseFloat(amount).toLocaleString()} has been added to your wallet.
                        </p>
                        <div className="glass-panel p-4 rounded-xl w-full flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-xs uppercase tracking-wider">New Balance</span>
                            <span className="font-mono font-bold text-emerald-400 text-lg">
                                ${(parseFloat(user?.balance || 0) + (mode === 'DEPOSIT' ? parseFloat(amount) : -parseFloat(amount))).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

WalletModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    user: PropTypes.shape({
        balance: PropTypes.number
    })
};
