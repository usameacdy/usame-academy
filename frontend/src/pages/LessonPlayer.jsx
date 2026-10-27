import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Play,
    FileText,
    Video,
    Layout,
    Menu,
    X,
    Link as LinkIcon,
    Download,
    MessageSquare,
    HelpCircle,
    Send,
    ThumbsUp,
    BookOpen,
    FileDown,
    Search,
    Sparkles,
    Clock,
    UserCheck,
    Share2,
    RefreshCw,
    SlidersHorizontal,
    Check
} from 'lucide-react';

const SAMPLE_VIDEO_FALLBACK = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // Extract src if it's a full iframe tag
    if (typeof url === 'string' && url.includes('<iframe')) {
        const srcMatch = url.match(/src=["']([^"']+)["']/);
        if (srcMatch) url = srcMatch[1];
    }

    if (url.includes('/embed/') || url.includes('player.vimeo.com')) return url;
    
    // Comprehensive YouTube Regex (Watch, Shorts, Live, v=, etc.)
    const ytMatch = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_\-]{11})/
    );
    if (ytMatch) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&autoplay=1`;
    }
    
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    if (url.startsWith('http')) return url;
    return url;
};

const isDirectVideoFile = (url) =>
    url && (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url) || url.includes('/uploads/') || url.includes('gtv-videos-bucket'));

const getFullVideoSrc = (url) => {
    if (!url) return SAMPLE_VIDEO_FALLBACK;
    if (url.startsWith('http')) return url;
    
    let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    let backendUrl = apiUrl.replace(/\/api\/?$/, '');
    if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);
    
    const relativeUrl = url.startsWith('/') ? url : `/${url}`;
    return `${backendUrl}${encodeURI(relativeUrl)}`;
};

const FALLBACK_COURSES_DATA = {
    '1': {
        id: '1',
        title: 'Mastering React & Next.js',
        lessons: [
            { id: 'react-1', title: 'Introduction to the Course', content: 'Ku soo dhawoow koorsada buuxda ee React & Next.js. Casharkan waxaan ku baran doonaa aasaaska, agabyada aynu isticmaalayno iyo habka loo habeeyo jawiga shaqada (Node.js, VS Code & Vite).', video_url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
            { id: 'react-2', title: 'React Fundamentals & Components', content: 'Casharkani wuxuu si faahfaahsan u sharaxayaa sida loo dhiso React Components, isticmaalka Props iyo habka State-ka loogu maamulo gudaha qaybaha.', video_url: 'https://www.youtube.com/watch?v=SqcY0GlETPk' },
            { id: 'react-3', title: 'Hooks Deep Dive (useState & useEffect)', content: 'Hooks waa lafdhabarta React-ka casriga ah. Halkan waxaad ku baran doontaa useState, useEffect iyo xeerarka ugu muhiimsan ee maamulka xogta.', video_url: 'https://www.youtube.com/watch?v=LlvBzyy-558' }
        ]
    },
    '2': {
        id: '2',
        title: 'UI/UX Design Masterclass',
        lessons: [
            { id: 'ui-1', title: 'Introduction to UI/UX Principles', content: 'Fahamka qawaaniinta asaasiga ah ee naqshadaynta: Visual Hierarchy, Typography, White Space iyo Color Theory.', video_url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU' },
            { id: 'ui-2', title: 'Figma Essentials & Auto-Layout', content: 'Baro sida loogu shaqeeyo Figma casri ah adigoo adeegsanaya Auto-Layout, Components iyo Design Tokens.', video_url: 'https://www.youtube.com/watch?v=HZuk6Wkx_Eg' },
            { id: 'ui-3', title: 'Creating Interactive Prototypes', content: 'Dhisidda prototypes dhab ah oo leh animations iyo transitions aad macaamiisha ugu soo bandhigi karto.', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
        ]
    },
    '3': {
        id: '3',
        title: 'Digital Marketing Pro',
        lessons: [
            { id: 'mkt-1', title: 'Fundamentals of Digital Marketing', content: 'Fahamka suuqgeynta dhijitaalka ah, barashada macaamiisha bartilmaameedka ah iyo sida loo qorsheeyo olole guuleysta.', video_url: 'https://www.youtube.com/watch?v=bixR-KIJKYM' },
            { id: 'mkt-2', title: 'Search Engine Optimization (SEO)', content: 'Sidee website-kaaga ama ganacsigaaga looga dhigaa midka koowaad ee kasoo baxa raadinta Google.', video_url: 'https://www.youtube.com/watch?v=xsVTqzratPs' },
            { id: 'mkt-3', title: 'Social Media Ads & Campaigns', content: 'Qorsheynta iyo socodsiinta xayeysiisyada Meta (Facebook/Instagram) iyo TikTok Ads oo faa\'iido leh.', video_url: 'https://www.youtube.com/watch?v=2vpH1d3tH7A' }
        ]
    }
};

const LessonPlayer = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [activeTab, setActiveTab] = useState('video'); // 'video' | 'notes' | 'resources' | 'qna'
    const [videoError, setVideoError] = useState(false);
    const [useDirectPlayer, setUseDirectPlayer] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    
    // Q&A State
    const [questions, setQuestions] = useState([
        {
            id: 1,
            user: "Usaame Xaaji",
            avatar: "UX",
            time: "2 saacadood ka hor",
            title: "Sidee ayaan u soo download-gareeyaa buugga casharkan?",
            content: "Casharka markaynu dhameysano ma jiraa PDF buug ah oo aynu kala soo degi karno qeybta Resources-ka?",
            likes: 4,
            userLiked: false,
            answered: true,
            answers: [
                {
                    id: 101,
                    user: "Ustaad Khaalid (Instructor)",
                    isInstructor: true,
                    time: "1 saac ka hor",
                    content: "Waa taa! Qaybta 'Buugga & Nootada' ama 'Resources' ka eeg, waxaad ka heli doontaa button-ka 'Download PDF Module' oo aad si toos ah u la soo degi karto."
                }
            ]
        },
        {
            id: 2,
            user: "Caasha Jaamac",
            avatar: "CJ",
            time: "Shalay",
            title: "Qaybta 2-aad ee koodhka dib miyaa loo eegi karaa?",
            content: "Koodhkii lagu sharaxayay fiidiyowga qaybtiisii labaad halkaan ma ka helayaa?",
            likes: 2,
            userLiked: false,
            answered: false,
            answers: []
        }
    ]);
    const [newQuestionTitle, setNewQuestionTitle] = useState("");
    const [newQuestionContent, setNewQuestionContent] = useState("");
    const [qnaSearch, setQnaSearch] = useState("");
    const [showQnaModal, setShowQnaModal] = useState(false);
    const [replyText, setReplyText] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setVideoError(false);
                const [courseRes, lessonRes] = await Promise.all([
                    api.get(`/courses/${courseId}`),
                    api.get(`/courses/lessons/${lessonId}`)
                ]);
                if (courseRes.data && lessonRes.data) {
                    const cLesson = lessonRes.data;
                    setCourse(courseRes.data);
                    setCurrentLesson(cLesson);
                    setCompleted(false);

                    if (cLesson.video_url !== null && cLesson.video_url !== undefined) setActiveTab('video');
                    else if (cLesson.pdf_url) setActiveTab('notes');
                    else setActiveTab('content');

                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.warn('Backend lesson fetch failed, checking fallback lessons:', err.message);
                if (err.response?.status === 403) {
                    alert('Koorsodan kuma diwaangelin. Lacagta bixi horta.');
                    navigate(`/courses/${courseId}`);
                    return;
                }
            }

            // Fallback course & lesson resolution
            const matchedCourse = FALLBACK_COURSES_DATA[courseId] || 
                                  Object.values(FALLBACK_COURSES_DATA).find(c => c.id === courseId || courseId?.includes('c871a169') || courseId?.includes('react')) || 
                                  FALLBACK_COURSES_DATA['1'];
            
            const matchedLesson = (matchedCourse.lessons || []).find(l => String(l.id) === String(lessonId)) || 
                                  matchedCourse.lessons[0];

            setCourse(matchedCourse);
            setCurrentLesson(matchedLesson);
            setCompleted(false);
            setActiveTab('video');
            setLoading(false);
        };
        fetchData();
    }, [courseId, lessonId, navigate]);

    const handleComplete = async () => {
        try {
            await api.post(`/courses/lessons/${lessonId}/complete`);
        } catch (err) {
            console.warn('Backend complete call failed:', err.message);
        }

        setCompleted(true);
        const lessons = course?.lessons || [];
        const currentIndex = lessons.findIndex(l => String(l.id) === String(lessonId));
        if (currentIndex < lessons.length - 1) {
            setTimeout(() => navigate(`/courses/${courseId}/lessons/${lessons[currentIndex + 1].id}`), 500);
        } else {
            setTimeout(() => {
                alert('🎉 Hambalyo! Dhammaan casharradii waad dhamaysatay. Hadda qaado imtixaanka shahaadada!');
                navigate(`/courses/${courseId}/exam`);
            }, 500);
        }
    };

    const handleAddQuestion = (e) => {
        e.preventDefault();
        if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;
        const newQ = {
            id: Date.now(),
            user: "Arday (Aad joogtid)",
            avatar: "ME",
            time: "Hadda cusub",
            title: newQuestionTitle,
            content: newQuestionContent,
            likes: 0,
            userLiked: false,
            answered: false,
            answers: []
        };
        setQuestions([newQ, ...questions]);
        setNewQuestionTitle("");
        setNewQuestionContent("");
        setShowQnaModal(false);
    };

    const handleLikeQuestion = (id) => {
        setQuestions(questions.map(q => {
            if (q.id === id) {
                return {
                    ...q,
                    likes: q.userLiked ? q.likes - 1 : q.likes + 1,
                    userLiked: !q.userLiked
                };
            }
            return q;
        }));
    };

    const handleAddReply = (questionId) => {
        const text = replyText[questionId];
        if (!text || !text.trim()) return;

        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const newReply = {
                    id: Date.now(),
                    user: "Arday",
                    isInstructor: false,
                    time: "Hadda",
                    content: text
                };
                return {
                    ...q,
                    answered: true,
                    answers: [...q.answers, newReply]
                };
            }
            return q;
        }));

        setReplyText({ ...replyText, [questionId]: "" });
    };

    const goToLesson = (lesson) => navigate(`/courses/${courseId}/lessons/${lesson.id}`);

    const lessons = course?.lessons || [];
    const currentIndex = lessons.findIndex(l => String(l.id) === String(lessonId));
    const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

    const rawVideoUrl = currentLesson?.video_url || SAMPLE_VIDEO_FALLBACK;
    const embedUrl = currentLesson ? getEmbedUrl(rawVideoUrl) : null;
    const directVideo = rawVideoUrl && isDirectVideoFile(rawVideoUrl);
    const videoSource = videoError ? SAMPLE_VIDEO_FALLBACK : getFullVideoSrc(rawVideoUrl);

    const filteredQuestions = questions.filter(q => 
        q.title.toLowerCase().includes(qnaSearch.toLowerCase()) || 
        q.content.toLowerCase().includes(qnaSearch.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-secondary border-b-4 border-secondary/20 shadow-neon-blue"></div>
            <p className="mt-4 font-black uppercase text-xs tracking-widest text-on-surface-variant/60">Soo raraya casharka...</p>
        </div>
    );

    if (!currentLesson) return <div className="p-10 text-center text-xl font-black text-on-surface uppercase italic">Casharka lama helin</div>;

    return (
        <div className="flex h-screen bg-surface font-manrope text-on-surface overflow-hidden relative">
            
            {/* MOBILE BACKDROP OVERLAY */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                />
            )}

            {/* CURRICULUM SIDEBAR */}
            <aside className={`bg-surface-container border-r border-outline-variant transition-all duration-300 flex flex-col flex-shrink-0 z-50 lg:z-40 ${
                sidebarOpen 
                    ? 'fixed inset-y-0 left-0 w-[85vw] sm:w-80 lg:relative lg:w-96 translate-x-0 shadow-2xl lg:shadow-none' 
                    : 'fixed inset-y-0 left-0 w-0 -translate-x-full lg:relative lg:translate-x-0 lg:w-0 overflow-hidden'
            }`}>
                <div className="p-5 sm:p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container-high/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>
                    <div className="space-y-1 relative z-10">
                        <p className="text-[10px] text-secondary uppercase tracking-[0.4em] font-black">CURRICULUM</p>
                        <h2 className="font-black text-on-surface truncate max-w-[180px] sm:max-w-[220px] text-sm sm:text-base uppercase tracking-tight">{course?.title}</h2>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-surface rounded-2xl transition-all text-on-surface-variant hover:text-on-surface border border-outline-variant/30">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 sm:px-8 py-4 sm:py-6 bg-surface-container-high/20 border-b border-outline-variant/20">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase text-on-surface-variant opacity-60 tracking-widest">Progress-ka Casharrada</span>
                        <span className="text-xs font-black text-secondary italic bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                            {currentIndex + 1} / {lessons.length}
                        </span>
                    </div>
                    <div className="h-2.5 bg-surface-container-highest rounded-full overflow-hidden shadow-inner p-0.5 border border-outline-variant/30">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${lessons.length > 0 ? ((currentIndex + 1) / lessons.length) * 100 : 0}%` }}
                            className="h-full bg-gradient-to-r from-secondary to-blue-400 rounded-full shadow-neon-blue"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-surface-container/60 backdrop-blur-xl no-scrollbar">
                    {lessons.map((lesson, i) => {
                        const isActive = String(lesson.id) === String(lessonId);
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => {
                                    goToLesson(lesson);
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl transition-all text-left relative group border ${
                                    isActive
                                        ? 'bg-secondary text-surface border-secondary shadow-xl scale-[1.01] shadow-secondary/20 font-bold'
                                        : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant border-outline-variant/30 hover:border-secondary/40'
                                }`}
                            >
                                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 transition-all ${
                                    isActive ? 'bg-surface/20 text-surface' : 'bg-surface-container-highest text-on-surface-variant/60 shadow-inner'
                                }`}>
                                    {lesson.video_url ? (
                                        <Play className={`w-4 h-4 ${isActive ? 'fill-surface' : 'fill-on-surface-variant/40'}`} />
                                    ) : (
                                        <span>{i + 1}</span>
                                    )}
                                </div>
                                <div className="flex-1 relative z-10 min-w-0">
                                    <span className="font-black text-xs block leading-snug truncate uppercase tracking-tight">{lesson.title}</span>
                                    <span className={`text-[9px] font-semibold uppercase tracking-wider block mt-0.5 ${isActive ? 'text-surface/80' : 'text-on-surface-variant/50'}`}>
                                        {lesson.video_url ? 'Video Lesson' : 'Reading Module'}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 bg-surface relative">
                
                {/* HEADER */}
                <header className="bg-surface-container/60 backdrop-blur-3xl px-4 sm:px-8 py-3.5 sm:py-5 border-b border-outline-variant/30 flex justify-between items-center z-30 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3 sm:gap-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="w-10 h-10 sm:w-12 sm:h-12 bg-surface-container-high hover:bg-secondary hover:text-surface rounded-2xl transition-all text-secondary flex items-center justify-center shadow-lg border border-outline-variant group shrink-0"
                            title="Bedel Curriculum-ka"
                        >
                            <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <div className="space-y-0.5 min-w-0">
                            <span className="text-[9px] sm:text-[10px] text-secondary font-black uppercase tracking-widest bg-secondary/10 px-2 sm:px-2.5 py-0.5 rounded-md border border-secondary/20 truncate inline-block">
                                CASHARKA {currentIndex + 1}
                            </span>
                            <h2 className="text-on-surface font-black text-sm sm:text-lg tracking-tight truncate max-w-[160px] sm:max-w-lg uppercase">{currentLesson.title}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={handleComplete}
                            className={`flex items-center gap-2 sm:gap-3 px-3.5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all italic shadow-xl shrink-0 ${
                                completed
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                    : 'bg-secondary text-surface hover:bg-secondary/90 shadow-secondary/20'
                            }`}
                        >
                            {completed ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-surface" />}
                            <span className="hidden sm:inline">{completed ? 'CASHARKAN WAAD DHAMAYSTAY' : 'MARK AS COMPLETE & NEXT'}</span>
                            <span className="sm:hidden">{completed ? 'DONE' : 'NEXT'}</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative z-10 pb-20">
                    
                    {/* MAIN VIDEO PLAYER CONTAINER */}
                    <div className="bg-black w-full h-[240px] sm:h-[380px] md:h-[460px] lg:h-[550px] min-h-[220px] flex items-center justify-center shadow-2xl relative overflow-hidden group border-b border-white/10 shrink-0">
                        {activeTab === 'video' || activeTab === 'notes' || activeTab === 'resources' || activeTab === 'qna' ? (
                            <div className="w-full h-full relative flex items-center justify-center bg-black">
                                {directVideo || videoError || useDirectPlayer ? (
                                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                                        <video
                                            key={videoSource}
                                            src={videoSource}
                                            controls
                                            autoPlay
                                            playsInline
                                            className="w-full h-full object-contain"
                                            controlsList="nodownload"
                                            onError={(e) => {
                                                console.warn("Video load error, using sample video fallback", e);
                                                setVideoError(true);
                                            }}
                                            ref={(el) => {
                                                if (el) {
                                                    el.playbackRate = playbackSpeed;
                                                    el.load();
                                                }
                                            }}
                                        >
                                            Browser-kaagu ma taageerayo nidaamkan video-ga.
                                        </video>

                                        {/* Speed Controls Overlay */}
                                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2 z-20 opacity-90 hover:opacity-100 transition-opacity">
                                            <SlidersHorizontal className="w-3.5 h-3.5 text-secondary" />
                                            <span className="text-[10px] font-black uppercase text-white/80 tracking-wider">Speed:</span>
                                            {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                                                <button
                                                    key={speed}
                                                    onClick={() => setPlaybackSpeed(speed)}
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                                        playbackSpeed === speed ? 'bg-secondary text-surface' : 'text-white/60 hover:text-white'
                                                    }`}
                                                >
                                                    {speed}x
                                                </button>
                                            ))}
                                        </div>

                                        {/* Direct Download Video Button */}
                                        <a 
                                            href={videoSource} 
                                            download 
                                            className="absolute bottom-16 right-4 bg-black/80 hover:bg-secondary text-white p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest z-20 backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Download Video
                                        </a>
                                    </div>
                                ) : (
                                    <div className="w-full h-full relative">
                                        <iframe
                                            className="w-full h-full border-0"
                                            src={embedUrl}
                                            title={currentLesson.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                        <button
                                            onClick={() => setUseDirectPlayer(true)}
                                            className="absolute bottom-4 left-4 bg-black/80 hover:bg-secondary text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 z-20 shadow-lg transition-all"
                                        >
                                            🔄 U Bedel HD Backup Player
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* INTERACTIVE NAVIGATION TABS */}
                    <div className="px-4 sm:px-8 lg:px-16 pt-4 sm:pt-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
                        
                        <div className="flex flex-wrap gap-2 sm:gap-3 p-1.5 sm:p-2 bg-surface-container-high/60 rounded-2xl sm:rounded-3xl w-full sm:w-fit border border-outline-variant/40 backdrop-blur-xl shadow-md">
                            {[
                                { id: 'video', icon: Video, label: '🎬 Player & Cashar' },
                                { id: 'notes', icon: BookOpen, label: '📚 Buugga & Nootada' },
                                { id: 'resources', icon: FileDown, label: '📎 Files & Resources' },
                                { id: 'qna', icon: MessageSquare, label: `💬 Su'aalaha & Q&A (${questions.length})` }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 border flex-1 sm:flex-none justify-center ${
                                        activeTab === tab.id 
                                            ? 'bg-secondary text-surface border-secondary shadow-lg shadow-secondary/20 scale-[1.01]' 
                                            : 'text-on-surface-variant hover:bg-surface-container-highest border-transparent hover:text-on-surface'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* TAB CONTENT SECTIONS */}
                        <AnimatePresence mode="wait">
                            
                            {/* OVERVIEW / VIDEO TAB CONTENT */}
                            {activeTab === 'video' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/40 shadow-xl relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-4 border-b border-outline-variant/30 pb-4">
                                            <div>
                                                <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">{currentLesson.title}</h3>
                                                <p className="text-xs text-on-surface-variant/70 font-medium">Faahfaahinta iyo nuxurka casharka maanta</p>
                                            </div>
                                            <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-xl text-xs font-black uppercase">
                                                HD Masterclass
                                            </span>
                                        </div>
                                        <div className="prose prose-invert max-w-none text-on-surface-variant font-medium leading-relaxed text-sm whitespace-pre-line">
                                            {currentLesson.content || 'Casharkan fiidiyowga ah wuxuu leeyahay sharaxaad buuxda. Ka daawo player-ka sare si aad u fahamto dhammaan koodhka iyo tusaalooyinka.'}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* BUUGGA & NOOTADA TAB (LESSON E-BOOK / PDF NOTES) */}
                            {activeTab === 'notes' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-surface-container p-10 rounded-3xl border border-outline-variant/40 shadow-xl space-y-8"
                                >
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-outline-variant/30 pb-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary">
                                                <BookOpen className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">Buugga & Handouts-ka Casharka</h3>
                                                <p className="text-xs text-on-surface-variant/70 font-medium mt-1">Dukumentiyada iyo nootada rasmiga ah ee koorsadan</p>
                                            </div>
                                        </div>
                                        {currentLesson.pdf_url ? (
                                            <a
                                                href={getFullVideoSrc(currentLesson.pdf_url)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-secondary text-surface hover:bg-secondary/90 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-3 shadow-xl transition-all shadow-secondary/20"
                                            >
                                                <Download className="w-4 h-4" /> Download Buugga PDF
                                            </a>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    const blob = new Blob([`# Buugga Casharka: ${currentLesson.title}\n\n## Nuxurka:\n${currentLesson.content || 'Waxaa halkan ku diyaarsan nootada casharka.'}`], { type: 'text/markdown' });
                                                    const url = URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = `${currentLesson.title.replace(/\s+/g, '_')}_Notes.md`;
                                                    a.click();
                                                }}
                                                className="bg-secondary text-surface hover:bg-secondary/90 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-3 shadow-xl transition-all shadow-secondary/20"
                                            >
                                                <FileDown className="w-4 h-4" /> Download Nootada Casharka (.md)
                                            </button>
                                        )}
                                    </div>

                                    {/* eBook Preview / Summary Notes */}
                                    <div className="bg-surface-container-high/40 p-8 rounded-2xl border border-outline-variant/30 space-y-6">
                                        <h4 className="text-base font-black text-secondary uppercase tracking-wider flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-amber-400" /> Macluumaad Muhiim Ah Oo Casharka Ku Saabsan
                                        </h4>
                                        <ul className="space-y-3 text-sm text-on-surface-variant font-medium">
                                            <li className="flex items-start gap-3">
                                                <Check className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                                                <span>Fahamka fikradaha aasaasiga ah ee lagu sharxay fiidiyowga casharkan.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <Check className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                                                <span>Koodhadhka iyo tusaalooyinka lagu bixiyay casharka waa kuwo toos ah oo la isticmaali karo.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <Check className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                                                <span>Wadarta wakhtiga daawashada iyo dib-u-eegista nootada waa mid laguu habeeyay.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </motion.div>
                            )}

                            {/* FILES & RESOURCES TAB */}
                            {activeTab === 'resources' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-surface-container p-10 rounded-3xl border border-outline-variant/40 shadow-xl space-y-6"
                                >
                                    <div className="border-b border-outline-variant/30 pb-4">
                                        <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">Khadadka & Files-ka La Soo Degayo</h3>
                                        <p className="text-xs text-on-surface-variant/70 font-medium">Kheyraadka dheeraadka ah ee aad ku isticmaali karto shaqadaada</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-5 bg-surface-container-high/50 rounded-2xl border border-outline-variant/40 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-sm text-on-surface uppercase">Koodhka Starter-ka</h5>
                                                    <p className="text-[10px] text-on-surface-variant/60 uppercase">ZIP Attachment • 1.2 MB</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => alert("Koodhka starter-ka ee casharka waa la soo degay!")}
                                                className="p-2.5 bg-surface-container-highest hover:bg-secondary hover:text-surface rounded-xl text-on-surface transition-all"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="p-5 bg-surface-container-high/50 rounded-2xl border border-outline-variant/40 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                                                    <BookOpen className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-sm text-on-surface uppercase">Cheat Sheet & References</h5>
                                                    <p className="text-[10px] text-on-surface-variant/60 uppercase">PDF Guide • 850 KB</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => alert("Cheat Sheet-ka casharka waa la soo degay!")}
                                                className="p-2.5 bg-surface-container-highest hover:bg-secondary hover:text-surface rounded-xl text-on-surface transition-all"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Q&A & DISCUSSION TAB */}
                            {activeTab === 'qna' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-surface-container p-8 lg:p-10 rounded-3xl border border-outline-variant/40 shadow-xl space-y-8"
                                >
                                    {/* Q&A Header Controls */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-6">
                                        <div>
                                            <h3 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
                                                <HelpCircle className="w-6 h-6 text-secondary" /> Su'aalaha & Wadashadalka Casharka
                                            </h3>
                                            <p className="text-xs text-on-surface-variant/70 font-medium mt-1">Wixii su'aal ah ama wax aad ka fahmi waayay casharkan halkan ku weydii macallinka iyo ardayda kale.</p>
                                        </div>

                                        <button
                                            onClick={() => setShowQnaModal(!showQnaModal)}
                                            className="bg-secondary text-surface hover:bg-secondary/90 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all shadow-secondary/20 shrink-0"
                                        >
                                            <MessageSquare className="w-4 h-4" /> Weydii Su'aal Cusub
                                        </button>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                                        <input
                                            type="text"
                                            placeholder="Gudaha su'aalaha ka raadi..."
                                            value={qnaSearch}
                                            onChange={(e) => setQnaSearch(e.target.value)}
                                            className="w-full bg-surface-container-high/60 pl-11 pr-4 py-3 rounded-2xl border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-secondary transition-all"
                                        />
                                    </div>

                                    {/* ASK QUESTION MODAL / FORM */}
                                    {showQnaModal && (
                                        <form onSubmit={handleAddQuestion} className="bg-surface-container-high/80 p-6 rounded-2xl border border-secondary/40 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <h4 className="font-black text-sm uppercase text-secondary flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" /> Soona gudbi su'aashaada
                                            </h4>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-on-surface-variant/70 mb-1 block">Cinwaanka Su'aasha</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="t.m. Sideen ugu shaqaysiiyaa koodhkan..."
                                                    value={newQuestionTitle}
                                                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                                                    className="w-full bg-surface p-3 rounded-xl border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase text-on-surface-variant/70 mb-1 block">Faahfaahinta Su'aasha</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    placeholder="Sharax waxaad ka fahmi waayay casharkan..."
                                                    value={newQuestionContent}
                                                    onChange={(e) => setNewQuestionContent(e.target.value)}
                                                    className="w-full bg-surface p-3 rounded-xl border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowQnaModal(false)}
                                                    className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase text-on-surface-variant/60 hover:text-on-surface"
                                                >
                                                    Kansal
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-secondary text-surface px-6 py-2.5 rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-md"
                                                >
                                                    <Send className="w-3.5 h-3.5" /> Soo Gudbi
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Questions List */}
                                    <div className="space-y-6">
                                        {filteredQuestions.length === 0 ? (
                                            <div className="text-center py-12 text-on-surface-variant/40 space-y-2">
                                                <MessageSquare className="w-12 h-12 mx-auto stroke-[1px]" />
                                                <p className="font-bold text-xs uppercase">Weli su'aal laguma soobin. Noqo kii ugu horreeyay ee su'aal weydiiya!</p>
                                            </div>
                                        ) : (
                                            filteredQuestions.map((q) => (
                                                <div key={q.id} className="p-6 bg-surface-container-high/40 rounded-2xl border border-outline-variant/30 space-y-4 hover:border-secondary/30 transition-all">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-secondary/20 text-secondary font-black text-xs flex items-center justify-center border border-secondary/30">
                                                                {q.avatar}
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-xs text-on-surface">{q.user}</span>
                                                                <span className="text-[10px] text-on-surface-variant/50 block">{q.time}</span>
                                                            </div>
                                                        </div>
                                                        {q.answered && (
                                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5">
                                                                <UserCheck className="w-3 h-3" /> Waa la kajawabay
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-sm text-on-surface">{q.title}</h4>
                                                        <p className="text-xs text-on-surface-variant/80 leading-relaxed">{q.content}</p>
                                                    </div>

                                                    {/* Actions (Like & Reply) */}
                                                    <div className="flex items-center gap-4 pt-2 border-t border-outline-variant/20">
                                                        <button
                                                            onClick={() => handleLikeQuestion(q.id)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                                                                q.userLiked 
                                                                    ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                                                                    : 'text-on-surface-variant/60 hover:text-on-surface bg-surface/40'
                                                            }`}
                                                        >
                                                            <ThumbsUp className="w-3.5 h-3.5" /> {q.likes}
                                                        </button>
                                                        <span className="text-[10px] text-on-surface-variant/40 font-bold uppercase">
                                                            {q.answers.length} Jawaabood
                                                        </span>
                                                    </div>

                                                    {/* Answers / Discussion List */}
                                                    {q.answers.length > 0 && (
                                                        <div className="mt-4 pl-4 border-l-2 border-secondary/40 space-y-3 pt-2">
                                                            {q.answers.map(ans => (
                                                                <div key={ans.id} className="p-3 bg-surface/60 rounded-xl border border-outline-variant/20 space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className={`font-bold text-xs ${ans.isInstructor ? 'text-secondary flex items-center gap-1' : 'text-on-surface'}`}>
                                                                            {ans.user} {ans.isInstructor && <Sparkles className="w-3 h-3 text-amber-400" />}
                                                                        </span>
                                                                        <span className="text-[9px] text-on-surface-variant/40">{ans.time}</span>
                                                                    </div>
                                                                    <p className="text-xs text-on-surface-variant">{ans.content}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Reply Input */}
                                                    <div className="flex gap-2 pt-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Ku dar jawaab ama aragti..."
                                                            value={replyText[q.id] || ""}
                                                            onChange={(e) => setReplyText({ ...replyText, [q.id]: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    handleAddReply(q.id);
                                                                }
                                                            }}
                                                            className="flex-1 bg-surface/60 px-3 py-2 rounded-xl border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-secondary"
                                                        />
                                                        <button
                                                            onClick={() => handleAddReply(q.id)}
                                                            className="px-4 py-2 bg-secondary/10 hover:bg-secondary hover:text-surface text-secondary rounded-xl text-xs font-bold transition-all"
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>

                    </div>
                </main>

                {/* FOOTER NAVIGATION */}
                <footer className="bg-surface-container-high/80 backdrop-blur-3xl border-t border-outline-variant/30 px-8 py-4 flex justify-between items-center z-30 sticky bottom-0">
                    <button
                        onClick={() => prevLesson && goToLesson(prevLesson)}
                        disabled={!prevLesson}
                        className="flex items-center gap-4 text-on-surface-variant font-black uppercase tracking-wider text-xs hover:text-secondary transition-all disabled:opacity-20 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-[9px] opacity-40">CASHARKII HORE</p>
                            <p className="font-bold text-on-surface text-xs truncate max-w-[150px]">{prevLesson?.title || 'Dhammaad'}</p>
                        </div>
                    </button>

                    <button
                        onClick={() => nextLesson ? goToLesson(nextLesson) : handleComplete()}
                        className="flex items-center gap-4 group"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-[9px] text-on-surface-variant opacity-60 font-black uppercase tracking-wider">CASHARKA XIGA</p>
                            <p className="font-bold text-on-surface text-xs truncate max-w-[150px]">{nextLesson?.title || 'Imtixaanka Koorsada'}</p>
                        </div>
                        <div className="w-11 h-11 bg-secondary text-surface rounded-xl flex items-center justify-center group-hover:scale-105 transition-all shadow-lg shadow-secondary/20">
                            <ChevronRight className="w-6 h-6" />
                        </div>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default LessonPlayer;
