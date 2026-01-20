import { useState, useEffect } from 'react';
import axios from 'axios';
import { History, ArrowRightLeft, TrendingUp, TrendingDown } from 'lucide-react';

export default function HistorySection() {
    const [activeTab, setActiveTab] = useState('ORDERS');
    const [orders, setOrders] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [ordersRes, txRes] = await Promise.all([
                    axios.get('http://localhost:8081/api/trade/orders', config),
                    axios.get('http://localhost:8081/api/wallet/transactions', config)
                ]);

                setOrders(ordersRes.data);
                setTransactions(txRes.data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl col-span-1 lg:col-span-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                    <History className="text-blue-500" size={18} />
                    History
                </h2>
                <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                    <button
                        onClick={() => setActiveTab('ORDERS')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'ORDERS' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('TRANSACTIONS')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'TRANSACTIONS' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'}`}
                    >
                        Transactions
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-900 z-10">
                        {activeTab === 'ORDERS' ? (
                            <tr className="text-slate-500 border-b border-slate-800 text-xs uppercase tracking-wider">
                                <th className="p-3 font-semibold">Date</th>
                                <th className="p-3 font-semibold">Symbol</th>
                                <th className="p-3 font-semibold">Type</th>
                                <th className="p-3 font-semibold text-right">Qty</th>
                                <th className="p-3 font-semibold text-right">Price</th>
                                <th className="p-3 font-semibold text-right">Total</th>
                                <th className="p-3 font-semibold text-right">P/L</th>
                            </tr>
                        ) : (
                            <tr className="text-slate-500 border-b border-slate-800 text-xs uppercase tracking-wider">
                                <th className="p-3 font-semibold">Date</th>
                                <th className="p-3 font-semibold">Type</th>
                                <th className="p-3 font-semibold text-right">Amount</th>
                                <th className="p-3 font-semibold text-right">Status</th>
                            </tr>
                        )}
                    </thead>
                    <tbody className="text-sm font-mono">
                        {loading ? (
                            <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading history...</td></tr>
                        ) : activeTab === 'ORDERS' ? (
                            orders.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-slate-500 italic">No order history</td></tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                                        <td className="p-3 text-slate-400 text-xs">{formatDate(order.createdAt)}</td>
                                        <td className="p-3 font-bold text-white">{order.symbol}</td>
                                        <td className={`p-3 font-bold ${order.type === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {order.type}
                                        </td>
                                        <td className="p-3 text-right text-slate-300">{order.quantity}</td>
                                        <td className="p-3 text-right text-slate-300">${order.price.toFixed(2)}</td>
                                        <td className="p-3 text-right text-slate-300">${(order.price * order.quantity).toFixed(2)}</td>
                                        <td className={`p-3 text-right font-bold ${order.realizedPnl > 0 ? 'text-emerald-400' : order.realizedPnl < 0 ? 'text-rose-500' : 'text-slate-500'}`}>
                                            {order.realizedPnl ? (
                                                <>
                                                    {order.realizedPnl > 0 ? '+' : ''}{order.realizedPnl.toFixed(2)}
                                                </>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))
                            )
                        ) : (
                            transactions.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-500 italic">No transactions</td></tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                                        <td className="p-3 text-slate-400 text-xs">{formatDate(tx.createdAt)}</td>
                                        <td className="p-3 font-bold text-white flex items-center gap-2">
                                            {tx.type === 'DEPOSIT' ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-amber-500" />}
                                            {tx.type}
                                        </td>
                                        <td className={`p-3 text-right font-bold ${tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-right">
                                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-bold">Success</span>
                                        </td>
                                    </tr>
                                ))
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
