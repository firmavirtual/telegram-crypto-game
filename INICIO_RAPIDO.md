# ⚡ INICIO RÁPIDO - Para Principiantes
## Deploy en Render con Git Bash (30 minutos)

---

## 🎯 LO QUE VAS A HACER (Resumen)

1. ✅ Configurar Git Bash (5 min)
2. ✅ Crear cuenta en GitHub (5 min)
3. ✅ Subir tu código a GitHub (5 min)
4. ✅ Crear cuenta en Render (2 min)
5. ✅ Deploy en Render (10 min)
6. ✅ Configurar bot en Telegram (3 min)

**Total: ~30 minutos**

---

## 📝 PASO 1: Git Bash (5 min)

### **Abrir Git Bash:**
1. Presiona **Windows + S**
2. Escribe: `git bash`
3. Click en Git Bash

### **Configurar (solo primera vez):**

Copia y pega estos comandos en Git Bash (cambia con tus datos):

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu_email@ejemplo.com"
```

### **Ir a tu proyecto:**

```bash
cd "/c/Users/TAMUZ TECH/.gemini/antigravity/playground/silver-cassini"
```

✅ **Listo el Paso 1**

---

## 🌐 PASO 2: GitHub (5 min)

### **Crear cuenta:**
1. Ve a: **https://github.com/signup**
2. Completa el formulario
3. Verifica tu email

### **Crear repositorio:**
1. Click en **+** (arriba derecha)
2. Click en **"New repository"**
3. Nombre: `telegram-crypto-game`
4. Tipo: **Public**
5. **NO marques nada más**
6. Click en **"Create repository"**

### **Copiar URL:**
Verás algo como:
```
https://github.com/TU-USUARIO/telegram-crypto-game.git
```
**Copia esa URL** (la usarás después)

✅ **Listo el Paso 2**

---

## 💾 PASO 3: Subir Código (5 min)

### **En Git Bash, copia y pega estos comandos:**

```bash
# 1. Inicializar Git
git init

# 2. Agregar archivos
git add .

# 3. Guardar cambios
git commit -m "Initial commit - Telegram Crypto Game"

# 4. Crear rama main
git branch -M main

# 5. Conectar con GitHub (REEMPLAZA TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/telegram-crypto-game.git

# 6. Subir código
git push -u origin main
```

**Te pedirá autenticación:**
- Si se abre el navegador → Click en "Authorize"
- Si pide usuario/password → Necesitas crear un token:
  1. Ve a: https://github.com/settings/tokens
  2. "Generate new token (classic)"
  3. Marca: `repo`
  4. Copia el token
  5. Úsalo como password

### **Verificar:**
Ve a: `https://github.com/TU-USUARIO/telegram-crypto-game`

**¿Ves tus archivos?** ✅ **¡Perfecto!**

✅ **Listo el Paso 3**

---

## 🚀 PASO 4: Render (10 min)

### **Crear cuenta:**
1. Ve a: **https://render.com**
2. Click en **"Get Started"**
3. **"Sign up with GitHub"** ← Importante
4. Autoriza Render

### **Crear servicio:**
1. Click en **"New +"**
2. Click en **"Web Service"**
3. Busca: `telegram-crypto-game`
4. Click en **"Connect"**

### **Configurar:**

| Campo | Valor |
|-------|-------|
| Name | `telegram-crypto-game` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | **Free** |

### **Variables de entorno:**

Click en "Advanced" y agrega estas 7 variables:

```
BOT_TOKEN = tu_token_de_botfather
WEBAPP_URL = https://telegram-crypto-game.onrender.com
ADMIN_USERNAME = admin
ADMIN_PASSWORD = TuPassword123
SESSION_SECRET = secreto_aleatorio_123
PORT = 10000
NODE_ENV = production
```

### **Crear:**
1. Click en **"Create Web Service"**
2. **Espera 3-5 minutos**
3. Cuando diga **"Live"** → ¡Listo!

### **Copiar URL:**
Verás tu URL arriba:
```
https://telegram-crypto-game.onrender.com
```
**Copia esa URL**

### **Actualizar WEBAPP_URL:**
1. Click en **"Environment"**
2. Edita `WEBAPP_URL`
3. Pega tu URL real
4. **"Save Changes"**
5. Espera 1-2 min (redeploy automático)

✅ **Listo el Paso 4**

---

## 🤖 PASO 5: Telegram (3 min)

### **Abrir @BotFather:**
1. Abre Telegram
2. Busca: `@BotFather`

### **Configurar menu button:**
```
/setmenubutton
```
- Selecciona tu bot
- Texto: `🎮 Play Game`
- URL: `https://telegram-crypto-game.onrender.com`

### **Configurar comandos:**
```
/setcommands
```
- Selecciona tu bot
- Pega esto:
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

✅ **Listo el Paso 5**

---

## ✅ PASO 6: Probar (2 min)

1. **Busca tu bot** en Telegram
2. **Envía:** `/start`
3. **Click en:** "🎮 Play Game"
4. **Espera 30 segundos** (primera vez)
5. **¡Debería abrir tu mini game!**

---

## 🎉 ¡ÉXITO!

Tu bot está funcionando en:

- **Bot:** `https://t.me/tu_bot_username`
- **Mini Game:** `https://telegram-crypto-game.onrender.com`
- **Admin:** `https://telegram-crypto-game.onrender.com/admin`

---

## 🐛 Si Algo Sale Mal

### **Bot no responde:**
→ Verifica `BOT_TOKEN` en Render → Environment

### **Mini game no carga:**
→ Espera 30 segundos (el servicio está despertando)

### **Error en Git:**
→ Lee el mensaje de error y busca en: `GIT_COMANDOS.md`

### **Error en Render:**
→ Click en "Logs" para ver qué pasó

---

## 📚 Guías Completas

Si te atascas, lee estas guías:

1. **`GUIA_PRINCIPIANTES.md`** ← Guía completa paso a paso
2. **`GIT_COMANDOS.md`** ← Todos los comandos de Git
3. **`RENDER_DEPLOY.md`** ← Detalles de Render

---

## 💡 Consejos

### **Copiar/Pegar en Git Bash:**
- **Copiar:** Selecciona + Click derecho
- **Pegar:** Click derecho

### **Si te pierdes:**
```bash
# Ver dónde estás
pwd

# Ir a tu proyecto
cd "/c/Users/TAMUZ TECH/.gemini/antigravity/playground/silver-cassini"
```

### **Para actualizar después:**
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

---

## 📞 ¿Necesitas Ayuda?

1. Copia el mensaje de error
2. Dime en qué paso estás
3. ¡Te ayudo!

---

**¡Tú puedes! Es más fácil de lo que parece** 💪

**Tiempo total: 30 minutos** ⏱️
