require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const cron = require('node-cron');

const db = require('./database');
const bot = require('./bot');
const { updateLeaderboard, checkAirdropEligibility, sendDailyReminders, announceWeeklyWinners } = require('./utils/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));

// Serve the mini game
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Scheduled tasks
// Update leaderboard every hour
cron.schedule('0 * * * *', () => {
    console.log('Updating leaderboard...');
    updateLeaderboard();
});

// Check airdrop eligibility every 6 hours
cron.schedule('0 */6 * * *', () => {
    console.log('Checking airdrop eligibility...');
    checkAirdropEligibility();
});

// Send daily reminders at 10 AM
cron.schedule('0 10 * * *', () => {
    console.log('Sending daily reminders...');
    sendDailyReminders();
});

// Announce weekly winners every Monday at 12 PM
cron.schedule('0 12 * * 1', () => {
    console.log('Announcing weekly winners...');
    announceWeeklyWinners();
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Mini game available at: http://localhost:${PORT}`);
    console.log(`Admin panel available at: http://localhost:${PORT}/admin`);
});
