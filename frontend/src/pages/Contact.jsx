import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate sending email
        setTimeout(() => {
            toast.success("Message sent! We'll allow 24-48 hours for a response.");
            setFormData({ name: '', email: '', message: '' });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30">
            <Navbar />
            <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-slate-400">Have questions about the platform? We're here to help.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                                        <Mail size={20} />
                                    </div>
                                    <span>support@deltatrading.com</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                                        <Phone size={20} />
                                    </div>
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                                        <MapPin size={20} />
                                    </div>
                                    <span>100 Fintech Blvd, New York, NY 10001</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Message</label>
                                <textarea
                                    rows="4"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
