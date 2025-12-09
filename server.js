require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const db = require('./database');
const bot = require('./bot');

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
    cookie: { secure: false }
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

// Scheduled tasks temporarily disabled to ensure stability
console.log('Note: Scheduled tasks (cron jobs) are temporarily disabled');

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
    console.log('✅ Bot is ready to receive commands');
});
