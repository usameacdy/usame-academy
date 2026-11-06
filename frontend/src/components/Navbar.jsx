import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Menu, X, ArrowLeft, Home, BookOpen, LayoutDashboard, Shield, Phone, Info } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isHomePage = location.pathname === '/';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleBack = () => {
        // If there is history, go back; otherwise go home
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="glass sticky top-0 z-[60] px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-outline-variant/40 shadow-sm font-manrope">
            <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
                
                {/* Brand & Optional Back Button */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    
                    {/* BACK BUTTON (Visible when not on Homepage) */}
                    {!isHomePage && (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-container hover:bg-secondary hover:text-white text-secondary border border-outline-variant text-[10px] sm:text-[11px] font-black uppercase transition-all shadow-sm shrink-0"
                            title="Dib u noqo"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Dib u Noqo</span>
                        </button>
                    )}

                    {/* Logo & Brand Name */}
                    <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0" title="Tag Bogga Hore">
                        <img 
                            src={`${import.meta.env.BASE_URL}assets/logo.png`} 
                            alt="Logo" 
                            className="w-8 h-8 sm:w-11 sm:h-11 object-contain transition-transform group-hover:scale-105"
                        />
                        <span className="text-base sm:text-2xl font-black text-primary tracking-tighter uppercase italic truncate">
                            USAMA <span className="text-secondary">ACADEMY</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-7 lg:gap-9">
                    <Link to="/" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isHomePage ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}>
                        Bogga Hore
                    </Link>
                    <Link to="/courses" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname.startsWith('/courses') ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}>
                        Koorsooyinka
                    </Link>
                    <Link to="/about" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname === '/about' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}>
                        Nagu Saabsan
                    </Link>
                    <Link to="/contact" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname === '/contact' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}>
                        Nala Xiriir
                    </Link>
                    
                    {user ? (
                        <>
                            <Link to="/dashboard" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname === '/dashboard' ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}>
                                Dashboard
                            </Link>
                            {(user.role === 'admin' || user.role === 'instructor') && (
                                <Link to="/admin" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${location.pathname.startsWith('/admin') ? 'text-primary' : 'text-primary/80 hover:text-primary'}`}>
                                    {user.role === 'admin' ? 'Maamulka' : 'Macalinka'}
                                </Link>
                            )}
                            <div className="flex items-center gap-4 pl-6 border-l border-outline-variant">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant">
                                        <User className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-on-surface truncate max-w-[120px]">{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="p-1.5 text-on-surface-variant hover:text-red-500 transition-colors" title="Ka bax">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-on-surface hover:text-secondary transition-colors">
                                Soo Gal
                            </Link>
                            <Link to="/register" className="btn-energy px-5 py-2 text-[10px] rounded-xl text-center shadow-md">
                                Is-diiwaangeli
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Right Controls: Back Button & Hamburger */}
                <div className="flex items-center gap-1.5 md:hidden">
                    <button 
                        className="p-2 text-on-surface hover:text-secondary rounded-xl bg-surface-container-high/40 border border-outline-variant/40 transition-colors" 
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full glass border-t border-outline-variant p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 shadow-2xl bg-surface/95 backdrop-blur-2xl">
                    
                    {/* Back Button inside Drawer if not Home */}
                    {!isHomePage && (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleBack();
                            }}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/10 text-secondary font-black text-xs uppercase tracking-wider border border-secondary/20"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>← Dib u Noqo (Previous Page)</span>
                        </button>
                    )}

                    <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container font-black text-xs uppercase tracking-wider text-on-surface">
                        <Home className="w-4 h-4 text-primary" /> Bogga Hore
                    </Link>

                    <Link to="/courses" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container font-black text-xs uppercase tracking-wider text-on-surface">
                        <BookOpen className="w-4 h-4 text-secondary" /> Koorsooyinka
                    </Link>

                    {user && (
                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container font-black text-xs uppercase tracking-wider text-on-surface">
                            <LayoutDashboard className="w-4 h-4 text-primary" /> Dashboard-kaaga
                        </Link>
                    )}

                    {user && (user.role === 'admin' || user.role === 'instructor') && (
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container font-black text-xs uppercase tracking-wider text-primary">
                            <Shield className="w-4 h-4 text-primary" /> Qaybta Maamulka
                        </Link>
                    )}

                    <Link to="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container font-black text-xs uppercase tracking-wider text-on-surface">
                        <Info className="w-4 h-4 text-on-surface-variant" /> Nagu Saabsan
                    </Link>

                    <Link to="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container font-black text-xs uppercase tracking-wider text-on-surface">
                        <Phone className="w-4 h-4 text-on-surface-variant" /> Nala Soo Xiriir
                    </Link>

                    <div className="pt-3 border-t border-outline-variant/60">
                        {user ? (
                            <div className="flex items-center justify-between p-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center font-black text-xs text-primary">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-xs font-black text-on-surface truncate max-w-[150px]">{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="text-xs font-black text-red-500 uppercase tracking-wider flex items-center gap-1.5 p-2 rounded-lg hover:bg-red-50">
                                    <LogOut className="w-3.5 h-3.5" /> Ka bax
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="p-3 text-center border border-outline-variant rounded-xl text-xs font-black uppercase text-on-surface hover:bg-surface-container">
                                    Soo Gal
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="btn-energy p-3 text-center text-xs rounded-xl shadow-md">
                                    Is-diiwaangeli
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
