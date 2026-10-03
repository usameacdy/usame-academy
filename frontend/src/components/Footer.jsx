import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-surface-container pt-24 pb-12 border-t border-outline-variant relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-10">
                <div className="grid md:grid-cols-4 gap-16 mb-20">
                    <div className="md:col-span-2 space-y-8">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center border border-outline-variant group-hover:border-secondary transition-all">
                                <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                            </div>
                            <span className="text-3xl font-black text-on-surface tracking-tighter uppercase italic">
                                USAMA <span className="text-secondary">ACADEMY</span>
                            </span>
                        </Link>
                        <p className="text-sm font-medium text-on-surface-variant max-w-md leading-relaxed opacity-60">
                            Barashada xirfadaha casriga ah ee lagu tartamo suuqyada caalamka. Akadeemiyada Usama waxay kuu diyaarisay jidkii aad ku gaari lahayd guushaada aqooneed.
                        </p>
                        <div className="flex gap-6">
                            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                                <a key={social} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-all">{social}</a>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary">Hagaha</h4>
                        <nav className="flex flex-col gap-4">
                            {['Koorsooyinka', 'Nagu Saabsan', 'Qiimaha', 'FAQs'].map((link) => (
                                <Link key={link} to="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-all w-fit">
                                    {link}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-8">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary">Qaanuunka</h4>
                        <nav className="flex flex-col gap-4">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                                <Link key={link} to="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-all w-fit">
                                    {link}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="pt-12 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-30">
                        © {new Date().getFullYear()} USAMA ACADEMY. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-50">SYSTEM STATUS: OPERATIONAL</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
