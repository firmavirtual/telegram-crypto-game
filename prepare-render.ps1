# Script para preparar deploy en Render.com

Write-Host "🚀 Preparando proyecto para Render.com..." -ForegroundColor Cyan
Write-Host ""

# Verificar git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git no está instalado." -ForegroundColor Red
    Write-Host "   Descarga desde: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

# Crear .env si no existe
if (-not (Test-Path .env)) {
    Write-Host "📝 Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
    Write-Host "⚠️  EDITA .env con tus credenciales antes de deployar" -ForegroundColor Yellow
} else {
    Write-Host "✅ Archivo .env existe" -ForegroundColor Green
}

# Verificar archivos necesarios
$requiredFiles = @(
    "server.js",
    "bot.js",
    "database.js",
    "package.json"
)

Write-Host ""
Write-Host "📦 Verificando archivos necesarios..." -ForegroundColor Yellow

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (falta)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "❌ Faltan archivos necesarios. No se puede continuar." -ForegroundColor Red
    exit
}

# Inicializar git
Write-Host ""
if (-not (Test-Path .git)) {
    Write-Host "📦 Inicializando Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git inicializado" -ForegroundColor Green
} else {
    Write-Host "✅ Git ya está inicializado" -ForegroundColor Green
}

# Agregar archivos
Write-Host ""
Write-Host "📦 Agregando archivos a Git..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Creando commit..." -ForegroundColor Yellow
git commit -m "Deploy to Render - Telegram Crypto Game" -q

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ ¡PROYECTO LISTO PARA RENDER!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  Edita el archivo .env con tus credenciales:" -ForegroundColor White
Write-Host "   • BOT_TOKEN (de @BotFather)" -ForegroundColor Gray
Write-Host "   • ADMIN_USERNAME y ADMIN_PASSWORD" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  Crea un repositorio en GitHub:" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Blue
Write-Host "   Nombre sugerido: telegram-crypto-game" -ForegroundColor Gray
Write-Host ""

Write-Host "3️⃣  Conecta y sube tu código:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/TU-USUARIO/telegram-crypto-game.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""

Write-Host "4️⃣  Deploy en Render:" -ForegroundColor White
Write-Host "   • Ve a: " -NoNewline -ForegroundColor Gray
Write-Host "https://render.com" -ForegroundColor Blue
Write-Host "   • Regístrate con GitHub" -ForegroundColor Gray
Write-Host "   • New + → Web Service" -ForegroundColor Gray
Write-Host "   • Conecta tu repositorio" -ForegroundColor Gray
Write-Host "   • Configura variables de entorno" -ForegroundColor Gray
Write-Host "   • Create Web Service" -ForegroundColor Gray
Write-Host ""

Write-Host "5️⃣  Configura el bot en Telegram:" -ForegroundColor White
Write-Host "   • Habla con @BotFather" -ForegroundColor Gray
Write-Host "   • /setmenubutton → URL de Render" -ForegroundColor Gray
Write-Host "   • /setcommands → Comandos del bot" -ForegroundColor Gray
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 Guías disponibles:" -ForegroundColor Yellow
Write-Host "   • RENDER_CHECKLIST.md - Checklist rápido (5 min)" -ForegroundColor Gray
Write-Host "   • RENDER_DEPLOY.md - Guía completa paso a paso" -ForegroundColor Gray
Write-Host ""

Write-Host "⏱️  Tiempo estimado de deploy: 10 minutos" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 ¡Éxito!" -ForegroundColor Green
