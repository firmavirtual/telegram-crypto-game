# 🏠 Versión Shared Hosting - Resumen Rápido

## ✅ ¿Qué se creó?

He adaptado el proyecto para funcionar en **shared hosting con MySQL**:

### **Archivos Nuevos:**

1. **`database-mysql.js`** - Base de datos MySQL (en vez de SQLite)
2. **`bot-webhook.js`** - Bot en modo webhook (en vez de polling)
3. **`server-shared-hosting.js`** - Servidor sin cron jobs
4. **`utils/helpers-mysql.js`** - Utilidades para MySQL
5. **`.htaccess`** - Configuración Apache
6. **`SHARED_HOSTING.md`** - Guía completa de instalación

### **Archivos Actualizados:**

- **`package.json`** - Agregado `mysql2`, scripts separados
- **`.env.example`** - Configuración MySQL

---

## ⚠️ Limitaciones de Shared Hosting

### **NO Funcionará:**
- ❌ Tareas programadas (recordatorios diarios, anuncios semanales)
- ❌ Actualización automática de leaderboard
- ❌ Proceso persistente del bot (usa webhooks en su lugar)

### **SÍ Funcionará:**
- ✅ Bot de Telegram (con webhooks)
- ✅ Mini game completo
- ✅ Sistema de puntos y misiones
- ✅ Leaderboard (actualización manual)
- ✅ Referidos
- ✅ Admin panel
- ✅ Base de datos MySQL

---

## 🎯 Dos Opciones para Ti

### **Opción 1: Todo en Shared Hosting** ⚠️

**Pros:**
- Todo en un solo lugar
- Usas tu dominio

**Contras:**
- Sin tareas automáticas
- Requiere HTTPS (SSL)
- Configuración más compleja

**Archivos a usar:**
- `server-shared-hosting.js`
- `database-mysql.js`
- `bot-webhook.js`

**Pasos:**
1. Sube archivos a `/public_html/tgcriptog/`
2. Configura MySQL en cPanel
3. Edita `.env` con credenciales MySQL
4. `npm install`
5. Inicia con PM2 o forever
6. Configura `.htaccess`

---

### **Opción 2: Híbrida (RECOMENDADO)** ⭐

**Bot + Backend:** Railway.app (gratis)  
**Frontend:** Tu shared hosting (opcional)

**Pros:**
- ✅ Todas las features funcionan
- ✅ Tareas automáticas activas
- ✅ Más fácil de configurar
- ✅ Gratis

**Contras:**
- Dos lugares diferentes

**Pasos:**
1. **Deploy bot en Railway:**
   - Usa archivos originales (`server.js`, `database.js`)
   - Sigue `DEPLOY_RAPIDO.md`
   - Obtén URL: `https://tu-proyecto.up.railway.app`

2. **Opcional - Frontend en tu hosting:**
   - Sube solo carpeta `/public/`
   - Configura para que apunte a Railway

---

## 📊 Comparación

| Característica | Shared Hosting | Railway (Gratis) |
|----------------|----------------|------------------|
| Costo | $2-5/mes | $0 (con $5 crédito) |
| Setup | Complejo | Fácil (5 min) |
| Tareas automáticas | ❌ | ✅ |
| Tu dominio | ✅ | ⚠️ Subdominio |
| MySQL | ✅ | PostgreSQL/SQLite |
| Mantenimiento | Manual | Automático |

---

## 💡 Mi Recomendación

Para un **demo de portafolio**, te sugiero:

### **🌟 Mejor Opción: Railway.app**

**Por qué:**
1. ✅ **Gratis** ($5 crédito mensual)
2. ✅ **Todas las features** funcionan
3. ✅ **Deploy en 5 minutos**
4. ✅ **Profesional** (siempre activo)
5. ✅ **Fácil de mostrar** en portafolio

**Cómo:**
```bash
# 1. Prepara proyecto
.\prepare-deploy.ps1

# 2. Sube a GitHub
git remote add origin https://github.com/TU-USUARIO/telegram-game.git
git push -u origin main

# 3. Deploy en Railway
# Ve a railway.app → "Deploy from GitHub repo"
```

**Resultado:**
- Bot funcionando: `https://t.me/tu_bot`
- Mini game: `https://tu-proyecto.up.railway.app`
- Admin: `https://tu-proyecto.up.railway.app/admin`

---

### **Si insistes en Shared Hosting:**

Lee la guía completa: **`SHARED_HOSTING.md`**

**Requisitos mínimos:**
- Node.js 16+
- MySQL
- SSL/HTTPS
- SSH access o cPanel con Node.js

---

## 🚀 Próximos Pasos

### **Para Railway (Recomendado):**
1. Ejecuta: `.\prepare-deploy.ps1`
2. Sigue: `DEPLOY_RAPIDO.md`
3. ¡Listo en 10 minutos!

### **Para Shared Hosting:**
1. Lee: `SHARED_HOSTING.md`
2. Configura MySQL
3. Sube archivos
4. Configura `.htaccess`
5. Inicia servidor

---

## 📞 ¿Necesitas Ayuda?

**Dime:**
1. ¿Qué hosting específico usas? (Hostinger, Bluehost, etc.)
2. ¿Tiene Node.js instalado?
3. ¿Tiene SSL/HTTPS?

Y te ayudo con la configuración específica! 😊

---

## 📁 Estructura de Archivos

```
Versión Original (VPS/Cloud):
├── server.js
├── database.js (SQLite)
├── bot.js (polling)
└── Con cron jobs ✅

Versión Shared Hosting:
├── server-shared-hosting.js
├── database-mysql.js (MySQL)
├── bot-webhook.js (webhooks)
├── .htaccess
└── Sin cron jobs ❌
```

---

**¿Cuál opción prefieres? ¡Dime y te guío paso a paso!** 🎯
