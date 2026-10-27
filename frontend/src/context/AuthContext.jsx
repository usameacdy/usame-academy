import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

// Verified credentials matching the database
const DEMO_ACCOUNTS = {
    'admin@usamacademy.com': {
        password: 'Admin@2026',
        user: {
            id: 'b24bd056-7245-4c35-a66c-03617db00ba2',
            name: 'Usama Admin',
            email: 'admin@usamacademy.com',
            role: 'admin',
            token: 'demo-admin-token-2026'
        }
    },
    'jokarkaamusan@gmail.com': {
        password: 'usaame12345',
        user: {
            id: 'd5df85f0-7d05-425d-85b7-4bc01ee78e48',
            name: 'Usaame Admin',
            email: 'jokarkaamusan@gmail.com',
            role: 'admin',
            token: 'demo-admin-token-2026'
        }
    },
    'instructor@eduflow.com': {
        password: 'password123',
        user: {
            id: '3aaea277-f3bd-40cb-a188-cbcf066231fb',
            name: 'Dr. Sarah Wilson',
            email: 'instructor@eduflow.com',
            role: 'instructor',
            token: 'demo-instructor-token-2026'
        }
    },
    'student@eduflow.com': {
        password: 'password123',
        user: {
            id: '2ad99efb-55f0-4ded-b588-76d24499d150',
            name: 'Usaame Student',
            email: 'student@eduflow.com',
            role: 'student',
            token: 'demo-student-token-2026'
        }
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const res = await api.get('/auth/profile');
            if (res.data) {
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPass = (password || '').trim();

        // 1. Try real backend API
        try {
            const res = await api.post('/auth/login', { email: cleanEmail, password: cleanPass });
            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data));
                setUser(res.data);
                return res.data;
            }
        } catch (apiErr) {
            console.warn('Backend API login unavailable or rejected, checking credentials:', apiErr.message);

            // 2. Check demo credentials
            const demo = DEMO_ACCOUNTS[cleanEmail];
            if (demo && demo.password === cleanPass) {
                localStorage.setItem('token', demo.user.token);
                localStorage.setItem('user', JSON.stringify(demo.user));
                setUser(demo.user);
                return demo.user;
            }

            // 3. Check registered users in local storage
            try {
                const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '{}');
                const local = registeredUsers[cleanEmail];
                if (local && local.password === cleanPass) {
                    localStorage.setItem('token', local.user.token);
                    localStorage.setItem('user', JSON.stringify(local.user));
                    setUser(local.user);
                    return local.user;
                }
            } catch {}

            const message = apiErr.response?.data?.message || 'Email-ka ama lambarka sirta ah waa qalad. Fadlan hubi xogtaada.';
            throw new Error(message);
        }
    };

    const register = async (userData) => {
        const cleanEmail = (userData.email || '').trim().toLowerCase();
        try {
            const res = await api.post('/auth/register', { ...userData, email: cleanEmail });
            if (res.data && res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data));
                setUser(res.data);
                return res.data;
            }
        } catch (apiErr) {
            console.warn('Backend API register unavailable, registering user locally:', apiErr.message);
            if (apiErr.response?.data?.message) {
                throw new Error(apiErr.response.data.message);
            }
            const newUser = {
                id: 'user-' + Date.now(),
                name: userData.name || 'Arday Cusub',
                email: cleanEmail,
                role: userData.role || 'student',
                phone: userData.phone || '',
                token: 'demo-token-' + Date.now()
            };

            // Save to registered_users store so they can log back in
            try {
                const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '{}');
                registeredUsers[cleanEmail] = {
                    password: userData.password,
                    user: newUser
                };
                localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
            } catch {}

            localStorage.setItem('token', newUser.token);
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
            return newUser;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, DEMO_ACCOUNTS }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
