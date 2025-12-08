# Script para preparar el proyecto para GitHub y deployment

Write-Host "🚀 Preparando proyecto para deployment..." -ForegroundColor Cyan
Write-Host ""

# Verificar si git está instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git no está instalado. Por favor instala Git primero." -ForegroundColor Red
    Write-Host "   Descarga desde: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

# Inicializar git si no existe
if (-not (Test-Path .git)) {
    Write-Host "📦 Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Repositorio Git inicializado" -ForegroundColor Green
} else {
    Write-Host "✅ Repositorio Git ya existe" -ForegroundColor Green
}

# Crear .env si no existe
if (-not (Test-Path .env)) {
    Write-Host "📝 Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANTE: Edita .env con tus credenciales antes de deployar" -ForegroundColor Yellow
} else {
    Write-Host "✅ Archivo .env ya existe" -ForegroundColor Green
}

# Agregar archivos a git
Write-Host ""
Write-Host "📦 Agregando archivos a Git..." -ForegroundColor Yellow
git add .

# Crear commit
Write-Host "💾 Creando commit inicial..." -ForegroundColor Yellow
git commit -m "Initial commit - Telegram Crypto Mini Game Bot" -q

Write-Host ""
Write-Host "✅ ¡Proyecto preparado!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Crea un repositorio en GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Blue
Write-Host ""
Write-Host "2️⃣  Conecta tu repositorio local:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Sube tu código:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  Deploy en Railway:" -ForegroundColor White
Write-Host "   • Ve a https://railway.app" -ForegroundColor Blue
Write-Host "   • Click en 'Start a New Project'" -ForegroundColor Gray
Write-Host "   • Selecciona 'Deploy from GitHub repo'" -ForegroundColor Gray
Write-Host "   • Elige tu repositorio" -ForegroundColor Gray
Write-Host ""
Write-Host "5️⃣  Configura variables de entorno en Railway:" -ForegroundColor White
Write-Host "   BOT_TOKEN, WEBAPP_URL, ADMIN_USERNAME, ADMIN_PASSWORD" -ForegroundColor Gray
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentación completa:" -ForegroundColor Yellow
Write-Host "   • DEPLOY_RAPIDO.md - Guía rápida de deployment" -ForegroundColor Gray
Write-Host "   • DEPLOYMENT.md - Guía completa con todas las opciones" -ForegroundColor Gray
Write-Host "   • README_ES.md - README en español para tu portafolio" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 ¡Buena suerte con tu demo!" -ForegroundColor Green
