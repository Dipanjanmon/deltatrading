import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, CreditCard, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import API_BASE_URL from '../config';

export default function BillingModal({ isOpen, onClose, user }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/wallet/${user.username}/transactions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransactions(res.data);
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && user?.username) {
            fetchTransactions();
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="glass-card w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh] overflow-hidden transform">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="text-emerald-500" />
                        Billing & History
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">View your transaction history and account statement.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <div className="glass-panel p-4 mb-6 rounded-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Current Balance</p>
                            <p className="text-3xl font-mono font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
                                ${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-500/10 to-transparent"></div>
                    </div>

                    <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Clock size={16} className="text-slate-500" />
                        Recent Transactions
                    </h3>

                    {loading ? (
                        <div className="text-center py-8 text-slate-500 animate-pulse">Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/5">
                            <CreditCard className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                            <p className="text-slate-500 text-sm">No transactions found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map(tx => (
                                <div key={tx.id} className="glass-interactive p-4 rounded-xl flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                            {tx.type === 'DEPOSIT' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">{tx.type}</p>
                                            <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-mono font-bold ${tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-slate-200'}`}>
                                            {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-[10px] text-slate-500 uppercase">{tx.status || 'COMPLETED'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-transparent">
                    <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-colors border border-transparent hover:border-white/5">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
