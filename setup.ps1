# Create .env file from .env.example
Copy-Item .env.example .env

Write-Host "✅ Created .env file"
Write-Host ""
Write-Host "⚠️  IMPORTANT: Edit .env file and add your configuration:"
Write-Host "   - BOT_TOKEN (get from @BotFather on Telegram)"
Write-Host "   - WEBAPP_URL (your domain or ngrok URL)"
Write-Host "   - ADMIN_USERNAME and ADMIN_PASSWORD"
Write-Host ""
Write-Host "📦 Installing dependencies..."
npm install

Write-Host ""
Write-Host "✅ Setup complete!"
Write-Host ""
Write-Host "🚀 To start the server:"
Write-Host "   npm start          (production)"
Write-Host "   npm run dev        (development with auto-reload)"
Write-Host ""
Write-Host "📱 Access points:"
Write-Host "   Mini Game: http://localhost:3000"
Write-Host "   Admin Panel: http://localhost:3000/admin.html"
