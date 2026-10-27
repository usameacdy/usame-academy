const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const examRoutes = require('./routes/examRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security Middleware
app.use(helmet({ 
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false 
}));

// Allow requests from frontend (dev, github pages, vercel, production)
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://usameacdy.github.io',
    'https://usame-academy.vercel.app',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.github.io') || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
}));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // Increased limit
});
app.use('/api', limiter);

// Serve uploads with streaming & CORS headers
app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoints (keeps Render awake & allows monitoring)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'EduFlow Backend is running!',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'EduFlow API Server - Usama Academy',
        version: '1.0.0',
        status: 'online'
    });
});

// Routes
// Direct Admin Reset Password Route
app.put('/api/auth/reset-admin/:id', require('./middleware/auth').protect, require('./middleware/auth').authorize('admin'), require('./controllers/authController').adminResetPassword);

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
