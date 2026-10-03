import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import Courses from './pages/Courses';
import AdminPanel from './pages/AdminPanel';
import CreateCourse from './pages/CreateCourse';
import About from './pages/About';
import LessonPlayer from './pages/LessonPlayer';
import TakeExam from './pages/TakeExam';
import CourseManager from './pages/CourseManager';
import Settings from './pages/Settings';
import PayRent from './pages/PayRent';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isSpecialPage = location.pathname.includes('/lessons/') || 
                        location.pathname.includes('/exam');

  const isFullWidthPage = location.pathname === '/' || location.pathname === '/about' || location.pathname === '/contact' || location.pathname === '/privacy' || location.pathname === '/terms';
  const isDashboardPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/lesson/') || location.pathname.startsWith('/exam/');


  if (isSpecialPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboardPage && <Navbar />}
      {isFullWidthPage || isDashboardPage ? (
        <main className="flex-grow w-full">
          {children}
        </main>
      ) : (
        <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
          {children}
        </main>
      )}
      {!isDashboardPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/create" element={
              <ProtectedRoute roles={['admin']}>
                <CreateCourse />
              </ProtectedRoute>
            } />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={
              <ProtectedRoute>
                <LessonPlayer />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/exam" element={
              <ProtectedRoute>
                <TakeExam />
              </ProtectedRoute>
            } />
            <Route path="/courses/:id/manage" element={
              <ProtectedRoute roles={['admin', 'instructor']}>
                <CourseManager />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute roles={['admin', 'instructor']}>
                <AdminPanel />
              </ProtectedRoute>
            } />

            <Route path="/pay-rent" element={
              <ProtectedRoute roles={['instructor']}>
                <PayRent />
              </ProtectedRoute>
            } />

            <Route path="/contact" element={<Contact />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </LayoutWrapper>
        <WhatsAppButton />
      </Router>
    </AuthProvider>
  );
}

export default App;
