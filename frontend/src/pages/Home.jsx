import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Sparkles, 
    ArrowRight, 
    CheckCircle2, 
    Award, 
    Smartphone, 
    Users, 
    Headphones, 
    Briefcase, 
    Star, 
    PlayCircle, 
    Zap, 
    ShieldCheck,
    Compass,
    GraduationCap,
    Clock,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Home = () => {
    const { user } = useAuth();
    const [promotions, setPromotions] = useState([]);
    const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://eduflow-backend-37eh.onrender.com';

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await api.get('/promotions');
                if (res.data && res.data.length > 0) {
                    setPromotions(res.data);
                }
            } catch (err) {
                // promotions optional, fallback to static showcase
            }
        };
        fetchPromotions();
    }, []);

    const features = [
        {
            icon: Smartphone,
            title: 'Kugu Habboon Mobil kasta',
            description: 'U samaysan inuu si degdeg ah oo qurux badan ugu shaqeeyo mobil kasta (sida Samsung A15 iwm) xitaa internet-ka xawaarihiisu hooseeyo.',
            badge: 'Mobile-First'
        },
        {
            icon: Award,
            title: 'Shahaado Caalami ah',
            description: 'Markaad dhammayso barashada xirfadda, hel shahaado rasmi ah oo leh QR code verification oo aad ku darsan karto CV-gaaga.',
            badge: 'La Xaqiijiyay'
        },
        {
            icon: Users,
            title: 'Macalimiin Khabiir ah',
            description: 'Khubaro Soomaaliyeed oo si toos ah uga shaqeeya shirkadaha tiknoolajiyada ugu caansan oo kugu hagaya casharro tallaabo-tallaabo ah.',
            badge: 'Mentorship'
        },
        {
            icon: Briefcase,
            title: 'Shaqo Helid & Freelancing',
            description: 'Kaliya ma barano casharro teoriyi ah, waxaan ku bareynaa sida mashaariic dhab ah loogu qabto loogana shaqaysto suuqyada caalamka (Upwork & Fiverr).',
            badge: 'Xirfad Dhab ah'
        },
        {
            icon: Headphones,
            title: 'Taageero Toos ah 24/7',
            description: 'Guddi macalimiin iyo maamul ah oo diyaar u ah inay kaa caawiyaan su’aal kasta ama caqabad aad la kulanto inta aad wax baranayso.',
            badge: 'Caawimaad Toos ah'
        },
        {
            icon: ShieldCheck,
            title: 'Barasho Fudud oo Nidaamsan',
            description: 'Casharrada oo si casri ah loogu habeeyay qaybo kooban (modules), laylisyo tijaabo ah, iyo imtixaanaad si fudud ku fahamsiinaya xirfadda.',
            badge: 'Nidaam Casri ah'
        }
    ];

    const steps = [
        {
            step: '01',
            title: 'Abuur Akoon Bilaash ah',
            description: 'Is-diiwaangeli wax ka yar 1 daqiiqo adoo isticmaalaya magacaaga iyo email-kaaga.'
        },
        {
            step: '02',
            title: 'Dooro Xirfaddaada',
            description: 'Ka dhex baaro xirfadaha casriga ah sida Programming, Design, ama Marketing, oo bilow isla markiiba.'
        },
        {
            step: '03',
            title: 'Dhammee & Qaado Shahaadadaada',
            description: 'Daawado casharrada meel kasta, gudub imtixaanka, oo qaado shahaado sharaf kugu taageerta shaqo raadinta.'
        }
    ];

    const testimonials = [
        {
            name: 'Khadar Maxamed Axmed',
            role: 'Junior Frontend Developer',
            text: 'Usama Academy waxay iga caawisay inaan ka bilaabo eber ilaa aan ka dhisay websites dhab ah. Hadda waxaan si toos ah uga shaqaystaa remote jobs.',
            rating: 5
        },
        {
            name: 'Aamina Cabdullahi Cali',
            role: 'UI/UX Designer',
            text: 'Fadlan qofkii doonaya inuu xirfad casri ah barto ha bilaabo maanta. Casharradu aad ayay u cad yihiin, mobilkaygana meel kasta ayaan kaga daawadaa.',
            rating: 5
        },
        {
            name: 'Cismaan Yuusuf Nuur',
            role: 'Digital Marketer & Freelancer',
            text: 'Nidaamka shahaadada iyo taageerada macalimiinta waa mid heersare ah. Waxaan bartay sida macaamiil looga helo baraha bulshada.',
            rating: 5
        }
    ];

    return (
        <div className="w-full overflow-x-hidden font-manrope text-on-surface bg-surface selection:bg-secondary/30 selection:text-secondary">
            
            {/* ── TOP PROMOTIONAL ANNOUNCEMENT RIBBON ───────────────────────── */}
            <div className="bg-gradient-to-r from-primary via-primary-container to-secondary text-white py-2.5 px-4 text-center text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-md">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
                    <span className="bg-tertiary text-primary px-2.5 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                        🔥 DALAB GAAR AH
                    </span>
                    <span>Ka faa’iidayso dhimis gaar ah oo bilaabashada koorsooyinka ah!</span>
                    <Link to={user ? "/courses" : "/register"} className="underline underline-offset-4 hover:text-tertiary transition-colors ml-1">
                        Ka Qaybgal Hadda &rarr;
                    </Link>
                </div>
            </div>

            {/* ── 1. HERO SECTION (HIGH ENERGY MARKETING & PROMOTIONAL) ───────── */}
            <section className="relative pt-8 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
                {/* AMBIENT BACKGROUND GLOWS */}
                <div className="absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-10 left-0 w-64 sm:w-[450px] h-64 sm:h-[450px] bg-primary/10 rounded-full blur-3xl -ml-20 pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
                    
                    {/* Left Copy Column */}
                    <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
                        
                        {/* Eyebrow Pill */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-secondary animate-spin" />
                            Madasha #1 Ee Barashada Xirfadaha Casriga Ah
                        </div>

                        {/* Big Catchy Title */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-on-surface tracking-tight leading-[1.15]">
                            Ku Baro Xirfadaha <br className="hidden sm:inline" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">
                                Mustaqbalka & Suuqyada
                            </span> <br />
                            Adigoo Gurigaaga Jooga
                        </h1>

                        {/* Persuasive Description */}
                        <p className="text-on-surface-variant text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Usama Academy waxay kugu xiraysaa xirfadaha loogu doonista badan yahay caalamka — Web Development, Design, AI, iyo Digital Skills. Wax ku baro mobilkaaga ama laptop-kaaga adoo helaya shahaado rasmi ah.
                        </p>

                        {/* Mobile & Desktop Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                            {user ? (
                                <Link 
                                    to="/dashboard" 
                                    className="btn-energy py-4 px-8 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-3 text-center"
                                >
                                    TAG DASHBOARD-KAAGA <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <Link 
                                    to="/register" 
                                    className="btn-energy py-4 px-8 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-3 text-center"
                                >
                                    IS-DIIWAANGELI BILAASH ⚡ <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}

                            <Link 
                                to="/courses" 
                                className="py-4 px-8 rounded-2xl text-xs font-black uppercase tracking-widest border-2 border-primary/20 hover:border-secondary hover:text-secondary text-on-surface bg-surface-container-lowest/80 transition-all flex items-center justify-center gap-2 text-center shadow-sm"
                            >
                                <Compass className="w-4 h-4 text-secondary" />
                                BAARO KOORSOOYINKA
                            </Link>
                        </div>

                        {/* Trust & Social Proof Badges */}
                        <div className="pt-4 border-t border-outline-variant/40 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-left">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2.5">
                                    {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
                                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
                                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
                                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop'].map((src, i) => (
                                        <img key={i} src={src} alt="Student" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-surface object-cover shadow-sm" />
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                                        ))}
                                    </div>
                                    <p className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant">5,000+ Arday Soomaaliyeed</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pl-4 border-l border-outline-variant/40">
                                <Award className="w-5 h-5 text-secondary" />
                                <span className="text-[11px] font-black uppercase tracking-wider text-on-surface">Shahaado Rasmi ah</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Visual / Promotional Card Column */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative mx-auto max-w-md lg:max-w-none">
                            
                            {/* Main Showcase Image Card */}
                            <div className="aspect-[4/5] sm:aspect-[3/3.5] rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl border border-outline-variant relative group">
                                <img 
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop" 
                                    alt="Ardayda Usama Academy" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                                    <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-2">
                                        Noloshaada Wax Ka Bedel
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black italic uppercase tracking-tight">
                                        Xirfadaha Casriga ah ee 2026
                                    </h3>
                                    <p className="text-xs text-white/80 font-medium mt-1">
                                        Koorsooyin tayo leh oo ku diyaarinaya shaqooyinka ugu mushaharka badan.
                                    </p>
                                </div>
                            </div>

                            {/* Floating Feature Badges */}
                            <div className="absolute -top-4 -left-4 sm:-left-6 bg-surface-container-lowest/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-outline-variant flex items-center gap-3 animate-bounce duration-1000">
                                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-black">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Heerka Guusha</p>
                                    <p className="text-xs sm:text-sm font-black text-on-surface">98% Arday Qanacsan</p>
                                </div>
                            </div>

                            <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-surface-container-lowest/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-outline-variant flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Qalab Kasta</p>
                                    <p className="text-xs sm:text-sm font-black text-on-surface">Mobile A15 & PC</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* ── 2. PROMOTIONAL CAROUSEL / HIGHLIGHT (Haddii promotions jiraan) ── */}
            {promotions.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                    <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-4 sm:p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-secondary" /> Xayeysiisyada & Fursadaha Socda
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {promotions.map((promo) => (
                                <div 
                                    key={promo.id}
                                    className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-outline-variant/40 group shadow-md"
                                >
                                    <img 
                                        src={`${BACKEND_URL}${promo.media_url}`} 
                                        alt={promo.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 sm:p-8 flex flex-col justify-end text-white">
                                        <h3 className="text-lg sm:text-2xl font-black uppercase italic tracking-tight">{promo.title}</h3>
                                        {promo.link_url && (
                                            <a 
                                                href={promo.link_url} 
                                                className="mt-3 w-fit bg-secondary text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                                            >
                                                Faahfaahin &rarr;
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── 3. WHY CHOOSE USAMA ACADEMY? (QAYBTA SOO JIIDASHADA & FAA'IIDOOYINKA) ── */}
            <section className="py-16 sm:py-24 bg-surface-container-lowest/60 border-y border-outline-variant/30 px-4 sm:px-6 md:px-8">
                <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
                    
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] sm:text-xs uppercase tracking-widest">
                            🌟 FAA’IIDOOYINKA KUU GAARKA AH
                        </div>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-on-surface">
                            Maxaa Usama Academy Ka Dhigay <br className="hidden sm:inline" />
                            <span className="text-secondary italic">Madasha Ugu Fiican</span> Ee Barashadaada?
                        </h2>
                        <p className="text-on-surface-variant text-xs sm:text-base leading-relaxed">
                            Waxaan kuu dhisnay nidaam casri ah oo kugu hagaya xirfadda aad rabto, adigoo helaya macalimiin diyaar kuu ah, shahaado rasmi ah, iyo fursado shaqo.
                        </p>
                    </div>

                    {/* Features Grid - 100% Mobile Optimized */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {features.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -4 }}
                                    className="bg-surface p-6 sm:p-8 rounded-3xl border border-outline-variant hover:border-secondary/50 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/50">
                                                {item.badge}
                                            </span>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-black text-on-surface tracking-tight group-hover:text-secondary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-outline-variant/30 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-secondary">
                                        <span>Diyaar u tahay</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </section>

            {/* ── 4. HOW IT WORKS (ROADMAP / 3 TALLAABO OO DEGDEG AH) ─────────── */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
                    <span className="text-xs font-black uppercase tracking-widest text-secondary">
                        ⚡ WAXBA KAMA FUDUDA
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-on-surface tracking-tight">
                        Sidee Waxbarashadu U Shaqaysaa?
                    </h2>
                    <p className="text-xs sm:text-sm text-on-surface-variant">
                        Kaliya 3 tallaabo oo fudud ayaad ku noqon kartaa xirfadle suuqa shaqada loogu doon-doono.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {steps.map((st, i) => (
                        <div 
                            key={i} 
                            className="bg-surface-container p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-md relative overflow-hidden"
                        >
                            <span className="text-4xl sm:text-5xl font-black text-primary/10 absolute top-4 right-6 select-none font-mono">
                                {st.step}
                            </span>
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm mb-5 shadow-md">
                                {st.step}
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-on-surface mb-2 tracking-tight">
                                {st.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                                {st.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 5. COURSES CATALOG CALL-TO-ACTION (NO CLUTTERED COURSE DUMP) ─── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-16">
                <div className="bg-gradient-to-br from-primary to-primary-container text-white rounded-3xl sm:rounded-[3rem] p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-outline-variant">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-black text-[10px] uppercase tracking-widest backdrop-blur-sm">
                            <GraduationCap className="w-4 h-4 text-tertiary" />
                            Koorsooyin Kala Duwan oo Casri ah
                        </div>

                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                            Ma Diyaar u Tahay Inaad Baarto <br className="hidden sm:inline" />
                            Dhammaan Koorsooyinka Aan Bixinno?
                        </h2>

                        <p className="text-xs sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
                            Web Development, Graphic Design, Digital Marketing, AI Tools, iyo xirfado kale oo badan ayaa ku sugaya bogga koorsooyinka.
                        </p>

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link 
                                to="/courses" 
                                className="w-full sm:w-auto bg-tertiary text-primary hover:bg-white hover:text-primary transition-all py-4 px-10 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 text-center"
                            >
                                DHAMMAAN KOORSOOYINKA EEG 🚀
                            </Link>
                            
                            {!user && (
                                <Link 
                                    to="/register" 
                                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 py-4 px-8 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-center"
                                >
                                    ABUUR AKOON HADA
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. TESTIMONIALS (ARDAYDA GUULAYSATAY) ────────────────────────── */}
            <section className="py-16 sm:py-20 bg-surface-container-lowest/50 border-t border-outline-variant/30 px-4 sm:px-6 md:px-8">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-black uppercase tracking-widest text-secondary">
                            💬 ARAGTIDA ARDAYDA
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black text-on-surface tracking-tight">
                            Maxay Ardaydu Ka Yiraahdeen?
                        </h2>
                        <p className="text-xs sm:text-sm text-on-surface-variant">
                            Dhagayso sheekooyinka dhiirrigelinta leh ee ardaydii hore ee Usama Academy.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, idx) => (
                            <div 
                                key={idx}
                                className="bg-surface p-6 sm:p-8 rounded-3xl border border-outline-variant shadow-md flex flex-col justify-between space-y-6"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center text-amber-500">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-amber-500" />
                                        ))}
                                    </div>
                                    <p className="text-xs sm:text-sm text-on-surface-variant italic leading-relaxed">
                                        "{t.text}"
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-outline-variant/40">
                                    <p className="text-sm font-black text-on-surface">{t.name}</p>
                                    <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. FINAL HIGH-CONVERTING BOTTOM CTA ──────────────────────────── */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto text-center">
                <div className="bg-surface-container rounded-3xl sm:rounded-[3.5rem] p-8 sm:p-16 border border-outline-variant shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                            BILAAB MAANTA SAFARKAAGA
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-on-surface tracking-tight leading-tight">
                            Mustaqbalkaagu Wuxuu Ka Bilaabmaa <span className="text-primary italic">Hal Go’aan</span>
                        </h2>
                        <p className="text-xs sm:text-base text-on-surface-variant leading-relaxed">
                            Ku biir kumannaanka arday ee baranaya xirfadaha ugu qaalisan. Ha sugin berri, fursadda ugu fiican waa maanta.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                            {user ? (
                                <Link 
                                    to="/dashboard" 
                                    className="btn-energy w-full sm:w-auto py-4 px-10 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl text-center"
                                >
                                    DASHBOARD-KAAGA GAL ⚡
                                </Link>
                            ) : (
                                <Link 
                                    to="/register" 
                                    className="btn-energy w-full sm:w-auto py-4 px-10 text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl text-center"
                                >
                                    IS-DIIWAANGELI BILAASH ⚡
                                </Link>
                            )}
                            <Link 
                                to="/about" 
                                className="w-full sm:w-auto py-4 px-8 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors text-center"
                            >
                                Faahfaahin Dheeraad ah &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
