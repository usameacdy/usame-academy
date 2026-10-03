import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { 
  Users, BookOpen, CreditCard, ShieldCheck, Plus, Trash2, Award, X, Settings,
  TrendingUp, Activity, DollarSign, Filter, ChevronDown, CheckCircle, Download, ExternalLink, Sun, Moon, Bell 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart as ReBarChart, Bar, Cell
} from 'recharts';

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
    const { user: currentUser } = useAuth();
    const [stats, setStats] = useState({ users: 0, courses: 0, results: 0, revenue: 0 });
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(currentUser?.role === 'admin' ? 'users' : 'courses');
    const [issueModal, setIssueModal] = useState(null);
    const [resetPasswordModal, setResetPasswordModal] = useState(null);
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [resetting, setResetting] = useState(false);
    const [certData, setCertData] = useState({ mother_name: '', profile_picture: null });
    const [issuing, setIssuing] = useState(false);
    const [revenueData, setRevenueData] = useState({ totalRevenue: 0, monthlyData: [], recentTransactions: [] });
    const [rentals, setRentals] = useState([]);
    const [newInstructor, setNewInstructor] = useState({ name: '', email: '', password: '', phone: '', monthly_fee: '' });
    const [promotions, setPromotions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({ course_id: '', title: '', description: '', due_date: '' });
    const [submissions, setSubmissions] = useState([]);
    const [gradingModal, setGradingModal] = useState(null);
    const [certRequests, setCertRequests] = useState([]);
    const [pendingEnrollments, setPendingEnrollments] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [newPromotion, setNewPromotion] = useState({ type: 'image', title: '', link_url: '', media: null });
    const [uploadingPromo, setUploadingPromo] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

    const fetchData = useCallback(async () => {
        if (!currentUser) return;

        if (currentUser.role === 'admin') {
            try {
                const uRes = await api.get('/auth/users');
                setUsers(Array.isArray(uRes.data) ? uRes.data : []);
                setStats(prev => ({ ...prev, users: uRes.data.length }));
            } catch (err) {
                console.error('Failed to fetch users:', err.message);
            }

            try {
                const revRes = await api.get('/payments/revenue');
                if (revRes.data) {
                    setRevenueData(revRes.data);
                    setStats(prev => ({ ...prev, revenue: revRes.data.totalRevenue || 0 }));
                }
            } catch (err) {
                console.error('Failed to fetch revenue:', err.message);
            }

            try {
                const rentRes = await api.get('/payments/rent/requests');
                setRentals(Array.isArray(rentRes.data) ? rentRes.data : []);
            } catch (err) {
                console.error('Failed to fetch rental requests:', err.message);
            }
        }

        try {
            const endpoint = currentUser.role === 'admin' ? '/courses/manage' : '/courses';
            const cRes = await api.get(endpoint);
            setCourses(Array.isArray(cRes.data) ? cRes.data : []);
            setStats(prev => ({ ...prev, courses: cRes.data.length }));
        } catch (err) {
            console.error('Failed to fetch courses:', err.message);
        }

        try {
            const rRes = await api.get('/exams/results');
            setResults(Array.isArray(rRes.data) ? rRes.data : []);
            setStats(prev => ({ ...prev, results: rRes.data.length }));
        } catch (err) {
            console.error('Failed to fetch results:', err.message);
        }

        try {
            const pRes = await api.get('/promotions/manage');
            setPromotions(Array.isArray(pRes.data) ? pRes.data : []);
        } catch (err) {
            console.error('Failed to fetch promotions:', err.message);
        }

        try {
            const coursesRes = await api.get(currentUser.role === 'admin' ? '/courses/manage' : '/courses');
            const allAssignments = [];
            for (const course of coursesRes.data) {
                const aRes = await api.get(`/assignments/course/${course.id}`);
                allAssignments.push(...(Array.isArray(aRes.data) ? aRes.data : []).map(a => ({ ...a, course_title: course.title })));
            }
            setAssignments(allAssignments);
        } catch (err) {
            console.error('Failed to fetch assignments:', err.message);
        }

        try {
            const crRes = await api.get('/certificates/requests');
            setCertRequests(crRes.data);
        } catch (err) {
            console.error('Failed to fetch certificate requests:', err.message);
        }

        if (currentUser.role === 'admin') {
            try {
                const [actRes, peRes] = await Promise.all([
                    api.get('/admin/activity'),
                    api.get('/courses/admin/pending-enrollments')
                ]);
                setRecentActivity(actRes.data);
                setPendingEnrollments(peRes.data);
            } catch (err) {
                console.error('Failed to fetch admin data:', err.message);
            }
        }
    }, [currentUser]);

    useEffect(() => {
        fetchData().then(() => setLoading(false));
    }, [fetchData]);

    const handleIssueCertificate = async (e) => {
        e.preventDefault();
        setIssuing(true);
        const formData = new FormData();
        formData.append('mother_name', certData.mother_name);
        if (certData.profile_picture) {
            formData.append('profile_picture', certData.profile_picture);
        }

        try {
            await api.post(`/certificates/issue/${issueModal.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Shahaadadii si guul ah ayaa loo bixiyay!');
            setIssueModal(null);
            setCertData({ mother_name: '', profile_picture: null });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Qalad ayaa dhacay markii la bixinayay shahaadada.');
        }
        setIssuing(false);
    };

    const handleAdminResetPassword = async (e) => {
        e.preventDefault();
        if (!resetPasswordModal?.id) {
            alert("Khalad: Lama hayo aqoonsiga (ID) ee qofka aad password-ka ka bedelayso.");
            return;
        }
        if (!newAdminPassword || newAdminPassword.length < 4) {
            alert("Fadlan qor password ka kooban ugu yaraan 4 xaraf.");
            return;
        }

        setResetting(true);
        try {
            await api.put(`/auth/reset-admin/${resetPasswordModal.id}`, { newPassword: newAdminPassword });
            alert(`Password-ka ${resetPasswordModal.name} si guul ah ayaa loo bedelay!`);
            setResetPasswordModal(null);
            setNewAdminPassword('');
        } catch (err) {
            console.error("Password Reset Error:", err);
            const errorMsg = err.response?.data?.message || err.message || 'Khalad farsamo ayaa dhacay.';
            alert(`Naga raali noqo: ${errorMsg}`);
        }
        setResetting(false);
    };

    const handleDeleteUser = async (id, name) => {
        if (id === currentUser.id) {
            alert("Ma tirtiri kartid akoonkaaga intaad xitaa admin tahay!");
            return;
        }
        if (!window.confirm(`Runtii ma rabtaa inaad tirtirto user-ka ${name}?`)) return;

        try {
            await api.delete(`/auth/users/${id}`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Khalad ayaa dhacay markii la tirtirayey user-ka.");
        }
    };

    const handleDeleteCourse = async (id, title) => {
        if (!window.confirm(`Runtii ma rabtaa inaad tirtirto koorsada: ${title}?`)) return;
        try {
            await api.delete(`/courses/${id}`);
            fetchData();
        } catch {
            alert("Ma tirtiri karo koorsadan.");
        }
    };

    const handleDeleteResult = async (id, studentName) => {
        if (!window.confirm(`Ma hubtaa inaad tirtirto natiijadan uu helay ${studentName}?`)) return;
        try {
            await api.delete(`/exams/results/${id}`);
            alert("Natiijada waa la tirtiray!");
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Khalad ayaa dhacay natiijo tirtiridii.");
        }
    };

    const handleDeleteTransaction = async (id) => {
        if (!window.confirm("Ma hubtaa inaad tirtirto diiwaankan lacag-bixinta?")) return;
        try {
            await api.delete(`/payments/transactions/${id}`);
            alert("Diiwaanka lacag-bixinta waa la tirtiray!");
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Khalad ayaa dhacay qaan-sheeg tirtiridii.");
        }
    };

    const handleCreateInstructor = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/instructor', newInstructor);
            alert('Instructor created successfully!');
            setNewInstructor({ name: '', email: '', password: '', phone: '', monthly_fee: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create instructor');
        }
    };

    const handleToggleLock = async (id, currentStatus) => {
        try {
            if (currentStatus) {
                await api.put(`/auth/users/${id}/unlock`);
            } else {
                await api.put(`/auth/users/${id}/lock`);
            }
            fetchData();
        } catch {
            alert('Failed to toggle lock status');
        }
    };

    const handleApproveRent = async (id) => {
        if (!window.confirm("Ma hubtaa inaad fasaxdo macalimkan (Approve Rent)?")) return;
        try {
            await api.put(`/payments/rent/approve/${id}`);
            alert('Kiro waa la ogolaaday, macalinka waa la furay (Unlocked).');
            fetchData();
        } catch {
            alert('Failed to approve rent');
        }
    };

    const handleCreatePromotion = async (e) => {
        e.preventDefault();
        if (!newPromotion.media) return alert('Fadlan soo gali sawirka ama muuqaalka!');
        setUploadingPromo(true);
        const formData = new FormData();
        formData.append('type', newPromotion.type);
        formData.append('title', newPromotion.title);
        formData.append('link_url', newPromotion.link_url);
        formData.append('promo_media', newPromotion.media);

        try {
            await api.post('/promotions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Promotion created successfully!');
            setNewPromotion({ type: 'image', title: '', link_url: '', media: null });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create promotion');
        }
        setUploadingPromo(false);
    };

    const handleDeletePromotion = async (id) => {
        if (!window.confirm("Ma hubtaa inaad tirtirto xayaysiiskan?")) return;
        try {
            await api.delete(`/promotions/${id}`);
            fetchData();
        } catch {
            alert('Failed to delete promotion');
        }
    };

    const handleTogglePromotion = async (id) => {
        try {
            await api.patch(`/promotions/${id}/toggle`);
            fetchData();
        } catch {
            alert('Failed to toggle promotion');
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assignments', newAssignment);
            alert('Howlgalka (Assignment) si guul ah ayaa loo abuuray!');
            setNewAssignment({ course_id: '', title: '', description: '', due_date: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create assignment');
        }
    };

    const handleViewSubmissions = async (assignmentId) => {
        try {
            const res = await api.get(`/assignments/${assignmentId}/submissions`);
            setSubmissions(res.data);
            setGradingModal({ assignmentId });
        } catch (err) {
            alert('Waa lagu guul daraystay soo kicinta submissions-ka.');
        }
    };

    const handleGradeSubmission = async (e) => {
        e.preventDefault();
        const { submissionId, grade, feedback } = gradingModal;
        try {
            await api.post(`/assignments/submissions/${submissionId}/grade`, { grade, feedback });
            alert('Waa la saxay! (Graded successfully)');
            handleViewSubmissions(gradingModal.assignmentId);
        } catch (err) {
            alert('Failed to grade submission');
        }
    };

    const handleUpdateEnrollment = async (id, status) => {
        try {
            await api.patch(`/courses/admin/enrollments/${id}`, { status });
            alert(`Xaaladda waa la beddelay: ${status}`);
            fetchData();
        } catch (err) {
            alert('Waa lagu guuldareystay beddelista xaaladda.');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-secondary border-b-2 border-secondary"></div>
        </div>
    );

    return (
        <div className="space-y-12 min-h-screen pb-20">
            {issueModal && (
                <div className="fixed inset-0 bg-surface/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                    <div className="glass rounded-[3rem] p-12 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-outline-variant relative bg-surface-container">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black text-on-surface uppercase italic tracking-tighter">Bixi Shahaado</h3>
                            <button onClick={() => setIssueModal(null)} className="p-3 bg-surface text-on-surface-variant hover:text-secondary rounded-2xl transition-all border border-outline-variant">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-on-surface-variant font-medium mb-10 flex items-center justify-between">
                            <span>Ardayga:</span>
                            <span className="font-black text-on-surface uppercase italic">{issueModal.student_name}</span>
                        </p>
                        <form onSubmit={handleIssueCertificate} className="space-y-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Magaca Hooyada (Optional)</label>
                                <input
                                    type="text"
                                    className="input-field bg-surface-container-high border-outline-variant focus:border-primary text-on-surface"
                                    placeholder="Tusaale: Xaliimo Jaamac..."
                                    value={certData.mother_name}
                                    onChange={e => setCertData({...certData, mother_name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Sawirka Passport-ka</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    className="block w-full text-sm text-on-surface-variant file:mr-6 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-surface-container-high file:text-secondary hover:file:bg-secondary hover:file:text-surface transition-all border border-outline-variant rounded-3xl p-3"
                                    onChange={e => setCertData({...certData, profile_picture: e.target.files[0]})}
                                />
                            </div>
                            <button type="submit" disabled={issuing} className="btn-energy w-full py-6 mt-6 text-[11px] uppercase tracking-[0.3em]">
                                {issuing ? 'Waa la dhisayaa...' : 'Dhis Shahaadada'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {resetPasswordModal && (
                <div className="fixed inset-0 bg-surface/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                    <div className="glass rounded-[3rem] p-12 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-outline-variant relative bg-surface-container">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-on-surface uppercase italic tracking-tighter leading-none">Reset Password</h3>
                                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mt-3 opacity-60">U badal sirta: {resetPasswordModal.name}</p>
                            </div>
                            <button onClick={() => setResetPasswordModal(null)} className="p-3 bg-surface text-on-surface-variant hover:text-secondary rounded-2xl transition-all border border-outline-variant">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAdminResetPassword} className="space-y-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Password Cusub</label>
                                <input
                                    type="password"
                                    required
                                    className="input-field bg-surface-container-high border-outline-variant focus:border-primary text-on-surface"
                                    value={newAdminPassword}
                                    onChange={e => setNewAdminPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" disabled={resetting} className="btn-energy w-full py-6 mt-6 text-[11px] uppercase tracking-[0.3em]">
                                {resetting ? 'Waa la bedelayaa...' : 'Bedel Password-ka'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 1. Header & Greeting */}
            <div className="space-y-12 animate-in fade-in slide-in-from-top-8 duration-700">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-secondary text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-secondary/20">
                            <ShieldCheck className="w-4 h-4" /> SECURE ADMIN HUB
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-on-surface uppercase italic tracking-tighter leading-none">
                            {currentUser?.role === 'admin' ? 'Xarunta' : 'Maamulka'} <span className="text-secondary">{currentUser?.role === 'admin' ? 'Maamulka' : 'Macalinka'}</span>
                        </h1>
                        <p className="text-on-surface-variant font-medium text-lg opacity-60">Maaree dhamaan xogta, koorsooyinka, iyo ardayda akadeemiyada.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {currentUser?.role === 'admin' && (
                            <Link to="/courses/create" className="btn-energy flex items-center gap-4 px-10 py-6 text-xs uppercase tracking-widest !rounded-[2rem] shadow-2xl">
                                <Plus className="w-5 h-5" /> SAMEE KOORSO
                            </Link>
                        )}
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-6 rounded-[2rem] transition-all border relative overflow-hidden group ${showNotifications ? 'bg-secondary text-white border-secondary shadow-2xl' : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-secondary shadow-sm'}`}
                            >
                                <Bell className="w-7 h-7 relative z-10" />
                                {(certRequests.length + pendingEnrollments.length + rentals.length) > 0 && (
                                    <span className="absolute top-4 right-4 w-6 h-6 bg-tertiary text-white rounded-full flex items-center justify-center text-[9px] font-black animate-pulse shadow-lg shadow-tertiary/40 border-2 border-surface z-20">
                                        {certRequests.length + pendingEnrollments.length + rentals.length}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-6 w-96 glass rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-outline-variant z-[150] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="p-10 border-b border-outline-variant bg-surface-container-high/50 flex justify-between items-center">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface">Ogeysiisyada Sugaya</h4>
                                        <span className="text-[9px] font-black text-secondary bg-secondary/10 px-4 py-1.5 rounded-full uppercase tracking-tighter">Action Required</span>
                                    </div>
                                    <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                                        {certRequests.length === 0 && pendingEnrollments.length === 0 && rentals.length === 0 ? (
                                            <div className="p-20 text-center space-y-6">
                                                <div className="w-20 h-20 bg-surface-container rounded-3xl mx-auto flex items-center justify-center border border-outline-variant opacity-20">
                                                    <Bell className="w-10 h-10" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-30">Wax cusub oo jira ma jiraan</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-outline-variant">
                                                {certRequests.map(req => (
                                                    <button key={`cert-${req.id}`} onClick={() => { setActiveTab('certRequests'); setShowNotifications(false); }} className="w-full p-8 text-left hover:bg-surface-container-high transition-all flex items-start gap-5 group">
                                                        <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-all shadow-inner">
                                                            <Award className="w-6 h-6" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-on-surface uppercase italic tracking-tighter truncate">Codsasho Shahaado</p>
                                                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1 truncate">{req.student_name} ayaa codsaday</p>
                                                        </div>
                                                    </button>
                                                ))}
                                                {pendingEnrollments.map(enr => (
                                                    <button key={`enr-${enr.id}`} onClick={() => { setActiveTab('verifications'); setShowNotifications(false); }} className="w-full p-8 text-left hover:bg-surface-container-high transition-all flex items-start gap-5 group">
                                                        <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-tertiary group-hover:text-white transition-all shadow-inner">
                                                            <DollarSign className="w-6 h-6" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-on-surface uppercase italic tracking-tighter truncate">Lacag Hubin Sugaysa</p>
                                                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1 truncate">{enr.student_name} - ${enr.price}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                                {rentals.map(rent => (
                                                    <button key={`rent-${rent.id}`} onClick={() => { setActiveTab('rentals'); setShowNotifications(false); }} className="w-full p-8 text-left hover:bg-surface-container-high transition-all flex items-start gap-5 group">
                                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                                            <Activity className="w-6 h-6" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-on-surface uppercase italic tracking-tighter truncate">Codsasho Kirayn</p>
                                                            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1 truncate">{rent.instructor_name} ayaa soo gudbiyay</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Key Metrics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        ...(currentUser?.role === 'admin' ? [{ icon: Users, label: 'Gala-yaasha', value: stats.users, color: 'text-primary', glow: 'shadow-primary/20' }] : []),
                        { icon: BookOpen, label: 'Koorsooyinka', value: stats.courses, color: 'text-secondary', glow: 'shadow-secondary/20' },
                        { icon: ShieldCheck, label: 'Natiijooyinka', value: stats.results, color: 'text-tertiary', glow: 'shadow-tertiary/20' },
                        ...(currentUser?.role === 'admin' ? [{ icon: CreditCard, label: 'Dakhliga Guud', value: `$${stats.revenue}`, color: 'text-secondary', glow: 'shadow-secondary/20' }] : []),
                    ].map((stat, i) => (
                        <div key={i} className={`p-10 bg-surface-container rounded-[3.5rem] border border-outline-variant shadow-sm ${stat.glow} flex flex-col justify-between h-56 group hover:translate-y-[-8px] hover:border-secondary/40 transition-all duration-500 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className={`w-16 h-16 bg-surface-container-highest ${stat.color} rounded-[1.5rem] flex items-center justify-center border border-outline-variant group-hover:bg-secondary group-hover:text-white transition-all duration-500 relative z-10`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.4em] mb-2 opacity-50">{stat.label}</p>
                                <p className="text-4xl font-black text-on-surface uppercase italic tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. System Status Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between px-10 py-6 bg-surface-container-high/40 rounded-[2rem] border border-outline-variant gap-6">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">System Online</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4 text-secondary opacity-60" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 italic">v2.5.0-EDITORIAL-STABLE</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-30">
                            Last Sync: {new Date().toLocaleTimeString()}
                        </div>
                        <div className="glass-pill px-6 text-secondary bg-secondary/10">Live Analytics ⚡</div>
                    </div>
                </div>

                {/* 4. Navigation Tab Pills */}
                <div className="flex flex-wrap gap-4 p-4 bg-surface-container rounded-[3rem] w-full lg:w-fit border border-outline-variant shadow-xl">
                    {[
                        ...(currentUser?.role === 'admin' ? [{ id: 'users', label: 'Ardayda', icon: Users }] : []),
                        { id: 'courses', label: 'Koorsooyinka', icon: BookOpen },
                        { id: 'results', label: 'Natiijooyinka', icon: ShieldCheck },
                        ...(currentUser?.role === 'admin' ? [
                            { id: 'instructors', label: 'Macalimiinta', icon: Award },
                            { id: 'rentals', label: 'Kirada', icon: CreditCard },
                            { id: 'verifications', label: 'Hubinta', icon: DollarSign },
                            { id: 'promotions', label: 'Xayeysiinta', icon: TrendingUp },
                            { id: 'certRequests', label: 'Cert Requests', icon: Award }
                        ] : []),
                        { id: 'submissions', label: 'Assignments', icon: Activity },
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] font-black uppercase italic tracking-[0.2em] text-[10px] transition-all duration-500 ${activeTab === tab.id ? 'bg-secondary text-white shadow-2xl shadow-secondary/40 -translate-y-1' : 'text-on-surface-variant hover:text-secondary hover:bg-surface'}`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {currentUser?.role === 'admin' && activeTab === 'users' && (
                <div className="bg-surface-container rounded-[3rem] border border-outline-variant shadow-sm overflow-hidden">
                    <div className="px-10 py-10 border-b border-outline-variant bg-surface-container-high/30">
                        <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Ardayda Diwaangashan</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                <tr>
                                    <th className="px-10 py-8">Macnaha</th>
                                    <th className="px-10 py-8">Xiriirka</th>
                                    <th className="px-10 py-8">Darajada</th>
                                    <th className="px-10 py-8 text-center">Ku Soo Biiray</th>
                                    <th className="px-10 py-8 text-center">Lacagta Bisha</th>
                                    <th className="px-10 py-8 text-right">Ficil</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant text-on-surface-variant">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-surface-container-high/20 transition-colors group">
                                        <td className="px-10 py-8 font-black text-on-surface uppercase italic tracking-tighter text-lg">{u.name}</td>
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-medium tracking-wide">{u.email}</p>
                                            {u.phone && <p className="text-xs text-secondary font-black italic tracking-widest mt-1">({u.phone})</p>}
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-5 py-2 rounded-xl text-[9px] font-black tracking-[0.2em] border uppercase ${u.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20' :
                                                u.role === 'instructor' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                                                    'bg-tertiary/10 text-tertiary border-tertiary/20 font-black'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-center font-black text-[10px] uppercase tracking-widest">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            {u.role === 'instructor' ? (
                                                <span className="font-black text-secondary tracking-tighter">${u.monthly_fee || '0.00'}</span>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>
                                        <td className="px-10 py-8 text-right flex justify-end gap-3">
                                            <button 
                                                onClick={() => setResetPasswordModal(u)}
                                                className="p-3 bg-surface-container text-on-surface-variant hover:text-secondary rounded-xl border border-outline-variant transition-all"
                                                title="Reset Password"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.id, u.name)}
                                                className="p-4 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded-[1.5rem] border border-transparent hover:border-tertiary/20 transition-all active:scale-95 shadow-sm"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'instructors' && (
                <div className="space-y-12">
                    <div className="surface-container rounded-[3rem] border border-outline-variant shadow-2xl p-10 bg-surface-container">
                        <h2 className="text-2xl font-black text-on-surface mb-8 uppercase italic tracking-tighter">Isku-xir Macalin Cusub</h2>
                        <form onSubmit={handleCreateInstructor} className="grid md:grid-cols-4 gap-6 items-end">
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className="block text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-widest opacity-60">Magaca Habboon</label>
                                <input type="text" required className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-4" value={newInstructor.name} onChange={e => setNewInstructor({...newInstructor, name: e.target.value})} />
                            </div>
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className="block text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-widest opacity-60">Email-ka</label>
                                <input type="email" required className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-4" value={newInstructor.email} onChange={e => setNewInstructor({...newInstructor, email: e.target.value})} />
                            </div>
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className="block text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-widest opacity-60">Lambarka Sirta</label>
                                <input type="password" required className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-4" value={newInstructor.password} onChange={e => setNewInstructor({...newInstructor, password: e.target.value})} />
                            </div>
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className="block text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-widest opacity-60">Telefoonka</label>
                                <input type="text" className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-4" value={newInstructor.phone} onChange={e => setNewInstructor({...newInstructor, phone: e.target.value})} />
                            </div>
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className="block text-[10px] font-black text-on-surface-variant mb-3 uppercase tracking-widest opacity-60">Lacagta Bisha ($)</label>
                                <input type="number" required className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-4" value={newInstructor.monthly_fee} onChange={e => setNewInstructor({...newInstructor, monthly_fee: e.target.value})} placeholder="0.00" />
                            </div>
                            <button type="submit" className="btn-energy py-5 col-span-full mt-4 text-[11px] uppercase tracking-[0.3em]">Diiwaangeli Macalinka</button>
                        </form>
                    </div>

                    <div className="glass rounded-[3rem] border border-outline-variant shadow-2xl overflow-hidden bg-surface-container">
                        <div className="px-10 py-10 border-b border-outline-variant bg-secondary/5">
                            <h2 className="text-2xl font-black text-secondary uppercase italic tracking-tighter">Codsiyada Bixinta Kirada</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                    <tr>
                                        <th className="px-10 py-8">Macalinka</th>
                                        <th className="px-10 py-8">Lacagta</th>
                                        <th className="px-10 py-8 text-center">Habka</th>
                                        <th className="px-10 py-8 text-center">Taariikhda</th>
                                        <th className="px-10 py-8 text-right">Ficil</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {rentals.length === 0 ? (
                                        <tr><td colSpan="5" className="px-10 py-20 text-center text-on-surface-variant font-black uppercase tracking-widest">Wax codsi kiro ah lama hayo</td></tr>
                                    ) : rentals.map(r => (
                                        <tr key={r.id} className="hover:bg-surface-container-high/10 transition-colors">
                                            <td className="px-10 py-8 font-black text-on-surface uppercase italic tracking-tighter">{r.instructor_name}</td>
                                            <td className="px-10 py-8 text-secondary font-black text-xl italic tracking-tighter">${r.amount}</td>
                                            <td className="px-10 py-8 text-center font-medium text-on-surface-variant uppercase tracking-widest text-[10px]">{r.payment_method}</td>
                                            <td className="px-10 py-8 text-center text-on-surface-variant font-black text-[10px] uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString()}</td>
                                            <td className="px-10 py-8 text-right">
                                                {r.status === 'pending' ? (
                                                    <button onClick={() => handleApproveRent(r.id)} className="btn-energy px-6 py-3 text-[9px] uppercase tracking-widest bg-secondary text-surface border-none">
                                                        OGOLAOW & FUR
                                                    </button>
                                                ) : (
                                                    <span className="text-secondary font-black uppercase italic tracking-widest text-xs">APPROVED ✔</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="glass rounded-[3rem] border border-outline-variant shadow-2xl overflow-hidden bg-surface-container">
                        <div className="px-10 py-10 border-b border-outline-variant bg-surface-container-high/30">
                            <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Dhammaan Macalimiinta</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                    <tr>
                                        <th className="px-10 py-8">Magaca</th>
                                        <th className="px-10 py-8">Xiriirka</th>
                                        <th className="px-10 py-8 text-center">Xaaladda</th>
                                        <th className="px-10 py-8 text-right">Ficil</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {users.filter(u => u.role === 'instructor').map((u) => (
                                        <tr key={u.id} className="hover:bg-surface-container-high/10 transition-colors">
                                            <td className="px-10 py-8 font-black text-on-surface uppercase italic tracking-tighter text-lg">{u.name}</td>
                                            <td className="px-10 py-8">
                                                <p className="text-sm font-medium tracking-wide">{u.email}</p>
                                                <p className="text-xs text-secondary font-black italic tracking-widest mt-1">{u.phone}</p>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${u.is_locked ? 'bg-tertiary/10 text-tertiary border-tertiary/20' : 'bg-secondary/10 text-secondary border-secondary/20'}`}>
                                                    {u.is_locked ? 'LOCKED 🔒' : 'ACTIVE ⚡'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right flex justify-end gap-3">
                                                <button 
                                                    onClick={() => setResetPasswordModal(u)}
                                                    className="p-3 bg-surface-container text-on-surface-variant hover:text-secondary rounded-xl border border-outline-variant transition-all"
                                                    title="Reset Password"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleToggleLock(u.id, u.is_locked)} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${u.is_locked ? 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary hover:text-surface' : 'bg-tertiary/10 text-tertiary border border-tertiary/20 hover:bg-tertiary hover:text-surface'}`}>
                                                    {u.is_locked ? 'Unlock' : 'Lock'}
                                                </button>
                                                <button onClick={() => handleDeleteUser(u.id, u.name)} className="p-4 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded-2xl border border-transparent hover:border-tertiary/20 transition-all">
                                                    <Trash2 className="w-5 h-5"/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'courses' && (
                <div className="glass rounded-[3rem] border border-outline-variant shadow-2xl overflow-hidden bg-surface-container">
                    <div className="px-10 py-10 border-b border-outline-variant bg-surface-container-high/30">
                        <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Maamul-ka Koorsooyinka</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                <tr>
                                    <th className="px-10 py-8">Magaca Koorsada</th>
                                    <th className="px-10 py-8">Macalinka</th>
                                    <th className="px-10 py-8 text-center">Qiimaha</th>
                                    <th className="px-10 py-8 text-center">La Sameeyay</th>
                                    <th className="px-10 py-8 text-right">Ficil</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant">
                                {courses.map((c) => (
                                    <tr key={c.id} className="hover:bg-surface-container-high/10 transition-colors group">
                                        <td className="px-10 py-8 font-black text-on-surface uppercase italic tracking-tighter text-lg group-hover:text-primary transition-colors">{c.title}</td>
                                        <td className="px-10 py-8 text-on-surface-variant font-black uppercase italic text-[10px] tracking-widest">{c.instructor_name || 'Admin'}</td>
                                        <td className="px-10 py-8 text-center font-black text-secondary text-2xl tracking-tighter italic">${c.price}</td>
                                        <td className="px-10 py-8 text-center text-on-surface-variant font-black text-[10px] uppercase tracking-widest">
                                            {new Date(c.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-8 text-right flex justify-end gap-3">
                                            <Link 
                                                to={`/courses/${c.id}/manage`}
                                                className="glass px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 border-primary/20 transition-all"
                                            >
                                                Manage
                                            </Link>
                                            {currentUser?.role === 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteCourse(c.id, c.title)}
                                                    className="p-4 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded-2xl border border-transparent hover:border-tertiary/20 transition-all"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {courses.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-28 text-center text-on-surface-variant font-black uppercase tracking-widest italic opacity-50">No courses found yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'results' && (
                <div className="glass rounded-[3rem] border border-outline-variant shadow-2xl overflow-hidden bg-surface-container">
                    <div className="px-10 py-10 border-b border-outline-variant bg-surface-container-high/30">
                        <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Natiijooyinka Imtixaanka</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                <tr>
                                    <th className="px-10 py-8">Ardayga</th>
                                    <th className="px-10 py-8">Imtixaanka</th>
                                    <th className="px-10 py-8 text-center">Dhibcaha</th>
                                    <th className="px-10 py-8 text-center">Xaaladda</th>
                                    <th className="px-10 py-8 text-right">Ficil</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant text-on-surface-variant">
                                {results.map((r) => (
                                    <tr key={r.id} className="hover:bg-surface-container-high/10 transition-colors group">
                                        <td className="px-10 py-8 font-black text-on-surface uppercase italic tracking-tighter text-lg">{r.student_name}</td>
                                        <td className="px-10 py-8 text-on-surface-variant font-medium">{r.exam_title}</td>
                                        <td className="px-10 py-8 text-center font-black text-on-surface text-2xl tracking-tighter">{r.score}%</td>
                                        <td className="px-10 py-8 text-center">
                                            <span className={`px-5 py-2 rounded-xl text-[9px] font-black tracking-widest border uppercase ${r.passed ? 'bg-secondary/10 text-secondary border-secondary/20 shadow-[0_0_10px_rgba(0,227,243,0.1)]' : 'bg-tertiary/10 text-tertiary border-tertiary/20'}`}>
                                                {r.passed ? 'PASSED ⚡' : 'FAILED ❌'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right flex justify-end gap-3">
                                            {r.passed && (
                                                <button
                                                    onClick={() => setIssueModal(r)}
                                                    className="btn-energy px-6 py-3 text-[9px] uppercase tracking-widest flex items-center gap-3"
                                                >
                                                    <Award className="w-4 h-4" /> Bixi Shahaado
                                                </button>
                                            )}
                                            {currentUser?.role === 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteResult(r.id, r.student_name)}
                                                    className="p-4 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded-2xl border border-transparent hover:border-tertiary/20 transition-all"
                                                    title="Tirtir Natiijada"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {results.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-10 py-28 text-center text-on-surface-variant font-black uppercase tracking-widest italic opacity-50">No exam results submitted yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'revenue' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
                    {/* Visual Charts Row */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Revenue Area Chart */}
                        <div className="lg:col-span-2 bg-surface-container rounded-[3rem] p-10 border border-outline-variant shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                                <TrendingUp className="w-40 h-40" />
                            </div>
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Dakhliga Billaha ah</h3>
                                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-60">Trend-ka dakhliga ee sanadka</p>
                                </div>
                                <div className="p-4 bg-secondary/10 text-secondary rounded-3xl border border-secondary/20">
                                    <DollarSign className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="h-[350px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData.monthlyData}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: 'var(--on-surface-variant)'}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: 'var(--on-surface-variant)'}} />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: 'var(--surface-container-high)', borderRadius: '1.5rem', border: '1px solid var(--outline-variant)', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase'}}
                                            itemStyle={{color: 'var(--secondary)'}}
                                            cursor={{stroke: 'var(--secondary)', strokeWidth: 2}}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="var(--secondary)" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Sales Bar Chart */}
                        <div className="bg-surface-container rounded-[3rem] p-10 border border-outline-variant shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                                <Activity className="w-40 h-40" />
                            </div>
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Iibka Koorsooyinka</h3>
                                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-60">Cadadka la iibiyay</p>
                                </div>
                                <div className="p-4 bg-tertiary/10 text-tertiary rounded-3xl border border-tertiary/20">
                                    <Activity className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="h-[350px] w-full relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ReBarChart data={revenueData.monthlyData}>
                                        <XAxis dataKey="month" hide />
                                        <Tooltip 
                                            cursor={{fill: 'rgba(255,255,255,0.03)'}}
                                            contentStyle={{backgroundColor: 'var(--surface-container-high)', borderRadius: '1.5rem', border: '1px solid var(--outline-variant)', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase'}}
                                        />
                                        <Bar dataKey="sales_count" radius={[15, 15, 0, 0]}>
                                            {revenueData.monthlyData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--secondary)' : 'var(--tertiary)'} />
                                            ))}
                                        </Bar>
                                    </ReBarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-[3rem] border border-outline-variant shadow-2xl overflow-hidden bg-surface-container">
                        <div className="px-12 py-10 border-b border-outline-variant flex items-center justify-between bg-surface-container-high/30">
                            <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Is-qoritaannada Ugu Dambeeyay</h2>
                            <span className="btn-energy px-8 py-3 text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-secondary/10">Guud ahaan: ${revenueData.totalRevenue}</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                    <tr>
                                        <th className="px-10 py-8">Ardayga (Buyer)</th>
                                        <th className="px-10 py-8">Koorsada</th>
                                        <th className="px-10 py-8 text-center">Lacagta</th>
                                        <th className="px-10 py-8 text-center">Habka</th>
                                        <th className="px-10 py-8 text-right">Ficil</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {revenueData.recentTransactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-surface-container-high/10 transition-colors group">
                                            <td className="px-10 py-8 font-black text-on-surface uppercase italic tracking-tighter text-lg flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-surface-container-high text-on-surface-variant flex items-center justify-center font-black text-xl border border-outline-variant group-hover:bg-primary group-hover:text-white transition-all">{t.student_name.charAt(0)}</div>
                                                {t.student_name}
                                            </td>
                                            <td className="px-10 py-8 font-medium text-on-surface-variant tracking-wide">{t.course_title}</td>
                                            <td className="px-10 py-8 text-center font-black text-secondary text-2xl tracking-tighter italic">${t.amount}</td>
                                            <td className="px-10 py-8 text-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant underline decoration-secondary/30">{t.provider}</td>
                                            <td className="px-10 py-8 text-right">
                                                <button
                                                    onClick={() => handleDeleteTransaction(t.id)}
                                                    className="p-4 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded-2xl border border-transparent hover:border-tertiary/20 transition-all"
                                                    title="Tirtir Diiwaanka"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {revenueData.recentTransactions.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-10 py-28 text-center text-on-surface-variant font-black uppercase tracking-widest italic opacity-50">No revenue transactions found yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {currentUser?.role === 'admin' && activeTab === 'promotions' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-600">
                    <div className="surface-container rounded-[3.5rem] border border-outline-variant shadow-2xl p-12 bg-surface-container">
                        <h2 className="text-3xl font-black text-on-surface mb-10 uppercase italic tracking-tighter">Ku dar Xayaysiis Cusub</h2>
                        <form onSubmit={handleCreatePromotion} className="grid lg:grid-cols-4 gap-8 items-end">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60">Nooca (Type)</label>
                                <select 
                                    className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-5" 
                                    value={newPromotion.type} 
                                    onChange={e => setNewPromotion({...newPromotion, type: e.target.value})}
                                >
                                    <option value="image">Sawir (Image)</option>
                                    <option value="video">Muuqaal (Video)</option>
                                </select>
                            </div>
                            <div className="lg:col-span-2 space-y-3">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60">Cinwaanka (Title)</label>
                                <input 
                                    type="text" 
                                    placeholder="Tusaale: Koorsada React 50% Off" 
                                    className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-5" 
                                    value={newPromotion.title} 
                                    onChange={e => setNewPromotion({...newPromotion, title: e.target.value})} 
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60">URL-ka (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="https://" 
                                    className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-5" 
                                    value={newPromotion.link_url} 
                                    onChange={e => setNewPromotion({...newPromotion, link_url: e.target.value})} 
                                />
                            </div>
                            <div className="lg:col-span-3 space-y-3">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60">Soo Gali Media</label>
                                <input 
                                    type="file" 
                                    accept={newPromotion.type === 'image' ? "image/*" : "video/*"}
                                    className="block w-full text-sm text-on-surface-variant file:mr-6 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-surface file:text-secondary hover:file:bg-secondary hover:file:text-surface transition-all border-2 border-outline-variant rounded-[2.5rem] p-3 shadow-inner"
                                    onChange={e => setNewPromotion({...newPromotion, media: e.target.files[0]})} 
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={uploadingPromo}
                                className="btn-energy h-[72px] flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-secondary/10"
                            >
                                {uploadingPromo ? 'Layaa soo galinayaa...' : <><Plus className="w-5 h-5"/> Save Promo</>}
                            </button>
                        </form>
                    </div>

                    <div className="glass rounded-[3rem] border border-outline-variant shadow-2xl overflow-hidden">
                        <div className="px-10 py-8 border-b border-outline-variant bg-surface-container-high/30">
                            <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Xayaysiisyada Hada Jira</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-surface-container-high/50 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                    <tr>
                                        <th className="px-10 py-8">Ka hor (Preview)</th>
                                        <th className="px-10 py-8">Cinwaanka</th>
                                        <th className="px-10 py-8 text-center">Nooca</th>
                                        <th className="px-10 py-8 text-center">Xaaladda</th>
                                        <th className="px-10 py-8 text-right">Ficil</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {promotions.map((p) => (
                                        <tr key={p.id} className="hover:bg-surface-container-high/10 transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="w-32 h-20 rounded-2xl overflow-hidden border border-outline-variant bg-surface-container">
                                                    {p.type === 'image' ? (
                                                        <img src={`${BACKEND_URL}${p.media_url}`} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                                                    ) : (
                                                        <video src={`${BACKEND_URL}${p.media_url}`} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 font-black text-on-surface uppercase italic tracking-tighter text-lg">{p.title}</td>
                                            <td className="px-10 py-8 text-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant glass-pill px-4 py-1">{p.type}</span>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <button 
                                                    onClick={() => handleTogglePromotion(p.id)}
                                                    className={`px-5 py-2 rounded-xl text-[9px] font-black tracking-widest border uppercase transition-all ${p.is_active ? 'bg-secondary/10 text-secondary border-secondary/20 shadow-[0_0_15px_rgba(0,227,243,0.1)]' : 'bg-surface-container-high text-on-surface-variant opacity-50'}`}
                                                >
                                                    {p.is_active ? 'LIVE ⚡' : 'HIDDEN 🌑'}
                                                </button>
                                            </td>
                                            <td className="px-10 py-8 text-right flex justify-end gap-3">
                                                <button 
                                                    onClick={() => handleDeletePromotion(p.id)}
                                                    className="p-4 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded-2xl border border-transparent hover:border-tertiary/20 transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {promotions.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-10 py-28 text-center text-on-surface-variant font-black uppercase tracking-widest italic opacity-50">Wax koorsada ama macalimiinta kor loogu qaadayo halkan kuma jiraan</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'assignments' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Create Assignment Form */}
                    <div className="glass rounded-[3rem] p-12 border border-outline-variant shadow-2xl relative overflow-hidden bg-surface-container">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                            <BookOpen className="w-48 h-48" />
                        </div>
                        <h2 className="text-3xl font-black text-on-surface uppercase italic tracking-tighter mb-10">Abuur Howlgal Cusub</h2>
                        <form onSubmit={handleCreateAssignment} className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-end relative z-10">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60">Dooro Koorsada</label>
                                <select 
                                    className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-5"
                                    value={newAssignment.course_id}
                                    onChange={e => setNewAssignment({...newAssignment, course_id: e.target.value})}
                                    required
                                >
                                    <option value="">-- DOORO --</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.title.toUpperCase()}</option>)}
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60">Cinwaanka Howlgalka</label>
                                <input 
                                    type="text" 
                                    className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-5" 
                                    placeholder="Tusaale: QUIZ 1"
                                    value={newAssignment.title}
                                    onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60">Xilliga loogu talagalay</label>
                                <input 
                                    type="datetime-local" 
                                    className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface py-5"
                                    value={newAssignment.due_date}
                                    onChange={e => setNewAssignment({...newAssignment, due_date: e.target.value})}
                                />
                            </div>
                            <div className="lg:col-span-3 space-y-4">
                                <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] opacity-60">Faahfaahinta Howlgalka</label>
                                <textarea 
                                    className="input-terminal bg-surface border-outline-variant focus:border-secondary text-on-surface h-[72px] py-5"
                                    placeholder="Qor waxa looga baahan yahay ardayga..."
                                    value={newAssignment.description}
                                    onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-energy h-[72px] flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-secondary/10">
                                <Plus className="w-6 h-6 border-2 border-white/20 rounded-lg p-0.5" /> SAVE
                            </button>
                        </form>
                    </div>

                    {/* Assignments List */}
                    <div className="glass rounded-[3rem] border border-outline-variant shadow-2xl overflow-hidden bg-surface-container">
                        <div className="px-12 py-10 border-b border-outline-variant bg-surface-container-high/30">
                            <h2 className="text-2xl font-black text-on-surface uppercase italic tracking-tighter">Howlgalada Jira</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                    <tr>
                                        <th className="px-10 py-8 uppercase">Koorsada</th>
                                        <th className="px-10 py-8 uppercase">Howlgalka</th>
                                        <th className="px-10 py-8 uppercase">Hada la gudbiyay</th>
                                        <th className="px-10 py-8 text-right uppercase">Ficil</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {assignments.map((a) => (
                                        <tr key={a.id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-10 py-8 font-bold text-slate-600">{a.course_title}</td>
                                            <td className="px-10 py-8">
                                                <p className="font-black text-primary uppercase italic tracking-tighter text-lg">{a.title}</p>
                                                <p className="text-xs text-slate-400 mt-1">Due: {a.due_date ? new Date(a.due_date).toLocaleString() : 'No limit'}</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <button 
                                                    onClick={() => handleViewSubmissions(a.id)}
                                                    className="flex items-center gap-2 px-6 py-3 bg-secondary/10 text-secondary rounded-2xl font-black uppercase italic tracking-widest text-[9px] hover:bg-secondary hover:text-white transition-all shadow-lg shadow-secondary/5"
                                                >
                                                    <Users className="w-4 h-4" /> Eeg Submissions
                                                </button>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="p-4 text-on-surface-variant hover:text-tertiary hover:bg-tertiary/10 rounded-2xl border border-transparent hover:border-tertiary/20 transition-all">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {assignments.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-10 py-28 text-center text-slate-400 font-black uppercase italic tracking-widest opacity-50">Wali wax assignments ah lama abuurin</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Grading Modal */}
            {gradingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-md" onClick={() => setGradingModal(null)}></div>
                    <div className="relative w-full max-w-5xl bg-surface-container-lowest rounded-[2rem] border border-outline-variant shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-8 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-primary">Student Submissions</h3>
                                <p className="text-on-surface-variant text-sm opacity-60">Grade and provide feedback for this assignment.</p>
                            </div>
                            <button onClick={() => setGradingModal(null)} className="p-3 hover:bg-surface-container-highest rounded-xl transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-10 max-h-[70vh] overflow-y-auto space-y-6">
                            {submissions.map(s => (
                                <div key={s.id} className="p-8 bg-surface-container-low rounded-2xl border border-outline-variant group hover:border-primary/20 transition-all">
                                    <div className="flex flex-wrap justify-between items-start gap-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-surface-container-lowest rounded-xl flex items-center justify-center text-primary font-bold text-xl border border-outline-variant shadow-sm">
                                                {s.student_name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-primary">{s.student_name}</h4>
                                                <p className="text-xs text-on-surface-variant opacity-60">Submitted: {new Date(s.submitted_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-[280px] space-y-4">
                                            {s.submission_text && (
                                                <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant text-sm italic">
                                                    "{s.submission_text}"
                                                </div>
                                            )}
                                            {s.file_url && (
                                                <a 
                                                    href={`${BACKEND_URL}${s.file_url}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
                                                >
                                                    <Download className="w-3.5 h-3.5" /> View File
                                                </a>
                                            )}
                                        </div>

                                        <div className="w-full lg:w-64 space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Grade</label>
                                                <input 
                                                    type="text" 
                                                    className="input-terminal py-3.5 text-center font-bold text-sm"
                                                    defaultValue={s.grade}
                                                    onChange={e => setGradingModal(prev => ({...prev, submissionId: s.id, grade: e.target.value}))}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Feedback</label>
                                                <textarea 
                                                    className="input-terminal h-20 py-3.5 text-xs"
                                                    defaultValue={s.feedback}
                                                    onChange={e => setGradingModal(prev => ({...prev, feedback: e.target.value}))}
                                                ></textarea>
                                            </div>
                                            <button 
                                                onClick={handleGradeSubmission}
                                                className="w-full btn-energy py-3.5 text-[10px]"
                                            >
                                                Save Grade
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {submissions.length === 0 && (
                                <div className="py-20 text-center text-on-surface-variant opacity-40 font-bold uppercase tracking-widest italic">No submissions found</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'certRequests' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="glass rounded-[3rem] border border-outline-variant shadow-2xl overflow-hidden bg-surface-container">
                        <div className="px-12 py-10 border-b border-outline-variant bg-secondary/5">
                            <h2 className="text-2xl font-black text-secondary uppercase italic tracking-tighter">Codsiyada Shahaadada</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                    <tr>
                                        <th className="px-10 py-8">Ardayga</th>
                                        <th className="px-10 py-8">Koorsada</th>
                                        <th className="px-10 py-8 text-center">Score</th>
                                        <th className="px-10 py-8 text-right">Ficil</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {certRequests.map((cr) => (
                                        <tr key={cr.id} className="hover:bg-secondary/5 transition-colors group">
                                            <td className="px-10 py-8 font-black text-on-surface uppercase italic tracking-tighter text-lg">{cr.student_name}</td>
                                            <td className="px-10 py-8 text-on-surface-variant font-bold">{cr.course_title}</td>
                                            <td className="px-10 py-8 text-center">
                                                <span className="text-2xl font-black text-secondary tracking-tighter">{cr.score}%</span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button 
                                                    onClick={() => setIssueModal({ id: cr.result_id, student_name: cr.student_name })}
                                                    className="btn-energy px-8 py-4 text-[10px] uppercase tracking-widest flex items-center gap-3 ml-auto shadow-lg shadow-secondary/10"
                                                >
                                                    <Award className="w-5 h-5" /> Bixi Shahaado
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {certRequests.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-10 py-28 text-center text-slate-400 font-black uppercase italic tracking-widest opacity-50">Wax codsi shahaado ah wali ma soo gaarin</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {currentUser?.role === 'admin' && activeTab === 'verifications' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="glass rounded-[3rem] border border-outline-variant shadow-2xl overflow-hidden bg-surface-container">
                        <div className="px-12 py-10 border-b border-outline-variant bg-secondary/5">
                            <h2 className="text-2xl font-black text-secondary uppercase italic tracking-tighter">Hubinta Lacagbixinta</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] border-b border-outline-variant">
                                    <tr>
                                        <th className="px-10 py-8">Ardayga</th>
                                        <th className="px-10 py-8">Koorsada</th>
                                        <th className="px-10 py-8 text-center">Lacagta</th>
                                        <th className="px-10 py-8 text-center">Taariikhda</th>
                                        <th className="px-10 py-8 text-right">Ficil</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant">
                                    {pendingEnrollments.map((pe) => (
                                        <tr key={pe.id} className="hover:bg-secondary/5 transition-colors group">
                                            <td className="px-10 py-8">
                                                <p className="font-black text-on-surface uppercase italic tracking-tighter text-lg">{pe.student_name}</p>
                                                <p className="text-xs text-on-surface-variant font-medium">{pe.student_email}</p>
                                            </td>
                                            <td className="px-10 py-8 text-on-surface-variant font-bold">{pe.course_title}</td>
                                            <td className="px-10 py-8 text-center">
                                                <span className="text-2xl font-black text-secondary tracking-tighter">${pe.price}</span>
                                            </td>
                                            <td className="px-10 py-8 text-center text-on-surface-variant font-black text-[10px] uppercase tracking-widest">
                                                {new Date(pe.enrolled_at).toLocaleString()}
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleUpdateEnrollment(pe.id, 'active')}
                                                        className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black uppercase italic tracking-widest text-[9px] hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> U Ogolaaw
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateEnrollment(pe.id, 'blocked')}
                                                        className="px-6 py-3 bg-red-500 text-white rounded-2xl font-black uppercase italic tracking-widest text-[9px] hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-2"
                                                    >
                                                        <X className="w-4 h-4" /> Diid
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingEnrollments.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-10 py-28 text-center text-slate-400 font-black uppercase italic tracking-widest opacity-50">Wax dakhli ah oo hubin sugaya hada ma jiraan</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
