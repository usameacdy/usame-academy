import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Plus,
    Video,
    FileText,
    Trash2,
    ChevronDown,
    ChevronUp,
    Save,
    Layout,
    CheckCircle2,
    XCircle,
    Settings as SettingsIcon,
    AlertCircle,
    HelpCircle,
    Upload,
    BookOpen,
    FileQuestion
} from 'lucide-react';
import Loading from '../components/Loading';

const CourseManager = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('lessons'); // 'lessons', 'exam', or 'settings'
    const [editCourse, setEditCourse] = useState({ title: '', description: '', price: '', category: '' });
    const [updating, setUpdating] = useState(false);

    // Form States
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [newLesson, setNewLesson] = useState({ title: '', content: '', video_url: '', video_file: null, pdf_file: null, image_file: null, order_index: 0 });
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        question_text: '',
        options: { A: '', B: '', C: '', D: '' },
        correct_option: 'A',
        question_type: 'multiple_choice' // 'multiple_choice', 'short_answer', 'true_false'
    });

    const fetchData = useCallback(async () => {
        try {
            const cRes = await api.get(`/courses/${id}`);
            const courseData = cRes.data;
            setCourse(courseData);
            setEditCourse({
                title: courseData.title,
                description: courseData.description,
                price: courseData.price,
                category: courseData.category || ''
            });
            setLessons((courseData.lessons || []).sort((a, b) => a.order_index - b.order_index));
            
            // Try fetch exam
            try {
                const eRes = await api.get(`/exams/course/${id}`);
                setExam(eRes.data);
                if (eRes.data.id) {
                    const qRes = await api.get(`/exams/${eRes.data.id}/questions`);
                    setQuestions(qRes.data);
                }
            } catch {
                console.log("No exam yet");
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
        setLoading(false);
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newLesson.title);
            formData.append('content', newLesson.content);
            formData.append('order_index', lessons.length + 1);
            
            if (newLesson.video_file) {
                formData.append('video', newLesson.video_file);
            } else {
                formData.append('video_url', newLesson.video_url);
            }

            if (newLesson.pdf_file) {
                formData.append('pdf', newLesson.pdf_file);
            }
            
            if (newLesson.image_file) {
                formData.append('image', newLesson.image_file);
            }

            await api.post(`/courses/${id}/lessons`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setShowLessonForm(false);
            setNewLesson({ title: '', content: '', video_url: '', video_file: null, pdf_file: null, image_file: null, order_index: 0 });
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to add lesson");
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            let examId = exam?.id;
            if (!examId) {
                const eRes = await api.post(`/exams`, {
                    course_id: id,
                    title: `${course.title} Final Exam`,
                    passing_score: 55,
                    duration_minutes: 30
                });
                examId = eRes.data.id;
                setExam(eRes.data);
            }
            await api.post(`/exams/${examId}/questions`, newQuestion);
            setShowQuestionForm(false);
            setNewQuestion({ 
                question_text: '', 
                options: { A: '', B: '', C: '', D: '' }, 
                correct_option: 'A',
                question_type: 'multiple_choice'
            });
            fetchData();
        } catch {
            alert("Failed to add question");
        }
    };

    const deleteLesson = async (lessonId) => {
        if (!window.confirm("Ma hubtaa inaad tirtirto casharkan?")) return;
        try {
            await api.delete(`/courses/lessons/${lessonId}`);
            alert("Casharka waa la tirtiray!");
            fetchData();
        } catch (err) {
            console.error("Delete Lesson Error:", err);
            alert("Waa lagu guuldareystay tirtirista casharka: " + (err.response?.data?.message || err.message));
        }
    };

    const deleteQuestion = async (questionId) => {
        if (!window.confirm("Ma hubtaa inaad tirtirto su'aashan?")) return;
        try {
            await api.delete(`/exams/questions/${questionId}`);
            alert("Su'aasha waa la tirtiray!");
            fetchData();
        } catch (err) {
            console.error("Delete Question Error:", err);
            alert("Waa lagu guuldareystay tirtirista su'aasha: " + (err.response?.data?.message || err.message));
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await api.put(`/courses/${id}`, editCourse);
            alert("Koorsada waa la cusboonaysiiyay!");
            fetchData();
        } catch {
            alert("Failed to update course");
        }
        setUpdating(false);
    };

    if (loading) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto py-16 px-6 space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-end bg-surface-container/60 backdrop-blur-xl p-12 rounded-[4rem] border border-outline-variant shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="space-y-4 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-on-surface tracking-tighter italic uppercase leading-tight">
                        <span className="text-secondary">MAAMUL:</span> <br />
                        {course?.title}
                    </h1>
                    <p className="text-on-surface-variant font-black uppercase tracking-[0.3em] text-xs opacity-60">Maamul casharrada iyo nidaamka imtixaanka</p>
                </div>
                <div className="flex flex-wrap gap-4 p-3 bg-surface rounded-[2.5rem] border border-outline-variant shadow-inner mt-10 lg:mt-0 relative z-10">
                    {[
                        { id: 'lessons', label: 'Casharrada', icon: BookOpen },
                        { id: 'exam', label: 'Imtixaanka', icon: FileQuestion },
                        { id: 'settings', label: 'Habaynta', icon: SettingsIcon }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id)}
                            className={`px-10 py-5 rounded-[1.5rem] font-black uppercase italic tracking-widest text-[11px] transition-all duration-500 border ${activeSection === tab.id ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' : 'text-on-surface-variant/40 border-transparent hover:text-on-surface'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeSection === 'lessons' ? (
                    <motion.div
                        key="lessons"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-10"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center bg-surface-container-high/40 p-10 rounded-[3.5rem] border border-outline-variant shadow-2xl glass">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-secondary/10 text-secondary border border-secondary/20 rounded-[1.5rem] flex items-center justify-center font-black text-4xl italic tracking-tighter shadow-inner">
                                    {lessons.length}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-on-surface italic uppercase tracking-tighter">Nidaamka Casharrada</h2>
                                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40">Tirtir ama ku dar casharro cusub</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowLessonForm(!showLessonForm)}
                                className="btn-energy flex items-center gap-3 py-6 px-10 font-black italic uppercase tracking-[0.2em] shadow-2xl shadow-secondary/10 mt-8 md:mt-0 hover:scale-105 active:scale-95 transition-all text-xs"
                            >
                                <Plus className="w-6 h-6" /> Ku dar Cashar ⚡
                            </button>
                        </div>

                        {showLessonForm && (
                            <motion.form
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onSubmit={handleAddLesson}
                                className="bg-surface-container p-12 rounded-[4rem] border border-secondary/20 shadow-[0_40px_100px_rgba(0,0,0,0.4)] space-y-10 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl"></div>
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Cinwaanka Casharka</label>
                                        <input
                                            className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-6 px-10 rounded-[2.5rem] font-bold text-lg italic uppercase tracking-tight"
                                            placeholder="e.g. INTRODUCTION TO VARIABLES"
                                            value={newLesson.title}
                                            onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Muuqaalka (Video)</label>
                                        <div className="flex flex-col gap-4">
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    className="hidden"
                                                    id="video-upload"
                                                    onChange={e => setNewLesson({ ...newLesson, video_file: e.target.files[0] })}
                                                />
                                                <label 
                                                    htmlFor="video-upload"
                                                    className={`input-terminal h-20 bg-surface border-2 border-dashed flex items-center justify-center gap-4 cursor-pointer transition-all rounded-[2rem] hover:scale-[1.02] active:scale-95 ${newLesson.video_file ? 'border-secondary bg-secondary/10 text-secondary shadow-neon-blue' : 'border-outline-variant text-on-surface-variant/40 hover:border-secondary/40'}`}
                                                >
                                                    <Upload className="w-5 h-5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{newLesson.video_file ? newLesson.video_file.name : 'SOO GALI VIDEO (MP4)'}</span>
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-4 px-4">
                                                <div className="flex-grow h-[1px] bg-outline-variant opacity-10"></div>
                                                <span className="text-[8px] font-black text-on-surface-variant/30 uppercase tracking-[0.5em]">AMA LINK</span>
                                                <div className="flex-grow h-[1px] bg-outline-variant opacity-10"></div>
                                            </div>
                                            <input
                                                className="input-terminal h-16 bg-surface-container border-outline-variant focus:border-secondary text-on-surface px-10 font-medium italic opacity-60 rounded-2xl text-xs"
                                                placeholder="YouTube/Vimeo Link..."
                                                value={newLesson.video_url}
                                                onChange={e => setNewLesson({ ...newLesson, video_url: e.target.value })}
                                                disabled={!!newLesson.video_file}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Buugaag / PDF</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    className="hidden"
                                                    id="pdf-upload"
                                                    onChange={e => setNewLesson({ ...newLesson, pdf_file: e.target.files[0] })}
                                                />
                                                <label 
                                                    htmlFor="pdf-upload"
                                                    className={`input-terminal h-16 bg-surface border-2 border-dashed flex items-center justify-center gap-4 cursor-pointer transition-all rounded-3xl ${newLesson.pdf_file ? 'border-secondary bg-secondary/10 text-secondary' : 'border-outline-variant text-on-surface-variant/40'}`}
                                                >
                                                    <FileText className="w-5 h-5" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{newLesson.pdf_file ? newLesson.pdf_file.name : 'SOO GALI BUUG (PDF)'}</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Sawir Sharaxaad ah</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="image-upload"
                                                    onChange={e => setNewLesson({ ...newLesson, image_file: e.target.files[0] })}
                                                />
                                                <label 
                                                    htmlFor="image-upload"
                                                    className={`input-terminal h-16 bg-surface border-2 border-dashed flex items-center justify-center gap-4 cursor-pointer transition-all rounded-3xl ${newLesson.image_file ? 'border-secondary bg-secondary/10 text-secondary' : 'border-outline-variant text-on-surface-variant/40'}`}
                                                >
                                                    <Layout className="w-5 h-5" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">{newLesson.image_file ? newLesson.image_file.name : 'SOO GALI SAWIR'}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Faahfaahinta Casharka</label>
                                        <textarea
                                            className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface min-h-[220px] py-8 px-10 rounded-[3rem] leading-relaxed text-sm opacity-80"
                                            placeholder="Write lesson content here..."
                                            value={newLesson.content}
                                            onChange={e => setNewLesson({ ...newLesson, content: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                                
                                <div className="flex gap-6 justify-end pt-8 border-t border-outline-variant/10">
                                    <button type="button" onClick={() => setShowLessonForm(false)} className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-red-500 transition-colors">DIID</button>
                                    <button type="submit" className="btn-energy px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] italic shadow-2xl shadow-secondary/10 rounded-2xl">ABUUR CASHARKA ⚡</button>
                                </div>
                            </motion.form>
                        )}

                        <div className="grid gap-6">
                            {lessons.map((lesson, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={lesson.id} 
                                    className="bg-surface-container-high/40 p-10 rounded-[3.5rem] border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between group hover:border-secondary/40 transition-all relative overflow-hidden shadow-xl"
                                >
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-center gap-10">
                                        <div className="w-16 h-16 bg-surface rounded-2xl text-secondary border border-outline-variant/40 flex items-center justify-center font-black italic text-2xl shadow-inner group-hover:bg-secondary group-hover:text-white transition-all">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-2xl text-on-surface italic uppercase tracking-tighter group-hover:text-secondary transition-colors leading-none">{lesson.title}</h3>
                                            <div className="flex flex-wrap items-center gap-6 mt-4 opacity-50">
                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Video className="w-4 h-4" /> {lesson.video_url ? 'Video Ready' : 'Text Only'}</span>
                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><FileText className="w-4 h-4" /> {lesson.pdf_url ? 'Resource ✓' : 'No PDF'}</span>
                                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Layout className="w-4 h-4" /> {lesson.image_url ? 'Media ✓' : 'Base Layout'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-8 md:mt-0 relative z-10">
                                        <button className="w-14 h-14 bg-surface text-on-surface-variant hover:text-secondary hover:border-secondary/40 border border-outline-variant/30 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl">
                                            <Save className="w-6 h-6" />
                                        </button>
                                        {user?.role === 'admin' && (
                                            <button onClick={() => deleteLesson(lesson.id)} className="w-14 h-14 bg-surface text-on-surface-variant hover:text-red-500 hover:border-red-500/40 border border-outline-variant/30 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-xl">
                                                <Trash2 className="w-6 h-6" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : activeSection === 'settings' ? (
                    <motion.div
                        key="settings"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto"
                    >
                        <form onSubmit={handleUpdateCourse} className="bg-surface-container p-14 rounded-[4rem] border border-outline-variant shadow-[0_40px_100px_rgba(0,0,0,0.5)] space-y-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 blur-[50px]"></div>
                            <div className="flex items-center gap-6 mb-4">
                                <div className="w-16 h-16 bg-secondary/10 text-secondary border border-secondary/20 rounded-2xl flex items-center justify-center shadow-inner">
                                    <SettingsIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-on-surface uppercase italic tracking-tighter">Habaynta Guud</h2>
                                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40">Cusboonaysii macluumaadka koorsada</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Cinwaanka Koorsada</label>
                                    <input
                                        className="input-terminal py-6 px-10 text-lg font-black uppercase italic tracking-tighter"
                                        value={editCourse.title}
                                        onChange={e => setEditCourse({ ...editCourse, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Faahfaahinta</label>
                                    <textarea
                                        className="input-terminal min-h-[180px] py-8 px-10 leading-relaxed text-sm opacity-80"
                                        value={editCourse.description}
                                        onChange={e => setEditCourse({ ...editCourse, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Qiimaha ($)</label>
                                        <input
                                            type="number"
                                            className="input-terminal h-20 text-2xl font-black italic"
                                            value={editCourse.price}
                                            onChange={e => setEditCourse({ ...editCourse, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Nooca (Category)</label>
                                        <select
                                            className="input-terminal h-20 appearance-none font-black italic tracking-widest px-10 cursor-pointer"
                                            value={editCourse.category}
                                            onChange={e => setEditCourse({ ...editCourse, category: e.target.value })}
                                        >
                                            <option value="">Dooro Nooca</option>
                                            <option value="Programming">Barnaamijyada (Code)</option>
                                            <option value="Design">Nashqadaynta (Design)</option>
                                            <option value="Business">Ganacsiga (Biz)</option>
                                            <option value="Other">Kuwa kale (Etc)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-outline-variant/10 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="btn-energy px-16 py-6 flex items-center gap-4 text-sm font-black italic uppercase tracking-[0.3em] shadow-2xl shadow-secondary/10 hover:scale-105 active:scale-95 transition-all"
                                >
                                    {updating ? 'CUSBOONAYSIIN...' : 'KAYDI ISBEDELKA'} ⚡
                                    <Save className="w-6 h-6" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="exam"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-10"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center bg-surface-container-high/40 p-10 rounded-[3.5rem] border border-outline-variant shadow-2xl glass">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-[1.5rem] flex items-center justify-center font-black text-4xl italic tracking-tighter shadow-inner">
                                    {questions.length}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-on-surface italic uppercase tracking-tighter">Qaabka Imtixaanka</h2>
                                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-40">Dhis imtixaanka finalka ah</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowQuestionForm(!showQuestionForm)}
                                className="btn-energy flex items-center gap-3 py-6 px-10 font-black italic uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/10 mt-8 md:mt-0 hover:scale-105 active:scale-95 transition-all text-xs"
                                style={{ background: 'linear-gradient(135deg, var(--tertiary), var(--tertiary-container))' }}
                            >
                                <Plus className="w-6 h-6" /> Ku dar Su'aal ⚡
                            </button>
                        </div>

                        {showQuestionForm && (
                            <motion.form
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onSubmit={handleAddQuestion}
                                className="bg-surface-container p-12 rounded-[4rem] border border-tertiary/20 shadow-[0_40px_100px_rgba(0,0,0,0.4)] space-y-10 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 blur-3xl"></div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Qoraalka Su'aasha</label>
                                    <textarea
                                        className="input-terminal bg-surface border-outline-variant focus:border-tertiary text-on-surface font-bold py-8 px-10 rounded-[3rem] min-h-[160px] leading-relaxed text-lg italic uppercase tracking-tight"
                                        placeholder="Halkan ku qor su'aasha..."
                                        value={newQuestion.question_text}
                                        onChange={e => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Nooca Su'aasha (Question Type)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { id: 'multiple_choice', label: 'ABCD (MCQ)', icon: '🔠' },
                                            { id: 'short_answer', label: 'Suaal & Jawaab', icon: '✍️' },
                                            { id: 'true_false', label: 'Run ama Been', icon: '⚖️' }
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => {
                                                    const updates = { question_type: type.id };
                                                    if (type.id === 'true_false') {
                                                        updates.options = { 'Run': 'Run', 'Been': 'Been' };
                                                        updates.correct_option = 'Run';
                                                    } else if (type.id === 'short_answer') {
                                                        updates.options = {};
                                                        updates.correct_option = '';
                                                    } else {
                                                        updates.options = { A: '', B: '', C: '', D: '' };
                                                        updates.correct_option = 'A';
                                                    }
                                                    setNewQuestion({ ...newQuestion, ...updates });
                                                }}
                                                className={`py-8 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all duration-300 ${newQuestion.question_type === type.id ? 'border-tertiary bg-tertiary/10 text-tertiary shadow-neon-pink' : 'bg-surface border-outline-variant/30 text-on-surface-variant/40 hover:border-tertiary/40'}`}
                                            >
                                                <span className="text-3xl">{type.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {newQuestion.question_type === 'multiple_choice' && (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {['A', 'B', 'C', 'D'].map(opt => (
                                            <div key={opt} className="relative group">
                                                <input
                                                    className={`input-terminal h-18 bg-surface-container-high border-outline-variant pl-20 pr-10 rounded-2xl font-bold italic transition-all ${newQuestion.correct_option === opt ? 'border-secondary bg-secondary/10 text-secondary' : 'text-on-surface-variant focus:border-secondary'}`}
                                                    placeholder={`Choice ${opt}`}
                                                    value={newQuestion.options[opt]}
                                                    onChange={e => setNewQuestion({
                                                        ...newQuestion,
                                                        options: { ...newQuestion.options, [opt]: e.target.value }
                                                    })}
                                                    required
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setNewQuestion({ ...newQuestion, correct_option: opt })}
                                                    className={`absolute left-0 top-0 w-20 h-full rounded-l-2xl flex items-center justify-center font-black italic text-xl transition-all ${newQuestion.correct_option === opt ? 'bg-secondary text-surface' : 'bg-surface-container-highest text-on-surface-variant border-r border-outline-variant'}`}
                                                >
                                                    {opt}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {newQuestion.question_type === 'true_false' && (
                                    <div className="grid grid-cols-2 gap-10">
                                        {['Run', 'Been'].map(opt => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setNewQuestion({ ...newQuestion, correct_option: opt })}
                                                className={`py-12 rounded-[2.5rem] border-4 font-black italic text-2xl transition-all shadow-inner ${newQuestion.correct_option === opt ? 'bg-secondary/10 border-secondary text-secondary shadow-neon-blue' : 'bg-surface-container-high border-outline-variant text-on-surface-variant/40'}`}
                                            >
                                                {opt === 'Run' ? '✅ RUN (TRUE)' : '❌ BEEN (FALSE)'}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {newQuestion.question_type === 'short_answer' && (
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] px-2 ml-2">Jawaabta saxda ah (Expectation)</label>
                                        <input
                                            className="input-terminal h-20 px-10 font-black italic text-secondary text-2xl uppercase tracking-widest rounded-3xl"
                                            placeholder="Enter correct answer..."
                                            value={newQuestion.correct_option}
                                            onChange={e => setNewQuestion({ ...newQuestion, correct_option: e.target.value })}
                                            required
                                        />
                                        <p className="text-[10px] text-on-surface-variant font-black italic uppercase tracking-widest opacity-40 ml-4">CASE-INSENSITIVE MATCHING ACTIVE</p>
                                    </div>
                                )}
                                
                                <div className="flex gap-6 justify-end pt-8 border-t border-outline-variant/10">
                                    <button type="button" onClick={() => setShowQuestionForm(false)} className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-red-500 transition-colors">CANCEL</button>
                                    <button type="submit" className="btn-energy px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] italic shadow-2xl shadow-tertiary/10 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--tertiary), var(--tertiary-container))' }}>ADD QUESTION ⚡</button>
                                </div>
                            </motion.form>
                        )}

                        <div className="grid gap-8">
                            {questions.map((q, idx) => (
                                <div key={q.id} className="bg-surface-container-high/40 p-10 rounded-[3.5rem] border border-outline-variant/30 space-y-10 group hover:border-tertiary/40 transition-all relative overflow-hidden shadow-xl">
                                    <div className="absolute top-0 right-0 w-1.5 h-full bg-tertiary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-8">
                                            <span className="w-16 h-16 bg-surface rounded-2xl text-tertiary border border-outline-variant/40 flex items-center justify-center font-black italic text-2xl shadow-inner group-hover:bg-tertiary group-hover:text-white transition-all">
                                                {idx + 1}
                                            </span>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-on-surface italic uppercase tracking-tighter group-hover:text-tertiary transition-colors leading-none pt-2">{q.question_text}</h3>
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-40">{q.question_type.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                        {user?.role === 'admin' && (
                                            <button onClick={() => deleteQuestion(q.id)} className="w-12 h-12 bg-surface text-on-surface-variant hover:text-red-500 hover:border-red-500/40 border border-outline-variant/30 rounded-xl flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {q.question_type === 'short_answer' ? (
                                            <div className="col-span-2 p-8 rounded-[2rem] border-2 border-secondary/20 bg-secondary/10 flex items-center justify-between shadow-inner">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-10 h-10 bg-secondary text-white rounded-lg flex items-center justify-center shadow-lg"><CheckCircle2 className="w-6 h-6" /></div>
                                                    <span className="text-lg font-black text-secondary italic tracking-tight uppercase">Correct Answer: {q.correct_option}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            Object.entries(q.options).map(([key, val]) => (
                                                <div key={key} className={`p-8 rounded-[2rem] border-2 flex items-center justify-between transition-all duration-500 ${q.correct_option === key ? 'border-secondary bg-secondary/10 shadow-inner' : 'border-outline-variant bg-surface/30 opacity-60'}`}>
                                                    <div className="flex items-center gap-5">
                                                        <span className={`w-12 h-12 rounded-xl flex items-center justify-center font-black italic text-xl ${q.correct_option === key ? 'bg-secondary text-white shadow-lg' : 'bg-surface-container text-on-surface-variant/40 shadow-inner border border-outline-variant/20'}`}>{key}</span>
                                                        <span className={`font-black uppercase italic tracking-tight text-lg ${q.correct_option === key ? 'text-secondary' : 'text-on-surface-variant/40'}`}>{val}</span>
                                                    </div>
                                                    {q.correct_option === key && <CheckCircle2 className="w-6 h-6 text-secondary scale-125 drop-shadow-[0_0_8px_rgba(38,166,154,0.4)]" />}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                            {questions.length === 0 && !showQuestionForm && (
                                <div className="text-center py-40 bg-surface-container rounded-[4rem] border border-dashed border-outline-variant/40 space-y-8 glass">
                                    <HelpCircle className="w-24 h-24 text-on-surface-variant mx-auto opacity-10" />
                                    <p className="text-on-surface-variant font-black uppercase italic tracking-[0.4em] opacity-30 text-sm">Wali wax su'aalo ah laguma darin imtixaankan.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseManager;
