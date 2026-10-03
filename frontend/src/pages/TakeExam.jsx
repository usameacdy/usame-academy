import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, HelpCircle, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

const TakeExam = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    const handleSubmit = useCallback(async () => {
        if (submitting || result) return;
        setSubmitting(true);
        try {
            const res = await api.post(`/exams/${exam.id}/submit`, { answers });
            setResult(res.data);
        } catch {
            alert('Submission failed. Please try again.');
        }
        setSubmitting(false);
    }, [exam, answers, submitting, result]);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const res = await api.get(`/exams/course/${courseId}`);
                // Initial fetch already includes questions for students
                setExam(res.data);
                if (res.data.duration_minutes) {
                    setTimeLeft(res.data.duration_minutes * 60);
                }
            } catch (err) {
                console.error("Exam fetch error:", err);
            }
            setLoading(false);
        };
        fetchExam();
    }, [courseId, navigate]);

    useEffect(() => {
        if (timeLeft === null || result) return;
        if (timeLeft === 0) {
            // Trigger submission without immediate state change in body
            const triggerSubmit = async () => {
                await handleSubmit();
            };
            triggerSubmit();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, result, handleSubmit]);

    const handleAnswerChange = (val) => {
        if (result) return;
        setAnswers({ ...answers, [exam.questions[currentQuestion].id]: val });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600 border-b-2 border-primary-600"></div>
        </div>
    );

    if (result) {
        return (
            <div className="max-w-2xl mx-auto py-24 px-6 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="surface-container p-16 rounded-[4rem] shadow-[0_0_100px_rgba(0,227,243,0.15)] border border-outline-variant relative overflow-hidden"
                >
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className={`w-28 h-28 mx-auto mb-10 rounded-[2.5rem] flex items-center justify-center relative z-10 ${result.passed ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-tertiary/20 text-tertiary border border-tertiary/30 shadow-[0_0_30px_rgba(255,107,173,0.2)]'}`}>
                        {result.passed ? <CheckCircle2 className="w-14 h-14" /> : <AlertCircle className="w-14 h-14" />}
                    </div>
                    <h2 className="text-5xl font-black text-on-surface mb-4 uppercase italic tracking-tighter">
                        {result.passed ? 'Hambalyo!' : 'Ma Dhawaatid!'}
                    </h2>
                    <p className="text-on-surface-variant text-xl mb-12 font-medium">
                        Waxaad heshay <span className="text-secondary font-black italic text-2xl">${result.score}%</span> dhibcood.
                    </p>

                    <div className="bg-surface-container-high/50 p-10 rounded-[2.5rem] mb-12 border border-outline-variant/30 glass">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-4">Xaaladda Natiijada</p>
                        <p className={`text-4xl font-black italic tracking-tight ${result.passed ? 'text-secondary drop-shadow-[0_0_15px_rgba(0,227,243,0.4)]' : 'text-tertiary shadow-neon-pink'}`}>
                            {result.passed ? 'WAAD GUDUBTAY' : 'WAAD DHACDAY'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                        {result.passed ? (
                            <button
                                onClick={() => navigate('/dashboard', { state: { tab: 'results' } })}
                                className="btn-energy flex-1 py-6 text-[11px] uppercase tracking-[0.2em]"
                            >
                                Gudub Dashboard
                            </button>
                        ) : (
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-energy bg-surface-container-highest border-outline-variant text-on-surface flex-1 py-6 text-[11px] uppercase tracking-[0.2em]"
                            >
                                Mar labaad tijaabi
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!exam || !exam.questions || exam.questions.length === 0) {
        return (
            <div className="max-w-2xl mx-auto py-24 px-6 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="surface-container p-16 rounded-[4rem] border border-outline-variant shadow-2xl"
                >
                    <div className="w-28 h-28 mx-auto mb-10 rounded-[2.5rem] bg-surface-container-highest text-tertiary flex items-center justify-center border border-outline-variant">
                        <AlertCircle className="w-14 h-14" />
                    </div>
                    <h2 className="text-3xl font-black text-on-surface mb-6 uppercase italic tracking-tighter">
                        Imtixaanka wali lama diyaarin
                    </h2>
                    <p className="text-on-surface-variant text-lg mb-12 font-medium tracking-wide">
                        Baraha koorsadan wali ma uusan raacin su'aalaha imtixaanka finalka ah. Fadlan dib ugu soo laabo mar dambe.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-energy w-full py-6 text-[11px] uppercase tracking-[0.2em]"
                    >
                        Dib u laabo
                    </button>
                </motion.div>
            </div>
        );
    }
    
    const question = exam.questions[currentQuestion];

    // Defensive: options can be a string (double-encoded JSON) or already an object
    const getOptions = (q) => {
        if (!q?.options) return {};
        if (typeof q.options === 'string') {
            try { return JSON.parse(q.options); } catch { return {}; }
        }
        return q.options;
    };

    return (
        <div className="max-w-5xl mx-auto py-12 md:py-20 px-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-10 mb-16 px-4">
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <span className="glass-pill text-[10px] py-1">FINAL EXAM</span>
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-on-surface uppercase italic tracking-tighter leading-none">{exam.title}</h1>
                    <p className="text-on-surface-variant font-black uppercase tracking-[0.3em] text-[10px]">Su'aasha {currentQuestion + 1} ka mid ah {exam.questions.length}</p>
                </div>
                <div className="flex items-center justify-center gap-6 glass bg-surface-container-high/40 px-10 py-6 rounded-[2.5rem] border border-outline-variant shadow-neon-blue">
                    <Clock className="w-6 h-6 text-secondary animate-pulse" />
                    <span className={`text-4xl font-black italic tracking-tighter leading-none min-w-[120px] text-center ${timeLeft < 60 ? 'text-tertiary' : 'text-on-surface'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div className="space-y-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0 }}
                        className="surface-container p-12 md:p-16 rounded-[4rem] shadow-2xl border border-outline-variant relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                        <div className="flex gap-8 mb-12 items-start">
                            <div className="w-16 h-16 bg-surface-container-highest text-secondary rounded-3xl flex items-center justify-center flex-shrink-0 font-black text-2xl border border-outline-variant shadow-neon-blue/30 italic">
                                ?
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-on-surface leading-tight pt-2 uppercase italic tracking-tighter">
                                {question.question_text}
                            </h3>
                        </div>

                        {/* Determine render type: short_answer, true_false, MCQ with options, or fallback text input */}
                        {question.question_type === 'short_answer' || Object.keys(getOptions(question)).length === 0 ? (
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 leading-none">
                                    Ku qor jawaabtaada halkan:
                                </label>
                                <textarea
                                    rows={4}
                                    className="input-field bg-surface-container-high border-outline-variant focus:border-primary text-2xl font-black italic resize-none py-8 px-10 rounded-[2.5rem]"
                                    placeholder="Ku qor jawaabtaada halkan..."
                                    value={answers[question.id] || ''}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        ) : question.question_type === 'true_false' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {['Run', 'Been'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswerChange(option)}
                                        className={`flex flex-col items-center justify-center p-12 rounded-[3.5rem] border-4 transition-all duration-500 group ${answers[question.id] === option
                                                ? option === 'Run' 
                                                    ? 'border-secondary bg-secondary/10 text-secondary shadow-[0_0_50px_rgba(0,227,243,0.2)]' 
                                                    : 'border-tertiary bg-tertiary/10 text-tertiary shadow-[0_0_50px_rgba(255,107,173,0.2)]'
                                                : 'border-outline-variant bg-surface-container-high/40 text-on-surface-variant hover:border-on-surface/20'
                                            }`}
                                    >
                                        <span className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">{option === 'Run' ? '⚡' : '🌑'}</span>
                                        <span className="text-3xl font-black uppercase tracking-[0.2em] italic">{option}</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {Object.entries(getOptions(question)).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleAnswerChange(key)}
                                        className={`flex items-center gap-8 p-8 rounded-[2.5rem] border-2 transition-all duration-300 text-left group ${answers[question.id] === key
                                                ? 'border-secondary bg-secondary/10 shadow-neon-blue'
                                                : 'border-outline-variant bg-surface-container-high/40 hover:border-secondary/30'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 ${answers[question.id] === key ? 'bg-secondary text-surface scale-110 shadow-neon-blue' : 'bg-surface-container-highest text-on-surface-variant group-hover:bg-on-surface/10'
                                            }`}>
                                            {key}
                                        </div>
                                        <span className={`text-xl font-black italic uppercase tracking-tight transition-colors ${answers[question.id] === key ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                                            {value}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-10 bg-surface-container-high/40 p-10 rounded-[3rem] border border-outline-variant shadow-2xl glass">
                    <button
                        disabled={currentQuestion === 0}
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                        className="text-on-surface-variant font-black uppercase italic tracking-widest text-[10px] hover:text-on-surface transition-colors disabled:opacity-20 flex items-center gap-2 group"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Hore u laabo
                    </button>

                    <div className="flex flex-wrap justify-center gap-4">
                        {exam.questions.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all duration-500 ${i === currentQuestion ? 'w-12 bg-secondary shadow-neon-blue' : 'w-2 bg-on-surface/10'
                                    }`}
                            />
                        ))}
                    </div>

                    {currentQuestion < exam.questions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQuestion(prev => prev + 1)}
                            className="btn-energy px-12 py-5 text-[11px] uppercase tracking-[0.2em] flex items-center gap-3"
                        >
                            Su'aasha Xigta <ChevronRight className="w-5 h-5 border-l border-on-surface/20 pl-2" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="btn-energy bg-surface-container-highest border-outline-variant text-on-surface px-12 py-5 text-[11px] uppercase tracking-[0.2em] shadow-neon-pink/20 hover:border-tertiary/40"
                        >
                            {submitting ? 'La soo xaraynayaa...' : 'Xaree Imtixaanka'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TakeExam;
