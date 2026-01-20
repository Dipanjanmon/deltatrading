import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('global'); // 'global' or 'weekly'

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const endpoint = timeframe === 'weekly'
                    ? 'http://localhost:8080/api/leaderboard/weekly'
                    : 'http://localhost:8080/api/leaderboard';

                const res = await fetch(endpoint, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setLeaderboard(data);
                } else {
                    console.error('Failed to fetch leaderboard');
                }
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [timeframe]);

    return (
        <div className="min-h-screen bg-transparent text-white font-sans selection:bg-emerald-500/30">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-32 pb-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
                        🏆 Top Traders
                    </h1>

                    {/* Toggle Switch */}
                    <div className="flex justify-center gap-4 mb-6">
                        <button
                            onClick={() => setTimeframe('global')}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${timeframe === 'global' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'glass-interactive text-slate-400 hover:text-white'}`}
                        >
                            All Time
                        </button>
                        <button
                            onClick={() => setTimeframe('weekly')}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${timeframe === 'weekly' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'glass-interactive text-slate-400 hover:text-white'}`}
                        >
                            Weekly Sprint
                        </button>
                    </div>

                    <p className="text-slate-400">
                        {timeframe === 'global' ? "See who's making the biggest moves in DeltaTrading." : "Who's winning this week? Specific weekly gains tracked from Monday."}
                    </p>
                </div>

                <div className="glass-card overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400 animate-pulse">Loading rankings...</div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-slate-800/50 backdrop-blur-md border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Rank</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Trader</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">
                                        {timeframe === 'weekly' ? 'Weekly Gain' : 'Net Worth'}
                                    </th>
                                    {timeframe === 'global' && <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Gain/Loss</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leaderboard.map((entry, index) => (
                                    <tr key={index} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index < 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-lg' : 'bg-slate-700 text-slate-300'}`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner border border-white/10">
                                                    {entry.username ? entry.username.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <span className="font-medium text-white">{entry.username}</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-mono ${timeframe === 'weekly' && entry.netWorth > 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                                            ${entry.netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        {timeframe === 'global' && (
                                            <td className={`px-6 py-4 text-right font-semibold ${entry.gainLossPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {entry.gainLossPercent ? (entry.gainLossPercent >= 0 ? '+' : '') + entry.gainLossPercent.toFixed(2) + '%' : 'N/A'}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {leaderboard.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                            No traders found yet. Be the first!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
