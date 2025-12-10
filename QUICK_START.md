# 🚀 SoulSync 2.0 - Quick Start Guide

## ⚡ TL;DR

```bash
# Clone and setup
git clone <your-repo-url>
cd soulsync-desktop
yarn install

# Run the app
yarn dev

# Build installer
yarn electron:build
```

---

## 🎯 What is SoulSync?

SoulSync 2.0 is a **mental health AI companion desktop app** with:

- 💬 AI-powered conversations
- 📊 Mood tracking with visualizations
- 🚨 SOS emergency button (Telegram alerts)
- 🎨 Beautiful green wellness theme
- 🖥️ Cross-platform (Windows, Mac, Linux)

---

## 📋 Prerequisites

Install these first:

- **Node.js** v16+ (Recommended: v20+)
- **Yarn** v1.22+
- **Python** 3.11+
- **pip** (comes with Python)

Verify:
```bash
node --version   # Should show v20.x or higher
yarn --version   # Should show 1.22.x
python3 --version # Should show 3.11.x
```

---

## 🏃 Running the App

### Method 1: All-in-One (Easiest)

```bash
cd soulsync-desktop
yarn dev
```

This starts:
- Backend (port 8001)
- Frontend (port 3000)
- Electron window

### Method 2: Separate Terminals

**Terminal 1 (Backend):**
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 2 (Frontend):**
```bash
cd frontend
yarn start
```

**Terminal 3 (Electron):**
```bash
yarn start
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New chat |
| `Ctrl/Cmd + K` | Search |
| `Ctrl/Cmd + ,` | Settings |
| `Ctrl/Cmd + Shift + E` | **SOS Emergency** |
| `Ctrl/Cmd + Q` | Quit app |

---

## 📦 Building for Production

### Build for Your Platform

```bash
yarn electron:build
```

### Build for Specific Platform

```bash
yarn electron:build:win    # Windows installer
yarn electron:build:mac    # macOS .dmg
yarn electron:build:linux  # Linux AppImage/deb
```

**Output**: Check the `/dist` folder

---

## 🗂️ Project Structure

```
soulsync-desktop/
├── electron/           # Desktop app (main process)
├── frontend/           # React UI (renderer process)
├── backend/            # FastAPI server (Python)
├── package.json        # Root config
└── README.md           # Full documentation
```

---

## 🐛 Troubleshooting

### App Won't Start?

```bash
# Clear cache and reinstall
yarn cache clean
rm -rf node_modules frontend/node_modules
yarn install
```

### Backend Issues?

```bash
cd backend
pip install -r requirements.txt --force-reinstall
```

### Build Fails?

```bash
cd frontend
rm -rf node_modules/.cache
yarn install
yarn build
```

---

## 📖 Features Overview

### 🔐 Authentication
- Sign up / Login
- Emergency contact setup (Telegram)
- Local data storage

### 💬 Chat
- AI-powered conversations
- Crisis detection
- Chat history

### 📈 Mood Dashboard
- Track mood (1-10 slider)
- Emotion tags
- Visual charts
- Wellness tips

### 🚨 SOS Button
- Floating panic button
- Send Telegram alert
- Desktop notification
- Keyboard shortcut

### ⚙️ Settings
- Theme toggle (light/dark)
- Manage emergency contacts
- Export data
- Account settings

---

## 🔗 Important Links

- **Full Documentation**: [README.md](README.md)
- **Test Report**: [ELECTRON_TEST_REPORT.md](ELECTRON_TEST_REPORT.md)
- **Installation Verification**: [INSTALLATION_VERIFICATION.md](INSTALLATION_VERIFICATION.md)
- **Architecture Updates**: [CRITICAL_UPDATES.md](CRITICAL_UPDATES.md)

---

## 💡 Tips

1. **First Run**: Use `yarn dev` for development
2. **Testing**: Run on a desktop with GUI (not headless server)
3. **Production**: Build with `yarn electron:build`
4. **Logs**: Check terminal for errors
5. **DevTools**: Press F12 in Electron window

---

## 📞 Need Help?

1. Check [README.md](README.md) for detailed docs
2. Review [Troubleshooting](#-troubleshooting) section
3. Check [ELECTRON_TEST_REPORT.md](ELECTRON_TEST_REPORT.md)
4. Open GitHub issue with error details

---

## ✅ Status

- ✅ All dependencies installed
- ✅ Syntax errors fixed
- ✅ Code verified
- ✅ Ready to run on desktop

---

**Made with 💚 by SoulSync Team**

*Start with: `yarn dev`*
