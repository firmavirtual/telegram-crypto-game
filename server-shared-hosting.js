require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const db = require('./database-mysql');
const { bot, setWebhook, processUpdate } = require('./bot-webhook');

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
app.use('/api', require('./routes/api-mysql'));
app.use('/admin', require('./routes/admin-mysql'));

// Serve the mini game
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Webhook endpoint for Telegram
app.post(`/webhook/${process.env.BOT_TOKEN}`, async (req, res) => {
    try {
        await processUpdate(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.sendStatus(500);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Mini game available at: ${process.env.WEBAPP_URL || `http://localhost:${PORT}`}`);
    console.log(`Admin panel available at: ${process.env.WEBAPP_URL || `http://localhost:${PORT}`}/admin`);

    // Set webhook for Telegram bot
    if (process.env.WEBAPP_URL) {
        await setWebhook();
    } else {
        console.log('⚠️  WEBAPP_URL not set. Webhook not configured.');
    }
});
