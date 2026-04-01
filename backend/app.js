const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const initDrawJob = require('./jobs/draw.job');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Init Background Jobs
initDrawJob();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Load routes
app.use('/api/v1/auth', require('./src/modules/auth/routes'));
app.use('/api/v1/subscription', require('./src/modules/subscription/routes'));
app.use('/api/v1/score', require('./src/modules/score/routes'));
app.use('/api/v1/charity', require('./src/modules/charity/routes'));
app.use('/api/v1/draw', require('./src/modules/draw/routes'));

// Basic health check
app.get('/', (req, res) => res.send('Golf Charity API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Server] Server started on port ${PORT}`));
