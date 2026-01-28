import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';
import { LogOut, TrendingUp, Wallet, DollarSign, PieChart as PieIcon, Activity, User, Search, Bell, Settings, ChevronDown, Edit, CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import LiveTicker from '../components/LiveTicker';
import PriceChart from '../components/PriceChart';
import WalletModal from '../components/WalletModal';
import ProfileModal from '../components/ProfileModal';
import HistorySection from '../components/HistorySection';
import MarketOverview from '../components/MarketOverview';
import BillingModal from '../components/BillingModal';
import toast, { Toaster } from 'react-hot-toast';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [balance, setBalance] = useState(0);
    const [portfolio, setPortfolio] = useState([]);
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [targetPrice, setTargetPrice] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [tradeType, setTradeType] = useState('BUY');
    const [marketPrices, setMarketPrices] = useState({});
    const [marketStats, setMarketStats] = useState([]); // New state for gainers/losers/search
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null); // Full user details
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);

    const searchResults = useMemo(() => {
        if (!searchQuery || !marketStats) return [];
        const q = searchQuery.toUpperCase();
        return marketStats.filter(item =>
            item.symbol.includes(q) || (item.name && item.name.toUpperCase().includes(q))
        );
    }, [searchQuery, marketStats]);

    // Poll for notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(response.data);
                setUnreadCount(response.data.filter(n => !n.read).length);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleSelectAsset = (assetSymbol) => {
        setSymbol(assetSymbol);
        setSearchQuery('');
        setShowSearchResults(false);
    };

    const fetchMarketPrices = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/trade/prices`);
            setMarketPrices(res.data);

            // Also fetch stats
            const statsRes = await axios.get(`${API_BASE_URL}/api/trade/stats`);
            setMarketStats(statsRes.data);
        } catch (error) {
            console.error("Error fetching market prices", error);
        }
    }, []);

    const [achievements, setAchievements] = useState([]); // New state for achievements

    // Fetch static/less frequent data (Achievements)
    const fetchAchievements = useCallback(async () => {
        try {
            const achRes = await axios.get(`${API_BASE_URL}/api/achievements`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAchievements(achRes.data);
        } catch (error) {
            console.error("Failed to load achievements", error);
        }
    }, []);

    // Fetch frequent User Data (Balance, Portfolio) for Real-time Equity/Cash
    const fetchUserData = useCallback(async () => {
        if (!user?.username) return;
        try {
            const userRes = await axios.get(`${API_BASE_URL}/api/users/${user?.username}`);
            setBalance(userRes.data.balance);
            setUserProfile(userRes.data); // Store full profile

            const pfRes = await axios.get(`${API_BASE_URL}/api/trade/portfolio`);
            setPortfolio(pfRes.data);
        } catch (error) {
            console.error("Failed to update user data", error);
        }
    }, [user]);

    // Initial Data Load
    const fetchData = useCallback(async () => {
        await fetchUserData();
        await fetchAchievements();
        await fetchMarketPrices();
    }, [fetchUserData, fetchAchievements, fetchMarketPrices]);

    useEffect(() => {
        const initData = async () => {
            await fetchData();
        };
        initData();

        const marketInterval = setInterval(fetchMarketPrices, 2000); // Market Prices: 2s
        const userInterval = setInterval(fetchUserData, 3000);       // User Data (Cash/Equity): 3s

        return () => {
            clearInterval(marketInterval);
            clearInterval(userInterval);
        };
    }, [fetchData, fetchMarketPrices, fetchUserData]);

    const handleTrade = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/trade/${tradeType.toLowerCase()}`, {
                symbol: symbol.toUpperCase(),
                quantity: parseFloat(quantity),
                targetPrice: targetPrice ? parseFloat(targetPrice) : null,
                stopLoss: stopLoss ? parseFloat(stopLoss) : null
            });
            toast.success(`${tradeType} order placed!`, {
                duration: 4000,
                position: 'top-right',
                style: { background: '#10B981', color: '#fff' },
                icon: '🚀',
            });
            fetchData();
            setSymbol('');
            setQuantity('');
            setTargetPrice('');
            setStopLoss('');
        } catch (error) {
            toast.error(error.response?.data || error.message);
        }
    };

    const portfolioData = portfolio.map(p => ({
        name: p.symbol,
        value: p.quantity * (marketPrices[p.symbol] || p.averagePrice)
    }));

    const portfolioValue = portfolioData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="min-h-screen bg-transparent text-gray-100 font-sans selection:bg-emerald-500/30">
            <Toaster />
            {/* Consistent Navbar */}
            <nav className="glass-panel px-6 py-4 flex justify-between items-center z-50 sticky top-0">
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <img
                                src="/deltatrading_logo_geometric_1768213069953.png"
                                alt="DeltaTrading Logo"
                                className="h-10 w-10 object-contain relative z-10 transition-transform group-hover:scale-110 duration-300"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white tracking-tight flex items-center gap-2 font-display">
                                Delta<span className="text-emerald-500">Trading</span>
                            </span>
                        </div>
                        <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">PRO</span>
                    </Link>

                    {/* Navbar Search */}
                    <div className="relative hidden lg:block w-96 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative glass-interactive rounded-xl flex items-center">
                            <Search className="absolute left-3.5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search markets, assets, news..."
                                className="w-full bg-transparent border-0 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-0 outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSearchResults(true);
                                }}
                                onFocus={() => setShowSearchResults(true)}
                            />
                            <div className="mr-2 px-2 py-1 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-slate-400">/</div>
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearchResults && searchQuery && (
                            <div className="absolute top-full left-0 w-full mt-3 glass-panel rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                {searchResults.length > 0 ? (
                                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900/50">Markets</div>
                                        {searchResults.map(asset => (
                                            <div
                                                key={asset.symbol}
                                                onClick={() => handleSelectAsset(asset.symbol)}
                                                className="flex items-center justify-between p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors group/item"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-slate-800/50 flex items-center justify-center text-xs font-bold text-slate-300 group-hover/item:bg-emerald-500/10 group-hover/item:text-emerald-400 transition-colors">
                                                        {asset.symbol.substring(0, 1)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm group-hover/item:text-emerald-400 transition-colors">{asset.symbol}</p>
                                                        <p className="text-[10px] text-slate-400">{asset.name}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-mono text-sm text-white">${asset.price.toFixed(2)}</p>
                                                    <p className={`text-[10px] font-bold ${asset.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <Search className="mx-auto h-8 w-8 text-slate-700 mb-2" />
                                        <p className="text-slate-500 text-sm">No assets found</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {showSearchResults && searchQuery && (
                            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setShowSearchResults(false)}></div>
                        )}
                    </div>
                </div>

                {/* Dashboard Menu */}
                <div className="flex items-center gap-5">

                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all relative"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <>
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0F172A] animate-ping"></span>
                                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0F172A]"></span>
                                </>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-3 border-b border-white/10 bg-white/5 backdrop-blur-sm flex justify-between items-center">
                                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                                    {unreadCount > 0 && <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono">{unreadCount} New</span>}
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500 text-sm">
                                            <Bell className="mx-auto h-6 w-6 mb-2 opacity-50" />
                                            No notifications yet
                                        </div>
                                    ) : (
                                        notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? 'bg-emerald-500/5' : ''}`}
                                                onClick={() => !notification.read && markAsRead(notification.id)}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!notification.read ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                                    <div>
                                                        <p className={`text-sm ${!notification.read ? 'text-white font-medium' : 'text-slate-400'}`}>
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-[10px] text-slate-600 mt-1 font-mono">
                                                            {new Date(notification.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {showNotifications && (
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                        )}
                    </div>

                    <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden md:block"></div>

                    <div className="hidden md:block text-right mr-2">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Total Equity</p>
                        <p className="font-mono font-bold text-lg text-white leading-none tracking-tight">
                            ${(balance + portfolioValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-1.5 pl-2 pr-3 glass-interactive rounded-full transition-all group"
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                    {userProfile?.profilePictureUrl ? (
                                        <img src={userProfile.profilePictureUrl} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={16} className="text-emerald-500" />
                                    )}
                                </div>
                            </div>
                            <div className="hidden sm:block text-left mr-1">
                                <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                                    {userProfile ? (userProfile.fullName || userProfile.username) : user?.username}
                                </p>
                            </div>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-3 w-64 glass-panel rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 border-b border-white/10 mb-2">
                                    <p className="font-bold text-white">{userProfile?.fullName || user?.username}</p>
                                    <p className="text-xs text-slate-500 truncate">{userProfile?.email || 'No email set'}</p>
                                </div>
                                <button
                                    onClick={() => { setIsProfileModalOpen(true); setShowProfileMenu(false); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    <Settings size={16} className="text-slate-500" /> Settings
                                </button>
                                <button
                                    onClick={() => { setIsBillingModalOpen(true); setShowProfileMenu(false); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    <CreditCard size={16} className="text-slate-500" /> Billing
                                </button>
                                <div className="h-px bg-white/10 my-2"></div>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                                >
                                    <LogOut size={16} /> Sign out
                                </button>
                            </div>
                        )}
                        {/* Overlay for menu */}
                        {showProfileMenu && (
                            <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                        )}
                    </div>
                </div>
            </nav>

            <LiveTicker prices={marketPrices} />

            <div className="container mx-auto p-6">
                <MarketOverview marketStats={marketStats} onSelectAsset={setSymbol} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Chart & Portfolio Table (8 Cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* Live Chart Area */}
                        <div className="glass-card p-6 h-[600px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <Activity size={100} className="text-emerald-500" />
                            </div>
                            <PriceChart
                                symbol={symbol || 'BTC'}
                                stats={marketStats.find(s => s.symbol === (symbol || 'BTC'))}
                            />
                        </div>

                        {/* Portfolio Table */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                                <PieIcon className="text-blue-500" size={18} />
                                Your Positions
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-slate-500 border-b border-white/5 text-xs uppercase tracking-wider">
                                            <th className="p-3 font-semibold">Symbol</th>
                                            <th className="p-3 font-semibold text-right">Qty</th>
                                            <th className="p-3 font-semibold text-right">Avg. Price</th>
                                            <th className="p-3 font-semibold text-right">Current</th>
                                            <th className="p-3 font-semibold text-right">P/L ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-mono">
                                        {portfolio.length === 0 ? (
                                            <tr><td colSpan="5" className="p-8 text-center text-slate-500 italic">No open positions</td></tr>
                                        ) : (
                                            portfolio.map(p => {
                                                const currentPrice = marketPrices[p.symbol] || p.averagePrice;
                                                const pl = (currentPrice - p.averagePrice) * p.quantity;
                                                const isProfit = pl >= 0;
                                                return (
                                                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => setSymbol(p.symbol)}>
                                                        <td className="p-3 font-bold text-white group-hover:text-emerald-400 transition-colors">{p.symbol}</td>
                                                        <td className="p-3 text-right text-slate-400">
                                                            {p.quantity < 0 ? (
                                                                <span className="text-rose-400 font-bold flex items-center justify-end gap-1">
                                                                    {Math.abs(p.quantity)} <span className="text-[10px] bg-rose-500/10 px-1 rounded border border-rose-500/20">SHORT</span>
                                                                </span>
                                                            ) : (
                                                                p.quantity
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-right text-slate-500">${p.averagePrice?.toFixed(2)}</td>
                                                        <td className="p-3 text-right text-white">${currentPrice.toFixed(2)}</td>
                                                        <td className={`p-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-500'}`}>
                                                            {isProfit ? '+' : ''}{pl.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Trade Form & Balance (4 Cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* Balance Card */}
                        <div className="glass-card p-6 relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0">
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                            <div className="flex items-center gap-3 mb-2 relative z-10 justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                        <Wallet size={20} />
                                    </div>
                                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Cash</h2>
                                </div>
                                <button
                                    onClick={() => setIsWalletModalOpen(true)}
                                    className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded font-bold transition-colors"
                                >
                                    + ADD FUNDS
                                </button>
                            </div>
                            <p className="text-3xl font-bold text-white tracking-tight relative z-10 font-mono mt-2">
                                ${(balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }))}
                            </p>
                        </div>

                        {/* Achievements Card */}
                        <div className="glass-card p-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                                Achievements
                                <Link to="/profile" className="text-[10px] text-emerald-400 hover:text-emerald-300">View All</Link>
                            </h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {achievements.length > 0 ? (
                                    achievements.filter(a => a.unlocked).map((ach, i) => (
                                        <div key={i} className="group relative shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-lg border-2 border-slate-800 cursor-help" title={ach.description}>
                                                {ach.badgeUrl}
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 glass-panel text-white text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                                                <p className="font-bold text-yellow-400">{ach.name}</p>
                                                <p className="text-slate-400">{ach.description}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 italic">No badges yet. Start trading!</p>
                                )}
                                {achievements.filter(a => a.unlocked).length === 0 && achievements.length > 0 && (
                                    <p className="text-xs text-slate-500 italic">No badges yet. Start trading!</p>
                                )}
                            </div>
                        </div>

                        {/* Trade Form */}
                        <div className="glass-card p-6 flex-1">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                                    <DollarSign className="text-emerald-500" size={18} />
                                    Quick Trade
                                </h2>
                                <span className="text-xs font-bold text-slate-500 bg-white/5 px-2 py-1 rounded">MARKET</span>
                            </div>


                            <div className="flex bg-slate-900/50 rounded-lg p-1.5 mb-6 border border-white/5">
                                <button
                                    className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${tradeType === 'BUY' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-500 hover:text-white'}`}
                                    onClick={() => setTradeType('BUY')}
                                >
                                    BUY
                                </button>
                                <button
                                    className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${tradeType === 'SELL' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' : 'text-slate-500 hover:text-white'}`}
                                    onClick={() => setTradeType('SELL')}
                                >
                                    SELL
                                </button>
                            </div>

                            <form onSubmit={handleTrade} className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Asset</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={symbol}
                                            onChange={e => setSymbol(e.target.value.toUpperCase())}
                                            className="w-full glass-interactive rounded-xl p-3.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all uppercase font-bold tracking-wider text-sm placeholder:text-slate-600"
                                            placeholder="BTC"
                                            required
                                        />
                                        {marketPrices[symbol] && (
                                            <div className="absolute right-3 top-3.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                ${marketPrices[symbol].toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                                        Quantity
                                        {tradeType === 'BUY' && symbol && marketPrices[symbol] && (
                                            <button
                                                type="button"
                                                onClick={() => setQuantity(Math.floor(balance / marketPrices[symbol]))}
                                                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 transition-colors"
                                            >
                                                MAX: {Math.floor(balance / marketPrices[symbol])}
                                            </button>
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        className="w-full glass-interactive rounded-xl p-3.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono text-sm placeholder:text-slate-600"
                                        placeholder="0"
                                        step="1"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block text-[10px]">Target Price ($)</label>
                                        <input
                                            type="number"
                                            value={targetPrice}
                                            onChange={e => setTargetPrice(e.target.value)}
                                            className="w-full glass-interactive rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono text-sm placeholder:text-slate-600"
                                            placeholder="Optional"
                                            step="0.01"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block text-[10px]">Stop Loss ($)</label>
                                        <input
                                            type="number"
                                            value={stopLoss}
                                            onChange={e => setStopLoss(e.target.value)}
                                            className="w-full glass-interactive rounded-xl p-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all font-mono text-sm placeholder:text-slate-600"
                                            placeholder="Optional"
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                {symbol && quantity && marketPrices[symbol] && (
                                    <div className="flex flex-col gap-2 bg-white/5 p-3 rounded-lg text-sm border border-white/5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-xs">Estimated Total</span>
                                            <span className="font-bold text-white font-mono">
                                                ${(parseFloat(quantity) * marketPrices[symbol]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-500">New Balance Impact</span>
                                            <span className={`font-mono ${tradeType === 'BUY' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                {tradeType === 'BUY' ? '-' : '+'}${(parseFloat(quantity) * marketPrices[symbol]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className={`w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide transition-all active:scale-95 shadow-lg mt-2 ${tradeType === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20'}`}>
                                    {tradeType} {symbol || 'ASSET'}
                                </button>
                            </form>
                        </div>

                        {/* Allocation Pie Chart */}
                        <div className="glass-card p-6 flex-col justify-center hidden lg:flex h-60">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                                Asset Allocation
                            </h3>
                            {portfolio.length > 0 ? (
                                <div className="w-full h-full text-xs">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={portfolioData} innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value" stroke="none">
                                                {portfolioData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '8px', fontSize: '12px', backdropFilter: 'blur(8px)' }}
                                                itemStyle={{ color: '#fff' }}
                                                formatter={(value) => `$${value.toFixed(2)}`}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs text-center">
                                    <PieIcon className="mb-2 opacity-50" />
                                    No assets owned
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Full Width History Section */}
                    <HistorySection />
                </div>
            </div>

            <WalletModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
                user={{ ...user, balance }}
                onSuccess={fetchData}
            />

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={userProfile}
                onUpdate={fetchData}
            />

            <BillingModal
                isOpen={isBillingModalOpen}
                onClose={() => setIsBillingModalOpen(false)}
                user={{ ...user, balance }}
            />
        </div >
    );
}
