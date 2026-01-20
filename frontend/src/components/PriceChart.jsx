import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, Clock } from 'lucide-react';
import PropTypes from 'prop-types';

const TIMEFRAMES = [
    { label: '1M', value: '1M' },
    { label: '5M', value: '5M' },
    { label: '30M', value: '30M' },
    { label: '1H', value: '1H' },
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
];

export default function PriceChart({ symbol, stats }) {

    const [data, setData] = useState([]);
    const [timeframe, setTimeframe] = useState('1M');
    const [loading, setLoading] = useState(false);

    // Calculate Fixed Reference Price (Day Open) based on stats
    // Derived from formula: Open = Price / (1 + Change%)
    const openPrice = stats ? stats.price / (1 + (stats.changePercent / 100)) : (data.length > 0 ? data[0].price : null);

    useEffect(() => {
        if (!symbol) return;

        const fetchHistory = async () => {
            // Only show loading spinner on initial timeframe switch, not polling
            // setLoading(true); 
            try {
                const res = await axios.get(`http://localhost:8081/api/trade/history/${symbol}?timeframe=${timeframe}`);
                const formattedData = res.data.map(d => ({
                    time: new Date(d.timestamp),
                    price: d.price,
                    rawTime: d.timestamp
                }));
                // Sort by time to ensure correct chart rendering
                formattedData.sort((a, b) => a.rawTime - b.rawTime);
                setData(formattedData);
            } catch (error) {
                console.error("Failed to load chart data", error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchHistory();

        // Poll for 1M - 1s update (Standard Professional Speed)
        const interval = setInterval(fetchHistory, 1000);
        return () => clearInterval(interval);
    }, [symbol, timeframe]);

    const formatXAxis = (tickItem) => {
        const date = new Date(tickItem);
        if (timeframe === '1M' || timeframe === '5M' || timeframe === '30M') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (timeframe === '1H') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    if (!symbol) return (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <div className="p-4 bg-slate-800 rounded-full mb-4 opacity-50">
                <Clock size={32} />
            </div>
            <p className="font-medium">Select a market to view chart</p>
            <p className="text-xs mt-2 opacity-60">Real-time market data available</p>
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h3 className="text-white font-bold text-xl flex items-center gap-3">
                            {symbol}
                            {data.length > 0 && (
                                <span className={`text-sm font-mono px-2 py-0.5 rounded ${data[data.length - 1].price >= data[0].price ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {data.length > 0 ? ((data[data.length - 1].price - data[0].price) / data[0].price * 100).toFixed(2) : 0}%
                                </span>
                            )}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded tracking-wider uppercase animate-pulse flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> LIVE
                            </span>
                            <span className="text-xs text-slate-500">Real-time Data</span>
                        </div>
                    </div>
                </div>

                {/* Timeframe Selectors */}
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf.value}
                            onClick={() => setTimeframe(tf.value)}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeframe === tf.value
                                ? 'bg-slate-700 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Current Price Display - Large */}
            <div className="px-6 py-4 flex items-end gap-2">
                {data.length > 0 && (
                    <>
                        <p className="text-4xl font-mono font-bold text-white tracking-tighter">
                            ${data[data.length - 1].price.toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-400 mb-1.5 font-medium">USD</p>
                    </>
                )}
            </div>

            {/* Chart Area */}
            <div className="flex-1 w-full min-h-0 relative group">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm z-10 transition-opacity">
                        <RefreshCw className="animate-spin text-emerald-500" size={32} />
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPriceRed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid opacity={0.06} vertical={true} horizontal={true} stroke="#fff" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="rawTime"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'sans-serif' }}
                            minTickGap={50}
                            tickFormatter={formatXAxis}
                            dy={10}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'monospace' }}
                            tickFormatter={(val) => val.toFixed(2)}
                            width={60}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                borderColor: '#334155',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                                color: '#fff',
                                padding: '12px'
                            }}
                            itemStyle={{ color: '#10B981', fontWeight: 'bold', fontFamily: 'monospace' }}
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            labelStyle={{ color: '#94A3B8', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        />
                        {openPrice && (
                            <ReferenceLine
                                y={openPrice}
                                stroke="#94A3B8"
                                strokeDasharray="3 3"
                                strokeOpacity={0.5}
                                label={{ position: 'right', fill: '#94A3B8', fontSize: 10, value: 'OPEN' }}
                            />
                        )}
                        <Area
                            type="monotone"
                            dataKey="price"
                            // Color based on Reference Line (Open Price)
                            stroke={data.length > 0 && data[data.length - 1].price >= openPrice ? "#10B981" : "#F43F5E"}
                            strokeWidth={1.5}
                            fillOpacity={1}
                            fill={data.length > 0 && data[data.length - 1].price >= openPrice ? "url(#colorPrice)" : "url(#colorPriceRed)"}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

PriceChart.propTypes = {
    symbol: PropTypes.string,
    stats: PropTypes.shape({
        price: PropTypes.number,
        changePercent: PropTypes.number
    })
};

