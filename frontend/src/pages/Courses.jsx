import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, CheckCircle, Star, BookOpen, Play } from 'lucide-react';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    
    const BACKEND_URL = import.meta.env.VITE_API_URL.replace('/api', '');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                setCourses(res.data);
                setFilteredCourses(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        let results = courses.filter(c => 
            (c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             c.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategory === 'All' || c.category === selectedCategory)
        );

        if (sortBy === 'price-low') results.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') results.sort((a, b) => b.price - a.price);
        if (sortBy === 'newest') results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setFilteredCourses(results);
    }, [searchTerm, selectedCategory, sortBy, courses]);

    const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];

    if (loading) return <div className="text-center py-20 text-xl font-bold">Loading Courses...</div>;

    return (
        <div className="space-y-12 relative pb-20">
            <div className="glow-purple -top-40 -left-40 opacity-10" />
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-on-surface uppercase tracking-tight italic">
                        Sahami <span className="text-secondary">Koorsooyinka</span>
                    </h1>
                    <p className="text-on-surface-variant text-lg font-medium tracking-wide">Ka xulo boqolaal barnaamijyo oo ay diyaariyeen khubaro.</p>
                </div>

                {/* ADVANCED FILTER BAR */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                        <input 
                            type="text" 
                            placeholder="Raadi magaca koorsada..." 
                            className="input-terminal pl-14 py-4 border-outline-variant focus:border-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select 
                            className="input-terminal py-4 px-6 min-w-[140px] appearance-none"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <select 
                            className="input-terminal py-4 px-6 min-w-[140px]"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Kuwa Cusub</option>
                            <option value="price-low">Qiimaha: Low to High</option>
                            <option value="price-high">Qiimaha: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence mode="popLayout">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            whileHover={{ y: -10 }}
                            className="glass rounded-3xl overflow-hidden group border border-outline-variant hover:border-secondary/40 transition-all duration-500 shadow-lg"
                            onClick={() => navigate(`/courses/${course.id}`)}
                        >
                            <div className="aspect-video bg-surface-container-high relative flex items-center justify-center text-white overflow-hidden">
                                {course.thumbnail_url ? (
                                    <img
                                        src={`${BACKEND_URL}${course.thumbnail_url}`}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center">
                                        <Play className="w-12 h-12 text-secondary/40 group-hover:text-secondary group-hover:scale-125 transition-all duration-500" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 glass-pill text-[10px] py-1">
                                    {course.category || 'Core'}
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-xl font-black text-on-surface line-clamp-1 uppercase italic tracking-tight group-hover:text-secondary transition-colors">{course.title}</h3>
                                    <div className="flex items-center text-secondary font-black text-sm">
                                        <Star className="w-4 h-4 fill-current mr-1" />
                                        <span>4.8</span>
                                    </div>
                                </div>
                                <p className="text-on-surface-variant line-clamp-2 text-sm leading-relaxed font-medium">{course.description}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-outline-variant">
                                    <span className="text-2xl font-black text-on-surface tracking-tighter">${course.price}</span>
                                    <Link to={`/courses/${course.id}`} className="text-secondary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 group/btn">
                                        Faahfaahin <BookOpen className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-28 text-center glass rounded-[3rem] border border-dashed border-outline-variant">
                        <p className="text-on-surface-variant text-lg font-medium tracking-wide">Waqtigan ma jiraan koorsooyin la heli karo. Fadlan dib u soo hubi mar kale!</p>
                    </div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Courses;
