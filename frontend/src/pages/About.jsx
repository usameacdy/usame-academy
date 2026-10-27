import { motion } from 'framer-motion';
import { 
    Users, 
    BookOpen, 
    Heart, 
    CheckCircle, 
    Menu, 
    ChevronRight, 
    Target,
    LayoutDashboard,
    Settings as SettingsIcon,
    User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    // Asset Paths (Generated)
    const desktopHeroImg = `${import.meta.env.BASE_URL}about_hero_architecture_1776346633897.png`;
    const yaanNahayImg = `${import.meta.env.BASE_URL}student_group_meeting_1776346934254.png`;
    const mobileHeroImg = `${import.meta.env.BASE_URL}about_mobile_character_1776347404224.png`;

    return (
        <div className="min-h-screen bg-surface font-manrope">
            
            {/* ==========================================
                DESKTOP VERSION (md and above)
            ========================================== */}
            <div className="hidden md:block">
                {/* HERO SECTION */}
                <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={desktopHeroImg} 
                            alt="Architecture" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-surface" />
                    </div>
                    
                    <div className="relative z-10 text-center text-white px-6 max-w-4xl space-y-8 pt-20">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl font-black uppercase tracking-tighter italic text-white"
                        >
                            Hadafkayaga iyo Hiddaha
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl font-medium text-white/90 leading-relaxed max-w-2xl mx-auto"
                        >
                            Waxaan dhisaynaa mustaqbalka waxbarashada dhijitaalka ah ee dhalinyarada Soomaaliyeed, annagoo isku xireyna hiddaha iyo tiknoolajiyadda casriga ah.
                        </motion.p>
                        <motion.button 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            onClick={() => navigate('/register')}
                            className="bg-[#F9A825] hover:bg-[#FBC02D] text-slate-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            Nagu soo biir
                        </motion.button>
                    </div>
                </section>

                {/* YAAN NAHAY SECTION */}
                <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <div className="p-4 glass rounded-[3rem] shadow-2xl relative border-outline-variant">
                            <img 
                                src={yaanNahayImg} 
                                alt="Students" 
                                className="rounded-[2.5rem] w-full shadow-lg"
                            />
                            <div className="absolute -bottom-10 -right-10 glass p-8 rounded-[2rem] shadow-2xl space-y-2 border border-outline-variant">
                                <p className="text-[10px] font-black uppercase text-[#F9A825] tracking-widest leading-none">TAYO IYO JOOGTO</p>
                                <p className="text-xl font-black text-on-surface leading-none italic uppercase">In ka badan 4 sano <br /> oo tayo ah</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <p className="text-xs font-black text-secondary uppercase tracking-[0.4em]">MUUQALKA GUUD</p>
                            <h2 className="text-5xl font-black text-on-surface uppercase italic tracking-tighter">Yaan Nahay?</h2>
                        </div>
                        <div className="space-y-6 text-on-surface-variant font-medium leading-[2] text-lg">
                            <p>Usama Academy waa madal waxbarasho oo heer caalami ah, oo loo aasaasay inay ka jawaabto baahida loo qabo xirfado tayo leh oo dhanka dhijitaalka ah oo ay heli karaan ardayda Soomaaliyeed meel kasta oo ay joogaan.</p>
                            <p>Hadafkayagu waa inaan awood-siino jiilka cusub annagoo siineyna agabka, aqoonta, iyo xiriirka ay ugu baahan yihiin inay kaga dhex muuqdaan suuqa shaqada ee caalamiga ah.</p>
                        </div>
                        <div className="flex items-center gap-4 p-6 glass rounded-3xl border border-outline-variant shadow-sm">
                            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <p className="font-black text-on-surface italic text-lg whitespace-nowrap uppercase">"Waxbarashadu waa furaha isbadalka dhabta ah."</p>
                        </div>
                    </div>
                </section>

                {/* GUULAHAYAGA SECTION */}
                <section className="bg-surface py-32 mb-32 border-y border-outline-variant">
                    <div className="max-w-7xl mx-auto px-6 space-y-20">
                        <div className="text-center space-y-4">
                            <h2 className="text-5xl font-black text-on-surface uppercase italic tracking-tighter">Guulahayaga</h2>
                            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-10">
                            <div className="glass p-12 rounded-[3.5rem] space-y-6 border border-outline-variant hover:scale-105 transition-transform bg-surface-container-low">
                                <div className="w-16 h-16 bg-surface-container-high text-secondary rounded-3xl flex items-center justify-center shadow-sm">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-5xl font-black text-on-surface tracking-tighter italic">10k+</p>
                                    <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Arday qalalinay</p>
                                </div>
                            </div>
                            <div className="bg-primary p-12 rounded-[3.5rem] space-y-6 shadow-2xl shadow-primary/30 text-white transform scale-110 relative z-10 border border-white/10">
                                <div className="w-16 h-16 bg-white/10 text-white rounded-3xl flex items-center justify-center">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-5xl font-black tracking-tighter italic">50+</p>
                                    <p className="text-sm font-bold text-white/40 uppercase tracking-widest">Koorsooyin Heersare ah</p>
                                </div>
                            </div>
                            <div className="glass p-12 rounded-[3.5rem] space-y-6 border border-outline-variant hover:scale-105 transition-transform bg-surface-container-low">
                                <div className="w-16 h-16 bg-surface-container-high text-secondary rounded-3xl flex items-center justify-center shadow-sm">
                                    <Heart className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-5xl font-black text-on-surface tracking-tighter italic">95%</p>
                                    <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Qanacsada Ardayda</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* KOOXDAYADA SECTION */}
                <section className="max-w-7xl mx-auto px-6 py-20 space-y-20">
                    <div className="flex justify-between items-end">
                        <div className="space-y-4">
                            <p className="text-xs font-black text-secondary uppercase tracking-[0.4em]">HOGAANKA</p>
                            <h2 className="text-6xl font-black text-on-surface uppercase italic tracking-tighter">Kooxdayada</h2>
                            <p className="text-on-surface-variant font-medium max-w-md">Khubaro aqoon durugsan u leh dhinacvada waxbarashada, Tiknoolajiyada, iyo hogaanka oo u heellan horumarkaaga.</p>
                        </div>
                        <button className="flex items-center gap-2 text-secondary font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                            Dhammaan Kooxda <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-8">
                        {[
                            { name: "Dr. Ahmed Ali", role: "Maamulaha Guud", img: "https://ui-avatars.com/api/?name=Dr+Ahmed+Ali&background=1a237e&color=fff&size=400" },
                            { name: "Eng. Sahra Mahad", role: "Madaxa Tiknoolajiyadda", img: "https://ui-avatars.com/api/?name=Eng+Sahra+Mahad&background=006876&color=fff&size=400" },
                            { name: "Liban Hassan", role: "Madaxa Curriculum-ka", img: "https://ui-avatars.com/api/?name=Liban+Hassan&background=1a237e&color=fff&size=400" },
                            { name: "Idil Osman", role: "Madaxa Isgaarsiinta", img: "https://ui-avatars.com/api/?name=Idil+Osman&background=006876&color=fff&size=400" }
                        ].map((staff, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -10 }}
                                className="space-y-4 group"
                            >
                                <div className="aspect-[4/5] glass overflow-hidden border border-outline-variant bg-surface-container">
                                    <img src={staff.img} alt={staff.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100" />
                                </div>
                                <div className="px-2">
                                    <h3 className="text-xl font-black text-on-surface uppercase italic tracking-tight">{staff.name}</h3>
                                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{staff.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FINAL CTA BOX */}
                <section className="max-w-7xl mx-auto px-6 py-32">
                    <div className="bg-primary rounded-[4.5rem] p-24 text-center text-white space-y-10 shadow-[0_40px_100px_rgba(26,35,126,0.3)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -mr-64 -mt-64" />
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none">Ma diyaar u tahay inaad bilowdo safarkaaga?</h2>
                            <p className="text-white/60 text-xl font-medium max-w-2xl mx-auto">Ku soo biir kumanaanka ardayda ah ee maanta dhisaya mustaqbalkooda.</p>
                        </div>
                        <button onClick={() => navigate('/register')} className="relative z-10 bg-[#F9A825] hover:bg-[#FBC02D] text-slate-900 px-16 py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm transition-all hover:scale-105 active:scale-95 shadow-2xl">
                            Is-diwaangeli Hadda
                        </button>
                    </div>
                </section>

                {/* DESKTOP FOOTER */}
                <footer className="bg-surface border-t border-outline-variant py-20">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-12">
                        <div className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/30">
                            <div className="flex gap-10">
                                <span className="hover:text-secondary cursor-pointer transition-colors">Privacy Policy</span>
                                <span className="hover:text-secondary cursor-pointer transition-colors">Terms of Service</span>
                                <span className="hover:text-secondary cursor-pointer transition-colors">Faculty Portal</span>
                                <span className="hover:text-secondary cursor-pointer transition-colors">Contact</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="text-2xl font-black text-secondary tracking-tighter uppercase italic">Usama Academy</h2>
                            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">© 2024 · USAMA ACADEMY. ALL RIGHTS RESERVED.</p>
                        </div>
                    </div>
                </footer>
            </div>


            {/* ==========================================
                MOBILE VERSION (Below md)
            ========================================== */}
            <div className="md:hidden flex flex-col">
                
                {/* MOBILE NAV HEADER */}
                <header className="fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-xl z-50 px-6 py-5 flex items-center justify-between border-b border-outline-variant">
                    <button className="p-3 bg-surface-container rounded-2xl border border-outline-variant">
                        <Menu className="w-5 h-5 text-on-surface" />
                    </button>
                    <h2 className="text-lg font-black text-primary uppercase italic tracking-tighter">Usama Academy</h2>
                    <div className="w-12 h-12 glass overflow-hidden border border-outline-variant p-1">
                        <img src="https://ui-avatars.com/api/?name=User&background=006876&color=fff" className="w-full h-full rounded-xl object-cover" alt="User" />
                    </div>
                </header>

                <main className="pt-28 pb-32 px-6 space-y-12">
                    
                    {/* MOBILE HERO CARD */}
                    <section className="bg-primary rounded-[3rem] p-2 overflow-hidden relative shadow-2xl shadow-primary/20">
                        <div className="relative aspect-[3/4]">
                            <img 
                                src={mobileHeroImg} 
                                alt="Mobile Character" 
                                className="w-full h-full object-cover rounded-[2.5rem]"
                            />
                            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20">
                                <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">Nagu Saabsan</h1>
                                <div className="w-16 h-1.5 bg-[#F9A825] mt-4 rounded-full" />
                            </div>
                        </div>
                    </section>

                    {/* MOBILE HADAFKA SECTION */}
                    <section className="glass p-10 rounded-[3rem] space-y-8 border border-outline-variant shadow-sm bg-surface-container">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                                <Target className="w-6 h-6" />
                            </div>
                            <h2 className="text-xs font-black text-secondary uppercase tracking-[0.4em]">HADAFKA</h2>
                        </div>
                        <p className="text-lg font-medium text-on-surface-variant leading-relaxed italic">
                            Waxaan u taagannahay inaan kobcinno aqoonta dhijitaalka ah ee bulshada, annagoo adeegsanayna tignoolajiyada ugu dambaysa si loo abuuro jiil aqoon iyo xirfad u saaxiib ah.
                        </p>
                    </section>

                    {/* MOBILE STATS BLOCKS */}
                    <section className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass p-8 rounded-[2.5rem] border border-outline-variant shadow-sm space-y-1 bg-surface-container">
                                <p className="text-4xl font-black text-on-surface tracking-tighter italic leading-none uppercase">5K+</p>
                                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">ARDAY</p>
                            </div>
                            <div className="bg-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 space-y-1 border border-white/10">
                                <p className="text-4xl font-black text-white tracking-tighter italic leading-none uppercase">120</p>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">KOORSOOYIN</p>
                            </div>
                        </div>
                        <div className="bg-secondary p-8 rounded-[2.5rem] shadow-xl shadow-secondary/20 flex items-center justify-between border border-white/10">
                            <div className="space-y-1">
                                <p className="text-4xl font-black text-white tracking-tighter italic leading-none uppercase">98%</p>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">KU QANACSANAANTA</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </section>

                    {/* MOBILE KOOXDAYADA */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Kooxdayada</h2>
                        <div className="space-y-4">
                            {[
                                { name: "Axmed Cali", role: "Aasaasaha & Maamulaha", color: "bg-secondary" },
                                { name: "Zahra Maxamed", role: "Madaxa Waxbarashada", color: "bg-primary" },
                                { name: "Faarax Cismaan", role: "Injineerka Sare", color: "bg-[#7E57C2]" }
                            ].map((person, i) => (
                                <div key={i} className="glass p-6 rounded-[2rem] flex items-center gap-6 border border-outline-variant shadow-sm bg-surface-container">
                                    <div className={`w-20 h-20 rounded-[1.5rem] ${person.color} overflow-hidden`}>
                                        <img src={`https://ui-avatars.com/api/?name=${person.name}&background=random&color=fff`} className="w-full h-full object-cover grayscale opacity-80" alt={person.name} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-on-surface italic uppercase tracking-tighter">{person.name}</h3>
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{person.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* MOBILE CTA BOX */}
                    <section className="bg-primary rounded-[3rem] p-10 text-center text-white space-y-8 relative overflow-hidden border border-white/10">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />
                        <div className="space-y-4 relative z-10">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none px-4">Ma rabtaa inaad nala soo xiriirto?</h2>
                            <p className="text-white/40 text-sm font-medium">Waxaan mar walba diyaari u nahay inaan ka jawaabno su'aalahaaga.</p>
                        </div>
                        <button className="w-full bg-[#F9A825] text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all relative z-10">
                            Fariin Noo Soo Dir
                        </button>
                    </section>

                </main>

                {/* MOBILE BOTTOM NAV */}
                <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-outline-variant flex items-center justify-between px-8 py-5 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                    <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-on-surface-variant opacity-40">
                        <LayoutDashboard className="w-6 h-6" />
                        <span className="text-[9px] font-bold uppercase">Muraayad</span>
                    </button>
                    <button onClick={() => navigate('/courses')} className="flex flex-col items-center gap-1 text-on-surface-variant opacity-40">
                        <BookOpen className="w-6 h-6" />
                        <span className="text-[9px] font-bold uppercase">Koorsooyinka</span>
                    </button>
                    <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-1 text-on-surface-variant opacity-40">
                        <SettingsIcon className="w-6 h-6" />
                        <span className="text-[9px] font-bold uppercase">Settings</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-secondary">
                        <User className="w-6 h-6" />
                        <span className="text-[9px] font-bold uppercase">Profile</span>
                    </button>
                </nav>

            </div>

        </div>
    );
};
export default About;
