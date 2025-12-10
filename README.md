# 🌿 SoulSync 2.0

<div align="center">

![SoulSync Logo](electron/icon.png)

**Your Mental Health AI Companion**

A compassionate desktop application that provides 24/7 mental health support through AI-powered conversations, mood tracking, and emergency assistance.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-28.0.0-blue.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-green.svg)](https://fastapi.tiangolo.com/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Building for Production](#-building-for-production)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**SoulSync 2.0** is a desktop mental health companion designed to provide a safe, private, and supportive environment for users seeking emotional support. Built with Electron, React, and FastAPI, SoulSync offers real-time AI conversations, mood tracking, crisis detection, and emergency contact integration through Telegram.

### Why SoulSync?

- 🔒 **Private & Secure**: All data stored locally on your device
- 🤖 **AI-Powered Support**: Empathetic conversations 24/7
- 📊 **Mood Tracking**: Visualize and understand your emotional patterns
- 🚨 **Crisis Detection**: Automatic emergency contact notification
- 💚 **Calming Design**: Wellness-focused green theme designed for comfort

---

## ✨ Features

### 🔐 Authentication & Onboarding
- Secure user registration and login
- Emergency contact setup with Telegram integration
- Personalized onboarding experience

### 💬 AI Chat Interface
- Real-time conversations with empathetic AI
- Streaming responses for natural interaction
- Chat history with conversation management
- Crisis detection and support

### 📈 Mood Dashboard
- Daily mood tracking with interactive slider (1-10)
- Emotional tags (Happy, Sad, Anxious, Calm, Energetic, Tired)
- Visual mood history with charts
- Personalized wellness tips

### 🚨 SOS Emergency Button
- Quick access panic button (Ctrl/Cmd+Shift+E)
- Instant notification to emergency contacts via Telegram
- Desktop notifications for immediate response
- Confirmation modal to prevent accidental triggers

### ⚙️ Settings & Customization
- Theme toggle (Light/Dark mode)
- Emergency contact management
- Data export functionality
- Account management

### 🖥️ Desktop Features
- System tray integration
- Global keyboard shortcuts
- Desktop notifications
- Window state persistence
- Minimize to tray
- Cross-platform support (Windows, macOS, Linux)

---

## 🛠️ Tech Stack

### Frontend
- **Electron** ^28.0.0 - Desktop application framework
- **React** ^19.0.0 - UI library
- **React Router** ^7.5.1 - Navigation
- **Tailwind CSS** ^3.4.17 - Styling
- **Framer Motion** ^12.23.25 - Animations
- **Radix UI** - Accessible components
- **Chart.js** ^4.5.1 - Data visualization
- **Lucide React** ^0.507.0 - Icons

### Backend
- **FastAPI** 0.110.1 - Python web framework
- **Uvicorn** 0.25.0 - ASGI server
- **Pydantic** - Data validation
- **Python-Jose** - JWT handling
- **Bcrypt** - Password hashing

### Storage
- **Local JSON Files** - User data, conversations, mood history
- **electron-store** ^8.1.0 - Persistent application settings

### Development Tools
- **CRACO** - Create React App Configuration Override
- **ESLint** - Code linting
- **electron-builder** ^24.9.1 - Application packaging

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required
- **Node.js** >= 16.x (Recommended: v20.x)
- **npm** >= 8.x or **Yarn** >= 1.22.x
- **Python** >= 3.11.x
- **pip** (Python package manager)

### Optional
- **Git** (for version control)
- **MongoDB** (if using database features - currently optional)

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Yarn version (if using Yarn)
yarn --version

# Check Python version
python3 --version

# Check pip version
pip --version
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/soulsync-desktop.git
cd soulsync-desktop
```

### Step 2: Install Dependencies

#### Option A: Using the Automated Script

```bash
# This will install all dependencies (root, frontend, backend)
yarn install
```

The `postinstall` script will automatically:
1. Install root Electron dependencies
2. Install frontend React dependencies
3. Install backend Python dependencies

#### Option B: Manual Installation

```bash
# Install root dependencies (Electron)
yarn install

# Install frontend dependencies
cd frontend
yarn install
cd ..

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### Step 3: Environment Configuration

#### Backend Environment (.env)

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env  # If example exists, otherwise create manually
```

Add the following configurations:

```env
# Backend Configuration
PORT=8001
HOST=0.0.0.0

# MongoDB (Optional - currently using local JSON storage)
MONGO_URL=mongodb://localhost:27017/soulsync

# JWT Configuration (for future auth)
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Telegram Bot (for emergency alerts)
TELEGRAM_BOT_TOKEN=your-bot-token-here
TELEGRAM_BOT_API_URL=https://api.telegram.org/bot

# AI Model Configuration (future integration)
AI_MODEL_ENDPOINT=your-ai-endpoint
AI_MODEL_API_KEY=your-api-key
```

#### Frontend Environment (.env)

The frontend may have a `.env` file for React environment variables:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_API_PREFIX=/api
```

### Step 4: Verify Installation

```bash
# Check if node_modules exists in root
ls node_modules

# Check if node_modules exists in frontend
ls frontend/node_modules

# Check if Python packages are installed
cd backend
pip list | grep fastapi
cd ..
```

---

## 🏃 Running the Application

### Development Mode

#### Option 1: Run Everything Together (Recommended)

```bash
# Start backend + frontend + Electron all at once
yarn dev
```

This command will:
1. Start the FastAPI backend on port 8001
2. Start the React development server on port 3000
3. Launch the Electron desktop application

#### Option 2: Run Components Separately

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

**Terminal 3 - Electron:**
```bash
yarn start
```

### Production Mode

```bash
# Build the frontend first
cd frontend
yarn build
cd ..

# Start Electron with production build
yarn start
```

### Keyboard Shortcuts

When the application is running, you can use these shortcuts:

- **Ctrl/Cmd + N** - New chat conversation
- **Ctrl/Cmd + K** - Open search
- **Ctrl/Cmd + ,** - Open settings
- **Ctrl/Cmd + Shift + E** - Trigger SOS emergency button
- **Ctrl/Cmd + Q** - Quit application

---

## 📁 Project Structure

```
soulsync-desktop/
├── electron/                   # Electron main process files
│   ├── main.js                # Main process entry point (359 lines)
│   ├── preload.js             # Preload script for IPC (61 lines)
│   └── icon.png               # Application icon
│
├── frontend/                   # React frontend application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # Reusable UI components (Radix)
│   │   │   ├── AppShell.jsx  # Main application layout
│   │   │   ├── Sidebar.jsx   # Navigation sidebar
│   │   │   ├── SOSButton.jsx # Emergency panic button
│   │   │   └── ...
│   │   ├── pages/            # Page components
│   │   │   ├── AuthPage.jsx      # Login/Signup
│   │   │   ├── OnboardingPage.jsx # User onboarding
│   │   │   ├── MoodDashboard.jsx  # Mood tracking
│   │   │   ├── ChatPage.jsx      # AI chat interface
│   │   │   └── SettingsPage.jsx  # User settings
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useAuth.js        # Authentication hook
│   │   │   ├── useElectron.js    # Electron integration hook
│   │   │   ├── useConversations.js # Chat management
│   │   │   └── useMood.js        # Mood tracking
│   │   ├── lib/              # Utility functions
│   │   ├── App.js            # Root component
│   │   └── index.js          # Entry point
│   ├── package.json
│   ├── craco.config.js       # CRACO configuration
│   └── tailwind.config.js    # Tailwind CSS configuration
│
├── backend/                    # FastAPI backend server
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
│
├── tests/                      # Test files
│   └── __init__.py
│
├── docs/                       # Documentation files
│   ├── ELECTRON_TEST_REPORT.md
│   ├── CRITICAL_UPDATES.md
│   ├── PROJECT_REQUIREMENTS.md
│   └── PROGRESS_TRACKING.md
│
├── package.json               # Root package.json (Electron config)
├── yarn.lock                  # Dependency lock file
├── .gitignore
└── README.md                  # This file
```

---

## ⚙️ Configuration

### Electron Configuration

The Electron configuration is in the root `package.json` under the `build` section:

```json
{
  "build": {
    "appId": "com.soulsync.desktop",
    "productName": "SoulSync",
    "directories": {
      "output": "dist",
      "buildResources": "electron/resources"
    },
    "win": {
      "target": ["nsis"],
      "icon": "electron/icon.png"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "electron/icon.png",
      "category": "public.app-category.healthcare-fitness"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "electron/icon.png",
      "category": "Education"
    }
  }
}
```

### Security Configuration

SoulSync follows Electron security best practices:

- ✅ **Context Isolation**: Enabled
- ✅ **Node Integration**: Disabled in renderer
- ✅ **Preload Script**: Used for secure IPC communication
- ✅ **Remote Module**: Disabled
- ✅ **External Links**: Opened in default browser, not in-app

### Window Configuration

- Default size: 1280x800
- Minimum size: 1024x600
- Window state persistence (size, position, maximized state)
- Minimize to system tray option

---

## 📦 Building for Production

### Prerequisites for Building

Depending on your target platform, you may need:

**Windows:**
- Windows 7 or later

**macOS:**
- macOS 10.12 or later
- Xcode Command Line Tools

**Linux:**
- Build tools: `sudo apt-get install build-essential`

### Build Commands

#### Build for Current Platform

```bash
yarn electron:build
```

#### Build for Specific Platform

```bash
# Build for Windows
yarn electron:build:win

# Build for macOS
yarn electron:build:mac

# Build for Linux
yarn electron:build:linux
```

### Output

Built applications will be in the `dist/` directory:

- **Windows**: `SoulSync Setup.exe` (NSIS installer)
- **macOS**: `SoulSync.dmg` (DMG image)
- **Linux**: `SoulSync.AppImage` or `soulsync_amd64.deb`

### Testing the Build

After building, test the installer:

1. Navigate to the `dist/` folder
2. Install the application
3. Run SoulSync
4. Verify all features work correctly

---

## 💻 Development

### Adding New Features

1. **Frontend Components**: Add to `frontend/src/components/`
2. **Pages**: Add to `frontend/src/pages/`
3. **API Endpoints**: Add to `backend/server.py`
4. **Electron IPC**: Add handlers in `electron/main.js` and `electron/preload.js`

### Code Style

- **JavaScript/React**: Follow ESLint configuration
- **Python**: Follow PEP 8 style guide
- **CSS**: Use Tailwind CSS utility classes

### Linting

```bash
# Lint frontend code
cd frontend
npx eslint src/

# Format Python code
cd backend
black server.py
isort server.py
flake8 server.py
```

### Testing

```bash
# Run backend tests
cd backend
pytest

# Run frontend tests (if configured)
cd frontend
yarn test
```

### Hot Reload

Both frontend and backend support hot reload:

- **Frontend**: React hot reload is automatic in development
- **Backend**: Uvicorn auto-reloads on code changes with `--reload` flag
- **Electron**: Restart required for main process changes; renderer process uses React hot reload

---

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: Dependencies Not Installing

**Problem**: `yarn install` fails or takes too long

**Solution**:
```bash
# Clear yarn cache
yarn cache clean

# Remove node_modules and reinstall
rm -rf node_modules frontend/node_modules
yarn install
```

#### Issue 2: Electron Won't Start

**Problem**: `yarn start` shows electron errors

**Solution**:
```bash
# Check if electron is installed
ls node_modules/.bin/electron

# Reinstall electron
yarn add electron@^28.0.0 --dev

# Try rebuilding native modules
cd node_modules/electron && npm run install && cd ../..
```

#### Issue 3: Backend Not Starting

**Problem**: Backend server fails to start

**Solution**:
```bash
# Check Python dependencies
cd backend
pip list | grep fastapi

# Reinstall requirements
pip install -r requirements.txt --force-reinstall

# Check if port 8001 is available
lsof -i :8001  # macOS/Linux
netstat -ano | findstr :8001  # Windows

# Start manually to see errors
uvicorn server:app --reload --port 8001
```

#### Issue 4: Frontend Build Fails

**Problem**: `yarn build` fails with errors

**Solution**:
```bash
cd frontend

# Clear cache
rm -rf node_modules/.cache

# Check for syntax errors
npx eslint src/

# Reinstall dependencies
rm -rf node_modules
yarn install

# Try building again
yarn build
```

#### Issue 5: Window Won't Open (Headless Environment)

**Problem**: Running in a server without display

**Solution**:
This is expected. Electron requires a display server (X11). To test:
- Run on a desktop machine with GUI
- Use virtual display (Xvfb) on Linux servers
- Build and test installers on target machines

#### Issue 6: MongoDB Connection Errors

**Problem**: Backend shows MongoDB connection errors

**Solution**:
SoulSync currently uses **local JSON storage**, not MongoDB. If you see these errors:
```bash
# Comment out MongoDB code in backend/server.py
# Or start MongoDB:
docker run -d -p 27017:27017 mongo
```

### Getting Help

If you encounter issues not listed here:

1. Check the [ELECTRON_TEST_REPORT.md](ELECTRON_TEST_REPORT.md) for testing details
2. Review [CRITICAL_UPDATES.md](CRITICAL_UPDATES.md) for architecture changes
3. Open an issue on GitHub with:
   - Error messages
   - Steps to reproduce
   - System information (OS, Node version, Python version)

---

## 🤝 Contributing

We welcome contributions to SoulSync! Here's how you can help:

### Types of Contributions

- 🐛 Bug reports and fixes
- ✨ New features and enhancements
- 📝 Documentation improvements
- 🎨 UI/UX improvements
- 🧪 Tests and quality assurance

### Development Workflow

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/soulsync-desktop.git
   cd soulsync-desktop
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Test Your Changes**
   ```bash
   # Test frontend
   cd frontend && yarn test
   
   # Test backend
   cd backend && pytest
   
   # Test full application
   yarn dev
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

   Then create a Pull Request on GitHub.

### Code Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited in the release notes

### Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Maintain a positive environment

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 SoulSync Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Electron** - For making desktop applications with web technologies possible
- **React** - For the powerful and flexible UI framework
- **FastAPI** - For the modern, fast Python web framework
- **Radix UI** - For accessible, unstyled components
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For beautiful icons
- **All Contributors** - Thank you for making SoulSync better!

---

## 📞 Contact & Support

### Get in Touch

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/yourusername/soulsync-desktop/issues)
- **Email**: support@soulsync.app
- **Twitter**: [@SoulSyncApp](https://twitter.com/soulsyncapp)
- **Discord**: [Join our community](https://discord.gg/soulsync)

### Resources

- **Documentation**: [docs/](docs/)
- **FAQ**: [FAQ.md](docs/FAQ.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **Roadmap**: [ROADMAP.md](ROADMAP.md)

---

## 🌟 Star History

If you find SoulSync helpful, please consider giving it a star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/soulsync-desktop&type=Date)](https://star-history.com/#yourusername/soulsync-desktop&Date)

---

<div align="center">

**Made with 💚 by the SoulSync Team**

*Your mental health matters. You're not alone.*

[⬆ Back to Top](#-soulsync-20)

</div
