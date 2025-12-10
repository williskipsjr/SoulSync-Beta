# 🎯 SoulSync 2.0 - Commands Reference

Quick reference for all important commands.

---

## 📦 Installation

```bash
# Install all dependencies (automatic)
yarn install

# Or manual installation
yarn install                    # Root (Electron)
cd frontend && yarn install     # Frontend (React)
cd backend && pip install -r requirements.txt  # Backend (Python)
```

---

## 🚀 Running the Application

### Development Mode

```bash
# Option 1: Run everything at once (RECOMMENDED)
yarn dev

# Option 2: Run separately
# Terminal 1:
cd backend && uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Terminal 2:
cd frontend && yarn start

# Terminal 3:
yarn start
```

### Production Mode

```bash
# Build frontend first
cd frontend && yarn build

# Then start Electron
yarn start
```

---

## 🔨 Building Production Installers

```bash
# Build for current platform
yarn electron:build

# Build for specific platforms
yarn electron:build:win      # Windows (.exe)
yarn electron:build:mac      # macOS (.dmg)
yarn electron:build:linux    # Linux (.AppImage, .deb)
```

**Output location**: `/dist` folder

---

## 🧹 Cleaning & Troubleshooting

```bash
# Clear yarn cache
yarn cache clean

# Remove all node_modules
rm -rf node_modules frontend/node_modules

# Reinstall everything
yarn install

# Clear frontend build cache
cd frontend && rm -rf node_modules/.cache
```

---

## 🧪 Testing & Linting

### Frontend

```bash
cd frontend

# Run tests
yarn test

# Lint code
npx eslint src/

# Build (test compilation)
yarn build
```

### Backend

```bash
cd backend

# Run tests
pytest

# Lint Python code
flake8 server.py
black server.py
isort server.py

# Type checking
mypy server.py
```

---

## 🔍 Checking Status

```bash
# Check versions
node --version
yarn --version
python3 --version
pip --version

# Check if dependencies installed
ls node_modules           # Root dependencies
ls frontend/node_modules  # Frontend dependencies
pip list | grep fastapi   # Backend dependencies

# Check if ports are available
lsof -i :8001    # macOS/Linux - Backend port
lsof -i :3000    # macOS/Linux - Frontend port
netstat -ano | findstr :8001  # Windows - Backend port
netstat -ano | findstr :3000  # Windows - Frontend port
```

---

## 🖥️ Electron Specific

```bash
# Just run Electron (requires built frontend)
yarn start

# Check Electron version
./node_modules/.bin/electron --version

# Rebuild native modules (if needed)
cd node_modules/electron && npm run install
```

---

## 🐍 Backend Specific

```bash
cd backend

# Start backend server
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Start with auto-reload
uvicorn server:app --reload

# Start on different port
uvicorn server:app --port 8002

# Check FastAPI docs (when server running)
# Open: http://localhost:8001/docs
```

---

## ⚛️ Frontend Specific

```bash
cd frontend

# Start dev server
yarn start

# Build for production
yarn build

# Test build locally
yarn build && npx serve -s build

# Analyze bundle size
yarn build --stats
```

---

## 📝 Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "feat: your message"

# Push
git push origin main

# Pull latest
git pull origin main

# Create branch
git checkout -b feature/your-feature
```

---

## 🔐 Environment Variables

```bash
# Backend (.env file location)
/app/backend/.env

# Frontend (.env file location)
/app/frontend/.env

# Check if .env exists
ls -la backend/.env
ls -la frontend/.env
```

---

## 🎹 Keyboard Shortcuts (When App Running)

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New chat conversation |
| `Ctrl/Cmd + K` | Open search |
| `Ctrl/Cmd + ,` | Open settings |
| `Ctrl/Cmd + Shift + E` | **Trigger SOS button** |
| `Ctrl/Cmd + Q` | Quit application |
| `F12` | Open DevTools (dev mode) |

---

## 📊 Monitoring & Logs

```bash
# Backend logs (if using supervisor)
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/backend.err.log

# Frontend logs (in terminal where yarn start ran)
# Electron logs (in terminal where yarn start ran)

# Check running processes
ps aux | grep electron
ps aux | grep uvicorn
ps aux | grep node
```

---

## 🛠️ Utilities

```bash
# Find files by name
find . -name "*.jsx"
find . -name "package.json"

# Search in files
grep -r "SoulSync" .
grep -r "TODO" frontend/src/

# Count lines of code
find frontend/src -name "*.jsx" -o -name "*.js" | xargs wc -l
find backend -name "*.py" | xargs wc -l

# Check disk usage
du -sh node_modules
du -sh frontend/node_modules
du -sh dist
```

---

## 🚨 Emergency Fixes

```bash
# If Electron won't start
yarn cache clean
rm -rf node_modules
yarn install

# If backend fails
cd backend
pip install -r requirements.txt --force-reinstall

# If frontend build fails
cd frontend
rm -rf node_modules node_modules/.cache
yarn install
yarn build

# If port already in use (kill process)
# macOS/Linux:
lsof -ti:8001 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

---

## 📦 Package Management

```bash
# Add new package (frontend)
cd frontend
yarn add package-name

# Add dev dependency (frontend)
yarn add -D package-name

# Remove package (frontend)
yarn remove package-name

# Add Python package (backend)
cd backend
pip install package-name
pip freeze > requirements.txt

# Check outdated packages
cd frontend && yarn outdated
cd backend && pip list --outdated
```

---

## 🎯 Common Workflows

### Workflow 1: Start Fresh Development Session

```bash
cd soulsync-desktop
git pull origin main
yarn install
yarn dev
```

### Workflow 2: Build and Test Installer

```bash
cd soulsync-desktop
cd frontend && yarn build && cd ..
yarn electron:build
# Test installer in /dist
```

### Workflow 3: Fix and Test

```bash
# Make code changes
# ...

# Test backend
cd backend && pytest

# Test frontend
cd frontend && yarn build

# Test full app
yarn dev
```

---

## 📚 Documentation Files

```bash
# Read documentation
cat README.md
cat QUICK_START.md
cat INSTALLATION_VERIFICATION.md
cat ELECTRON_TEST_REPORT.md
cat PROJECT_FIXES_SUMMARY.md
cat COMMANDS_REFERENCE.md  # This file
```

---

## ✅ Verification Commands

```bash
# Verify installation
ls node_modules/.bin/electron
ls frontend/node_modules/.bin/react-scripts
pip list | grep fastapi

# Verify code syntax
cd backend && python3 -m py_compile server.py
cd frontend && yarn build --dry-run

# Verify configuration
cat package.json
cat frontend/package.json
cat backend/requirements.txt
```

---

**Quick Tip**: Save this file as a bookmark! 🔖

---

*SoulSync 2.0 - Commands Reference*
*Always use `yarn` instead of `npm`*
