import { TrendingUp, TrendingDown, Globe } from 'lucide-react';

export default function LiveTicker({ prices }) {
    // Separate Indices and Stocks for display
    const indicesKey = ['SPX', 'NDX', 'DJI', 'BTC', 'ETH'];
    const indices = Object.entries(prices).filter(([key]) => indicesKey.includes(key));
    const stocks = Object.entries(prices).filter(([key]) => !indicesKey.includes(key));

    const TickerItem = ({ symbol, price }) => (
        <div className="flex items-center gap-3 px-4 py-1 border-r border-slate-700/50">
            <span className="font-bold text-sm text-gray-300">{symbol}</span>
            <div className="flex items-center gap-1">
                <span className="font-mono text-sm font-semibold text-white">
                    ${price.toFixed(2)}
                </span>
                {/* Simulated direction based on hash of price or random for effect since we don't have prev */}
                {price % 2 > 1 ? (
                    <TrendingUp size={12} className="text-emerald-400" />
                ) : (
                    <TrendingDown size={12} className="text-rose-400" />
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full flex flex-col bg-slate-900 border-b border-slate-800">
            {/* Top Bar: Global Indices */}
            <div className="bg-slate-950 px-6 py-2 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Globe size={14} /> Global Markets
                </div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar">
                    {indices.map(([sym, price]) => (
                        <div key={sym} className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${sym === 'BTC' || sym === 'ETH' ? 'text-yellow-500' : 'text-blue-400'}`}>{sym}</span>
                            <span className="text-xs font-mono text-gray-300">${price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scrolling Ticker for Stocks */}
            <div className="relative flex overflow-x-hidden bg-slate-900/50 py-3 group">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {stocks.map(([symbol, price]) => (
                        <TickerItem key={symbol} symbol={symbol} price={price} />
                    ))}
                    {/* Duplicate for seamless loop */}
                    {stocks.map(([symbol, price]) => (
                        <TickerItem key={`${symbol}-dup`} symbol={symbol} price={price} />
                    ))}
                </div>
                <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center">
                    {stocks.map(([symbol, price]) => (
                        <TickerItem key={`${symbol}-2`} symbol={symbol} price={price} />
                    ))}
                    {stocks.map(([symbol, price]) => (
                        <TickerItem key={`${symbol}-dup-2`} symbol={symbol} price={price} />
                    ))}
                </div>
            </div>
            <style>{`
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee2 {
                    animation: marquee2 40s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes marquee2 {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(0%); }
                }
            `}</style>
        </div>
    );
}
