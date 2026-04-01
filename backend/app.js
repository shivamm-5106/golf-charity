const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const initDrawJob = require('./jobs/draw.job');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Init Background Jobs
initDrawJob();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// ── Security Headers ──────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ── CORS ──────────────────────────────────────────────────
const allowedOrigins = isProd
    ? [process.env.FRONTEND_URL || 'https://yourdomain.com']
    : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// ── Compression ───────────────────────────────────────────
app.use(compression());

// ── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks

// ── Global Rate Limiter ───────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' }
});
app.use('/api', globalLimiter);

// ── Stricter Auth Rate Limiter ────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // max 20 login/signup attempts per 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts. Please wait 15 minutes.' }
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/v1/auth', authLimiter, require('./src/modules/auth/routes'));
app.use('/api/v1/subscription', require('./src/modules/subscription/routes'));
app.use('/api/v1/score', require('./src/modules/score/routes'));
app.use('/api/v1/charity', require('./src/modules/charity/routes'));
app.use('/api/v1/draw', require('./src/modules/draw/routes'));
app.use('/api/v1/admin', require('./src/modules/admin/routes'));

// ── Health Check ──────────────────────────────────────────
app.get('/', (req, res) => res.json({
    status: 'ok',
    message: 'Golf Charity API Running',
    env: process.env.NODE_ENV || 'development',
    version: '1.0.0'
}));

// ── 404 Handler ───────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// ── Global Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
    console.error('[Error]', err.stack || err.message);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: isProd ? 'Internal Server Error' : err.message,
        ...(!isProd && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
