import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNavigation from '../components/BottomNavigation';
import {
    LayoutDashboard,
    BookOpen,
    Bell,
    Clock,
    Star,
    ShieldCheck,
    Calendar,
    User,
    ChevronRight,
    Search,
    Settings,
    HelpCircle,
    Trophy,
    Zap,
    Award,
    Play,
    Plus,
    MoreHorizontal,
    LogOut,
    CheckCircle2,
    Package,
    Rocket,
    Download,
    ExternalLink,
    X
} from 'lucide-react';
import Loading from '../components/Loading';

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');

const SidebarItem = ({ icon: Icon, label, id, activeTab, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === id ? 'bg-primary text-white shadow-lg' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
    >
        <Icon className={`w-5 h-5 ${activeTab === id ? 'text-white' : ''}`} />
        <span className="text-[15px]">{label}</span>
    </button>
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [coursesList, setCoursesList] = useState([]);
    const [stats, setStats] = useState({ courses: 12, hours: 48.5, points: 850, certificates: 8 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [certificates, setCertificates] = useState([]);
    const [previewCert, setPreviewCert] = useState(null);
    const [resultsList, setResultsList] = useState([]);
    const [assignmentsList, setAssignmentsList] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionData, setSubmissionData] = useState({ text: '', file: null });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.role === 'admin' || user?.role === 'instructor') {
                    const { data } = await api.get('/courses');
                    setCoursesList(data);
                } else {
                    const [enrolledRes, certRes, resultsRes] = await Promise.all([
                        api.get('/courses/enrolled'),
                        api.get('/certificates'),
                        api.get('/exams/my-results')
                    ]);
                    setCertificates(certRes.data);
                    setResultsList(resultsRes.data);
                    
                    const coursesWithProgress = await Promise.all(
                        enrolledRes.data.map(async (course) => {
                            try {
                                const progRes = await api.get(`/courses/${course.id}/progress`);
                                return { ...course, progress: progRes.data.percentage };
                            } catch {
                                return { ...course, progress: 0 };
                            }
                        })
                    );
                    setCoursesList(coursesWithProgress);

                    // Fetch Assignments
                    const allAssignments = [];
                    for (const course of enrolledRes.data) {
                        try {
                            const aRes = await api.get(`/assignments/course/${course.id}`);
                            allAssignments.push(...aRes.data.map(a => ({ ...a, course_title: course.title })));
                        } catch (err) {
                            console.error(`Error fetching assignments for ${course.id}`, err);
                        }
                    }
                    setAssignmentsList(allAssignments);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, [user?.role]);

    if (loading) return <Loading />;

    const handleAssignmentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('submission_text', submissionData.text);
            if (submissionData.file) {
                formData.append('assignment_file', submissionData.file);
            }
            await api.post(`/assignments/${selectedAssignment.id}/submit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Howlgalkaaga (Assignment) si guul ah ayaa loo gudbiyay!');
            setSelectedAssignment(null);
            setSubmissionData({ text: '', file: null });
        } catch (err) {
            alert(err.response?.data?.message || 'Waa lagu guuldareystay gudbinta.');
        }
        setSubmitting(false);
    };

    const handleRequestCertificate = async (resultId) => {
        try {
            const res = await api.post(`/certificates/request/${resultId}`);
            alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || 'Codsiga waa ku guuldareystay.');
        }
    };

    const upcomingSessions = [
        { id: 1, date: '24', month: 'MAA', title: 'Horumarinta Webka (React)', time: '08:30 PM', teacher: 'Prof. Leyla Osman', type: 'Toos ah' },
        { id: 2, date: '25', month: 'TAL', title: 'Maamulka Xogta (SQL)', time: '10:00 AM', teacher: 'Dr. Mohamed Said', type: 'Toos ah' },
        { id: 3, date: '27', month: 'KHAM', title: 'Cilmi-nafsiga Suuqqeynta', time: '04:00 PM', teacher: 'Muna Hussein', type: 'Locked' },
    ];

    return (
        <div className="min-h-screen bg-surface font-manrope text-on-surface flex overflow-hidden">
            
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex w-72 bg-surface border-r border-outline-variant flex-col p-6 sticky top-0 h-screen z-20">
                <div className="flex items-center gap-4 mb-12 px-2">
                    <img 
                        src="/assets/logo.png" 
                        alt="Logo" 
                        className="w-12 h-12 object-contain"
                    />
                    <div>
                        <h1 className="text-lg font-black text-secondary leading-none uppercase italic">Usama<br />Academy</h1>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" activeTab={activeTab} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={BookOpen} label="My Courses" id="courses" activeTab={activeTab} onClick={() => navigate('/courses')} />
                    <SidebarItem icon={ShieldCheck} label="Results" id="results" activeTab={activeTab} onClick={() => setActiveTab('results')} />
                    <SidebarItem icon={CheckCircle2} label="Assignments" id="assignments" activeTab={activeTab} onClick={() => setActiveTab('assignments')} />
                    <SidebarItem icon={Package} label="Resources" id="resources" activeTab={activeTab} onClick={() => {}} />
                    <SidebarItem icon={Settings} label="Settings" id="settings" activeTab={activeTab} onClick={() => navigate('/settings')} />
                </nav>

                <div className="mt-auto">
                    <div className="bg-primary/20 p-8 rounded-[2.5rem] border border-primary/20 relative overflow-hidden group mb-8 shadow-2xl shadow-primary/10">
                        <div className="relative z-10">
                            <Zap className="w-10 h-10 text-amber-400 mb-5" />
                            <h4 className="text-white font-black text-xs mb-2 uppercase tracking-widest">Upgrade to Pro</h4>
                            <p className="text-white/40 text-[10px] font-medium leading-relaxed">Hel dhammaan koorsooyinka iyo shahaadooyinka xad la'aan.</p>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 text-on-surface-variant hover:text-red-500 transition-colors uppercase tracking-[0.2em] font-black text-[10px] italic">
                        <LogOut className="w-5 h-5" />
                        <span>Ma xirto</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 h-screen overflow-y-auto relative pb-20 md:pb-0">
                
                {/* TOP BAR - DESKTOP */}
                <header className="hidden md:flex h-24 bg-surface/80 backdrop-blur-md sticky top-0 z-30 px-10 items-center justify-between border-b border-outline-variant">
                    <div className="flex-1 max-w-xl relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 opacity-40" />
                        <input 
                            type="text" 
                            placeholder="Raadi casharo, macalimiin..." 
                            className="w-full bg-surface-container-high border-outline-variant border rounded-2xl py-4 pl-14 pr-6 text-xs focus:ring-2 focus:ring-secondary/20 transition-all font-black uppercase tracking-widest text-on-surface placeholder:text-on-surface-variant/30"
                        />
                    </div>
                    <div className="flex items-center gap-8">
                        <button className="relative p-3 text-on-surface-variant hover:bg-surface-container rounded-2xl transition-all hover:scale-110 active:scale-95">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface shadow-lg shadow-red-500/20"></span>
                        </button>
                        <button className="p-3 text-on-surface-variant hover:bg-surface-container rounded-2xl transition-all hover:scale-110 active:scale-95">
                            <HelpCircle className="w-6 h-6" />
                        </button>
                        <div className="h-10 w-[1px] bg-outline-variant mx-2 opacity-30"></div>
                        <div className="flex items-center gap-5 pl-2 group cursor-pointer" onClick={() => navigate('/settings')}>
                            <div className="text-right">
                                <p className="text-sm font-black text-on-surface uppercase italic tracking-tighter group-hover:text-secondary transition-colors">{user?.name}</p>
                                <p className="text-[9px] font-black uppercase text-secondary tracking-[0.3em] leading-none mt-1 opacity-60">ARDAY PREMIUM</p>
                            </div>
                            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=26A69A&color=fff`} className="w-12 h-12 rounded-2xl border-2 border-outline-variant shadow-xl group-hover:scale-110 transition-transform" alt="profile" />
                        </div>
                    </div>
                </header>

                {/* MOBILE VIEW LOGIC */}
                <div className="md:hidden">
                    {/* MOBILE HEADER */}
                    <header className="px-6 pt-8 flex justify-between items-center bg-surface/50 backdrop-blur-sm sticky top-0 z-30 pb-4">
                        <div className="flex items-center gap-3">
                            <img src="/assets/logo.png" className="w-10 h-10 object-contain" alt="Logo" />
                            <span className="font-extrabold text-secondary text-lg tracking-tighter uppercase italic">Usama Academy</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 glass rounded-xl shadow-sm relative border-outline-variant">
                                <Bell className="w-6 h-6 text-on-surface" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
                            </button>
                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=26A69A&color=fff`} className="w-10 h-10 rounded-xl border border-outline-variant shadow-sm" alt="profile" />
                        </div>
                    </header>
                </div>

                <div className="p-6 md:p-10 space-y-8 md:space-y-12">
                    {activeTab === 'dashboard' ? (
                        <>
                            {/* WELCOME BANNER */}
                    <section className="bg-gradient-to-br from-primary to-[#283593] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
                        <div className="relative z-10 max-w-2xl space-y-6">
                            <div className="inline-block px-4 py-1.5 bg-secondary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20">
                                AKADEEMIYADA SARE
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black md:leading-[1.1] tracking-tight">
                                Soo dhawaaw, {user?.name?.split(' ')[0] || 'Ahmed'}! 
                            </h2>
                            <p className="text-sm md:text-lg text-white/70 max-w-md font-medium leading-relaxed">
                                Maanta waa maalin weyn oo aad wax cusub baran karto. Waxaad horay u marisay 85% ka mid ah yoolkaaga todobaadlaha ah.
                            </p>
                            <button className="flex items-center gap-3 bg-amber-400 text-[#331800] px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all w-full md:w-fit justify-center shadow-lg shadow-amber-400/20">
                                <Play className="w-5 h-5 fill-current" /> Sii wad Barashada
                            </button>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>
                        <div className="absolute -right-10 bottom-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[60px]"></div>
                    </section>

                    {/* STATS ROW */}
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { label: user?.role === 'instructor' ? 'Ardaydaada' : 'Koorsooyinka Socda', value: user?.role === 'instructor' ? '342' : '12', sub: '+2 Todobaadkan', icon: BookOpen, color: 'bg-indigo-500/10 text-indigo-400' },
                            { label: user?.role === 'instructor' ? 'Saacadaha Casharka' : 'Saacadaha la Bartay', value: user?.role === 'instructor' ? '128' : '48.5', sub: '156h Isugeyn', icon: Clock, color: 'bg-emerald-500/10 text-emerald-400' },
                            { label: user?.role === 'instructor' ? 'Dakhliga (Bishan)' : 'Darajada Caalamiga', value: user?.role === 'instructor' ? '$2,450' : '#1,240', sub: 'Top 5%', icon: Trophy, color: 'bg-amber-500/10 text-amber-400' },
                            { label: user?.role === 'instructor' ? 'Kirada Bisha' : 'Shahaadooyinka', value: user?.role === 'instructor' ? `$${user.monthly_fee || 0}` : '08', sub: user?.role === 'instructor' ? 'Active' : '8 Dhamaaday', icon: user?.role === 'instructor' ? ShieldCheck : CheckCircle2, color: 'bg-blue-500/10 text-blue-400' },
                        ].map((stat, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i} 
                                className="glass p-6 md:p-8 border border-outline-variant hover:border-secondary/40 transition-all cursor-default group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-7 h-7" />
                                    </div>
                                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{stat.sub}</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-on-surface-variant">{stat.label}</p>
                                    <p className="text-3xl md:text-4xl font-black text-on-surface tracking-tight">{stat.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </section>

                    {/* DASHBOARD GRID - MAIN SPLIT */}
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* LEFT COLUMN - CONTENT */}
                        <div className="lg:col-span-2 space-y-10">
                            
                            {/* ACTIVE COURSE / VIDEO PREVIEW */}
                            <section className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Sii Wad Barashada</h3>
                                    <Link to="/courses" className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] hover:underline transition-all">Dhamaan Koorsooyinka</Link>
                                </div>
                                <div className="glass rounded-[3.5rem] border border-outline-variant shadow-2xl overflow-hidden flex flex-col md:flex-row h-full md:h-[400px] group bg-surface-container">
                                    <div className="w-full md:w-3/5 h-[240px] md:h-full relative overflow-hidden bg-slate-900">
                                        <img 
                                            src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1631&auto=format&fit=crop" 
                                            className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" 
                                            alt="course" 
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white hover:scale-110 transition-all">
                                                <Play className="w-8 h-8 fill-current" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-6 left-6 flex gap-2">
                                            <span className="px-3 py-1 bg-secondary text-white rounded-lg text-[9px] font-black uppercase tracking-widest">UI/UX DESIGN</span>
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20">MODULE 4</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <h4 className="text-2xl md:text-3xl font-black text-on-surface leading-tight uppercase italic tracking-tighter">Naqshadaynta Casriga ah ee Figma</h4>
                                            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">Baro sida loo abuuro nidaam naqshadeed (Design System) dhamaystiran oo loo isticmaali karo barnaamijyada waaweyn.</p>
                                        </div>
                                        <div className="space-y-4 mt-8">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-on-surface-variant">Horumarka Casharka</span>
                                                <span className="text-secondary">75%</span>
                                            </div>
                                            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '75%' }}
                                                    className="h-full bg-secondary rounded-full"
                                                ></motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* RECENT REWARDS / BADGES */}
                            <section className="space-y-10">
                                <h3 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Guulaha dhowaan kuu soo hoyday</h3>
                                <div className="grid grid-cols-4 gap-4 md:gap-10">
                                    {[
                                        { label: 'Todobaad Nadiif ah', icon: Trophy, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
                                        { label: 'Deg-deg ku Barte', icon: Rocket, color: 'bg-secondary/10 text-secondary border-secondary/20' },
                                        { label: 'Xaliyaha Mushkilada', icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
                                        { label: 'Ka qayb-qaate Firfircoon', icon: Star, color: 'bg-tertiary/10 text-tertiary border-tertiary/20' },
                                    ].map((badge, i) => (
                                        <div key={i} className="flex flex-col items-center gap-6 text-center">
                                            <div className={`w-16 h-16 md:w-28 md:h-28 ${badge.color} glass border rounded-[2.5rem] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all cursor-pointer shadow-xl shadow-surface/5`}>
                                                <badge.icon className="w-8 h-8 md:w-12 md:h-12" />
                                            </div>
                                            <p className="text-[10px] md:text-[11px] font-black text-on-surface leading-tight px-1 uppercase tracking-widest opacity-60 italic">{badge.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* CERTIFICATES SECTION */}
                            {user?.role === 'student' && certificates.length > 0 && (
                                <section className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Shahaadooyinkayga</h3>
                                        <span className="glass-pill px-6 text-[10px] font-black uppercase tracking-widest">{certificates.length} Dhamaaday</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        {certificates.map((cert) => (
                                            <motion.div 
                                                key={cert.id}
                                                whileHover={{ y: -10, scale: 1.02 }}
                                                onClick={() => setPreviewCert(cert)}
                                                className="glass p-10 cursor-pointer bg-surface-container border border-outline-variant hover:border-secondary/40 group relative overflow-hidden rounded-[3rem] shadow-2xl transition-all"
                                            >
                                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ExternalLink className="w-6 h-6 text-secondary" />
                                                </div>
                                                <div className="flex items-center gap-8 relative z-10">
                                                    <div className="w-20 h-20 bg-secondary/10 rounded-[1.5rem] shadow-inner flex items-center justify-center text-secondary border border-secondary/20 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                                                        <Award className="w-10 h-10" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black text-on-surface line-clamp-1 mb-2 group-hover:text-secondary transition-colors uppercase italic italic tracking-tighter">{cert.course_title}</h4>
                                                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] italic opacity-40">
                                                            Lagu bixiyay: {new Date(cert.issued_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* RIGHT COLUMN - SIDE INFO */}
                        <div className="space-y-10">
                            
                            {/* LIVE CLASSES / CALENDAR */}
                            <section className="glass rounded-[2.5rem] border border-outline-variant shadow-sm p-8 space-y-8 bg-surface-container">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-on-surface uppercase italic tracking-tighter">Fasallada Tooska ah</h3>
                                    <button className="text-on-surface-variant"><MoreHorizontal /></button>
                                </div>
                                <div className="space-y-6">
                                    {upcomingSessions.map((session, i) => (
                                        <div key={i} className="flex items-center gap-5 group cursor-pointer">
                                            <div className={`w-14 h-16 rounded-2xl flex flex-col items-center justify-center relative border border-outline-variant ${session.type === 'Toos ah' ? 'bg-secondary text-white' : 'bg-surface text-on-surface-variant'}`}>
                                                <span className="text-[10px] font-black uppercase tracking-widest mb-0.5 opacity-60">{session.month}</span>
                                                <span className="text-2xl font-black tracking-tight leading-none italic">{session.date}</span>
                                                {session.type === 'Locked' && <div className="absolute -top-1 -right-1 glass p-1 rounded-full shadow-sm"><Settings className="w-3 h-3" /></div>}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h5 className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors italic">{session.title}</h5>
                                                <p className="text-[11px] text-on-surface-variant font-medium">Saacada: {session.time} - {session.type === 'Toos ah' ? 'Toos ah' : 'Lama furin'}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <img src={`https://ui-avatars.com/api/?name=${session.teacher}&background=random`} className="w-5 h-5 rounded-full" alt="teacher" />
                                                    <span className="text-[10px] text-on-surface-variant font-bold">{session.teacher}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-4 border-2 border-dashed border-outline-variant rounded-2xl text-on-surface-variant text-xs font-bold hover:bg-surface transition-colors uppercase tracking-widest italic">
                                    + Ku dar jadwalkaaga
                                </button>
                            </section>

                             {/* TARGET WEEKLY PROGRESS */}
                            <section className="bg-primary rounded-[2.5rem] p-10 text-white space-y-8 shadow-2xl shadow-primary/40 relative overflow-hidden">
                                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                                    <h3 className="text-xl font-bold">Target Todobaadka</h3>
                                    
                                    <div className="relative w-40 h-40 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                                            <motion.circle 
                                                initial={{ strokeDasharray: '0 440' }}
                                                animate={{ strokeDasharray: '330 440' }}
                                                cx="80" cy="80" r="70" fill="transparent" stroke="var(--secondary)" strokeWidth="12" strokeLinecap="round" 
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-4xl font-black">18</span>
                                            <span className="text-[10px] uppercase font-black tracking-widest text-white/50">/ 24 Saacadood</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-center text-white/60 font-medium italic leading-relaxed">
                                        "Joogteyntu waa fure u ah guushaada."
                                    </p>
                                </div>
                                {/* BG Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 blur-[60px] rounded-full"></div>
                            </section>

                        </div>
                    </div>
                        </>
                    ) : activeTab === 'assignments' ? (
                        <div className="space-y-12 animate-in fade-in duration-500">
                             <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black text-on-surface uppercase italic tracking-tighter">Dhammaan Howlgalada</h3>
                                <div className="glass-pill px-8 text-[10px] font-black uppercase tracking-widest">{assignmentsList.length} Total</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {assignmentsList.map(a => (
                                    <motion.div 
                                        key={a.id}
                                        whileHover={{ y: -10 }}
                                        className="bg-surface-container rounded-[3.5rem] border border-outline-variant shadow-2xl p-10 flex flex-col justify-between group h-full transition-all"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] opacity-60">{a.course_title}</span>
                                                <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-on-surface-variant group-hover:bg-secondary group-hover:text-white transition-all shadow-inner border border-outline-variant">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <h4 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter group-hover:text-secondary transition-colors">{a.title}</h4>
                                            <p className="text-sm text-on-surface-variant font-medium line-clamp-3 leading-relaxed opacity-60 italic">{a.description}</p>
                                        </div>

                                        <div className="mt-10 pt-8 border-t border-outline-variant flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-on-surface-variant opacity-40">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                                    {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No Limit'}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => setSelectedAssignment(a)}
                                                className="px-8 py-4 bg-secondary text-white rounded-2xl font-black uppercase italic tracking-[0.2em] text-[10px] hover:shadow-2xl hover:shadow-secondary/20 transition-all hover:scale-105 active:scale-95"
                                            >
                                                Gudbi ⚡
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                                {assignmentsList.length === 0 && (
                                    <div className="col-span-full py-40 text-center space-y-6">
                                        <Package className="w-24 h-24 text-on-surface-variant mx-auto opacity-10" />
                                        <p className="text-on-surface-variant font-black uppercase italic tracking-[0.4em] opacity-30 text-sm">Wali wax howlgal ah laguma soo diwaangalin</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'results' ? (
                        <div className="space-y-12 animate-in fade-in duration-500">
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black text-on-surface uppercase italic tracking-tighter">Natiijooyinkaaga Imtixaanka</h3>
                                <div className="glass-pill px-8 text-[10px] font-black uppercase tracking-widest">{resultsList.length} Imtixaan</div>
                            </div>
                            
                            <div className="bg-surface-container rounded-[3.5rem] border border-outline-variant shadow-2xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                        <tr>
                                            <th className="px-12 py-10">Imtixaanka</th>
                                            <th className="px-12 py-10 text-center">Score</th>
                                            <th className="px-12 py-10 text-center">Xaaladda</th>
                                            <th className="px-12 py-10 text-right">Certificate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant">
                                        {resultsList.map(r => (
                                            <tr key={r.id} className="hover:bg-surface-container-high/20 transition-colors group">
                                                <td className="px-12 py-10">
                                                    <p className="font-black text-on-surface uppercase italic tracking-tighter text-xl group-hover:text-secondary transition-colors">{r.exam_title}</p>
                                                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mt-2 opacity-50">Lagu galay: {new Date(r.taken_at).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-12 py-10 text-center">
                                                    <span className="text-3xl font-black text-on-surface tracking-tighter italic">{r.score}%</span>
                                                </td>
                                                <td className="px-12 py-10 text-center">
                                                    <span className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border ${r.passed ? 'bg-secondary/10 text-secondary border-secondary/20 shadow-lg shadow-secondary/5' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                        {r.passed ? 'GUUL' : 'DHACAY'}
                                                    </span>
                                                </td>
                                                <td className="px-12 py-10 text-right">
                                                    {r.passed ? (
                                                        <button 
                                                            onClick={() => handleRequestCertificate(r.id)}
                                                            className="btn-energy px-8 py-4 text-[10px] uppercase tracking-widest flex items-center gap-3 ml-auto shadow-xl shadow-secondary/10"
                                                        >
                                                            <Award className="w-5 h-5" /> Codso Shahaado
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-20">Ma xaq u lahid</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* MOBILE BOTTOM NAVIGATION */}
                <BottomNavigation activeTab="home" />

                {/* CERTIFICATE PREVIEW MODAL */}
                <AnimatePresence>
                    {previewCert && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-surface/80 backdrop-blur-xl"
                            onClick={() => setPreviewCert(null)}
                        >
                            <motion.div 
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-surface-container rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-outline-variant max-w-6xl w-full overflow-hidden relative"
                                onClick={e => e.stopPropagation()}
                            >
                                <button 
                                    onClick={() => setPreviewCert(null)}
                                    className="absolute top-10 right-10 p-5 bg-surface text-on-surface-variant hover:text-secondary rounded-[2rem] border border-outline-variant shadow-2xl transition-all z-20 hover:scale-110 active:scale-95"
                                >
                                    <X className="w-7 h-7" />
                                </button>

                                <div className="grid lg:grid-cols-2 h-full">
                                    <div className="bg-surface-container-high/50 p-16 flex items-center justify-center border-r border-outline-variant relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-transparent opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
                                        <div className="relative group/img">
                                            <img 
                                                src={`${apiUrl}${previewCert.certificate_url}`} 
                                                className="w-full shadow-[0_50px_80px_rgba(0,0,0,0.4)] rounded-xl border-4 border-outline-variant group-hover/img:scale-[1.03] transition-transform duration-700" 
                                                alt="Certificate" 
                                            />
                                            <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-[2px]">
                                                <button 
                                                    onClick={() => window.open(`${apiUrl}${previewCert.certificate_url}`, '_blank')}
                                                    className="btn-energy scale-125 px-8"
                                                >
                                                    <ExternalLink className="w-5 h-5 mr-3" /> ARAG FULL SIZE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-16 space-y-12 flex flex-col justify-center">
                                        <div className="space-y-6">
                                            <div className="inline-block px-6 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                                                Verified Achievement 🌑
                                            </div>
                                            <h2 className="text-4xl font-black text-on-surface leading-tight uppercase italic tracking-tighter">
                                                {previewCert.course_title}
                                            </h2>
                                            <p className="text-on-surface-variant font-medium leading-relaxed opacity-60 text-sm">
                                                Hambalyo! Waxaad si guul leh u dhammaystirtay koorsadan. Shahaadadan waxay dammaanad qaadaysaa aqoontaada iyo xirfaddaada heerka caalami ee akadeemiyada Usama.
                                            </p>
                                        </div>

                                        <div className="space-y-4 p-8 bg-surface rounded-[2.5rem] border border-outline-variant shadow-inner">
                                            <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40 ml-2">Verification Code</div>
                                            <div className="flex justify-between items-center group">
                                                <span className="text-2xl font-black text-secondary tracking-widest uppercase italic">{previewCert.verification_code}</span>
                                                <CheckCircle className="w-6 h-6 text-emerald-500 scale-0 group-hover:scale-100 transition-transform" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-5">
                                            <a 
                                                href={`${apiUrl}${previewCert.certificate_url}`} 
                                                download 
                                                className="btn-energy py-6 text-center flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-secondary/10"
                                            >
                                                <Download className="w-5 h-5" /> SOO DAJISO (PDF) ⚡
                                            </a>
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`Verification Code: ${previewCert.verification_code}`);
                                                    alert('Verification code copied!');
                                                }}
                                                className="w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant hover:text-secondary transition-all border border-transparent hover:border-secondary/20 rounded-2xl bg-surface/30"
                                            >
                                                KOOBIYEY LINK-KA HUBINTA
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ASSIGNMENT SUBMISSION MODAL */}
                <AnimatePresence>
                    {selectedAssignment && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl"
                            onClick={() => setSelectedAssignment(null)}
                        >
                            <motion.div 
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="bg-surface-container rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-outline-variant max-w-2xl w-full overflow-hidden relative animate-in zoom-in-95"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-12 border-b border-outline-variant bg-surface-container-high/30">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] opacity-40">{selectedAssignment.course_title}</span>
                                            <h3 className="text-3xl font-black text-on-surface uppercase italic tracking-tighter">{selectedAssignment.title}</h3>
                                        </div>
                                        <button onClick={() => setSelectedAssignment(null)} className="p-4 bg-surface text-on-surface-variant hover:text-secondary rounded-2xl border border-outline-variant shadow-xl shadow-surface/20 transition-all hover:scale-110 active:scale-95">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <p className="text-on-surface-variant font-medium leading-relaxed bg-surface p-8 rounded-[2rem] border border-outline-variant italic opacity-60 text-sm">
                                        "{selectedAssignment.description}"
                                    </p>
                                </div>

                                <form onSubmit={handleAssignmentSubmit} className="p-12 space-y-10">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40 ml-4">Jawaabtaada (Submission Text)</label>
                                        <textarea 
                                            className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface min-h-[180px] py-6"
                                            placeholder="Halkan ku qor jawaabtaada..."
                                            value={submissionData.text}
                                            onChange={e => setSubmissionData({...submissionData, text: e.target.value})}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40 ml-4">Soo Gali Fayl (Optional)</label>
                                        <input 
                                            type="file" 
                                            className="block w-full text-xs text-on-surface-variant file:mr-6 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-surface file:text-secondary hover:file:bg-secondary hover:file:text-surface transition-all bg-surface-container border-2 border-outline-variant rounded-[2.5rem] p-4 shadow-inner"
                                            onChange={e => setSubmissionData({...submissionData, file: e.target.files[0]})}
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="w-full btn-energy py-6 text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-secondary/10 hover:scale-105"
                                    >
                                        {submitting ? 'GUDBINAYAA...' : 'GUDBI HOWLGALKA ⚡'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
};

export default Dashboard;
