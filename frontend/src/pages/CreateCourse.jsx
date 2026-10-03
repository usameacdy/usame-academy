import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Upload, 
    ChevronRight, 
    ChevronLeft,
    Check, 
    BookOpen, 
    Plus, 
    Trash2, 
    Settings,
    FileQuestion,
    Layout,
    FileText
} from 'lucide-react';

const CreateCourse = () => {
    const [step, setStep] = useState(1);
    const [courseId, setCourseId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // STEP 1: Course Info
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Programming'
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);

    // STEP 2: Lessons
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState({ title: '', content: '', video_url: '', video_file: null, pdf_file: null, image_file: null });

    // STEP 3: Exam
    const [examId, setExamId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        question_text: '',
        options: { A: '', B: '', C: '', D: '' },
        correct_option: 'A',
        question_type: 'multiple_choice'
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleStep1Submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        if (thumbnail) data.append('thumbnail', thumbnail);

        try {
            const res = await api.post('/courses', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setCourseId(res.data.id);
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.message || 'Khalad ayaa ka dhacay koorsada');
        }
        setLoading(false);
    };

    const addLesson = async () => {
        if (!currentLesson.title || !currentLesson.content) return alert("Fadlan buuxi macluumaadka casharka");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', currentLesson.title);
            formData.append('content', currentLesson.content);
            formData.append('order_index', lessons.length + 1);
            
            if (currentLesson.video_file) {
                formData.append('video', currentLesson.video_file);
            } else {
                formData.append('video_url', currentLesson.video_url);
            }

            if (currentLesson.pdf_file) {
                formData.append('pdf', currentLesson.pdf_file);
            }
            
            if (currentLesson.image_file) {
                formData.append('image', currentLesson.image_file);
            }

            const res = await api.post(`/courses/${courseId}/lessons`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLessons([...lessons, res.data]);
            setCurrentLesson({ title: '', content: '', video_url: '', video_file: null, pdf_file: null, image_file: null });
        } catch {
            alert("Casharka lama raacin kari");
        }
        setLoading(false);
    };

    const deleteLesson = async (lessonId) => {
        if (!window.confirm("Ma hubtaa inaad tirtirto casharkan?")) return;
        setLoading(true);
        try {
            await api.delete(`/courses/lessons/${lessonId}`);
            setLessons(lessons.filter(l => l.id !== lessonId));
        } catch {
            alert("Waa lagu guuldareystay tirtirista casharka.");
        }
        setLoading(false);
    };

    const createExamRecord = async () => {
        if (examId) return;
        setLoading(true);
        try {
            const res = await api.post('/exams', {
                course_id: courseId,
                title: `${formData.title} - Final Assessment`,
                passing_score: 70,
                duration_minutes: 30
            });
            setExamId(res.data.id);
        } catch (err) {
            console.error("Exam creation error:", err);
        }
        setLoading(false);
    };

    const addQuestion = async () => {
        if (!currentQuestion.question_text) return alert("Fadlan qor su'aasha");
        setLoading(true);
        try {
            let activeExamId = examId;
            if (!activeExamId) {
                const res = await api.post('/exams', {
                    course_id: courseId,
                    title: `${formData.title} - Final Assessment`,
                    passing_score: 70,
                    duration_minutes: 30
                });
                activeExamId = res.data.id;
                setExamId(activeExamId);
            }

            const qRes = await api.post(`/exams/${activeExamId}/questions`, currentQuestion);
            setQuestions([...questions, qRes.data]);
            setCurrentQuestion({
                question_text: '',
                options: { A: '', B: '', C: '', D: '' },
                correct_option: 'A',
                question_type: 'multiple_choice'
            });
        } catch (err) {
            console.error("Question addition error:", err);
            alert("Su'aasha lama raacin kari");
        }
        setLoading(false);
    };

    const deleteQuestion = async (questionId) => {
        if (!window.confirm("Ma hubtaa inaad tirtirto su'aashan?")) return;
        setLoading(true);
        try {
            await api.delete(`/exams/questions/${questionId}`);
            setQuestions(questions.filter(q => q.id !== questionId));
        } catch {
            alert("Waa lagu guuldareystay tirtirista su'aasha.");
        }
        setLoading(false);
    };

    const finalizeCourse = async () => {
        setLoading(true);
        if (!examId && courseId) {
            try {
                await createExamRecord();
            } catch (err) {
                console.error("Finalization exam sync failed:", err);
            }
        }
        setLoading(false);
        navigate(`/courses/${courseId}/manage`);
    };

    const steps = [
        { id: 1, label: 'Koorsada', icon: Layout },
        { id: 2, label: 'Casharada', icon: BookOpen },
        { id: 3, label: 'Imtixaanka', icon: FileQuestion }
    ];

    return (
        <div className="max-w-5xl mx-auto py-16 px-6">
            {/* Progress Bar */}
            <div className="mb-20 relative flex justify-between items-center max-w-3xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant/30 -translate-y-1/2 z-0"></div>
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-secondary shadow-neon-blue -translate-y-1/2 z-0 transition-all duration-700 ease-out"
                    style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                ></div>
                
                {steps.map((s) => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${step >= s.id ? 'bg-secondary text-surface border-secondary shadow-neon-blue' : 'bg-surface-container border-outline-variant text-on-surface-variant'}`}>
                            {step > s.id ? <Check className="w-7 h-7" /> : <s.icon className="w-6 h-6" />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${step >= s.id ? 'text-secondary' : 'text-on-surface-variant/40'}`}>{s.label}</span>
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="surface-container p-12 rounded-[4rem] shadow-2xl border border-outline-variant relative overflow-hidden"
                    >
                        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                        <header className="mb-14 text-center">
                            <h1 className="text-5xl font-black text-on-surface mb-3 uppercase italic tracking-tighter leading-none">Bilow Koorsada</h1>
                            <p className="text-on-surface-variant font-medium tracking-[0.1em] text-sm">Geli macluumaadka aasaasiga ah ee koorsada</p>
                        </header>

                        <form onSubmit={handleStep1Submit} className="space-y-10">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2">Magaca Koorsada</label>
                                        <input
                                            type="text"
                                            className="input-field bg-surface-container-high border-outline-variant focus:border-secondary text-on-surface font-bold py-6 px-8 rounded-2xl transition-all"
                                            placeholder="Tusaale: Barashada Adobe Photoshop"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2">Qiimaha ($)</label>
                                            <input
                                                type="number"
                                                className="input-field bg-surface-container-high border-outline-variant focus:border-secondary font-black italic rounded-2xl py-6 px-8"
                                                placeholder="0.00"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2">Qaybta</label>
                                            <select 
                                                className="input-field bg-surface-container-high border-outline-variant focus:border-secondary font-bold rounded-2xl py-6 px-8 appearance-none"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="Programming">Programming</option>
                                                <option value="Design">Design</option>
                                                <option value="Business">Business</option>
                                                <option value="Language">Language</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2">Sawirka Koorsada (Thumbnail)</label>
                                    <div className="group relative aspect-video rounded-[3rem] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center overflow-hidden hover:border-secondary/50 transition-all cursor-pointer bg-surface-container-high/40 glass">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="text-center p-8 space-y-4">
                                                <div className="w-20 h-20 bg-surface-container-highest rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-2 border border-outline-variant group-hover:border-secondary group-hover:rotate-12 transition-all">
                                                    <Upload className="w-10 h-10 text-secondary" />
                                                </div>
                                                <span className="text-[11px] font-black text-on-surface-variant tracking-widest uppercase">Select Media</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-30"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required={!courseId}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2">Sharaxaad Kooban (Description)</label>
                                <textarea
                                    className="input-field bg-surface-container-high border-outline-variant focus:border-secondary min-h-[150px] py-6 px-8 leading-relaxed rounded-3xl text-on-surface-variant"
                                    placeholder="Maxay ardaydu ku baran doonaan koorsadan?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-energy w-full py-6 flex items-center justify-center gap-4 text-xl tracking-[0.2em] font-black italic uppercase transition-all shadow-neon-blue/20"
                            >
                                {loading ? 'DIYAARINTA...' : 'Next: Casharada'} <ChevronRight className="w-7 h-7" />
                            </button>
                        </form>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                        <div className="surface-container p-12 rounded-[4rem] shadow-2xl border border-outline-variant relative overflow-hidden">
                            <div className="absolute -top-24 -left-24 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
                            <header className="mb-14 flex justify-between items-end border-b pb-8 border-outline-variant/30">
                                <div>
                                    <h1 className="text-5xl font-black text-on-surface uppercase italic tracking-tighter leading-none">Casharada</h1>
                                    <p className="text-on-surface-variant font-medium tracking-[0.1em] text-sm mt-3 italic">Ku dar casharada koorsada (Video & Document)</p>
                                </div>
                                <div className="text-secondary font-black text-6xl italic drop-shadow-[0_0_15px_rgba(38,166,154,0.3)]">{lessons.length}</div>
                            </header>

                            <div className="space-y-10 bg-surface-container-high/40 p-12 rounded-[4rem] border border-outline-variant glass">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Cinwaanka Casharka</label>
                                        <input
                                            type="text"
                                            className="input-terminal bg-surface-container border-outline-variant focus:border-secondary text-on-surface py-6 px-10 rounded-[2.5rem] font-bold text-lg italic uppercase tracking-tight"
                                            placeholder="e.g. HORDHACA PHOTOSHOP"
                                            value={currentLesson.title}
                                            onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Video (SOO GALI AMA LINK)</label>
                                        <div className="flex flex-col gap-5">
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="hidden"
                                                    id="video-upload"
                                                    onChange={e => setCurrentLesson({ ...currentLesson, video_file: e.target.files[0] })}
                                                />
                                                <label 
                                                    htmlFor="video-upload"
                                                    className={`input-terminal h-20 bg-surface-container border-2 border-dashed flex items-center justify-center gap-4 cursor-pointer transition-all rounded-[2rem] hover:scale-[1.02] active:scale-95 ${currentLesson.video_file ? 'border-secondary bg-secondary/10 text-secondary shadow-neon-blue' : 'border-outline-variant text-on-surface-variant/40 hover:border-secondary/40'}`}
                                                >
                                                    <Upload className="w-6 h-6" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{currentLesson.video_file ? currentLesson.video_file.name : 'SOO GALI VIDEO (MP4)'}</span>
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-4 px-4">
                                                <div className="flex-grow h-[1px] bg-outline-variant opacity-20"></div>
                                                <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-[0.5em]">AMA LINK</span>
                                                <div className="flex-grow h-[1px] bg-outline-variant opacity-20"></div>
                                            </div>
                                            <input
                                                type="text"
                                                className="input-terminal h-16 bg-surface-container border-outline-variant focus:border-secondary text-on-surface px-10 font-medium italic opacity-60 rounded-2xl text-xs"
                                                placeholder="https://youtube.com/..."
                                                value={currentLesson.video_url}
                                                onChange={(e) => setCurrentLesson({ ...currentLesson, video_url: e.target.value })}
                                                disabled={!!currentLesson.video_file}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">BUUG / PDF (Optional)</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            id="pdf-upload-new"
                                            onChange={e => setCurrentLesson({ ...currentLesson, pdf_file: e.target.files[0] })}
                                        />
                                        <label 
                                            htmlFor="pdf-upload-new"
                                            className={`input-terminal h-16 bg-surface-container border-2 border-dashed flex items-center justify-center gap-4 cursor-pointer transition-all rounded-3xl ${currentLesson.pdf_file ? 'border-secondary bg-secondary/10 text-secondary' : 'border-outline-variant text-on-surface-variant/40'}`}
                                        >
                                            <FileText className="w-5 h-5" />
                                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{currentLesson.pdf_file ? currentLesson.pdf_file.name : 'SOO GALI BUUG (PDF)'}</span>
                                        </label>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">SAWIR (Optional)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="image-upload-new"
                                            onChange={e => setCurrentLesson({ ...currentLesson, image_file: e.target.files[0] })}
                                        />
                                        <label 
                                            htmlFor="image-upload-new"
                                            className={`input-terminal h-16 bg-surface-container border-2 border-dashed flex items-center justify-center gap-4 cursor-pointer transition-all rounded-3xl ${currentLesson.image_file ? 'border-secondary bg-secondary/10 text-secondary' : 'border-outline-variant text-on-surface-variant/40'}`}
                                        >
                                            <Upload className="w-5 h-5" />
                                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{currentLesson.image_file ? currentLesson.image_file.name : 'SOO GALI SAWIR'}</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">NUNXURKA CASHARKA (Content)</label>
                                    <textarea
                                        className="input-terminal bg-surface-container border-outline-variant focus:border-secondary text-on-surface min-h-[160px] py-8 px-10 rounded-[3rem] leading-relaxed text-sm opacity-80"
                                        placeholder="Qor sharaxaadda casharka halkan..."
                                        value={currentLesson.content}
                                        onChange={(e) => setCurrentLesson({ ...currentLesson, content: e.target.value })}
                                    ></textarea>
                                </div>
                                <button
                                    type="button"
                                    onClick={addLesson}
                                    disabled={loading}
                                    className="btn-energy w-full py-8 text-xl font-black italic tracking-[0.3em] uppercase flex items-center justify-center gap-5 transition-all shadow-neon-blue/20"
                                >
                                    <Plus className="w-8 h-8" /> {loading ? 'DHAXGELINTA...' : 'Add Lesson'}
                                </button>
                            </div>

                            <div className="mt-14 space-y-6 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                                {lessons.map((l, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={idx} 
                                        className="p-8 bg-surface-container-high/60 border border-outline-variant/30 rounded-[3.5rem] flex justify-between items-center group hover:border-secondary/40 transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-10 relative z-10">
                                            <span className="w-16 h-16 rounded-2xl bg-surface-container-highest text-secondary border border-outline-variant/40 flex items-center justify-center font-black italic text-2xl shadow-inner">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <h3 className="font-black text-on-surface text-xl uppercase italic tracking-tight group-hover:text-secondary transition-colors">{l.title}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    {l.video_url?.startsWith('/uploads/') && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">Video Ready</span>}
                                                    {l.video_url && !l.video_url.startsWith('/uploads/') && <span className="text-[9px] font-black uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-lg">Cloud Link</span>}
                                                    {l.pdf_url && <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg">Document ✓</span>}
                                                    {l.image_url && <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1 rounded-lg">Media ✓</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => deleteLesson(l.id)}
                                            className="p-5 text-on-surface-variant/30 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all hover:scale-110 active:scale-95"
                                        >
                                            <Trash2 className="w-7 h-7" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-16 pt-10 border-t border-outline-variant/20 flex gap-10">
                                <button onClick={() => setStep(1)} className="btn-energy bg-surface-container-highest border-outline-variant text-on-surface-variant flex-1 py-7 uppercase tracking-widest italic font-black">
                                    <ChevronLeft className="w-6 h-6" /> Back
                                </button>
                                <button onClick={() => { setStep(3); createExamRecord(); }} className="btn-energy flex-1 py-7 uppercase tracking-[0.2em] font-black italic shadow-neon-blue/20">
                                    Step 3: Assessment <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-10"
                    >
                        <div className="surface-container p-12 rounded-[5rem] shadow-2xl border border-outline-variant relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-40 h-40 bg-tertiary/5 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
                             <header className="mb-14 flex justify-between items-end border-b pb-8 border-outline-variant/30">
                                <div>
                                    <h1 className="text-5xl font-black text-on-surface uppercase italic tracking-tighter leading-none">Imtixaanka</h1>
                                    <p className="text-on-surface-variant font-medium tracking-[0.1em] text-sm mt-3">Ku dar su'aalaha imtixaanka finalka ah</p>
                                </div>
                                <div className="text-tertiary font-black text-6xl italic drop-shadow-[0_0_15px_rgba(255,107,173,0.3)]">{questions.length}</div>
                            </header>

                            <div className="space-y-10 bg-surface-container-high/40 p-12 rounded-[4rem] border border-outline-variant glass">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2">Nooca Su'aasha (Type)</label>
                                    <div className="grid grid-cols-3 gap-6">
                                        {[
                                            { id: 'multiple_choice', label: 'ABCD Choice', icon: '⚡' },
                                            { id: 'short_answer', label: 'Short Key', icon: '⌨️' },
                                            { id: 'true_false', label: 'Logic Gate', icon: '⚖️' }
                                        ].map(t => (
                                            <button 
                                                key={t.id}
                                                type="button"
                                                onClick={() => {
                                                    const updates = { question_type: t.id };
                                                    if (t.id === 'true_false') {
                                                        updates.options = { 'Run': 'Run', 'Been': 'Been' };
                                                        updates.correct_option = 'Run';
                                                    } else if (t.id === 'short_answer') {
                                                        updates.options = {};
                                                        updates.correct_option = '';
                                                    } else {
                                                        updates.options = { A: '', B: '', C: '', D: '' };
                                                        updates.correct_option = 'A';
                                                    }
                                                    setCurrentQuestion({ ...currentQuestion, ...updates });
                                                }}
                                                className={`py-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all duration-300 ${currentQuestion.question_type === t.id ? 'border-tertiary bg-tertiary/10 text-tertiary shadow-neon-pink' : 'bg-surface-container-highest border-outline-variant text-on-surface-variant/40 hover:border-tertiary/40'}`}
                                            >
                                                <span className="text-2xl">{t.icon}</span>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2">Su'aasha (Question Text)</label>
                                    <textarea
                                        className="input-field bg-surface-container-high border-outline-variant focus:border-tertiary text-on-surface font-bold py-6 px-10 rounded-[2rem] min-h-[140px]"
                                        placeholder="Qor su'aasha halkan..."
                                        value={currentQuestion.question_text}
                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                                    ></textarea>
                                </div>

                                {currentQuestion.question_type === 'multiple_choice' && (
                                    <div className="grid grid-cols-2 gap-6">
                                        {['A', 'B', 'C', 'D'].map(opt => (
                                            <div key={opt} className="relative group">
                                                <input
                                                    className={`input-field bg-surface-container-high border-outline-variant pl-20 h-20 rounded-2xl font-bold italic transition-all ${currentQuestion.correct_option === opt ? 'border-secondary bg-secondary/10 text-secondary' : 'text-on-surface-variant focus:border-secondary'}`}
                                                    placeholder={`Option ${opt}`}
                                                    value={currentQuestion.options[opt]}
                                                    onChange={e => setCurrentQuestion({
                                                        ...currentQuestion,
                                                        options: { ...currentQuestion.options, [opt]: e.target.value }
                                                    })}
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setCurrentQuestion({ ...currentQuestion, correct_option: opt })}
                                                    className={`absolute left-0 top-0 w-20 h-full rounded-l-2xl flex items-center justify-center font-black italic text-xl transition-all ${currentQuestion.correct_option === opt ? 'bg-secondary text-surface' : 'bg-surface-container-highest text-on-surface-variant border-r border-outline-variant'}`}
                                                >
                                                    {opt}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.question_type === 'true_false' && (
                                    <div className="grid grid-cols-2 gap-8">
                                        {['Run', 'Been'].map(opt => (
                                            <button 
                                                key={opt}
                                                type="button"
                                                onClick={() => setCurrentQuestion({ ...currentQuestion, correct_option: opt })}
                                                className={`py-12 rounded-[3rem] border-4 font-black italic text-3xl transition-all shadow-inner ${currentQuestion.correct_option === opt ? 'bg-secondary/10 border-secondary text-secondary shadow-neon-blue' : 'bg-surface-container-highest border-outline-variant text-on-surface-variant/40'}`}
                                            >
                                                {opt === 'Run' ? '⚡ RUN' : '🌑 BEEN'}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.question_type === 'short_answer' && (
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2">Jawaabta saxda ah (Expectation)</label>
                                        <input
                                            className="input-field bg-surface-container-high border-outline-variant focus:border-tertiary h-20 px-10 font-black italic text-secondary text-2xl uppercase tracking-widest rounded-3xl"
                                            placeholder="Qor jawaabta saxda ah..."
                                            value={currentQuestion.correct_option}
                                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_option: e.target.value })}
                                        />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    disabled={loading}
                                    className="btn-energy w-full py-7 flex items-center justify-center gap-5 text-xl tracking-[0.2em] font-black italic uppercase transition-all shadow-neon-pink/20 hover:border-tertiary/50"
                                    style={{ background: 'linear-gradient(135deg, var(--tertiary), var(--tertiary-container))' }}
                                >
                                    <Plus className="w-8 h-8" /> {loading ? 'DHAXGELINTA...' : 'Add Question'} 
                                </button>
                            </div>

                            <div className="mt-14 space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                {questions.map((q, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={idx} 
                                        className="p-8 bg-surface-container-high/60 border border-outline-variant/30 rounded-[3rem] flex justify-between items-center group hover:border-tertiary/40 transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-1.5 h-full bg-tertiary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-8">
                                            <span className="w-14 h-14 rounded-2xl bg-surface-container-highest text-tertiary border border-outline-variant/40 flex items-center justify-center font-black italic text-xl shadow-inner">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <h3 className="font-black text-on-surface text-lg uppercase tracking-tight line-clamp-1">{q.question_text}</h3>
                                                <p className="text-[10px] font-black uppercase text-tertiary/60 tracking-[0.4em] italic mt-1">{q.question_type.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => deleteQuestion(q.id)}
                                            className="p-4 text-on-surface-variant/30 hover:text-tertiary hover:bg-tertiary/10 rounded-2xl transition-all"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className="mt-16 pt-10 border-t border-outline-variant/20 flex gap-10">
                                <button onClick={() => setStep(2)} className="btn-energy bg-surface-container-highest border-outline-variant text-on-surface-variant flex-1 py-7 uppercase tracking-widest italic font-black">
                                    <ChevronLeft className="w-6 h-6" /> Dib u laabo
                                </button>
                                <button onClick={finalizeCourse} className="btn-energy flex-1 py-7 uppercase tracking-[0.3em] font-black italic shadow-neon-blue/20">
                                    HADDA LAUNCH GAREE <Check className="w-9 h-9 border-l border-on-surface/20 pl-4 ml-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreateCourse;
