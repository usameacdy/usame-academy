import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Phone, CreditCard, CheckCircle, Loader2, Lock, ExternalLink, ArrowRight, Clock, ArrowLeft, ShieldCheck, KeyRound, Smartphone } from 'lucide-react';
import api from '../api/axios';

// Admin merchant numbers for each provider
const MERCHANT_ZAAD = '0634498157';  // Zaad
const MERCHANT_SAHAL = '0906619970';  // Sahal
const MERCHANT_EVC = '0770877759';   // EVC Plus
const MERCHANT_SOMTEL = '0770877759';// Somtel

const PAYMENT_METHODS = [
    {
        id: 'zaad',
        label: 'Zaad Service',
        provider: 'zaad',
        color: 'from-emerald-600 to-green-700',
        bgLight: 'bg-emerald-50/90',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-300',
        icon: '💚',
        description: 'Telesom Zaad (Somaliland)',
        placeholder: '063XXXXXXX',
        country: 'Somaliland',
        merchant: MERCHANT_ZAAD,
        getUssd: (amount) => `*880*${MERCHANT_ZAAD}*${amount}#`,
        getLink: (amount) => `tel:*880*${MERCHANT_ZAAD}*${amount}%23`,
    },
    {
        id: 'evc',
        label: 'EVC Plus',
        provider: 'evc',
        color: 'from-red-600 to-rose-700',
        bgLight: 'bg-rose-50/90',
        textColor: 'text-rose-700',
        borderColor: 'border-rose-300',
        icon: '🔴',
        description: 'Hormuud EVC Plus (Somalia)',
        placeholder: '061XXXXXXX',
        country: 'Somalia',
        merchant: MERCHANT_EVC,
        getUssd: (amount) => `*712*${MERCHANT_EVC}*${amount}#`,
        getLink: (amount) => `tel:*712*${MERCHANT_EVC}*${amount}%23`,
    },
    {
        id: 'sahal',
        label: 'Sahal Service',
        provider: 'sahal',
        color: 'from-blue-600 to-sky-700',
        bgLight: 'bg-blue-50/90',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
        icon: '🔵',
        description: 'Golis Sahal (Puntland)',
        placeholder: '090XXXXXXX',
        country: 'Puntland',
        merchant: MERCHANT_SAHAL,
        getUssd: (amount) => `*883*${MERCHANT_SAHAL}*${amount}#`,
        getLink: (amount) => `tel:*883*${MERCHANT_SAHAL}*${amount}%23`,
    },
    {
        id: 'somtel',
        label: 'Somtel e-Dahab',
        provider: 'somtel',
        color: 'from-amber-600 to-orange-700',
        bgLight: 'bg-orange-50/90',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-300',
        icon: '🟠',
        description: 'Somtel e-Dahab',
        placeholder: '063XXXXXXX',
        country: 'Somalia / SL',
        merchant: MERCHANT_SOMTEL,
        getUssd: (amount) => `*767*${MERCHANT_SOMTEL}*${amount}#`,
        getLink: (amount) => `tel:*767*${MERCHANT_SOMTEL}*${amount}%23`,
    },
    {
        id: 'mastercard',
        label: 'Card Payment',
        provider: 'mastercard',
        color: 'from-slate-800 to-slate-950',
        bgLight: 'bg-slate-100/90',
        textColor: 'text-slate-800',
        borderColor: 'border-slate-300',
        icon: '💳',
        description: 'International Credit Card',
        placeholder: null,
        country: 'Credit/Debit Card',
        merchant: null,
    },
];

const PaymentModal = ({ course, onClose, onSuccess }) => {
    const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
    const [phone, setPhone] = useState('');
    const [simPin, setSimPin] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [step, setStep] = useState('select'); // 'select' | 'sim_prompt' | 'processing' | 'done'
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const amount = parseFloat(course.price).toFixed(2);

    const handleSelectMethod = (method) => {
        setSelectedMethod(method);
        setError('');
        setPhone('');
        setSimPin('');
        setCardNumber('');
        setCardExpiry('');
        setCardCvv('');
        setCardName('');
        setStep('select');
    };

    const handleOpenSimPrompt = () => {
        if (selectedMethod.id !== 'mastercard') {
            const cleanPhone = phone.replace(/\D/g, '');
            if (!cleanPhone || cleanPhone.length < 7) {
                setError('Fadlan geli 9-ka lambar ee telefoonkaaga mobaylka (t.m. 063XXXXXXX)');
                return;
            }
        } else {
            if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
                setError('Fadlan geli macluumaadka kaarka oo dhan.');
                return;
            }
        }
        setError('');
        if (selectedMethod.id === 'mastercard') {
            handleFinalSubmit();
        } else {
            setStep('sim_prompt');
        }
    };

    const handleFinalSubmit = async () => {
        if (selectedMethod.id !== 'mastercard' && (!simPin || simPin.length < 4)) {
            setError('Fadlan geli 4-ta lambar ee PIN-kaaga SIM Card-ka.');
            return;
        }

        setProcessing(true);
        setError('');
        setStep('processing');

        try {
            await api.post('/payments/local/mock', {
                course_id: course.id,
                provider: selectedMethod.provider,
                phone_number: phone || 'CARD_PAYMENT',
            });

            setTimeout(() => {
                setStep('done');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 2500);
            }, 1800);
        } catch (err) {
            setError(err.response?.data?.message || 'Lacag bixintu way ku guuldareysatay. Fadlan isku day markale.');
            setStep('select');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                {/* BACKDROP */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md"
                />

                {/* MODAL CONTAINER */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-[460px] bg-surface-container rounded-[2.5rem] shadow-2xl overflow-hidden z-20 max-h-[92vh] flex flex-col border border-outline-variant font-manrope text-on-surface"
                >
                    {/* MODAL HEADER */}
                    <div className="bg-primary text-white p-6 sm:p-8 relative overflow-hidden flex-shrink-0">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-2xl -mr-20 -mt-20" />
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> USSD SIM PUSH GATEWAY
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight max-w-[85%] truncate uppercase italic">
                                    {course.title}
                                </h2>
                                <div className="flex items-baseline gap-2 pt-1">
                                    <span className="text-3xl sm:text-4xl font-black italic tracking-tighter text-secondary">${amount}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Wadarta Qiimaha</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-2xl transition-all border border-white/10"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* MODAL BODY */}
                    <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
                        
                        {/* STEP 1: SELECT METHOD & ENTER PHONE */}
                        {step === 'select' && (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 opacity-80 text-center">
                                        Dooro Nidaamka Lacag Bixinta (USSD Push / Mobile Money)
                                    </p>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {PAYMENT_METHODS.map((method) => {
                                            const isSelected = selectedMethod?.id === method.id;
                                            return (
                                                <button
                                                    key={method.id}
                                                    onClick={() => handleSelectMethod(method)}
                                                    className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all ${
                                                        isSelected
                                                            ? `border-secondary ${method.bgLight} shadow-md scale-[1.02]`
                                                            : 'border-outline-variant/40 hover:border-secondary/40 bg-surface-container-high/40'
                                                    }`}
                                                >
                                                    <span className="text-2xl drop-shadow-sm">{method.icon}</span>
                                                    <div className="text-center">
                                                        <p className="font-extrabold text-[11px] text-on-surface leading-tight">{method.label}</p>
                                                        <p className="text-[8px] text-on-surface-variant font-bold uppercase tracking-wider opacity-70">
                                                            {method.country}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Form Input based on Method */}
                                {selectedMethod && (
                                    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                                        <div className={`bg-gradient-to-r ${selectedMethod.color} p-4 rounded-2xl flex items-center gap-3.5 text-white shadow-md relative overflow-hidden`}>
                                            <span className="text-3xl">{selectedMethod.icon}</span>
                                            <div>
                                                <p className="font-extrabold text-base leading-tight">{selectedMethod.label}</p>
                                                <p className="text-[9px] font-bold uppercase tracking-wider opacity-80">{selectedMethod.description}</p>
                                            </div>
                                        </div>

                                        {selectedMethod.id === 'mastercard' ? (
                                            <div className="space-y-3">
                                                <div className="relative">
                                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                                                    <input
                                                        type="text"
                                                        placeholder="LAMBARKA KAARKADA"
                                                        value={cardNumber}
                                                        onChange={(e) => setCardNumber(e.target.value)}
                                                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-outline-variant bg-surface text-xs font-bold uppercase tracking-wider text-on-surface focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="MAGACA KU QORAN KAARKA"
                                                    value={cardName}
                                                    onChange={(e) => setCardName(e.target.value)}
                                                    className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-surface text-xs font-bold uppercase tracking-wider text-on-surface focus:outline-none focus:border-secondary"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        value={cardExpiry}
                                                        onChange={(e) => setCardExpiry(e.target.value)}
                                                        className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-surface text-xs font-bold text-center uppercase tracking-wider text-on-surface focus:outline-none focus:border-secondary"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="CVV"
                                                        value={cardCvv}
                                                        onChange={(e) => setCardCvv(e.target.value)}
                                                        className="w-full px-4 py-3.5 rounded-2xl border border-outline-variant bg-surface text-xs font-bold text-center uppercase tracking-wider text-on-surface focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant block">
                                                    Geli 9-ka Lambar ee Telefoonkaaga (SIM Card)
                                                </label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-secondary" />
                                                    <input
                                                        type="tel"
                                                        maxLength={10}
                                                        placeholder={selectedMethod.placeholder}
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-secondary/40 bg-surface font-black text-sm tracking-wider text-on-surface focus:outline-none focus:border-secondary shadow-inner"
                                                    />
                                                </div>
                                                <p className="text-[9px] text-on-surface-variant/70 italic font-medium">
                                                    * Markaad riixdo button-ka hoose, USSD Prompt ayaa ku soo dhacaya SIM Card-ka telefoonkaaga si aad PIN-ka ugu meel mariso.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {error && (
                                    <div className="p-3.5 bg-red-500/10 text-red-500 border border-red-500/30 rounded-2xl text-xs font-bold text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleOpenSimPrompt}
                                    disabled={!selectedMethod}
                                    className="w-full py-4 bg-secondary text-surface text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-secondary/90 active:scale-95 transition-all flex items-center justify-center gap-2 italic disabled:opacity-20"
                                >
                                    <Smartphone className="w-4 h-4" />
                                    {selectedMethod ? `SHID USSD SIM PUSH ($${amount})` : 'DOORO NIDAAMKA'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: SIM CARD PIN PROMPT OVERLAY (USSD PUSH MODAL) */}
                        {step === 'sim_prompt' && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-[#111827] text-white p-6 rounded-3xl border border-secondary/40 shadow-2xl space-y-6 relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{selectedMethod.icon}</span>
                                        <div>
                                            <h4 className="font-black text-xs uppercase tracking-widest text-secondary">{selectedMethod.label} USSD PUSH</h4>
                                            <p className="text-[9px] text-white/60">SIM Card Direct Payment Prompt</p>
                                        </div>
                                    </div>
                                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[9px] font-black uppercase">
                                        SIM ACTIVE
                                    </span>
                                </div>

                                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <p className="text-xs text-white/90 leading-relaxed font-medium">
                                        Ma hubtaa inaad <strong className="text-secondary font-black">${amount}</strong> u meel mariso USAMA ACADEMY?
                                    </p>
                                    <p className="text-[10px] text-white/50">
                                        Lambarka SIM-ka: <strong className="text-white font-mono">{phone}</strong>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-secondary flex items-center gap-1.5">
                                        <KeyRound className="w-3.5 h-3.5" /> Geli PIN-ka SIM Card-kaaga (4 Digits)
                                    </label>
                                    <input
                                        type="password"
                                        maxLength={4}
                                        autoFocus
                                        placeholder="••••"
                                        value={simPin}
                                        onChange={(e) => setSimPin(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleFinalSubmit();
                                        }}
                                        className="w-full bg-black/80 border-2 border-secondary p-4 rounded-2xl text-center text-2xl font-black tracking-[0.5em] text-secondary focus:outline-none shadow-inner"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-400 text-xs font-bold text-center bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                                        {error}
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button
                                        onClick={() => setStep('select')}
                                        className="py-3.5 rounded-xl border border-white/20 text-white/70 hover:text-white font-bold text-xs uppercase tracking-wider"
                                    >
                                        Kansal
                                    </button>
                                    <button
                                        onClick={handleFinalSubmit}
                                        className="py-3.5 bg-secondary text-surface font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-secondary/90 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" /> BIXI / SEND
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: PROCESSING ANIMATION */}
                        {step === 'processing' && (
                            <div className="py-12 text-center space-y-6">
                                <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center mx-auto border border-secondary/30">
                                    <Loader2 className="w-10 h-10 text-secondary animate-spin" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-on-surface uppercase">USSD SIM PIN Farsamaynayaa...</h3>
                                    <p className="text-xs font-medium text-on-surface-variant px-6">
                                        Fadlan xoogaa sug. Waxaan lacagta ka jaraynaa SIM Card-kaaga mobile-ka.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: SUCCESS / DONE */}
                        {step === 'done' && (
                            <div className="py-10 text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto border-2 border-emerald-500 text-emerald-400"
                                >
                                    <CheckCircle className="w-10 h-10" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-on-surface uppercase">Lacagta Waa La Bixiyay! 🎉</h3>
                                    <p className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 py-2 px-4 rounded-xl border border-emerald-500/20 inline-block">
                                        SIM Card-kaaga waxaa ka baxday ${amount}. Hadda si toos ah ayaad u geli kartaa casharrada!
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
