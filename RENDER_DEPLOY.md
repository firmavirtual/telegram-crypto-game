# 🚀 Guía Completa: Deploy en Render.com

## ✅ Ventajas de Render.com

- ✅ **Completamente gratis** (tier gratuito)
- ✅ **HTTPS automático**
- ✅ **Deploy desde GitHub** automático
- ✅ **PostgreSQL gratis** incluido
- ✅ **Fácil configuración**
- ⚠️ Se "duerme" después de 15 min sin uso (tarda ~30s en despertar)

---

## 📋 Paso 1: Preparar el Proyecto

### **Opción A: Usar SQLite (Más Simple)**

**Archivos a usar:**
- ✅ `server.js` (versión original)
- ✅ `database.js` (SQLite)
- ✅ `bot.js` (polling mode)
- ✅ Todo en `/public/`, `/routes/`, `/utils/`

**Ventaja:** No necesitas configurar base de datos externa.

**Desventaja:** Los datos se pierden al redeploy (Render reinicia el contenedor).

---

### **Opción B: Usar PostgreSQL (Recomendado para Producción)**

**Archivos a usar:**
- ✅ `server.js`
- ✅ `database-postgres.js` (lo crearemos)
- ✅ `bot.js`
- ✅ Todo en `/public/`, `/routes/`, `/utils/`

**Ventaja:** Datos persistentes, no se pierden.

**Desventaja:** Configuración adicional.

---

## 🎯 Opción Recomendada: SQLite (Para Demo)

Para un demo de portafolio, SQLite es suficiente. Los datos se resetean al redeploy, pero es más simple.

---

## 📦 Paso 2: Preparar Archivos para GitHub

### **1. Asegúrate de tener estos archivos:**

```
silver-cassini/
├── server.js              ✅ (versión original)
├── bot.js                 ✅ (versión original)
├── database.js            ✅ (SQLite)
├── package.json           ✅
├── .gitignore             ✅
├── render.yaml            ✅ (ya existe)
├── /public/               ✅
├── /routes/               ✅
└── /utils/                ✅
```

### **2. Verifica `package.json`:**

Debe tener el script `start`:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### **3. Crea archivo `.gitignore`** (si no existe):

```
node_modules/
.env
database.sqlite
*.log
```

---

## 📤 Paso 3: Subir a GitHub

### **Opción A: Desde la Terminal**

```powershell
# 1. Inicializar Git (si no está inicializado)
git init

# 2. Agregar archivos
git add .

# 3. Commit
git commit -m "Deploy to Render - Telegram Crypto Game"

# 4. Crear repositorio en GitHub
# Ve a: https://github.com/new
# Nombre: telegram-crypto-game
# Público o Privado (tu eliges)

# 5. Conectar y subir
git remote add origin https://github.com/TU-USUARIO/telegram-crypto-game.git
git branch -M main
git push -u origin main
```

### **Opción B: Usar GitHub Desktop**

1. Abre GitHub Desktop
2. File → Add Local Repository
3. Selecciona la carpeta del proyecto
4. Commit changes
5. Publish repository

---

## 🌐 Paso 4: Deploy en Render.com

### **1. Crear Cuenta**

1. Ve a [render.com](https://render.com)
2. Click en "Get Started"
3. Regístrate con GitHub (recomendado)

### **2. Crear Web Service**

1. En el dashboard, click en **"New +"**
2. Selecciona **"Web Service"**
3. Click en **"Connect a repository"**
4. Autoriza Render a acceder a GitHub
5. Selecciona tu repositorio `telegram-crypto-game`

### **3. Configurar el Service**

**Configuración básica:**

| Campo | Valor |
|-------|-------|
| **Name** | `telegram-crypto-game` (o el que prefieras) |
| **Region** | `Oregon (US West)` o el más cercano |
| **Branch** | `main` |
| **Root Directory** | (dejar vacío) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### **4. Variables de Entorno**

Click en **"Advanced"** y agrega estas variables:

```env
BOT_TOKEN=tu_bot_token_de_botfather
WEBAPP_URL=https://telegram-crypto-game.onrender.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=TuPasswordSeguro123
SESSION_SECRET=genera_un_string_aleatorio_aqui
PORT=10000
NODE_ENV=production
```

**Importante:** 
- `WEBAPP_URL` será tu URL de Render (la obtienes después del deploy)
- `PORT` debe ser `10000` (Render usa este puerto)

### **5. Deploy**

1. Click en **"Create Web Service"**
2. Render comenzará a:
   - Clonar tu repositorio
   - Instalar dependencias (`npm install`)
   - Iniciar el servidor (`npm start`)

**Tiempo estimado:** 2-5 minutos

---

## 🔧 Paso 5: Configurar el Bot

### **1. Obtener tu URL de Render**

Después del deploy, Render te dará una URL como:
```
https://telegram-crypto-game.onrender.com
```

### **2. Actualizar WEBAPP_URL**

1. En Render, ve a tu servicio
2. Click en **"Environment"**
3. Edita `WEBAPP_URL` con tu URL real
4. Click en **"Save Changes"**
5. Render redeployará automáticamente

### **3. Configurar Menu Button en Telegram**

Abre Telegram y habla con [@BotFather](https://t.me/botfather):

```
/setmenubutton
```

- Selecciona tu bot
- Texto del botón: `🎮 Play Game`
- URL: `https://telegram-crypto-game.onrender.com`

### **4. Configurar Comandos del Bot**

Envía a @BotFather:

```
/setcommands
```

Selecciona tu bot y pega:

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

## ✅ Paso 6: Probar el Bot

1. **Abre Telegram**
2. **Busca tu bot** (por el username)
3. **Envía** `/start`
4. **Click** en "🎮 Play Game"
5. **Debería abrir** tu mini game

**URLs importantes:**
- Mini Game: `https://telegram-crypto-game.onrender.com`
- Admin Panel: `https://telegram-crypto-game.onrender.com/admin`

---

## 🔄 Paso 7: Auto-Deploy (Opcional)

Render hace auto-deploy cada vez que haces push a GitHub:

```bash
# Hacer cambios en el código
git add .
git commit -m "Update: descripción del cambio"
git push

# Render detectará el cambio y redeployará automáticamente
```

---

## ⚠️ Limitaciones del Plan Gratuito

### **Free Tier de Render:**

1. **Se duerme después de 15 minutos** de inactividad
   - Primera petición tarda ~30 segundos en responder
   - Luego funciona normal

2. **750 horas gratis al mes**
   - Suficiente para un demo
   - Si se duerme, no cuenta horas

3. **Datos se pierden con SQLite**
   - Al redeploy, la BD se resetea
   - Solución: Usar PostgreSQL (ver abajo)

---

## 🗄️ Opción Avanzada: PostgreSQL (Datos Persistentes)

Si quieres que los datos NO se pierdan:

### **1. Crear PostgreSQL Database en Render**

1. En Render dashboard, click **"New +"**
2. Selecciona **"PostgreSQL"**
3. Configuración:
   - Name: `telegram-game-db`
   - Database: `telegram_game`
   - User: (auto-generado)
   - Region: Mismo que tu web service
   - Plan: **Free**

4. Click **"Create Database"**

### **2. Conectar a tu Web Service**

1. Ve a tu Web Service
2. Click en **"Environment"**
3. Agrega variable:
   ```
   DATABASE_URL=internal_connection_string_de_render
   ```
   (Render te da este string en la página de la BD)

### **3. Actualizar código para PostgreSQL**

Necesitarías adaptar `database.js` para usar PostgreSQL en lugar de SQLite.

**Para simplificar, te recomiendo usar SQLite para el demo.**

---

## 📊 Monitoreo y Logs

### **Ver Logs en Tiempo Real:**

1. Ve a tu servicio en Render
2. Click en **"Logs"**
3. Verás todo lo que imprime `console.log()`

### **Verificar Estado:**

1. Dashboard → Tu servicio
2. Verás:
   - Status: `Live` (activo) o `Sleeping` (dormido)
   - Último deploy
   - Uso de recursos

---

## 🐛 Troubleshooting

### **"Build failed"**

**Causa:** Error en `npm install`

**Solución:**
1. Verifica que `package.json` esté correcto
2. Checa logs de build en Render
3. Asegúrate que todas las dependencias existan

### **"Application failed to start"**

**Causa:** Error al ejecutar `npm start`

**Solución:**
1. Verifica que `server.js` exista
2. Checa que el puerto sea `process.env.PORT`
3. Revisa logs en Render

### **"Bot no responde"**

**Causa:** `BOT_TOKEN` incorrecto o bot dormido

**Solución:**
1. Verifica `BOT_TOKEN` en Environment
2. Si está dormido, envía `/start` y espera 30s
3. Checa logs para ver errores

### **"Mini game no carga"**

**Causa:** `WEBAPP_URL` incorrecto

**Solución:**
1. Verifica que `WEBAPP_URL` sea tu URL de Render
2. Debe ser HTTPS
3. Actualiza en @BotFather el menu button

### **"Service keeps sleeping"**

**Solución:** Esto es normal en el plan gratuito. Opciones:
1. Usar un servicio de "keep-alive" (ping cada 10 min)
2. Upgrade a plan de pago ($7/mes)
3. Aceptar el delay de 30s

---

## 💡 Tips para Portafolio

### **1. README atractivo**

Agrega a tu README de GitHub:

```markdown
## 🚀 Live Demo

- **Bot de Telegram:** [@tu_bot_username](https://t.me/tu_bot_username)
- **Mini Game:** [https://telegram-crypto-game.onrender.com](https://telegram-crypto-game.onrender.com)
- **Admin Panel:** [Demo Admin](https://telegram-crypto-game.onrender.com/admin)
  - Usuario: `demo`
  - Contraseña: `demo123`

**Nota:** El servicio puede tardar ~30s en despertar si no se ha usado recientemente.
```

### **2. Screenshots**

Agrega capturas de pantalla:
- Home del mini game
- Missions screen
- Leaderboard
- Admin panel

### **3. Badge de Deploy**

Agrega al README:

```markdown
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)
```

---

## 📋 Checklist Final

Antes de compartir tu demo:

- [ ] Bot deployado en Render
- [ ] Variables de entorno configuradas
- [ ] `WEBAPP_URL` actualizada
- [ ] Menu button configurado en @BotFather
- [ ] Comandos configurados en @BotFather
- [ ] Bot probado (enviar `/start`)
- [ ] Mini game abre correctamente
- [ ] Admin panel accesible
- [ ] README actualizado con links
- [ ] Screenshots agregados

---

## 🎉 ¡Listo!

Tu bot estará en vivo en:
- **Bot:** `https://t.me/tu_bot_username`
- **Mini Game:** `https://telegram-crypto-game.onrender.com`
- **Admin:** `https://telegram-crypto-game.onrender.com/admin`

---

## 📞 ¿Necesitas Ayuda?

Si tienes algún error específico:
1. Copia el mensaje de error de los logs
2. Dime en qué paso estás
3. ¡Te ayudo a resolverlo!

---

**¡Éxito con tu deploy!** 🚀
