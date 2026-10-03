import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Download, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        alert('Mahadsanid! Fariintaada waa la diray.');
    };

    return (
        <div className="min-h-screen bg-surface selection:bg-secondary/30 selection:text-secondary">
            <div className="max-w-[1400px] mx-auto px-6 py-20 lg:py-32">
                <div className="flex flex-col lg:flex-row gap-20 items-start">
                    
                    {/* Left Side: Portrait & Info */}
                    <div className="w-full lg:w-[45%] sticky top-32">
                        <div className="relative">
                            {/* The Portrait */}
                            <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl border border-outline-variant group">
                                <img 
                                    src="/usama_profile_portrait_1777298562378.png" 
                                    alt="Usama Academy Founder" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60"></div>
                            </div>

                            {/* Floating Glass Card */}
                            <div className="absolute -bottom-10 -left-6 lg:-left-12 glass-premium p-8 lg:p-12 rounded-[2.5rem] max-w-[320px] animate-in slide-in-from-left duration-700">
                                <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter leading-none mb-2">Usama Academy</h3>
                                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-6">Founder & Lead Mentor</p>
                                <div className="space-y-4">
                                    <a href="mailto:jokarkaamusan@gmail.com" className="flex items-center gap-4 text-on-surface-variant group cursor-pointer hover:text-primary transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-outline-variant group-hover:border-primary/30">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold">jokarkaamusan@gmail.com</span>
                                    </a>
                                    <a href="tel:+2520906619970" className="flex items-center gap-4 text-on-surface-variant group cursor-pointer hover:text-primary transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-outline-variant group-hover:border-primary/30">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold">+2520906619970</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="w-full lg:w-[55%] pt-12 lg:pt-0">
                        <div className="max-w-2xl">
                            <h1 className="text-6xl lg:text-8xl font-black text-primary uppercase italic tracking-tighter leading-[0.8] mb-8 animate-in slide-in-from-bottom duration-500">
                                Nala <br /> <span className="text-secondary">Soo Xiriir</span>
                            </h1>
                            <p className="text-on-surface-variant text-lg font-medium leading-relaxed mb-16 opacity-70 max-w-lg">
                                Waxaan halkan u joognaa inaan kaa caawino barashada xirfadaha cusub. Noo soo dir fariin, waxaan kuugu soo jawaabi doonaa sida ugu dhaqsaha badan.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-4 opacity-40">Magacaaga oo buuxa</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="input-terminal"
                                            placeholder="TUSAALE: CALI AXMED"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-4 opacity-40">Email-kaaga</label>
                                        <input 
                                            type="email" 
                                            required
                                            className="input-terminal"
                                            placeholder="EMAIL@USAAM.COM"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-4 opacity-40">Mowduuca (Subject)</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="input-terminal"
                                        placeholder="MAXAAD KA CODSANAYSAA?"
                                        value={formData.subject}
                                        onChange={e => setFormData({...formData, subject: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-4 opacity-40">Sideen kuu caawin karnaa?</label>
                                    <textarea 
                                        required
                                        className="input-terminal h-48 resize-none py-6"
                                        placeholder="HALKAN KU QOR FARIINTAADA..."
                                        value={formData.message}
                                        onChange={e => setFormData({...formData, message: e.target.value})}
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn-energy w-full lg:w-auto px-16 py-6 text-sm uppercase tracking-[0.3em]">
                                    Dir Fariinta <Send className="w-5 h-5" />
                                </button>
                            </form>

                            {/* Social Presence */}
                            <div className="mt-24 pt-12 border-t border-outline-variant flex flex-wrap gap-12 items-center">
                                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.4em] opacity-40">Social Presence</span>
                                <div className="flex gap-8">
                                    <a href="https://www.facebook.com/share/18SSf1WNnC/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all duration-300">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                                        <a key={i} href="#" className="p-4 rounded-2xl bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all duration-300">
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
