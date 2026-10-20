import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Award, ArrowRight, ShieldCheck, Cpu, Phone } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const nameParts = formData.name.trim().split(/\s+/);
        if (nameParts.length < 3) {
            setError('Fadlan qor magacaaga oo saddexan (Tusaale: Maxamed Cali Jaamac) si shahaadadaadu u dhab noqoto.');
            setLoading(false);
            return;
        }

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Khalad ayaa dhacay xilligii diiwaangelinta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface font-manrope text-on-surface flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden selection:bg-secondary/30 selection:text-secondary">
            
            {/* BACKGROUND DECOR */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -ml-40 -mt-40" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -mr-40 -mb-40" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[600px] relative z-10"
            >
                {/* HEADER */}
                <div className="text-center mb-10 space-y-4">
                    <img 
                        src={`${import.meta.env.BASE_URL}assets/logo.png`} 
                        alt="Logo" 
                        className="w-24 h-24 mx-auto object-contain mb-2"
                    />
                    <div>
                        <h1 className="text-3xl font-black text-primary uppercase tracking-tighter italic">KU SOO BIIR USAMA ACADEMY</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1">Bilow safarkaaga waxbarasho maanta</p>
                    </div>
                </div>

                {/* REGISTER CARD */}
                <div className="glass-premium rounded-[3.5rem] p-8 sm:p-12 shadow-2xl border border-outline-variant space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl pointer-events-none"></div>
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-5 bg-red-50 text-red-500 rounded-2xl text-[11px] font-black uppercase tracking-tight flex items-center gap-4 border border-red-100 italic"
                            >
                                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-4 opacity-40">Magacaaga Saddexan</label>
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50 group-focus-within:text-secondary transition-colors" />
                                    <input
                                        type="text"
                                        className="input-terminal w-full py-5 px-14 text-sm focus:ring-0"
                                        placeholder="Maxamed Cali Jaamac"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-4 opacity-40">Email-ka</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50 group-focus-within:text-secondary transition-colors" />
                                    <input
                                        type="email"
                                        className="input-terminal w-full py-5 px-14 text-sm focus:ring-0"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-4 opacity-40">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50 group-focus-within:text-secondary transition-colors" />
                                    <input
                                        type="password"
                                        className="input-terminal w-full py-5 px-14 text-sm focus:ring-0"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-4 opacity-40">Telefoonka</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50 group-focus-within:text-secondary transition-colors" />
                                    <input
                                        type="text"
                                        className="input-terminal w-full py-5 px-14 text-sm focus:ring-0"
                                        placeholder="061 • • • • • • •"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-6 rounded-[2rem] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] italic shadow-xl transition-all ${loading ? 'bg-surface-container text-on-surface-variant cursor-not-allowed border border-outline-variant' : 'btn-energy hover:scale-[1.02]'}`}
                        >
                            {loading ? 'Diiwaangelinta...' : <>Abuur Akoonka <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>

                    <div className="text-center relative z-10">
                        <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-80">
                            Hadda ka hor miyaad is diiwaangelisay? 
                            <Link to="/login" className="text-secondary ml-3 hover:text-primary transition-colors underline underline-offset-8">Login Hub</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-surface-container rounded-full border border-outline-variant shadow-sm">
                        <Award className="w-4 h-4 text-secondary" />
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em]">Certified Digital Learning Protocol</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
