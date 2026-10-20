import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, User, LogOut, Menu, X, Cpu, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-[60] px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-4">
                    <img 
                        src={`${import.meta.env.BASE_URL}assets/logo.png`} 
                        alt="Logo" 
                        className="w-12 h-12 object-contain"
                    />
                    <span className="text-2xl font-black text-primary tracking-tighter uppercase italic">
                        USAMA <span className="text-secondary">ACADEMY</span>
                    </span>
                </Link>


                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <Link to="/courses" className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-colors">Koorsooyinka</Link>
                    <Link to="/about" className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-colors">Nagu Saabsan</Link>
                    <Link to="/contact" className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-colors">Nala Soo Xiriir</Link>
                    
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-secondary transition-colors">Dashboard</Link>
                            {(user.role === 'admin' || user.role === 'instructor') && (
                                <Link to="/admin" className="text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary-600 transition-colors">
                                    {user.role === 'admin' ? 'Maamulka' : 'Macalinka'}
                                </Link>
                            )}
                            <div className="flex items-center gap-6 pl-8 border-l border-outline-variant">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="p-2 text-on-surface-variant hover:text-tertiary transition-colors">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-on-surface hover:text-secondary transition-colors">Soo Gal</Link>
                            <Link to="/register" className="btn-energy px-6 py-2.5 text-[10px] rounded-xl text-center">Is-diiwaangeli</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden p-2 text-on-surface" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full glass border-t border-outline-variant p-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
                    <Link to="/courses" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-widest text-on-surface">Koorsooyinka</Link>
                    <Link to="/about" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-widest text-on-surface">Nagu Saabsan</Link>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-widest text-on-surface">Nala Soo Xiriir</Link>
                    {user ? (
                        <>
                             <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-widest text-on-surface">Dashboard</Link>
                             <button onClick={handleLogout} className="text-left text-sm font-black uppercase tracking-widest text-tertiary">Kabax</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="text-sm font-black uppercase tracking-widest text-on-surface">Gali</Link>
                            <Link to="/register" onClick={() => setIsOpen(false)} className="btn-energy text-center text-xs">Is-diiwaangeli</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
