import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Users, Globe, TrendingUp, Shield } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                        We Are Building the Future of Trading
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed">
                        DeltaTrading was founded on a simple belief: Everyone deserves access to professional-grade financial tools without the risk.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-20 animate-fade-in-up">
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-all">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-400">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                        <p className="text-slate-400 leading-relaxed">
                            To democratize financial literacy by providing a zero-risk environment where anyone can master the art of trading using real-time market simulation.
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                        <p className="text-slate-400 leading-relaxed">
                            A world where financial markets are transparent, accessible, and understood by all, powered by cutting-edge technology and educational resources.
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-16 max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-10 text-center">Meet the Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Dipanjan", role: "CEO & Founder", icon: <Users /> },
                            { name: "Alex Chen", role: "CTO", icon: <Shield /> },
                            { name: "Bella Spark", role: "Head of Product", icon: <TrendingUp /> }
                        ].map((member, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all">
                                    {member.icon}
                                </div>
                                <h4 className="text-xl font-bold">{member.name}</h4>
                                <p className="text-emerald-500">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
