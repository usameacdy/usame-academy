import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import Loading from './Loading';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (!loading && user) {
            if (roles.length > 0 && !roles.includes(user.role)) {
                navigate('/');
            } else if (user.role === 'instructor' && user.is_locked && location.pathname !== '/pay-rent') {
                navigate('/pay-rent');
            }
        }
    }, [user, loading, navigate, roles, location]);

    if (loading) return <Loading />;

    if (user && user.role === 'instructor' && user.is_locked && location.pathname !== '/pay-rent') {
        return null; // Prevents flashing content before redirect
    }

    return user && (roles.length === 0 || roles.includes(user.role)) ? children : null;
};

export default ProtectedRoute;
