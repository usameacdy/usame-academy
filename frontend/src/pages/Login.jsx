import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, Shield, Sparkles, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Ma loo ogolaan galitaanka. Hubi xogtaada.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = (quickEmail, quickPass) => {
        setEmail(quickEmail);
        setPassword(quickPass);
        setError('');
    };

    return (
        <div className="min-h-screen bg-surface font-manrope text-on-surface flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-secondary/30 selection:text-secondary">
            
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -ml-40 -mb-40" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                {/* BRAND HEADER */}
                <div className="text-center mb-10 space-y-4">
                    <img 
                        src={`${import.meta.env.BASE_URL}assets/logo.png`} 
                        alt="Logo" 
                        className="w-24 h-24 mx-auto object-contain mb-2"
                    />
                    <div>
                        <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">
                            USAMA <span className="text-secondary">ACADEMY</span>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1">Gali Akoonkaaga Barashada</p>
                    </div>
                </div>

                {/* LOGIN CARD */}
                <div className="glass-premium rounded-[3.5rem] p-10 sm:p-12 shadow-2xl border border-outline-variant space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl pointer-events-none"></div>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-on-surface italic">Ku soo dhawoow</h2>
                        <p className="text-sm text-on-surface-variant font-medium opacity-80">Fadlan geli macluumaadkaaga si aad u bilowdo.</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-red-50 text-red-500 rounded-2xl text-[11px] font-black uppercase tracking-tight flex items-center gap-3 border border-red-100"
                            >
                                <Shield className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-4 opacity-40">Email-kaagu</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    className="input-terminal w-full py-5 px-14 text-sm focus:ring-0"
                                    placeholder="magaca@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40">Lambarka Sirta</label>
                                <button type="button" onClick={() => alert('Fadlan la xariir maamulka Usama Academy si lambarka sirta dib loogu cusboonaysiiyo.')} className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] hover:text-primary transition-colors">Ma ilowday?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-terminal w-full py-5 px-14 text-sm focus:ring-0"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-6 rounded-[2rem] flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.3em] italic shadow-xl transition-all ${loading ? 'bg-surface-container text-on-surface-variant cursor-not-allowed border border-outline-variant' : 'btn-energy'}`}
                        >
                            {loading ? 'Hubinta xogta...' : <>Gali Akoonka <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    {/* QUICK DEMO LOGINS */}
                    <div className="pt-2 border-t border-outline-variant/50">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/70 text-center mb-3">
                            Akoonada Tijaabada (Demo Login)
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('admin@usamacademy.com', 'Admin@2026')}
                                className="py-2.5 px-2 bg-surface-container hover:bg-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider text-on-surface transition-all border border-outline-variant"
                            >
                                👑 Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('instructor@eduflow.com', 'password123')}
                                className="py-2.5 px-2 bg-surface-container hover:bg-secondary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider text-on-surface transition-all border border-outline-variant"
                            >
                                👨‍🏫 Macalin
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('student@eduflow.com', 'password123')}
                                className="py-2.5 px-2 bg-surface-container hover:bg-emerald-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider text-on-surface transition-all border border-outline-variant"
                            >
                                🎓 Arday
                            </button>
                        </div>
                    </div>

                    <div className="text-center pt-2 relative z-10">
                        <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-80">
                            Ma haysatid akoon? 
                            <Link to="/register" className="text-secondary ml-3 hover:text-primary transition-colors underline underline-offset-4 decoration-2">Abuur Akoon Cusub</Link>
                        </p>
                    </div>
                </div>

                {/* TRUST FOOTER */}
                <div className="mt-12 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-60 px-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full shadow-[0_0_10px_rgba(0,227,243,0.8)]" />
                        System Secure
                    </div>
                    <div>Usama Academy v1.0</div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
