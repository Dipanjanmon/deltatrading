import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Layers } from 'lucide-react';
import PropTypes from 'prop-types';

export default function MarketOverview({ marketStats, onSelectAsset }) {

    const topGainers = useMemo(() => {
        if (!marketStats) return [];
        return [...marketStats].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
    }, [marketStats]);

    const topLosers = useMemo(() => {
        if (!marketStats) return [];
        return [...marketStats].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);
    }, [marketStats]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Top Gainers */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp size={80} className="text-emerald-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-500" /> Top Gainers
                </h3>
                <div className="space-y-3">
                    {topGainers.map(asset => (
                        <div key={asset.symbol} onClick={() => onSelectAsset(asset.symbol)} className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs border border-emerald-500/20">
                                    {asset.symbol.substring(0, 1)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-sm">{asset.symbol}</span>
                                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{asset.name}</span>
                                </div>
                            </div>
                            <span className={`font-mono font-bold text-sm ${asset.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Losers */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingDown size={80} className="text-rose-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingDown size={16} className="text-rose-500" /> Top Losers
                </h3>
                <div className="space-y-3">
                    {topLosers.map(asset => (
                        <div key={asset.symbol} onClick={() => onSelectAsset(asset.symbol)} className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold text-xs border border-rose-500/20">
                                    {asset.symbol.substring(0, 1)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-sm">{asset.symbol}</span>
                                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{asset.name}</span>
                                </div>
                            </div>
                            <span className={`font-mono font-bold text-sm ${asset.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

MarketOverview.propTypes = {
    marketStats: PropTypes.arrayOf(PropTypes.shape({
        symbol: PropTypes.string,
        name: PropTypes.string,
        changePercent: PropTypes.number
    })),
    onSelectAsset: PropTypes.func
};
