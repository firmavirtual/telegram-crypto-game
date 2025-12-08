# ⚡ Deploy Rápido en Render.com - Checklist

## 📋 Checklist de 5 Minutos

### ✅ Paso 1: Preparar Proyecto (2 min)

```powershell
# Ejecuta este script
.\prepare-deploy.ps1

# O manualmente:
git init
git add .
git commit -m "Deploy to Render"
```

**Archivos necesarios:**
- ✅ `server.js`
- ✅ `bot.js`
- ✅ `database.js`
- ✅ `package.json`
- ✅ `/public/`, `/routes/`, `/utils/`

---

### ✅ Paso 2: Subir a GitHub (2 min)

1. **Crea repo en GitHub:** https://github.com/new
   - Nombre: `telegram-crypto-game`
   - Público

2. **Sube código:**
   ```bash
   git remote add origin https://github.com/TU-USUARIO/telegram-crypto-game.git
   git push -u origin main
   ```

---

### ✅ Paso 3: Deploy en Render (3 min)

1. **Ve a:** https://render.com
2. **Regístrate** con GitHub
3. **New +** → **Web Service**
4. **Conecta** tu repositorio
5. **Configura:**
   - Name: `telegram-crypto-game`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: **Free**

6. **Variables de entorno:**
   ```
   BOT_TOKEN=tu_token_aqui
   WEBAPP_URL=https://telegram-crypto-game.onrender.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=tu_password
   SESSION_SECRET=random_string
   PORT=10000
   ```

7. **Create Web Service**

---

### ✅ Paso 4: Configurar Bot (2 min)

**Habla con @BotFather en Telegram:**

1. **Menu button:**
   ```
   /setmenubutton
   ```
   - Texto: `🎮 Play Game`
   - URL: `https://telegram-crypto-game.onrender.com`

2. **Comandos:**
   ```
   /setcommands
   ```
   Pega:
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

---

### ✅ Paso 5: Probar (1 min)

1. Abre tu bot en Telegram
2. Envía `/start`
3. Click en "🎮 Play Game"
4. ¡Debería funcionar!

---

## 🎯 URLs Finales

Después del deploy tendrás:

- **Bot:** `https://t.me/tu_bot_username`
- **Mini Game:** `https://telegram-crypto-game.onrender.com`
- **Admin Panel:** `https://telegram-crypto-game.onrender.com/admin`

---

## ⚠️ Importante

**El servicio se duerme después de 15 min sin uso.**
- Primera petición tarda ~30 segundos
- Luego funciona normal
- Es normal en el plan gratuito

---

## 🐛 Errores Comunes

### "Build failed"
→ Verifica `package.json` tenga `"start": "node server.js"`

### "Bot no responde"
→ Verifica `BOT_TOKEN` en Render → Environment

### "Mini game no carga"
→ Actualiza `WEBAPP_URL` con tu URL real de Render

---

## 📞 Ayuda

¿Atascado en algún paso?
1. Revisa los logs en Render
2. Lee la guía completa: `RENDER_DEPLOY.md`
3. ¡Pregúntame!

---

**Tiempo total: ~10 minutos** ⏱️

**¡Éxito!** 🚀
