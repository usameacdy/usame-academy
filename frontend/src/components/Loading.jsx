import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-2xl">
            <div className="relative">
                {/* Outer Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Main Spinner */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-20 h-20 border-[6px] border-[#F3F3F3] border-t-secondary rounded-full shadow-2xl shadow-primary/10"
                />
                
                {/* Inner Pulsing Circle */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow-lg"
                />
                
                {/* Logo and Text */}
                <div className="absolute top-28 left-1/2 -translate-x-1/2 whitespace-nowrap text-center space-y-3">
                    <img src={`${import.meta.env.BASE_URL}assets/logo.png`} className="w-12 h-12 mx-auto animate-bounce opacity-80" alt="Logo" />
                    <h3 className="font-manrope font-black italic text-primary uppercase tracking-[0.4em] text-sm drop-shadow-sm">Usama Academy</h3>
                    <p className="font-manrope text-[10px] text-slate-400 font-black uppercase tracking-widest">Waa la soo kicinayaa...</p>
                </div>
            </div>
        </div>
    );
};

export default Loading;
