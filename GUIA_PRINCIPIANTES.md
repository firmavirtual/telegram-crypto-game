# 🎓 Guía para Principiantes: Git + Render
## Deploy de tu Bot de Telegram sin experiencia previa

---

## ✅ Requisitos

Lo que necesitas (probablemente ya lo tienes):

- [x] Git Bash instalado (✅ ya lo tienes)
- [x] Cuenta de email
- [ ] Cuenta de GitHub (la crearemos)
- [ ] Cuenta de Render (la crearemos)

**Tiempo total:** 20-30 minutos (primera vez)

---

## 📚 Conceptos Básicos (Explicación Simple)

### **¿Qué es Git?**
Es como un "historial de cambios" de tu código. Te permite guardar versiones de tu proyecto.

### **¿Qué es GitHub?**
Es como "Google Drive" pero para código. Guardas tu proyecto en la nube.

### **¿Qué es Render?**
Es donde tu bot "vivirá" y estará funcionando 24/7 (gratis).

### **¿Cómo funciona todo junto?**
```
Tu PC → Git → GitHub → Render → Bot funcionando
```

---

## 🚀 PARTE 1: Preparar Git (5 minutos)

### **Paso 1.1: Abrir Git Bash**

1. Presiona **Windows + S**
2. Escribe: `git bash`
3. Click en **Git Bash** (ventana negra se abrirá)

### **Paso 1.2: Configurar Git (solo primera vez)**

En Git Bash, escribe estos comandos (presiona Enter después de cada uno):

```bash
# Configura tu nombre (usa tu nombre real o username)
git config --global user.name "Tu Nombre"

# Configura tu email (usa el email que usarás para GitHub)
git config --global user.email "tu_email@ejemplo.com"

# Verifica que funcionó
git config --list
```

**Deberías ver tu nombre y email en la lista.**

### **Paso 1.3: Navegar a tu proyecto**

```bash
# Ve a la carpeta de tu proyecto
cd "/c/Users/TAMUZ TECH/.gemini/antigravity/playground/silver-cassini"

# Verifica que estás en la carpeta correcta
pwd
```

**Deberías ver la ruta de tu proyecto.**

---

## 🌐 PARTE 2: Crear Cuenta en GitHub (5 minutos)

### **Paso 2.1: Registrarse**

1. Abre tu navegador
2. Ve a: **https://github.com/signup**
3. Completa el formulario:
   - Email: tu email
   - Password: crea una contraseña segura
   - Username: elige un nombre de usuario (ej: `tamuztech`)
4. Verifica tu email
5. Completa el cuestionario (puedes saltarlo)

### **Paso 2.2: Crear Repositorio**

1. Una vez dentro de GitHub, click en el **+** (arriba derecha)
2. Click en **"New repository"**
3. Configuración:
   - **Repository name:** `telegram-crypto-game`
   - **Description:** `Telegram Mini Game for Crypto Projects`
   - **Public** (seleccionado)
   - **NO marques** "Add a README file"
   - **NO marques** "Add .gitignore"
   - **NO marques** "Choose a license"
4. Click en **"Create repository"**

**¡Perfecto! Ahora tienes un repositorio vacío.**

### **Paso 2.3: Copiar comandos de GitHub**

GitHub te mostrará una página con comandos. **NO los ejecutes todavía.**

Verás algo como:
```
https://github.com/TU-USUARIO/telegram-crypto-game.git
```

**Copia esa URL** (la necesitarás en el siguiente paso).

---

## 💾 PARTE 3: Subir tu Código a GitHub (5 minutos)

### **Paso 3.1: Volver a Git Bash**

Asegúrate de estar en la carpeta de tu proyecto:

```bash
# Verifica que estás en la carpeta correcta
pwd
# Debería mostrar: /c/Users/TAMUZ TECH/.gemini/antigravity/playground/silver-cassini
```

### **Paso 3.2: Inicializar Git**

```bash
# Inicializa Git en tu proyecto
git init

# Verifica que funcionó (deberías ver "Initialized empty Git repository")
```

### **Paso 3.3: Agregar archivos**

```bash
# Agrega TODOS los archivos del proyecto
git add .

# Verifica qué archivos se agregaron
git status
```

**Deberías ver una lista de archivos en verde.**

### **Paso 3.4: Hacer tu primer commit**

```bash
# Guarda los cambios con un mensaje
git commit -m "Initial commit - Telegram Crypto Game"
```

**Deberías ver un resumen de archivos creados.**

### **Paso 3.5: Crear rama main**

```bash
# Renombra la rama a "main"
git branch -M main
```

### **Paso 3.6: Conectar con GitHub**

**Reemplaza `TU-USUARIO` con tu username de GitHub:**

```bash
# Conecta tu proyecto local con GitHub
git remote add origin https://github.com/TU-USUARIO/telegram-crypto-game.git

# Ejemplo real:
# git remote add origin https://github.com/tamuztech/telegram-crypto-game.git
```

### **Paso 3.7: Subir el código**

```bash
# Sube tu código a GitHub
git push -u origin main
```

**GitHub te pedirá autenticación:**

#### **Opción A: Usar GitHub CLI (Recomendado)**
1. Te abrirá el navegador
2. Click en "Authorize"
3. Listo

#### **Opción B: Usar Token**
Si te pide usuario y contraseña:
1. **NO uses tu contraseña de GitHub**
2. Necesitas crear un "Personal Access Token":
   - Ve a: https://github.com/settings/tokens
   - Click en "Generate new token (classic)"
   - Selecciona: `repo` (todos los permisos de repo)
   - Click en "Generate token"
   - **Copia el token** (solo se muestra una vez)
   - Usa ese token como contraseña

**Después de autenticar, tu código se subirá a GitHub.**

### **Paso 3.8: Verificar en GitHub**

1. Ve a: `https://github.com/TU-USUARIO/telegram-crypto-game`
2. **Deberías ver todos tus archivos ahí**
3. ✅ ¡Éxito! Tu código está en GitHub

---

## 🚀 PARTE 4: Deploy en Render (10 minutos)

### **Paso 4.1: Crear Cuenta en Render**

1. Ve a: **https://render.com**
2. Click en **"Get Started"**
3. **Importante:** Click en **"Sign up with GitHub"** (más fácil)
4. Autoriza Render a acceder a GitHub
5. Completa tu perfil

### **Paso 4.2: Crear Web Service**

1. En el dashboard de Render, click en **"New +"** (arriba derecha)
2. Selecciona **"Web Service"**
3. Click en **"Connect a repository"**
4. **Busca** tu repositorio: `telegram-crypto-game`
5. Click en **"Connect"**

### **Paso 4.3: Configurar el Servicio**

Llena el formulario:

| Campo | Qué poner |
|-------|-----------|
| **Name** | `telegram-crypto-game` (o cualquier nombre) |
| **Region** | `Oregon (US West)` (o el más cercano) |
| **Branch** | `main` |
| **Root Directory** | (dejar vacío) |
| **Runtime** | `Node` (se detecta automático) |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### **Paso 4.4: Configurar Variables de Entorno**

**Importante:** Antes de crear el servicio, necesitas agregar variables.

1. Scroll down hasta **"Environment Variables"**
2. Click en **"Add Environment Variable"**
3. Agrega estas variables **UNA POR UNA**:

**Variable 1:**
- Key: `BOT_TOKEN`
- Value: `tu_token_de_botfather` (el que obtuviste de @BotFather)

**Variable 2:**
- Key: `WEBAPP_URL`
- Value: `https://telegram-crypto-game.onrender.com` (cambia si usaste otro nombre)

**Variable 3:**
- Key: `ADMIN_USERNAME`
- Value: `admin`

**Variable 4:**
- Key: `ADMIN_PASSWORD`
- Value: `TuPasswordSeguro123` (elige una contraseña)

**Variable 5:**
- Key: `SESSION_SECRET`
- Value: `mi_secreto_aleatorio_12345` (cualquier texto aleatorio)

**Variable 6:**
- Key: `PORT`
- Value: `10000`

**Variable 7:**
- Key: `NODE_ENV`
- Value: `production`

### **Paso 4.5: Seleccionar Plan Gratuito**

1. Scroll down hasta **"Instance Type"**
2. Selecciona **"Free"**

### **Paso 4.6: Crear el Servicio**

1. Click en **"Create Web Service"** (botón azul abajo)
2. **Espera 2-5 minutos** mientras Render:
   - Clona tu código de GitHub
   - Instala dependencias (`npm install`)
   - Inicia tu servidor

**Verás logs en tiempo real. Espera hasta que diga "Live".**

### **Paso 4.7: Obtener tu URL**

1. Una vez que diga **"Live"**, verás tu URL arriba:
   ```
   https://telegram-crypto-game.onrender.com
   ```
2. **Copia esa URL**

### **Paso 4.8: Actualizar WEBAPP_URL (Importante)**

1. En Render, ve a tu servicio
2. Click en **"Environment"** (menú izquierdo)
3. Busca la variable `WEBAPP_URL`
4. Click en el lápiz (editar)
5. **Reemplaza** con tu URL real (la que copiaste)
6. Click en **"Save Changes"**
7. Render redeployará automáticamente (espera 1-2 min)

---

## 🤖 PARTE 5: Configurar el Bot en Telegram (5 minutos)

### **Paso 5.1: Abrir Telegram**

1. Abre Telegram en tu teléfono o PC
2. Busca: **@BotFather**
3. Abre la conversación

### **Paso 5.2: Configurar Menu Button**

En la conversación con @BotFather:

1. Envía: `/setmenubutton`
2. **Selecciona tu bot** de la lista
3. Te preguntará el texto del botón, envía: `🎮 Play Game`
4. Te preguntará la URL, envía tu URL de Render:
   ```
   https://telegram-crypto-game.onrender.com
   ```
5. Deberías ver: "Success! Menu button updated"

### **Paso 5.3: Configurar Comandos**

1. Envía: `/setcommands`
2. **Selecciona tu bot** de la lista
3. Copia y pega esto:
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
4. Deberías ver: "Success! Command list updated"

---

## ✅ PARTE 6: Probar tu Bot (2 minutos)

### **Paso 6.1: Abrir tu Bot**

1. En Telegram, busca tu bot (por el username que le diste)
2. Abre la conversación
3. Envía: `/start`

### **Paso 6.2: Abrir el Mini Game**

1. Deberías ver un mensaje de bienvenida
2. Abajo verás un botón: **"🎮 Play Game"**
3. **Click en el botón**
4. **Espera 30 segundos** (primera vez, el servicio está "despertando")
5. ¡Debería abrir tu mini game!

### **Paso 6.3: Probar Admin Panel**

1. Abre tu navegador
2. Ve a: `https://telegram-crypto-game.onrender.com/admin`
3. Login:
   - Usuario: `admin`
   - Password: la que pusiste en `ADMIN_PASSWORD`
4. ¡Deberías ver el panel de administración!

---

## 🎉 ¡ÉXITO!

Tu bot está funcionando en:

- **Bot de Telegram:** `https://t.me/tu_bot_username`
- **Mini Game:** `https://telegram-crypto-game.onrender.com`
- **Admin Panel:** `https://telegram-crypto-game.onrender.com/admin`

---

## 📝 Comandos de Git Bash - Resumen

Para futuras actualizaciones:

```bash
# 1. Navegar a tu proyecto
cd "/c/Users/TAMUZ TECH/.gemini/antigravity/playground/silver-cassini"

# 2. Ver cambios
git status

# 3. Agregar cambios
git add .

# 4. Guardar cambios
git commit -m "Descripción de los cambios"

# 5. Subir a GitHub
git push

# Render detectará el cambio y redeployará automáticamente
```

---

## 🐛 Problemas Comunes

### **"Permission denied" al hacer git push**
**Solución:** Necesitas autenticarte con GitHub
1. Ve a: https://github.com/settings/tokens
2. Genera un token
3. Úsalo como contraseña

### **"Build failed" en Render**
**Solución:** Revisa los logs en Render
- Probablemente falta algún archivo
- O hay un error en `package.json`

### **"Bot no responde"**
**Solución:** 
1. Verifica `BOT_TOKEN` en Render → Environment
2. Asegúrate que el servicio esté "Live"
3. Espera 30s si está "sleeping"

### **"Mini game no carga"**
**Solución:**
1. Verifica que `WEBAPP_URL` sea correcta
2. Debe ser HTTPS
3. Actualiza el menu button en @BotFather

---

## 💡 Tips

### **Ver logs en Render:**
1. Ve a tu servicio en Render
2. Click en "Logs"
3. Verás todo lo que imprime tu servidor

### **Hacer cambios:**
1. Edita archivos en tu PC
2. En Git Bash:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```
3. Render redeployará automáticamente

### **Pausar el servicio:**
1. En Render → Settings
2. Scroll down → "Suspend Service"
3. Para reactivar: "Resume Service"

---

## 📞 ¿Necesitas Ayuda?

Si te atascas en algún paso:

1. **Copia el mensaje de error exacto**
2. **Dime en qué paso estás**
3. **Envíame un screenshot si es posible**
4. ¡Te ayudo a resolverlo!

---

## 🎓 Próximos Pasos

Una vez que funcione:

1. **Personaliza** el README de GitHub
2. **Agrega screenshots** del bot
3. **Comparte** el link en tu portafolio
4. **Aprende más** sobre Git y GitHub

---

**¡Felicidades! Has deployado tu primer proyecto con Git y Render** 🎉

**Tiempo total:** ~30 minutos (primera vez)  
**Próximas veces:** ~5 minutos
