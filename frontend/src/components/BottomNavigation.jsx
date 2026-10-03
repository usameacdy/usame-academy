import { useNavigate } from 'react-router-dom';
import { Home, BookOpen, Book, User } from 'lucide-react';

const BottomNavigation = ({ activeTab }) => {
    const navigate = useNavigate();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E1E2E9] px-6 py-3 flex items-center justify-between z-50 md:hidden">
            {activeTab === 'home' ? (
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-[#80F2E0] px-6 py-2 rounded-full flex flex-col items-center">
                        <Home className="w-6 h-6 text-[#1A1C1E]" />
                        <span className="text-[10px] font-black text-[#1A1C1E]">Hoy</span>
                    </div>
                </div>
            ) : (
                <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-[#44474E] opacity-70">
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Hoy</span>
                </button>
            )}

            {activeTab === 'courses' ? (
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-[#80F2E0] px-6 py-2 rounded-full flex flex-col items-center">
                        <BookOpen className="w-6 h-6 text-[#1A1C1E]" />
                        <span className="text-[10px] font-black text-[#1A1C1E]">Koorsooyinka</span>
                    </div>
                </div>
            ) : (
                <button onClick={() => navigate('/courses')} className="flex flex-col items-center gap-1 text-[#44474E] opacity-70">
                    <BookOpen className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Koorsooyinka</span>
                </button>
            )}

            {activeTab === 'reading' ? (
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-[#80F2E0] px-6 py-2 rounded-full flex flex-col items-center">
                        <Book className="w-6 h-6 text-[#1A1C1E]" />
                        <span className="text-[10px] font-black text-[#1A1C1E]">Akhris</span>
                    </div>
                </div>
            ) : (
                <button className="flex flex-col items-center gap-1 text-[#44474E] opacity-70">
                    <Book className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Akhris</span>
                </button>
            )}

            {activeTab === 'profile' ? (
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-[#80F2E0] px-6 py-2 rounded-full flex flex-col items-center">
                        <User className="w-6 h-6 text-[#1A1C1E]" />
                        <span className="text-[10px] font-black text-[#1A1C1E]">Profile</span>
                    </div>
                </div>
            ) : (
                <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-1 text-[#44474E] opacity-70">
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            )}
        </nav>
    );
};

export default BottomNavigation;
