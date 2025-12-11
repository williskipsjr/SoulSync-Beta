# 🖥️ SoulSync Desktop App - Complete Guide

This guide covers everything you need to know about running, building, and distributing SoulSync as a standalone desktop application.

---

## 📋 Table of Contents

- [Overview](#overview)
- [For End Users](#for-end-users)
- [For Developers](#for-developers)
- [Building for Distribution](#building-for-distribution)
- [Packaging Best Practices](#packaging-best-practices)
- [Platform-Specific Notes](#platform-specific-notes)
- [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

SoulSync can run in two modes:

1. **Development Mode**: Full hot-reload, debugging tools enabled
2. **Production Mode**: Packaged as standalone desktop app

### Key Features of Desktop App

✅ **Completely Offline** - Works without internet after installation  
✅ **Local Storage** - All data stored on your device  
✅ **No Database Required** - Uses local JSON files  
✅ **System Tray Integration** - Minimize to tray  
✅ **Global Shortcuts** - Quick access from anywhere  
✅ **Auto-updates** - (Coming soon) Automatic updates  
✅ **Cross-platform** - Windows, macOS, Linux  

---

## 👤 For End Users

### Download & Install

**Option 1: Pre-built Installers (Recommended)**

Download the installer for your platform:

- **Windows**: `SoulSync-Setup-2.0.0.exe` (~100MB)
- **macOS**: `SoulSync-2.0.0.dmg` (~100MB)
- **Linux**: `SoulSync-2.0.0.AppImage` (~100MB)

**Installation Steps:**

#### Windows
1. Download `SoulSync-Setup-2.0.0.exe`
2. Double-click to run installer
3. Follow installation wizard
4. Launch from Start Menu or Desktop shortcut

#### macOS
1. Download `SoulSync-2.0.0.dmg`
2. Open the DMG file
3. Drag SoulSync to Applications folder
4. Launch from Applications

#### Linux (AppImage)
1. Download `SoulSync-2.0.0.AppImage`
2. Make it executable:
   ```bash
   chmod +x SoulSync-2.0.0.AppImage
   ```
3. Run it:
   ```bash
   ./SoulSync-2.0.0.AppImage
   ```

#### Linux (Debian/Ubuntu)
1. Download `soulsync_2.0.0_amd64.deb`
2. Install:
   ```bash
   sudo dpkg -i soulsync_2.0.0_amd64.deb
   ```
3. Launch from applications menu

### First Run

1. **Launch SoulSync**
2. **Create Account** - Your data stays on your device
3. **Complete Onboarding** - Set up emergency contacts (optional)
4. **Start Using** - Track mood, chat with AI, get support

### Usage Tips

**Keyboard Shortcuts:**
- `Ctrl/Cmd + N` - New chat
- `Ctrl/Cmd + K` - Search
- `Ctrl/Cmd + ,` - Settings
- `Ctrl/Cmd + Shift + E` - Emergency SOS
- `Ctrl/Cmd + Q` - Quit

**System Tray:**
- Click tray icon for quick actions
- Right-click for menu
- Close window minimizes to tray (configurable)

**Data Location:**

Your data is stored locally:
- **Windows**: `C:\Users\YourName\AppData\Roaming\SoulSync\`
- **macOS**: `~/Library/Application Support/SoulSync/`
- **Linux**: `~/.config/SoulSync/`

---

## 👨‍💻 For Developers

### Running in Development Mode

```bash
# Install dependencies
yarn install

# Start development mode with hot reload
yarn dev
```

This starts:
- Backend server on `http://localhost:8001`
- Frontend React server on `http://localhost:3000`
- Electron window with DevTools

### Project Structure for Electron

```
soulsync-desktop/
├── electron/
│   ├── main.js          # Main Electron process
│   ├── preload.js       # Secure IPC bridge
│   └── icon.png         # App icon
├── frontend/build/      # Production React build
├── backend/             # FastAPI backend
│   ├── server.py       
│   └── data/           # Local JSON storage
└── package.json         # Electron config & build settings
```

### Key Configuration Files

**package.json** (root) - Electron configuration:
```json
{
  "name": "soulsync-desktop",
  "main": "electron/main.js",
  "scripts": {
    "start": "electron .",
    "dev": "concurrently \"yarn backend:start\" \"yarn electron:dev\"",
    "electron:build": "cd frontend && yarn build && electron-builder"
  },
  "build": {
    "appId": "com.soulsync.desktop",
    "files": [
      "electron/**/*",
      "frontend/build/**/*",
      "backend/**/*"
    ]
  }
}
```

**electron/main.js** - Main process:
- Creates browser window
- Manages system tray
- Registers global shortcuts
- Handles IPC communication
- Starts backend server (in production)

**electron/preload.js** - Security bridge:
- Exposes safe APIs to renderer
- Handles IPC between main and renderer
- Maintains security isolation

### Environment Detection

```javascript
// electron/main.js
const isDev = !app.isPackaged;

const FRONTEND_URL = isDev 
  ? 'http://localhost:3000'  // Development: React dev server
  : `file://${path.join(__dirname, '../frontend/build/index.html')}`; // Production: Built files
```

### Backend Integration

**Development Mode:**
- Backend runs via supervisor (separate process)
- Electron connects to `http://localhost:8001`

**Production Mode:**
- Backend bundled with app
- Electron spawns backend process automatically
- Uses local JSON storage (no database needed)

---

## 📦 Building for Distribution

### Prerequisites

Install build tools for your platform:

**Windows:**
```powershell
# No additional tools needed
# Windows SDK is included with Node.js
```

**macOS:**
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

**Linux:**
```bash
# Install build essentials
sudo apt-get install build-essential

# Install additional dependencies for AppImage
sudo apt-get install fuse libfuse2
```

### Build Commands

```bash
# 1. Ensure all dependencies are installed
yarn install
cd frontend && yarn install && cd ..
cd backend && pip install -r requirements.txt && cd ..

# 2. Build frontend
cd frontend
yarn build
cd ..

# 3. Build for specific platform
yarn electron:build           # Current platform
yarn electron:build:win       # Windows
yarn electron:build:mac       # macOS  
yarn electron:build:linux     # Linux

# Or build for all platforms (requires appropriate OS)
yarn electron:build --win --mac --linux
```

### Build Output

After building, check the `dist/` directory:

```
dist/
├── win-unpacked/              # Windows unpacked files
├── mac/                       # macOS app bundle
├── linux-unpacked/            # Linux unpacked files
├── SoulSync Setup 2.0.0.exe   # Windows installer
├── SoulSync-2.0.0.dmg         # macOS disk image
├── SoulSync-2.0.0.AppImage    # Linux AppImage
└── soulsync_2.0.0_amd64.deb   # Debian package
```

### Build Configuration

Customize build in `package.json`:

```json
{
  "build": {
    "appId": "com.soulsync.desktop",
    "productName": "SoulSync",
    "directories": {
      "output": "dist",
      "buildResources": "electron/resources"
    },
    "files": [
      "electron/**/*",
      "frontend/build/**/*",
      "backend/**/*",
      "!backend/__pycache__",
      "!backend/.env",
      "!backend/venv"
    ],
    "win": {
      "target": ["nsis"],
      "icon": "electron/icon.png",
      "artifactName": "${productName}-Setup-${version}.${ext}"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "electron/icon.png",
      "category": "public.app-category.healthcare-fitness",
      "hardenedRuntime": true,
      "gatekeeperAssess": false
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "electron/icon.png",
      "category": "Education",
      "maintainer": "SoulSync Team <support@soulsync.app>"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "SoulSync"
    }
  }
}
```

---

## 🎯 Packaging Best Practices

### 1. Optimize Bundle Size

**Frontend:**
```bash
# Production build with optimizations
cd frontend
yarn build

# Analyze bundle size
npx source-map-explorer 'build/static/js/*.js'
```

**Backend:**
- Only include necessary Python packages
- Remove dev dependencies from requirements.txt
- Exclude test files and documentation

**Electron:**
```json
{
  "build": {
    "files": [
      "!node_modules/**/*",
      "node_modules/electron-store/**/*",
      "!**/*.md",
      "!tests/**/*"
    ]
  }
}
```

### 2. Security Best Practices

**Electron Security:**
```javascript
// electron/main.js
webPreferences: {
  nodeIntegration: false,        // Disable Node in renderer
  contextIsolation: true,        // Enable context isolation
  enableRemoteModule: false,     // Disable remote module
  preload: path.join(__dirname, 'preload.js')
}
```

**CSP Headers:**
```html
<!-- frontend/public/index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'">
```

### 3. Code Signing (Important for Distribution)

**macOS:**
```bash
# Sign the app (requires Apple Developer account)
electron-builder --mac --publish never

# Notarize for Gatekeeper
xcrun notarytool submit SoulSync.dmg \
  --apple-id "your@email.com" \
  --password "app-specific-password" \
  --team-id "TEAM_ID"
```

**Windows:**
```bash
# Sign with certificate (optional but recommended)
electron-builder --win --publish never
```

### 4. Auto-updates Configuration

```json
{
  "build": {
    "publish": [
      {
        "provider": "github",
        "owner": "yourusername",
        "repo": "soulsync-desktop"
      }
    ]
  }
}
```

```javascript
// electron/main.js
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
```

---

## 🖥️ Platform-Specific Notes

### Windows

**Installation Location:**
- Default: `C:\Program Files\SoulSync\`
- User data: `C:\Users\[Username]\AppData\Roaming\SoulSync\`

**Important Files:**
- Installer: `SoulSync Setup 2.0.0.exe` (NSIS)
- Executable: `SoulSync.exe`

**Notes:**
- Windows Defender may flag first run (normal for unsigned apps)
- Recommend code signing for production
- Works on Windows 7 and later

### macOS

**Installation Location:**
- App: `/Applications/SoulSync.app`
- User data: `~/Library/Application Support/SoulSync/`

**Important Files:**
- DMG: `SoulSync-2.0.0.dmg`
- App Bundle: `SoulSync.app`

**Notes:**
- Gatekeeper may block unsigned apps
- Need to "Right-click → Open" first time
- Recommend notarization for production
- Works on macOS 10.12 (Sierra) and later

### Linux

**Installation Locations:**
- AppImage: Run from anywhere (portable)
- DEB install: `/opt/SoulSync/`
- User data: `~/.config/SoulSync/`

**Important Files:**
- AppImage: `SoulSync-2.0.0.AppImage` (universal)
- DEB: `soulsync_2.0.0_amd64.deb` (Debian/Ubuntu)

**AppImage Setup:**
```bash
# Make executable
chmod +x SoulSync-2.0.0.AppImage

# Optional: Install to system
./SoulSync-2.0.0.AppImage --appimage-extract
sudo mv squashfs-root /opt/SoulSync
sudo ln -s /opt/SoulSync/AppRun /usr/bin/soulsync
```

**Notes:**
- AppImage requires FUSE
- Works on most modern Linux distributions
- Tested on Ubuntu 20.04+, Fedora 35+, Arch Linux

---

## 🔧 Troubleshooting

### Build Issues

**Issue: electron-builder fails**

```bash
# Clear cache and rebuild
rm -rf dist node_modules
yarn install
yarn electron:build
```

**Issue: "Cannot find module 'electron'"**

```bash
# Reinstall Electron
yarn add electron@^28.0.0 --dev
```

**Issue: Frontend build fails**

```bash
# Clear frontend cache
cd frontend
rm -rf node_modules/.cache build
yarn install
yarn build
```

### Runtime Issues

**Issue: Backend not starting in packaged app**

Check logs:
```bash
# macOS
~/Library/Logs/SoulSync/

# Windows  
%APPDATA%\SoulSync\logs\

# Linux
~/.config/SoulSync/logs/
```

Solution:
```javascript
// electron/main.js - Add detailed logging
backendProcess.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`Backend Error: ${data}`);
});
```

**Issue: App won't start (white screen)**

1. Check DevTools console (Cmd+Opt+I / Ctrl+Shift+I)
2. Verify frontend build exists:
   ```bash
   ls frontend/build/index.html
   ```
3. Check Electron console output

**Issue: Data not persisting**

Verify data directory permissions:
```bash
# macOS/Linux
ls -la ~/Library/Application\ Support/SoulSync/
chmod -R 755 ~/Library/Application\ Support/SoulSync/

# Windows (PowerShell)
Get-Acl "$env:APPDATA\SoulSync"
```

### Distribution Issues

**Issue: macOS Gatekeeper blocks app**

**For Users:**
```bash
# Remove quarantine attribute
xattr -cr /Applications/SoulSync.app
```

**For Developers:**
- Sign and notarize the app
- Apply for Apple Developer Program ($99/year)

**Issue: Windows SmartScreen warning**

**For Users:**
- Click "More info" → "Run anyway"

**For Developers:**
- Get a code signing certificate
- Use EV certificate for instant reputation

**Issue: Linux AppImage won't run**

```bash
# Install FUSE
sudo apt-get install fuse libfuse2

# Make executable
chmod +x SoulSync-2.0.0.AppImage

# Run
./SoulSync-2.0.0.AppImage
```

---

## 📚 Additional Resources

### Official Documentation

- [Electron Docs](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)

### Useful Tools

- [Electron Forge](https://www.electronforge.io/) - Alternative build tool
- [Electron Packager](https://github.com/electron/electron-packager) - Simple packaging
- [asar](https://github.com/electron/asar) - Archive format

### Community

- [Electron Discord](https://discord.gg/electronjs)
- [electron-builder Issues](https://github.com/electron-userland/electron-builder/issues)

---

## ✅ Checklist for Distribution

Before releasing:

- [ ] Test on all target platforms
- [ ] Sign code (Windows, macOS)
- [ ] Notarize macOS app
- [ ] Test fresh install (clean VM)
- [ ] Verify auto-update works
- [ ] Check bundle size
- [ ] Test offline functionality
- [ ] Verify all features work
- [ ] Update version numbers
- [ ] Create release notes
- [ ] Tag release in Git
- [ ] Upload to GitHub Releases
- [ ] Update download links in README

---

## 🎉 Success!

You now have a complete understanding of building and distributing SoulSync as a desktop application!

**Questions?** Open an issue on GitHub or join our Discord.

**Happy building!** 💚

---

[⬆ Back to Main README](README.md)
