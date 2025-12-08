# Telegram Crypto Mini Game Bot

A comprehensive Telegram mini game for crypto/social projects with user onboarding, missions, leaderboard, referral system, and airdrop eligibility tracking.

## 🚀 Features

### User Features
- ✅ **User Onboarding** - Seamless registration via Telegram
- 💰 **Wallet Address Collection** - Secure wallet integration
- 🔗 **Social Media Linking** - Connect X, Instagram, TikTok, YouTube, Facebook
- 📋 **Daily & Weekly Missions** - Task system with proof submission
- ⭐ **Points System** - Earn points for completing missions
- 🏆 **Leaderboard** - Compete with other players
- 👥 **Referral System** - Invite friends and earn rewards
- 🎁 **Airdrop Eligibility** - Track qualification status
- 📱 **Beautiful Mini Game UI** - Modern, responsive design

### Admin Features
- 📊 **Dashboard** - Real-time statistics
- 👤 **User Management** - View, search, ban/unban users
- 📝 **Mission Management** - Create, edit, activate/deactivate missions
- ✅ **Review Submissions** - Approve/reject mission proofs
- 📢 **Broadcast Messages** - Send to all or selected users
- 📅 **Automated Reminders** - Daily check-in reminders
- 🏅 **Weekly Announcements** - Automatic winner announcements
- 📥 **CSV Export** - Export user data with all details
- 🛡️ **Anti-Spam Protection** - Rate limiting and CAPTCHA support

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- A domain or ngrok for hosting (for Telegram Web App)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd silver-cassini
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Telegram Bot Configuration
BOT_TOKEN=your_telegram_bot_token_here
WEBAPP_URL=https://your-domain.com

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_password
ADMIN_TELEGRAM_IDS=123456789,987654321

# Server Configuration
PORT=3000
SESSION_SECRET=your_random_session_secret_here

# Database
DB_PATH=./database.sqlite
```

### 4. Get your Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token and paste it in `.env` file
5. Send `/setdomain` to BotFather and set your web app URL
6. Send `/setmenubutton` to add a menu button for your mini game

### 5. Start the server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## 🌐 Deployment

### Using ngrok (for testing)
```bash
ngrok http 3000
```
Copy the HTTPS URL and update `WEBAPP_URL` in `.env`

### Production Deployment

Deploy to platforms like:
- **Heroku**
- **Railway**
- **DigitalOcean**
- **AWS**
- **Vercel** (with serverless functions)

Make sure to:
1. Set all environment variables
2. Use HTTPS (required by Telegram)
3. Update `WEBAPP_URL` with your production domain

## 📱 Setting Up the Mini Game

### 1. Configure Bot Commands

Send these commands to [@BotFather](https://t.me/botfather):

```
/setcommands

start - Start the game
play - Open the mini game
profile - View your profile
missions - View available missions
leaderboard - View top players
referral - Get your referral link
wallet - Set your wallet address
help - Show help message
```

### 2. Set Menu Button

```
/setmenubutton
Select your bot
Send the button text: "🎮 Play Game"
Send the web app URL: https://your-domain.com
```

### 3. Update Bot Username

In `public/js/app.js`, update line 241:
```javascript
const botUsername = 'YourActualBotUsername';
```

## 🎮 Usage

### For Users

1. Start the bot: `/start`
2. Click "🚀 Play Game" to open the mini game
3. Complete daily check-ins and missions
4. Link social media accounts
5. Add wallet address
6. Invite friends using referral link
7. Climb the leaderboard!

### For Admins

1. Access admin panel: `http://your-domain.com/admin.html`
2. Login with credentials from `.env`
3. Manage users, missions, and broadcasts
4. Review mission submissions
5. Export user data

## 📊 Database Schema

The application uses SQLite with the following tables:

- **users** - User information and points
- **social_links** - Social media connections
- **missions** - Available missions
- **user_missions** - Mission completion tracking
- **referrals** - Referral relationships
- **leaderboard** - Cached leaderboard data
- **airdrop_eligibility** - Airdrop qualification status
- **broadcasts** - Message broadcast history
- **activity_log** - Anti-spam tracking

## 🔧 Customization

### Airdrop Requirements

Edit `utils/helpers.js` to change eligibility criteria:

```javascript
function calculateAirdropEligibility(user, socialLinks, referralCount) {
  const minPoints = 1000;        // Change minimum points
  const minReferrals = 3;        // Change minimum referrals
  const minSocialLinks = 3;      // Change minimum social links
  // ...
}
```

### Mission Types

Default missions are created in `database.js`. You can:
- Add more missions via admin panel
- Edit existing missions
- Change point rewards
- Set frequency (once, daily, weekly)

### Scheduled Tasks

Configured in `server.js`:
- Leaderboard updates: Every hour
- Airdrop eligibility: Every 6 hours
- Daily reminders: 10 AM daily
- Weekly winners: Monday 12 PM

## 🎨 Customization

### Colors and Branding

Edit `public/css/style.css` CSS variables:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #ec4899;
  --success-color: #10b981;
  /* ... */
}
```

### Adding New Features

1. Add database tables in `database.js`
2. Create API routes in `routes/api.js`
3. Update frontend in `public/js/app.js`
4. Style in `public/css/style.css`

## 🔒 Security

- ✅ Session-based admin authentication
- ✅ Anti-spam rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS protection
- ⚠️ For production: Use HTTPS, strong passwords, and consider adding 2FA

## 📝 API Endpoints

### Public API
- `GET /api/user/:telegramId` - Get user data
- `POST /api/user/:telegramId/wallet` - Update wallet
- `POST /api/user/:telegramId/social` - Add social link
- `GET /api/missions` - Get all missions
- `POST /api/user/:telegramId/missions/:missionId/submit` - Submit mission
- `GET /api/leaderboard` - Get leaderboard
- `POST /api/user/:telegramId/checkin` - Daily check-in

### Admin API (requires authentication)
- `POST /admin/login` - Admin login
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - Get all users
- `POST /admin/users/:id/ban` - Ban/unban user
- `GET /admin/missions` - Get all missions
- `POST /admin/missions` - Create mission
- `GET /admin/missions/pending` - Get pending submissions
- `POST /admin/missions/submissions/:id/review` - Review submission
- `POST /admin/broadcast` - Send broadcast message
- `GET /admin/export/users` - Export users CSV

## 🐛 Troubleshooting

### Bot not responding
- Check `BOT_TOKEN` in `.env`
- Ensure server is running
- Check bot permissions

### Mini game not loading
- Verify `WEBAPP_URL` is correct and uses HTTPS
- Check browser console for errors
- Ensure Telegram Web App SDK is loaded

### Database errors
- Delete `database.sqlite` and restart (will reset all data)
- Check file permissions

## 📄 License

MIT License - feel free to use for your project!

## 🤝 Support

For issues and questions:
- Check the troubleshooting section
- Review the code comments
- Open an issue on GitHub

## 🎉 Credits

Built with:
- Node.js & Express
- Telegram Bot API
- SQLite
- jQuery
- Font Awesome
- Google Fonts (Inter)

---

**Happy Gaming! 🚀**
