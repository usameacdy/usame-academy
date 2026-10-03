import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import BottomNavigation from '../components/BottomNavigation';
import {
    Search,
    ChevronRight,
    Home,
    BookOpen,
    Book,
    User,
    LogOut,
    Bell,
    Settings as SettingsIcon,
    Code,
    Palette,
    Terminal,
    Award
} from 'lucide-react';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        courses: 12,
        series: 5,
        hours: 150
    });

    const completedCourses = [
        { id: 1, title: 'Web Development', icon: Code, color: 'bg-blue-600', status: 'La dhammaystiray' },
        { id: 2, title: 'UI/UX Design', icon: Palette, color: 'bg-teal-400', status: 'La dhammaystiray' },
        { id: 3, title: 'Python Basics', icon: Terminal, color: 'bg-orange-700', status: 'La dhammaystiray' },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-manrope text-[#1A1C1E] pb-24">
            
            {/* TOP BAR */}
            <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D47A1&color=fff`} 
                            alt="avatar" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-xl font-extrabold text-[#0D47A1] tracking-tight">Baro Hadda</h1>
                </div>
                <button className="p-2 text-[#44474E]">
                    <Search className="w-6 h-6" />
                </button>
            </header>

            <div className="p-6 space-y-10">
                
                {/* PROFILE INFO */}
                <div className="flex flex-col items-center gap-4 py-4">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full border-[5px] border-white shadow-xl overflow-hidden bg-white">
                            <img 
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1587&auto=format&fit=crop" 
                                alt="profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-extrabold text-[#1A1C1E] tracking-tight">{user?.name || 'Maxamed Axmed'}</h2>
                        <p className="text-sm font-medium text-[#44474E] mt-1">{user?.email || 'maxamed@email.com'}</p>
                    </div>
                </div>

                {/* STATS ROW */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { value: stats.courses, label: 'Koorsooyinka' },
                        { value: stats.series, label: 'Taxane' },
                        { value: stats.hours, label: 'Saacadood' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-[#E1E2E9] text-center flex flex-col items-center justify-center">
                            <p className="text-xl font-black text-[#0D47A1]">{stat.value}</p>
                            <p className="text-[10px] font-bold text-[#44474E] uppercase tracking-wide mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* COMPLETED COURSES */}
                <div className="space-y-4">
                    <h3 className="text-lg font-extrabold text-[#1A1C1E] tracking-tight">Koorsooyinka Dhamaaday</h3>
                    <div className="space-y-3">
                        {completedCourses.map((course) => (
                            <div key={course.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-[#E1E2E9] flex items-center justify-between group active:scale-[0.98] transition-transform">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 ${course.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                        <course.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-[15px] text-[#1A1C1E]">{course.title}</h4>
                                        <p className="text-[11px] font-bold text-[#26A69A] mt-1">{course.status}</p>
                                    </div>
                                </div>
                                <Award className="w-6 h-6 text-[#A8AAB4]" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* SETTINGS LIST */}
                <div className="space-y-4">
                    <h3 className="text-lg font-extrabold text-[#1A1C1E] tracking-tight">Habaynta</h3>
                    <div className="bg-white rounded-[1.5rem] shadow-sm border border-[#E1E2E9] overflow-hidden">
                        {[
                            { label: 'Beddel Macluumaadka', icon: User, color: 'text-[#44474E]', onClick: () => {} },
                            { label: 'Ogeysiisyada', icon: Bell, color: 'text-[#44474E]', onClick: () => {} },
                            { label: 'Ka Bax', icon: LogOut, color: 'text-red-500', onClick: logout }
                        ].map((item, i) => (
                            <button 
                                key={i}
                                onClick={item.onClick}
                                className={`w-full p-6 flex items-center justify-between group active:bg-[#F8F9FB] transition-colors ${i !== 2 ? 'border-b border-[#E1E2E9]' : ''}`}
                            >
                                <div className="flex items-center gap-5">
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                    <span className={`font-bold text-[15px] ${item.color === 'text-red-500' ? 'text-red-600' : 'text-[#1A1C1E]'}`}>{item.label}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-[#A8AAB4] group-hover:translate-x-1 transition-transform" />
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* BOTTOM NAVIGATION */}
            <BottomNavigation activeTab="profile" />
        </div>
    );
};

export default Settings;
