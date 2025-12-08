# 🏠 Guía de Instalación en Shared Hosting

## ⚠️ Limitaciones Importantes

Los **shared hosting** tienen limitaciones que afectan los bots de Telegram:

### ❌ **NO Funciona:**
- Procesos persistentes (el bot no puede estar "escuchando" 24/7)
- Tareas programadas (cron jobs) con Node.js
- Conexiones WebSocket persistentes

### ✅ **SÍ Funciona:**
- Webhooks (Telegram envía actualizaciones a tu URL)
- Mini game web (interfaz HTML/CSS/JS)
- API REST
- MySQL database

---

## 🎯 Soluciones Disponibles

### **Opción 1: Webhook Mode (Versión Completa)**

Usa webhooks en lugar de polling. **Requiere HTTPS (SSL)**.

**Archivos necesarios:**
- `server-shared-hosting.js` - Servidor sin cron jobs
- `bot-webhook.js` - Bot en modo webhook
- `database-mysql.js` - Base de datos MySQL
- `utils/helpers-mysql.js` - Utilidades para MySQL

### **Opción 2: Solo Mini Game (Sin Bot)**

Hospeda solo la interfaz web, el bot en otro lugar gratuito (Railway, Render).

---

## 📋 Requisitos del Shared Hosting

Para que funcione, tu hosting debe tener:

- ✅ **Node.js** instalado (v16+)
- ✅ **MySQL** database
- ✅ **SSL/HTTPS** (requerido por Telegram)
- ✅ Soporte para **subdirectorios** (ej: `/tgcriptog`)
- ✅ Acceso a **package.json** y `npm install`

---

## 🚀 Instalación Paso a Paso

### **Paso 1: Preparar Archivos**

1. **Sube estos archivos a tu hosting:**
   ```
   /public_html/tgcriptog/
   ├── server-shared-hosting.js
   ├── bot-webhook.js
   ├── database-mysql.js
   ├── package.json
   ├── .env
   ├── /public/
   ├── /routes/
   └── /utils/
   ```

2. **Crea archivo `.htaccess`** (para Apache):
   ```apache
   RewriteEngine On
   RewriteRule ^$ http://localhost:3000/ [P,L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
   ```

### **Paso 2: Configurar MySQL**

1. **Crea una base de datos** en cPanel/Plesk:
   - Nombre: `telegram_game`
   - Usuario: `tu_usuario`
   - Password: `tu_password`

2. **Anota las credenciales:**
   - Host: `localhost` (o el que te den)
   - Database: nombre de tu BD
   - User: tu usuario
   - Password: tu contraseña

### **Paso 3: Configurar Variables de Entorno**

Edita `.env`:

```env
# Bot de Telegram
BOT_TOKEN=tu_bot_token_de_botfather
BOT_USERNAME=tu_bot_username
WEBAPP_URL=https://paginaswebvenezuela.xyz/tgcriptog

# MySQL (credenciales de tu hosting)
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_password_mysql
DB_NAME=telegram_game

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=TuPasswordSeguro123

# Server
PORT=3000
SESSION_SECRET=genera_string_aleatorio_aqui
```

### **Paso 4: Instalar Dependencias**

Conéctate por SSH o usa el terminal de cPanel:

```bash
cd /home/tu_usuario/public_html/tgcriptog
npm install
```

### **Paso 5: Iniciar el Servidor**

**Opción A: Con PM2 (recomendado)**
```bash
npm install -g pm2
pm2 start server-shared-hosting.js --name telegram-game
pm2 save
pm2 startup
```

**Opción B: Con node (básico)**
```bash
node server-shared-hosting.js &
```

**Opción C: Con forever**
```bash
npm install -g forever
forever start server-shared-hosting.js
```

### **Paso 6: Configurar Proxy Reverso**

Si tu hosting usa Apache, crea/edita `.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /tgcriptog/
    
    # Redirigir todo a Node.js
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

Para Nginx, agrega en la configuración:

```nginx
location /tgcriptog/ {
    proxy_pass http://localhost:3000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### **Paso 7: Configurar Webhook en Telegram**

El webhook se configura automáticamente al iniciar el servidor, pero puedes verificarlo:

```bash
curl https://api.telegram.org/bot<TU_BOT_TOKEN>/setWebhook?url=https://paginaswebvenezuela.xyz/tgcriptog/webhook/<TU_BOT_TOKEN>
```

### **Paso 8: Probar**

1. Abre tu bot en Telegram
2. Envía `/start`
3. Click en "🎮 Play Game"
4. Debería abrir: `https://paginaswebvenezuela.xyz/tgcriptog`

---

## 🔧 Configuración Específica por Hosting

### **cPanel (Hostinger, Bluehost, etc.)**

1. **Setup Node.js App:**
   - cPanel → Software → Setup Node.js App
   - Node.js version: 16+
   - Application root: `/tgcriptog`
   - Application URL: `tgcriptog`
   - Application startup file: `server-shared-hosting.js`

2. **Variables de entorno:**
   - Agregar en cPanel las variables del `.env`

3. **Iniciar app:**
   - Click en "Start App"

### **Plesk**

1. **Node.js:**
   - Websites & Domains → Node.js
   - Enable Node.js
   - Document root: `/tgcriptog`
   - Application mode: production
   - Application startup file: `server-shared-hosting.js`

2. **Variables:**
   - Agregar en Environment Variables

### **DirectAdmin**

Similar a cPanel, busca la sección de Node.js Apps.

---

## ⚠️ Problemas Comunes

### **"Cannot find module 'mysql2'"**
```bash
cd /ruta/a/tu/proyecto
npm install
```

### **"Port 3000 already in use"**
Cambia el puerto en `.env`:
```env
PORT=3001
```

### **"Webhook failed"**
- Verifica que tu URL sea HTTPS
- Verifica que el servidor esté corriendo
- Checa los logs: `pm2 logs telegram-game`

### **"Database connection failed"**
- Verifica credenciales en `.env`
- Asegúrate que MySQL esté corriendo
- Verifica que el usuario tenga permisos

---

## 🎯 Alternativa Recomendada

Si tu shared hosting no soporta Node.js o tiene muchas limitaciones:

### **Opción Híbrida:**

1. **Bot en Railway/Render** (gratis)
   - Usa `server.js` original
   - Base de datos SQLite o PostgreSQL

2. **Mini Game en Shared Hosting**
   - Solo archivos `/public/`
   - HTML, CSS, JavaScript estático
   - Apunta el bot al shared hosting

**Ventajas:**
- ✅ Bot siempre activo
- ✅ Cron jobs funcionan
- ✅ Mini game en tu dominio

---

## 📊 Comparación de Opciones

| Característica | Shared Hosting | VPS/Cloud |
|----------------|----------------|-----------|
| Costo | $2-5/mes | Gratis-$5/mes |
| Facilidad | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Cron Jobs | ❌ | ✅ |
| Procesos 24/7 | ⚠️ Limitado | ✅ |
| MySQL | ✅ | ✅ |
| Node.js | ⚠️ Depende | ✅ |

---

## 💡 Recomendación Final

Para un **demo de portafolio profesional**, te recomiendo:

1. **Bot + Backend:** Railway.app (gratis, $5 crédito)
2. **Frontend (opcional):** Tu shared hosting
3. **Base de datos:** PostgreSQL en Railway o MySQL en hosting

Esto te da:
- ✅ Bot 100% funcional
- ✅ Todas las features trabajando
- ✅ Tu dominio personalizado
- ✅ Costo: $0

---

**¿Necesitas ayuda específica con tu hosting? ¡Dime qué hosting usas y te ayudo!** 🚀
