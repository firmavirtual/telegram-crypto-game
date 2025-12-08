# 🚀 Pasos Rápidos para Deploy en Railway

## Opción A: Deploy desde GitHub (Recomendado)

### 1. Sube tu código a GitHub

```powershell
# Inicializa git
git init

# Agrega todos los archivos
git add .

# Commit
git commit -m "Initial commit - Telegram Crypto Mini Game"

# Crea repositorio en GitHub y conecta
git remote add origin https://github.com/TU-USUARIO/telegram-crypto-game.git
git branch -M main
git push -u origin main
```

### 2. Deploy en Railway

1. Ve a [railway.app](https://railway.app)
2. Click en "Start a New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway a acceder a GitHub
5. Selecciona tu repositorio `telegram-crypto-game`
6. Railway detectará automáticamente Node.js

### 3. Configura Variables de Entorno

En Railway, ve a tu proyecto → Variables:

```
BOT_TOKEN=tu_bot_token_de_botfather
WEBAPP_URL=https://tu-proyecto.up.railway.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=TuPasswordSeguro123
SESSION_SECRET=genera_un_string_aleatorio_aqui
PORT=3000
```

### 4. Obtén tu URL

- Railway te asignará una URL automáticamente
- Ejemplo: `https://telegram-crypto-game-production.up.railway.app`
- Copia esta URL

### 5. Actualiza WEBAPP_URL

- En Railway → Variables
- Cambia `WEBAPP_URL` a tu URL real
- Railway redeployará automáticamente

### 6. Configura el Bot en Telegram

Abre Telegram y habla con @BotFather:

```
/setmenubutton
```
- Selecciona tu bot
- Texto del botón: `🎮 Play Game`
- URL: Tu URL de Railway (ej: `https://tu-proyecto.up.railway.app`)

### 7. ¡Prueba tu bot!

1. Busca tu bot en Telegram
2. Envía `/start`
3. Click en "🎮 Play Game"
4. ¡Debería abrir tu mini game!

---

## Opción B: Deploy con Railway CLI

```powershell
# 1. Instala Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Inicializa proyecto
railway init

# 4. Agrega variables de entorno
railway variables set BOT_TOKEN=tu_token
railway variables set ADMIN_USERNAME=admin
railway variables set ADMIN_PASSWORD=tu_password

# 5. Deploy
railway up

# 6. Obtén la URL
railway domain
```

---

## 📝 Checklist Post-Deployment

- [ ] Bot deployado en Railway
- [ ] Variables de entorno configuradas
- [ ] URL obtenida de Railway
- [ ] WEBAPP_URL actualizada con URL real
- [ ] Menu button configurado en @BotFather
- [ ] Bot probado en Telegram
- [ ] Admin panel accesible en `/admin`

---

## 🎯 URLs Importantes

Después del deployment tendrás:

- **Mini Game:** `https://tu-proyecto.up.railway.app`
- **Admin Panel:** `https://tu-proyecto.up.railway.app/admin`
- **Bot de Telegram:** `https://t.me/tu_bot_username`

---

## 🆘 Problemas Comunes

### "Bot no responde"
✅ Verifica que BOT_TOKEN esté correcto en Railway
✅ Checa los logs en Railway
✅ Asegúrate que el deployment fue exitoso

### "Mini game no carga"
✅ Verifica que WEBAPP_URL sea HTTPS
✅ Actualiza el menu button en @BotFather
✅ Limpia caché del navegador

### "Base de datos se resetea"
✅ En Railway, agrega un volumen persistente
✅ O considera usar PostgreSQL en vez de SQLite

---

## 💡 Tips para Portafolio

1. **Personaliza el README**
   - Agrega tu nombre y links
   - Sube screenshots
   - Describe el proyecto

2. **Haz el repo público**
   - Muestra tu código
   - Agrega una licencia MIT

3. **Documenta bien**
   - Explica decisiones técnicas
   - Muestra arquitectura
   - Incluye diagramas si es posible

4. **Demo en vivo**
   - Comparte el link del bot
   - Agrega credenciales de admin demo
   - Graba un video demo

---

**¡Listo! Tu proyecto estará en vivo en menos de 10 minutos** 🚀
