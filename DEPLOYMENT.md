# 🚀 Guía de Deployment Gratuito

## Opciones de Hosting Gratuito

### 🌟 Opción 1: Railway.app (RECOMENDADO)

**Ventajas:**
- ✅ $5 USD gratis al mes
- ✅ Deploy automático
- ✅ HTTPS incluido
- ✅ Fácil configuración

**Pasos:**

1. **Crea cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Regístrate con GitHub

2. **Sube tu código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```

3. **Deploy en Railway**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Elige tu repositorio
   - Railway detectará automáticamente que es Node.js

4. **Configura Variables de Entorno**
   En Railway, ve a Variables y agrega:
   ```
   BOT_TOKEN=tu_bot_token
   WEBAPP_URL=https://tu-proyecto.up.railway.app
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=tu_password
   SESSION_SECRET=random_string_here
   PORT=3000
   ```

5. **Obtén tu URL**
   - Railway te dará una URL como: `https://tu-proyecto.up.railway.app`
   - Actualiza `WEBAPP_URL` con esta URL
   - Actualiza en @BotFather el menu button con esta URL

6. **Redeploy**
   - Cada push a GitHub redeploya automáticamente

---

### 🌟 Opción 2: Render.com

**Ventajas:**
- ✅ Completamente gratis
- ✅ HTTPS automático
- ⚠️ Se duerme después de 15 min sin uso

**Pasos:**

1. **Crea cuenta en Render**
   - Ve a [render.com](https://render.com)
   - Regístrate con GitHub

2. **Sube código a GitHub** (igual que Railway)

3. **Crea Web Service**
   - Click en "New +"
   - Selecciona "Web Service"
   - Conecta tu repositorio
   - Configuración:
     - **Name**: telegram-crypto-game
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

4. **Variables de Entorno**
   Agrega en Environment:
   ```
   BOT_TOKEN=tu_bot_token
   WEBAPP_URL=https://tu-proyecto.onrender.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=tu_password
   SESSION_SECRET=random_string
   ```

5. **Deploy**
   - Render deployará automáticamente
   - Te dará una URL: `https://tu-proyecto.onrender.com`

**Nota importante:** En el plan gratuito, el servicio se "duerme" después de 15 minutos de inactividad. La primera petición después de dormir toma ~30 segundos.

---

### 🌟 Opción 3: Fly.io

**Pasos:**

1. **Instala Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Inicializa app**
   ```bash
   fly launch
   ```

4. **Configura secretos**
   ```bash
   fly secrets set BOT_TOKEN=tu_token
   fly secrets set WEBAPP_URL=https://tu-app.fly.dev
   fly secrets set ADMIN_USERNAME=admin
   fly secrets set ADMIN_PASSWORD=tu_password
   fly secrets set SESSION_SECRET=random_string
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

---

### 🌟 Opción 4: Vercel (Para frontend + serverless)

**Nota:** Vercel es mejor para frontend. Para el bot necesitarías separar frontend y backend.

---

## 📋 Checklist Pre-Deployment

Antes de deployar, asegúrate de:

- [ ] Código subido a GitHub
- [ ] `.env` en `.gitignore` (no subir secretos)
- [ ] Variables de entorno configuradas en la plataforma
- [ ] Bot token obtenido de @BotFather
- [ ] `package.json` tiene script `"start": "node server.js"`

---

## 🔧 Configuración Post-Deployment

1. **Actualiza Bot en Telegram**
   - Abre @BotFather
   - `/setmenubutton`
   - Selecciona tu bot
   - URL: Tu URL de deployment (ej: `https://tu-proyecto.up.railway.app`)

2. **Actualiza variable WEBAPP_URL**
   - En tu plataforma de hosting
   - Cambia `WEBAPP_URL` a tu URL real
   - Redeploy si es necesario

3. **Prueba el bot**
   - Abre Telegram
   - Busca tu bot
   - `/start`
   - Click en "🎮 Play Game"

---

## 💡 Consejos para Demo de Portafolio

1. **README atractivo**
   - Agrega screenshots
   - Describe las features
   - Link al bot de Telegram

2. **Demo en vivo**
   - Comparte el link del bot
   - Agrega credenciales de admin demo en README

3. **Video/GIF**
   - Graba un demo del bot funcionando
   - Súbelo a tu README

4. **Documentación**
   - Explica la arquitectura
   - Menciona tecnologías usadas
   - Muestra código destacado

---

## 🆘 Troubleshooting

### Bot no responde
- Verifica que `BOT_TOKEN` esté correcto
- Checa logs en tu plataforma de hosting
- Asegúrate que el servidor esté corriendo

### Mini game no carga
- Verifica que `WEBAPP_URL` sea HTTPS
- Checa que apunte a tu deployment
- Actualiza en @BotFather

### Base de datos se resetea
- Railway: Usa volúmenes persistentes
- Render: Considera usar PostgreSQL en vez de SQLite
- Fly.io: Configura volúmenes

---

## 📊 Comparación de Plataformas

| Plataforma | Gratis | HTTPS | Auto-deploy | Persistencia | Mejor para |
|------------|--------|-------|-------------|--------------|------------|
| Railway    | $5/mes | ✅    | ✅          | ✅           | **Demo profesional** |
| Render     | ✅     | ✅    | ✅          | ⚠️           | Pruebas rápidas |
| Fly.io     | ✅     | ✅    | ✅          | ✅           | Producción |
| Vercel     | ✅     | ✅    | ✅          | ❌           | Solo frontend |

---

## 🎯 Mi Recomendación

Para un **demo de portafolio**, usa **Railway.app**:
- Profesional
- Confiable
- Fácil de configurar
- $5 gratis es suficiente para un demo

---

**¿Necesitas ayuda con el deployment? ¡Pregúntame!** 🚀
