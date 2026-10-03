import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PayRent = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [provider, setProvider] = useState('Zaad');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const amount = user?.monthly_fee || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/payments/rent/submit', {
                amount,
                payment_method: provider
            });
            setSubmitted(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Khalad ayaa dhacay. Fadlan mar kale isku day.');
        }
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-10 max-w-md w-full rounded-[3rem] shadow-2xl text-center space-y-6">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">Waa la diray!</h2>
                    <p className="text-slate-500 text-lg">
                        Codsigaagii bixinta kirada waa la diray. Maamulaha ayaa eegi doona oo email kuugu soo sheegi doona marka lagaa furo xisaabtaada.
                    </p>
                    <button onClick={() => { logout(); navigate('/login'); }} className="btn-primary w-full py-4 mt-4">
                        Ka bax (Logout)
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white max-w-lg w-full p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50 -z-10"></div>
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center shadow-inner mb-8">
                    <Lock className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Akoonkaaga Waa Xiran Yahay</h1>
                <p className="text-slate-500 font-medium mb-8">
                    Bisha ayaa kuu dhamaatay! Fadlan iska bixi kirada/mushaarka bisha si laguu furo oo aad usii wadatid casharadaada iyo ardaydaada.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Qaddarka Kirada ($)</label>
                        <input
                            type="number"
                            disabled
                            value={amount}
                            className="input-field border-2 bg-slate-50 font-black text-xl text-slate-900"
                        />
                        <p className="text-xs text-slate-600 font-bold ml-1">Tani waa lacagta billaha ah ee go'an.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Dooro Qaabka Bixinta</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['Zaad', 'EVC', 'eDahab'].map(method => (
                                <button
                                    type="button"
                                    key={method}
                                    onClick={() => setProvider(method)}
                                    className={`py-4 rounded-2xl border-2 font-black transition-all ${provider === method ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md' : 'border-slate-100 text-slate-600 hover:border-slate-300'}`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 rounded-[2rem] shadow-xl shadow-primary-200 mt-8"
                    >
                        <CreditCard className="w-6 h-6" />
                        {loading ? 'Waa la dirayaa...' : `Bixi $${amount}`}
                    </button>
                    <button type="button" onClick={() => { logout(); navigate('/login'); }} className="w-full text-slate-600 font-bold hover:text-slate-600 transition-colors mt-4">
                        Ka bax akoonka (Logout)
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default PayRent;
