import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, BookOpen, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [courseRes, promoRes] = await Promise.all([
                    api.get('/courses'),
                    api.get('/promotions')
                ]);
                if (courseRes.data && courseRes.data.length > 0) {
                    setCourses(courseRes.data.slice(0, 3));
                } else {
                    setCourses(fallbackCourses);
                }
                setPromotions(promoRes.data || []);
            } catch (err) {
                console.error('Error fetching home data, using fallback content:', err);
                setCourses(fallbackCourses);
            }
        };
        fetchHomeData();
    }, []);

    const fallbackCourses = [
        {
            id: '1',
            title: 'Mastering React & Next.js',
            description: 'Baro dhismaha websites-ka casriga ah adoo adeegsanaya React, Next.js iyo Tailwind CSS.',
            price: '49.99',
            category: 'Web Development',
            thumbnail_url: null,
        },
        {
            id: '2',
            title: 'UI/UX Design Masterclass',
            description: 'Baro naqshadaynta Figma, habka loo abuuro interface-yo qurux badan iyo user experience heersare ah.',
            price: '35.00',
            category: 'Design',
            thumbnail_url: null,
        },
        {
            id: '3',
            title: 'Digital Marketing & Social Media Pro',
            description: 'Baro suuqgeynta online-ka, SEO, Google Ads iyo baraha bulshada si aad ganacsigaaga kor ugu qaaddo.',
            price: '25.00',
            category: 'Marketing',
            thumbnail_url: null,
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/courses?search=${encodeURIComponent(search)}`);
        }
    };

    return (
        <div className="space-y-24 md:space-y-32 pb-24 bg-surface font-manrope">
            {/* 1. Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 md:pt-24 lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-secondary/20">
                        SILSILAD WAXBARASHO
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-on-surface leading-[1.1] tracking-tight font-manrope">
                        Baro Xirfado <br className="hidden md:block"/> Cusub maanta
                    </h1>
                    <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-lg">
                        Ku biir kumannaan arday ah oo baranaya xirfadaha suuqa loogu doonayo. Ka mid noqo jiilka cusub ee tiknoolajiyada.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative max-w-md flex items-center bg-surface-container p-2 rounded-[2.5rem] shadow-2xl border border-outline-variant focus-within:border-secondary transition-all">
                        <div className="pl-6 text-on-surface-variant/40">
                            <Search className="w-5 h-5" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Raadi koorsada aad rabto..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/20 font-medium px-4 text-sm"
                        />
                        <button type="submit" className="btn-energy py-4 px-10 text-[10px] !rounded-[2rem]">
                            RAADI ⚡
                        </button>
                    </form>

                    {/* Trust Indicators */}
                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-3">
                            {['https://i.pravatar.cc/100?img=11', 'https://i.pravatar.cc/100?img=32', 'https://i.pravatar.cc/100?img=12', 'https://i.pravatar.cc/100?img=44'].map((img, i) => (
                                <img key={i} src={img} alt="Student" className="w-10 h-10 rounded-full border-2 border-surface object-cover shadow-sm" />
                            ))}
                        </div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide leading-tight max-w-[150px]">
                            Ku biir arday badan oo ka faa'iidaysanaya
                        </p>
                    </div>
                </div>

                <div className="relative mt-24 lg:mt-0 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                    <div className="aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative border border-outline-variant/30 group">
                        <img 
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
                            alt="Students collaborating" 
                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                    </div>
                    {/* Floating Card */}
                    <div className="absolute -bottom-12 left-4 right-4 md:left-12 md:right-auto md:w-96 glass p-10 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-outline-variant relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 blur-3xl group-hover:scale-150 transition-transform"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-center">
                                <p className="font-black text-on-surface text-sm italic uppercase tracking-tighter">Web Development Bootcamp</p>
                                <span className="text-[9px] font-black text-secondary uppercase tracking-widest">80% COMPLETE</span>
                            </div>
                            <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-secondary rounded-full w-[80%] shadow-neon-blue"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1.5 Promotions Section */}
            {promotions.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="relative overflow-hidden rounded-[3rem] border border-outline-variant bg-surface-container/30">
                        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 p-6">
                            {promotions.map((promo, i) => (
                                <motion.div 
                                    key={promo.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    className="min-w-[300px] md:min-w-[600px] snap-center aspect-[21/9] relative rounded-[2rem] overflow-hidden group border border-outline-variant/30"
                                >
                                    <img 
                                        src={`${BACKEND_URL}${promo.media_url}`} 
                                        alt={promo.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                                        <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4">{promo.title}</h3>
                                        {promo.link_url && (
                                            <a href={promo.link_url} className="w-fit bg-secondary text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/30 hover:scale-105 transition-transform">
                                                FAHAMKA DHEER ⚡
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 2. Courses Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-5xl font-black text-on-surface font-manrope">Koorsooyinka ugu <br className="hidden md:block" /> Caansan</h2>
                        <p className="text-on-surface-variant font-medium">Baro xirfado aad xirib-raad ku hormarin karto.</p>
                    </div>
                    <Link to="/courses" className="flex items-center gap-2 text-secondary font-bold hover:text-white transition-colors whitespace-nowrap uppercase tracking-widest text-xs">
                        Eeg dhamaan koorsooyinka <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {(courses.length > 0 ? courses : [
                        { id: 1, title: 'Barashada Full-stack Web Development', level: 'Heer Dhexe', lessonUrl: '12 Cashar', price: 100, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085' },
                        { id: 2, title: 'Digital Marketing Mastery 2024', level: 'Sareeye', lessonUrl: '8 Cashar', price: 85, image: 'https://images.unsplash.com/photo-1432888117426-1d5ac0c08272' },
                        { id: 3, title: 'Maamulka Ganaacsiga iyo Hogaaminta', level: 'Bilowge', lessonUrl: '15 Cashar', price: 120, image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0' }
                    ]).map((course, idx) => (
                        <Link to={`/courses/${course.id}`} key={course.id || idx} className="group flex flex-col bg-surface-container/60 rounded-[3.5rem] border border-outline-variant/30 overflow-hidden hover:border-secondary/40 hover:bg-surface-container transition-all duration-500 shadow-xl">
                            <div className="aspect-video relative overflow-hidden bg-surface-container-highest">
                                <img 
                                    src={course.thumbnail_url ? `${BACKEND_URL}${course.thumbnail_url}` : course.image} 
                                    alt={course.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" 
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="glass-pill">
                                        {course.level || 'Heer Dhexe'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-10 flex flex-col flex-grow text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 blur-3xl group-hover:scale-150 transition-transform"></div>
                                <h3 className="font-black text-2xl text-on-surface group-hover:text-secondary transition-colors flex-grow mb-8 uppercase italic tracking-tighter leading-tight relative z-10">
                                    {course.title}
                                </h3>
                                <div className="flex items-center justify-between pt-8 border-t border-outline-variant/10 text-on-surface-variant font-black italic relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shadow-inner">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest">{course.lessonUrl || course.lessons_count || 12} MODULES</span>
                                    </div>
                                    <span className="text-2xl font-black text-secondary">${course.price}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. Expertise Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    {/* Visual Masonry */}
                    <div className="relative animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10">
                            {/* Top Left */}
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" alt="Expert 1" className="w-full h-48 md:h-64 object-cover rounded-[2rem] shadow-lg mt-8" />
                            {/* Top Right */}
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" alt="Expert 2" className="w-full h-64 md:h-80 object-cover rounded-[2rem] shadow-xl" />
                            {/* Bottom Left */}
                            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop" alt="Expert 3" className="w-full h-56 md:h-72 object-cover rounded-[2rem] shadow-md col-span-2 md:col-span-1" />
                        </div>
                        {/* Floating Center Badge */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-secondary text-surface p-8 md:p-10 rounded-[3rem] shadow-[0_0_80px_rgba(0,227,243,0.4)] flex flex-col items-center justify-center border-4 border-surface transform hover:scale-110 transition-all duration-500">
                            <span className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none">50+</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80 mt-2">Masters</span>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                        <span className="text-secondary font-bold uppercase tracking-widest text-[10px] block">
                            LA TALIYE XIRFADEED
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-on-surface font-manrope leading-[1.1]">
                            La baro khubaro <br className="hidden md:block"/> suuqa caalamka ku <br className="hidden md:block"/> takhasusay
                        </h2>
                        <p className="text-on-surface-variant text-lg leading-relaxed">
                            Macalimiintan u ma ahan kaliya aqoonyahano, waa dad si toos ah uga shaqeeya shirkadaha ugu muhiimsan dunida. Waayo aragnimadooda iyo talooyinkooda barasho waa miisaan dhamaystiran.
                        </p>
                        
                        <ul className="space-y-4 pt-2">
                            {[
                                "Caawimaad toos ah (Live Sessions)",
                                "Talo-siin gaar ah (1-on-1 Mentorship)",
                                "Koorsooyinka nolosha wax ka bedela"
                            ].map((bullet, i) => (
                                <li key={i} className="flex items-center gap-4 text-on-surface font-bold">
                                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-secondary/20">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    {bullet}
                                </li>
                            ))}
                        </ul>

                        <div className="pt-6">
                            <Link to="/about" className="inline-flex items-center gap-3 bg-primary text-white font-bold rounded-full px-8 py-4 hover:bg-primary/90 transition-colors shadow-xl shadow-primary/20 outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
                                Baro Macalimiinta <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>



            {/* 4. Bottom CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="bg-surface-container p-16 md:p-24 lg:p-32 rounded-[5rem] text-center relative overflow-hidden shadow-2xl border border-outline-variant glass">
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px]"></div>
                    
                    <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                        <h2 className="text-5xl md:text-7xl font-black text-on-surface uppercase italic tracking-tighter leading-[1.1]">
                            Ma diyaar u tahay inaad <br /> bilowdo <span className="text-secondary">safarkaaga?</span>
                        </h2>
                        <p className="text-on-surface-variant text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                            Barasho maanta oo hel <span className="text-tertiary font-black italic">30% DHIMIS</span> koorsooyinka xulaneed. Wakhtigu waa hadda.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                            {user ? (
                                <Link to="/dashboard" className="btn-energy px-16 py-7 text-xs !rounded-[2rem]">
                                    TAG DASHBOARD-KA ⚡
                                </Link>
                            ) : (
                                <Link to="/register" className="btn-energy px-16 py-7 text-xs !rounded-[2rem]">
                                    IS DIIWAANGELI HADDA ⚡
                                </Link>
                            )}
                            <Link to="/courses" className="px-12 py-6 text-on-surface-variant font-black uppercase tracking-widest text-[11px] hover:text-on-surface transition-colors">
                                Eeg wax intaa dheer
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
