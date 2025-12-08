# 🚀 Quick Start Guide

## Step 1: Get Your Telegram Bot Token

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "My Crypto Game")
4. Choose a username (must end in 'bot', e.g., "mycryptogame_bot")
5. **Copy the bot token** - you'll need this!

## Step 2: Setup the Project

Run the setup script:
```powershell
.\setup.ps1
```

Or manually:
```powershell
# Copy environment file
Copy-Item .env.example .env

# Install dependencies
npm install
```

## Step 3: Configure Environment

Edit `.env` file:
```env
BOT_TOKEN=YOUR_BOT_TOKEN_HERE
WEBAPP_URL=http://localhost:3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123
```

## Step 4: Start the Server

```powershell
npm start
```

You should see:
```
Server running on port 3000
Mini game available at: http://localhost:3000
Admin panel available at: http://localhost:3000/admin
```

## Step 5: Test Locally with ngrok

For Telegram to access your local server:

1. Download ngrok: https://ngrok.com/download
2. Run: `ngrok http 3000`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Update `.env`: `WEBAPP_URL=https://abc123.ngrok.io`
5. Restart the server

## Step 6: Configure Your Bot

Send these to @BotFather:

### Set Commands
```
/setcommands
```
Then select your bot and paste:
```
start - Start the game
play - Open the mini game
profile - View your profile
missions - View available missions
leaderboard - View top players
referral - Get your referral link
wallet - Set your wallet address
help - Show help message
```

### Set Menu Button
```
/setmenubutton
```
- Select your bot
- Button text: `🎮 Play Game`
- Web App URL: Your WEBAPP_URL (e.g., `https://abc123.ngrok.io`)

## Step 7: Update Bot Username in Code

Edit `public/js/app.js` line 241:
```javascript
const botUsername = 'your_bot_username'; // Replace with your actual bot username
```

## Step 8: Test Your Bot!

1. Open Telegram
2. Search for your bot
3. Send `/start`
4. Click "🎮 Play Game" button
5. The mini game should open!

## Step 9: Access Admin Panel

1. Open browser: `http://localhost:3000/admin.html`
2. Login with credentials from `.env`
3. Manage users, missions, and more!

## 🎉 You're All Set!

### What's Next?

- ✅ Customize missions in the admin panel
- ✅ Change colors in `public/css/style.css`
- ✅ Adjust airdrop requirements in `utils/helpers.js`
- ✅ Deploy to production (Heroku, Railway, etc.)

### Common Issues

**Bot not responding?**
- Check BOT_TOKEN is correct
- Make sure server is running
- Verify bot is not already running elsewhere

**Mini game not loading?**
- Use HTTPS URL (ngrok for local testing)
- Check browser console for errors
- Verify WEBAPP_URL in .env

**Need help?**
- Read the full README.md
- Check the code comments
- Review Telegram Bot API docs

---

**Happy coding! 🚀**
