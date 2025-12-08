# 🎯 Comandos de Git Bash - Cheat Sheet

## 📍 Comandos Básicos para Navegar

```bash
# Ver dónde estás
pwd

# Listar archivos en la carpeta actual
ls

# Ir a una carpeta
cd nombre_carpeta

# Ir a la carpeta de tu proyecto
cd "/c/Users/TAMUZ TECH/.gemini/antigravity/playground/silver-cassini"

# Volver a la carpeta anterior
cd ..

# Ir a tu carpeta de usuario
cd ~

# Limpiar la pantalla
clear
```

---

## 🔧 Configuración Inicial (Solo Primera Vez)

```bash
# Configurar tu nombre
git config --global user.name "Tu Nombre"

# Configurar tu email
git config --global user.email "tu_email@ejemplo.com"

# Ver tu configuración
git config --list

# Ver solo tu nombre
git config user.name

# Ver solo tu email
git config user.email
```

---

## 📦 Comandos de Git - Primera Vez

```bash
# 1. Ir a tu proyecto
cd "/c/Users/TAMUZ TECH/.gemini/antigravity/playground/silver-cassini"

# 2. Inicializar Git
git init

# 3. Agregar todos los archivos
git add .

# 4. Hacer el primer commit
git commit -m "Initial commit"

# 5. Crear rama main
git branch -M main

# 6. Conectar con GitHub (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/telegram-crypto-game.git

# 7. Subir a GitHub
git push -u origin main
```

---

## 🔄 Comandos para Actualizar (Después de Cambios)

```bash
# 1. Ver qué archivos cambiaron
git status

# 2. Agregar todos los cambios
git add .

# O agregar un archivo específico
git add nombre_archivo.js

# 3. Guardar cambios con mensaje
git commit -m "Descripción de lo que cambiaste"

# 4. Subir a GitHub
git push
```

---

## 📊 Comandos para Ver Información

```bash
# Ver historial de commits
git log

# Ver historial resumido
git log --oneline

# Ver últimos 5 commits
git log -5

# Ver qué cambió en los archivos
git diff

# Ver estado actual
git status

# Ver ramas
git branch

# Ver repositorios remotos conectados
git remote -v
```

---

## 🌿 Comandos de Ramas (Avanzado)

```bash
# Ver todas las ramas
git branch

# Crear nueva rama
git branch nombre-rama

# Cambiar a otra rama
git checkout nombre-rama

# Crear y cambiar a nueva rama
git checkout -b nombre-rama

# Volver a main
git checkout main

# Eliminar rama
git branch -d nombre-rama
```

---

## 🔄 Comandos para Sincronizar

```bash
# Descargar cambios de GitHub (sin aplicar)
git fetch

# Descargar y aplicar cambios de GitHub
git pull

# Subir cambios a GitHub
git push

# Forzar subida (¡cuidado!)
git push -f
```

---

## 🆘 Comandos de Emergencia

```bash
# Deshacer cambios en un archivo (antes de commit)
git checkout -- nombre_archivo.js

# Deshacer el último commit (mantiene cambios)
git reset --soft HEAD~1

# Deshacer el último commit (elimina cambios)
git reset --hard HEAD~1

# Ver qué archivos están siendo ignorados
git status --ignored

# Limpiar archivos no rastreados
git clean -fd
```

---

## 📝 Ejemplos Prácticos

### **Ejemplo 1: Subir Proyecto por Primera Vez**

```bash
cd "/c/Users/TAMUZ TECH/.gemini/antigravity/playground/silver-cassini"
git init
git add .
git commit -m "Initial commit - Telegram Crypto Game"
git branch -M main
git remote add origin https://github.com/tu-usuario/telegram-crypto-game.git
git push -u origin main
```

### **Ejemplo 2: Actualizar Después de Hacer Cambios**

```bash
cd "/c/Users/TAMUZ TECH/.gemini/antigravity/playground/silver-cassini"
git status
git add .
git commit -m "Fixed bug in missions system"
git push
```

### **Ejemplo 3: Ver Qué Cambió**

```bash
git status
git diff
git log --oneline -5
```

---

## 🎨 Mensajes de Commit Recomendados

```bash
# Nuevas features
git commit -m "Add: nueva funcionalidad de referidos"

# Correcciones
git commit -m "Fix: error en el leaderboard"

# Actualizaciones
git commit -m "Update: mejorar diseño del admin panel"

# Documentación
git commit -m "Docs: actualizar README con instrucciones"

# Estilo/formato
git commit -m "Style: mejorar CSS del mini game"

# Refactoring
git commit -m "Refactor: optimizar consultas de base de datos"
```

---

## 🔑 Autenticación con GitHub

### **Opción 1: GitHub CLI (Recomendado)**

```bash
# Instalar GitHub CLI
# Descarga desde: https://cli.github.com/

# Autenticarse
gh auth login

# Seguir las instrucciones en pantalla
```

### **Opción 2: Personal Access Token**

```bash
# 1. Crear token en: https://github.com/settings/tokens
# 2. Click en "Generate new token (classic)"
# 3. Seleccionar: repo (todos los permisos)
# 4. Copiar el token

# 5. Al hacer git push, usar:
# Username: tu_usuario_github
# Password: el_token_que_copiaste
```

### **Opción 3: Guardar Credenciales**

```bash
# Guardar credenciales para no pedirlas cada vez
git config --global credential.helper store

# Próximo git push pedirá credenciales una vez
# Después las recordará
```

---

## 🚫 Archivos a Ignorar (.gitignore)

Tu proyecto ya tiene `.gitignore`, pero si necesitas agregar más:

```bash
# Editar .gitignore
nano .gitignore

# O con notepad
notepad .gitignore

# Agregar líneas como:
node_modules/
.env
*.log
database.sqlite
```

---

## 💡 Tips Útiles

### **Copiar y Pegar en Git Bash:**
- **Copiar:** Selecciona texto + Click derecho
- **Pegar:** Click derecho

### **Autocompletar:**
- Escribe parte del nombre y presiona **Tab**

### **Historial de Comandos:**
- Presiona **↑** (flecha arriba) para ver comandos anteriores

### **Cancelar Comando:**
- Presiona **Ctrl + C**

### **Salir de Git Log:**
- Presiona **Q**

---

## 📚 Recursos para Aprender Más

- **Git Handbook:** https://guides.github.com/introduction/git-handbook/
- **GitHub Learning Lab:** https://lab.github.com/
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf
- **Visualizador de Git:** https://git-school.github.io/visualizing-git/

---

## 🎯 Workflow Típico

```bash
# Cada vez que trabajes en tu proyecto:

# 1. Ir a tu proyecto
cd "/c/Users/TAMUZ TECH/.gemini/antigravity/playground/silver-cassini"

# 2. Ver estado
git status

# 3. Hacer cambios en tus archivos (con tu editor)

# 4. Ver qué cambió
git status
git diff

# 5. Agregar cambios
git add .

# 6. Commit
git commit -m "Descripción clara de los cambios"

# 7. Subir a GitHub
git push

# 8. Render detectará el cambio y redeployará automáticamente
```

---

**¡Guarda este archivo como referencia!** 📌
