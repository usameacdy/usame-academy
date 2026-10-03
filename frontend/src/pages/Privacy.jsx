import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-surface py-24 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                {/* Header */}
                <header className="text-center space-y-6">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                        <ShieldCheck className="w-4 h-4" /> Privacy Policy
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-on-surface uppercase italic tracking-tighter leading-none">
                        Qaanuunka <span className="text-secondary">Amniga</span>
                    </h1>
                    <p className="text-on-surface-variant font-medium text-lg opacity-60">
                        Sidee u dhowrnaa xogtaada iyo sirtaada gaarka ah?
                    </p>
                </header>

                {/* Content Cards */}
                <div className="grid gap-8">
                    {[
                        { 
                            title: 'Xogta aan ururino', 
                            icon: Eye, 
                            content: 'Markaad iska diwaangalinayso Usama Academy, waxaan ururinaa magacaaga, email-kaaga, iyo telefoonkaaga si aan kuugu soo saarno shahaado sax ah oo magacaaga wadata.' 
                        },
                        { 
                            title: 'Sidee loo isticmaalaa xogtaada?', 
                            icon: Lock, 
                            content: 'Xogtaada waxaa loo isticmaalaa oo kaliya si aan kuugu bixino adeegyada waxbarasho, kuu soo dirno ogeysiisyada muhiimka ah, iyo inaan hubino in koorsooyinka aad iibsatay ay kuu furanyihiin.' 
                        },
                        { 
                            title: 'Dhowrista Sirta', 
                            icon: ShieldCheck, 
                            content: 'Usama Academy marnaba ma iibiso mana la wadaagto xogtaada shakhsiga ah cid saddexaad (Third parties) iyada oo aan oggolaanshahaaga laga helin.' 
                        },
                        { 
                            title: 'Lacag-bixinta', 
                            icon: FileText, 
                            content: 'Dhammaan lacagaha lagu bixiyo nidaamyada mobilada (sida EVC Plus ama Zaad) waxay u dhacaan si ammaan ah, anaguna ma kaydino lambarada sirta ah ee macaamiisha.' 
                        }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-surface-container rounded-[3rem] p-12 border border-outline-variant hover:border-secondary/40 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 bg-surface-container-highest rounded-[1.5rem] flex items-center justify-center text-secondary border border-outline-variant group-hover:bg-secondary group-hover:text-white transition-all">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">{item.title}</h3>
                                    <p className="text-on-surface-variant leading-relaxed font-medium opacity-70 italic">{item.content}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <footer className="text-center pt-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-30">
                        Cusboonaysiintii u dambaysay: May 2026
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Privacy;
