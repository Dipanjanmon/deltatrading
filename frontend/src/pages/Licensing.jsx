import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Licensing() {
    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Licensing & Market Data Disclaimer</h1>

                <div className="space-y-8 text-slate-300 leading-relaxed">
                    <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                        <h2 className="text-2xl font-bold text-white mb-4">Simulation License</h2>
                        <p>
                            DeltaTrading is a <strong>simulated educational platform</strong>. All "money", "assets", and "trades" on this platform are virtual and have no real-world monetary value. This software is provided for personal, non-commercial educational use only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Market Data Attribution</h2>
                        <p className="mb-4">
                            The market data displayed on this platform is simulated for educational purposes using random walk algorithms and historical patterns. It is NOT real-time financial data and should not be used for actual trading decisions.
                        </p>
                        <p>
                            Any resemblance to actual market movements is coincidental or based on delayed public datasets used for backtesting simulation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Open Source Software</h2>
                        <p>
                            This platform utilizes the following open-source technologies:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4 text-emerald-400">
                            <li>React (MIT License)</li>
                            <li>Spring Boot (Apache 2.0 License)</li>
                            <li>Recharts (MIT License)</li>
                            <li>TailwindCSS (MIT License)</li>
                            <li>Lucide Icons (ISC License)</li>
                        </ul>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}
