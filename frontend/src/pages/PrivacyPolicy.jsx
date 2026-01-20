import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-slate-500 mb-8">Last Updated: January 12, 2026</p>

                <div className="space-y-8 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your username, password (encrypted), and simulated trading data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To provide, maintain, and improve our trading simulation services.</li>
                            <li>To process your simulated transactions and update your virtual portfolio.</li>
                            <li>To send you technical notices, updates, security alerts, and support messages.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                        <p>
                            We use industry-standard encryption (AES-256) to protect your personal information and trading data. However, please note that no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Cookies</h2>
                        <p>
                            We use cookies solely for session management (keeping you logged in). We do not use third-party tracking cookies.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}
