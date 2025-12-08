# Project Structure

```
silver-cassini/
│
├── 📁 public/                    # Frontend files
│   ├── 📁 css/
│   │   └── style.css            # Main stylesheet (premium design)
│   ├── 📁 js/
│   │   └── app.js               # Frontend JavaScript (jQuery)
│   ├── index.html               # Mini game interface
│   └── admin.html               # Admin panel interface
│
├── 📁 routes/                    # API routes
│   ├── api.js                   # Public API endpoints
│   └── admin.js                 # Admin API endpoints
│
├── 📁 utils/                     # Utility functions
│   ├── helpers.js               # Helper functions
│   └── scheduler.js             # Scheduled tasks
│
├── 📁 exports/                   # CSV export directory
│
├── 📄 server.js                  # Main Express server
├── 📄 bot.js                     # Telegram bot logic
├── 📄 database.js                # SQLite database setup
├── 📄 package.json               # Dependencies
├── 📄 .env.example               # Environment variables template
├── 📄 .gitignore                 # Git ignore rules
├── 📄 README.md                  # Full documentation
├── 📄 QUICKSTART.md              # Quick start guide
└── 📄 setup.ps1                  # Setup script
```

## Key Files Explained

### Backend
- **server.js** - Express server with routes and scheduled tasks
- **bot.js** - Telegram bot commands and handlers
- **database.js** - SQLite database schema and initialization
- **routes/api.js** - User-facing API endpoints
- **routes/admin.js** - Admin panel API endpoints
- **utils/helpers.js** - Utility functions (referral codes, spam detection, etc.)
- **utils/scheduler.js** - Automated tasks (reminders, announcements)

### Frontend
- **public/index.html** - Main mini game interface
- **public/css/style.css** - Premium dark theme with gradients
- **public/js/app.js** - Frontend logic with jQuery
- **public/admin.html** - Admin dashboard

### Configuration
- **.env** - Your configuration (create from .env.example)
- **package.json** - Node.js dependencies
- **database.sqlite** - SQLite database (auto-created)

## Features by File

### User Features (bot.js + public/)
✅ /start - User onboarding
✅ /play - Open mini game
✅ /profile - View profile
✅ /missions - View missions
✅ /leaderboard - Top players
✅ /referral - Referral link
✅ /wallet - Set wallet address

### Admin Features (routes/admin.js + admin.html)
✅ Dashboard with statistics
✅ User management (ban/unban)
✅ Mission management (CRUD)
✅ Review mission submissions
✅ Broadcast messages
✅ CSV export

### Automated Tasks (utils/scheduler.js)
✅ Hourly leaderboard updates
✅ 6-hour airdrop eligibility checks
✅ Daily reminders (10 AM)
✅ Weekly winner announcements (Monday 12 PM)

## Database Tables

1. **users** - User profiles and points
2. **social_links** - Social media connections
3. **missions** - Available missions
4. **user_missions** - Completion tracking
5. **referrals** - Referral relationships
6. **leaderboard** - Cached rankings
7. **airdrop_eligibility** - Qualification status
8. **broadcasts** - Message history
9. **activity_log** - Anti-spam tracking
