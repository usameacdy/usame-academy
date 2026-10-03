import { motion } from 'framer-motion';
import { Gavel, FileCheck, AlertCircle, HelpCircle } from 'lucide-react';

const Terms = () => {
    return (
        <div className="min-h-screen bg-surface py-24 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                {/* Header */}
                <header className="text-center space-y-6">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                        <Gavel className="w-4 h-4" /> Terms of Service
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-on-surface uppercase italic tracking-tighter leading-none">
                        Shuruudaha <span className="text-tertiary">Adeegga</span>
                    </h1>
                    <p className="text-on-surface-variant font-medium text-lg opacity-60">
                        Waa maxay xeerarka lagu maamulo xiriirka Usama Academy iyo Ardayda?
                    </p>
                </header>

                {/* Content Cards */}
                <div className="grid gap-8">
                    {[
                        { 
                            title: 'Isticmaalka Akoonka', 
                            icon: FileCheck, 
                            content: 'Akoon kasta waxaa iska leh hal qof oo kaliya. Lama oggola in dad badan ay isku wada isticmaalaan hal akoon. Haddii lagu arko, akoonka waa la xiri karaa.' 
                        },
                        { 
                            title: 'Lahaanshaha Agabka', 
                            icon: AlertCircle, 
                            content: 'Dhammaan muuqaalada, agabka, iyo casharrada yaala Usama Academy waa hanti ay leedahay akadeemiyadu. Lama oggola in la koobiyeeyo ama meel kale lagu faafiyo iyadoon oggolaansho laga helin.' 
                        },
                        { 
                            title: 'Lacag Celinta (Refunds)', 
                            icon: HelpCircle, 
                            content: 'Koorsooyinka waa agab dijital ah oo isla marka aad iibsato lagu siinayo, sidaas darteed guud ahaan ma jirto lacag celin marka aad hesho fursad aad ku daawato casharrada.' 
                        },
                        { 
                            title: 'Dhaqanka iyo Anshaxa', 
                            icon: Gavel, 
                            content: 'Arday kasta waxaa looga baahanyahay inuu dhowro anshaxa iyo asluubta marka uu la xiriirayo macalimiinta ama ardayda kale ee nidaamka ku dhex jirta.' 
                        }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-surface-container rounded-[3rem] p-12 border border-outline-variant hover:border-tertiary/40 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 bg-surface-container-highest rounded-[1.5rem] flex items-center justify-center text-tertiary border border-outline-variant group-hover:bg-tertiary group-hover:text-white transition-all">
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

export default Terms;
