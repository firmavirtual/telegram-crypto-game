# Telegram Crypto Mini Game Bot

🎮 **Demo de portafolio** - Bot de Telegram con mini juego para proyectos crypto/social

[🚀 Prueba el Bot](https://t.me/tu_bot_username) | [📊 Admin Panel](https://tu-proyecto.up.railway.app/admin)

## 🌟 Características Principales

- ✅ **Sistema de Misiones** - Tareas diarias y semanales con recompensas
- 💰 **Sistema de Puntos** - Gana puntos completando misiones
- 🏆 **Leaderboard** - Compite con otros jugadores
- 👥 **Sistema de Referidos** - Invita amigos y gana recompensas
- 🎁 **Elegibilidad para Airdrop** - Tracking automático de requisitos
- 🔗 **Enlaces Sociales** - Conecta X, Instagram, TikTok, YouTube, Facebook
- 💳 **Colección de Wallets** - Registro de direcciones de billetera
- 📢 **Broadcast** - Mensajes masivos a usuarios
- 🤖 **Panel de Admin** - Gestión completa del sistema

## 🎨 Capturas de Pantalla

![Mini Game Home](screenshots/home.png)
![Missions](screenshots/missions.png)
![Admin Panel](screenshots/admin.png)

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **SQLite** - Base de datos
- **node-telegram-bot-api** - API de Telegram
- **node-cron** - Tareas programadas

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos (diseño dark theme premium)
- **JavaScript** - Lógica
- **jQuery** - Manipulación del DOM

### Características Técnicas
- Arquitectura RESTful API
- Sistema de autenticación por sesiones
- Anti-spam con rate limiting
- Scheduled tasks (recordatorios diarios, anuncios semanales)
- Export de datos a CSV
- Responsive design

## 📋 Funcionalidades Detalladas

### Para Usuarios
- Onboarding automático vía Telegram
- Daily check-in (50 puntos)
- Misiones sociales (100 puntos c/u)
- Sistema de referidos (100 puntos por referido)
- Tracking de elegibilidad para airdrop
- Perfil personalizado
- Leaderboard en tiempo real

### Para Administradores
- Dashboard con estadísticas en tiempo real
- Gestión de usuarios (ban/unban)
- Creación y edición de misiones
- Revisión de submissions con pruebas
- Broadcast a todos o usuarios seleccionados
- Export de datos completos en CSV

### Automatización
- Actualización de leaderboard cada hora
- Verificación de elegibilidad cada 6 horas
- Recordatorios diarios a las 10 AM
- Anuncio de ganadores semanales (lunes 12 PM)

## 🚀 Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/telegram-crypto-game.git
cd telegram-crypto-game

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor
npm start
```

## 🌐 Deployment

Este proyecto está deployado en **Railway.app**. Para deployar tu propia instancia:

1. Fork este repositorio
2. Crea cuenta en [Railway.app](https://railway.app)
3. Conecta tu repositorio
4. Configura variables de entorno
5. Deploy automático

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para instrucciones detalladas.

## 📚 Documentación

- [README.md](README.md) - Documentación completa
- [QUICKSTART.md](QUICKSTART.md) - Guía de inicio rápido
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de deployment
- [FEATURES.md](FEATURES.md) - Lista completa de features
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Estructura del proyecto

## 🔐 Credenciales de Demo

**Admin Panel:**
- URL: `https://tu-proyecto.up.railway.app/admin`
- Usuario: `demo`
- Contraseña: `demo123`

**Bot de Telegram:**
- [@tu_bot_username](https://t.me/tu_bot_username)

## 📊 Estadísticas del Proyecto

- **Líneas de código:** ~3,500+
- **Archivos:** 14
- **Tablas de BD:** 9
- **API Endpoints:** 20+
- **Comandos del Bot:** 8
- **Tareas Programadas:** 4

## 🎯 Casos de Uso

Este proyecto es ideal para:
- Proyectos crypto que necesitan engagement de comunidad
- Airdrops con sistema de puntos
- Programas de referidos
- Gamificación de comunidades
- Marketing viral en Telegram

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- Portfolio: [tu-portfolio.com](https://tu-portfolio.com)

## 🙏 Agradecimientos

- Telegram Bot API
- Railway.app por hosting gratuito
- Comunidad de Node.js

---

⭐ **Si te gusta este proyecto, dale una estrella en GitHub!**

🐛 **¿Encontraste un bug?** Abre un issue

💡 **¿Tienes una idea?** Abre un issue o PR

📧 **Contacto:** tu-email@ejemplo.com
