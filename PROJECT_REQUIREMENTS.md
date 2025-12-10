# 🌿 SOULSYNC 2.0 - PROJECT REQUIREMENTS & CONTEXT

**📅 Last Updated:** December 2024  
**🎯 Project Type:** Electron Desktop Application (Mental Health AI Chatbot)  
**🔄 Status:** In Active Development - Electron Conversion Phase

---

## 🎯 PROJECT OVERVIEW

SoulSync 2.0 is a **mental health AI companion desktop application** designed to provide:
- Safe, empathetic conversations powered by fine-tuned BERT model
- Crisis detection and emergency contact alerts via Telegram
- Mood tracking and wellness dashboard
- Calming green wellness-themed UI

---

## ✅ USER CONFIRMED REQUIREMENTS (December 2024)

### 1. **Platform: Electron Desktop App** ✅
- **Requirement:** This MUST be an Electron desktop application
- **NOT a web app** - needs native desktop features
- **Target Platforms:** Windows, macOS, Linux
- **Desktop Features Required:**
  - Native window (resizable, minimize, maximize, close)
  - System tray icon
  - Desktop notifications
  - Keyboard shortcuts (Ctrl+N, Ctrl+K, Enter to send, etc.)
  - Window state persistence
  - Desktop-specific UI patterns

### 2. **AI Model: Fine-tuned BERT (No External LLM)** ✅
- **No OpenAI, Claude, or Gemini needed**
- **Model:** Custom fine-tuned BERT model
- **Training Data:** 50,000+ mental health conversation samples
- **Deployment:** User has/will provide model access details
- **Integration Approach:** 
  - Model likely hosted as API endpoint or local model
  - Need to ask user for:
    - Model API endpoint URL (if hosted)
    - OR local model files location (if running locally)
    - Authentication method (API key, token, etc.)
    - Request/response format

### 3. **Emergency Alerts: Telegram Bot** ✅
- **User has Telegram Bot Token** - will provide when ready
- **Purpose:** Send emergency alerts to user's emergency contact
- **Trigger:** Crisis detection from BERT model or manual SOS button
- **Implementation:**
  - Python: `python-telegram-bot` library
  - Backend endpoint: `/api/emergency-alert`
  - Store user's emergency contact Telegram Chat ID in MongoDB
  - Send immediate alert when crisis detected

### 4. **Development Priority: Electron First** ✅
- **Phase 1:** Convert to Electron desktop app (CURRENT FOCUS)
- **Phase 2:** Integrate fine-tuned BERT model
- **Phase 3:** Implement Telegram emergency alerts
- **Phase 4:** Complete MongoDB integration
- **Phase 5:** Testing and polish

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    ELECTRON DESKTOP APP                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  RENDERER PROCESS                       │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         React Frontend (Port 3000)               │  │ │
│  │  │  - UI Components                                 │  │ │
│  │  │  - Auth, Chat, Mood Dashboard, Settings          │  │ │
│  │  │  - Green Wellness Theme                          │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↕                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   MAIN PROCESS                         │ │
│  │  - Window management                                   │ │
│  │  - IPC handlers                                        │ │
│  │  - System tray                                         │ │
│  │  - Desktop notifications                               │ │
│  │  - Keyboard shortcuts                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Port 8001)                     │
│  - User authentication (JWT)                                 │
│  - Chat endpoint → Fine-tuned BERT Model                     │
│  - Telegram emergency alerts                                 │
│  - MongoDB data persistence                                  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────────┐  ┌─────────────────┐  ┌────────────┐ │
│  │  Fine-tuned BERT │  │  Telegram Bot   │  │  MongoDB   │ │
│  │  Model API       │  │  (User's Bot)   │  │  Database  │ │
│  └──────────────────┘  └─────────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 TECHNICAL STACK

### Desktop Layer (NEW - To Be Implemented)
- **Electron:** Latest stable version
- **electron-builder:** For packaging Windows/Mac/Linux
- **Main Process:** Window management, IPC, native features
- **Preload Script:** Secure context bridge

### Frontend (Existing - 85% Complete)
- **React 19** with React Router v7
- **Tailwind CSS** with custom green wellness theme
- **Framer Motion** for animations
- **Radix UI** components (40+ components)
- **Recharts** for mood tracking graphs
- **Lucide React** for icons

### Backend (Existing - 30% Complete)
- **FastAPI 0.110.1** with async support
- **Motor** (async MongoDB driver)
- **JWT + bcrypt** for authentication
- **python-telegram-bot** (to be added)
- **Pydantic v2** for data validation

### AI Model
- **Fine-tuned BERT** (50k mental health conversations)
- Deployment details pending from user

### Database
- **MongoDB** (already connected)
- Collections to create:
  - `users` - User accounts and settings
  - `conversations` - Chat history
  - `mood_history` - Mood tracking data
  - `emergency_contacts` - Telegram Chat IDs

---

## 📝 PENDING INFORMATION FROM USER

### 1. Fine-tuned BERT Model Access
**Need to know:**
- [ ] How is the model deployed?
  - Hosted API endpoint (URL + auth)?
  - Local model files (path to model)?
  - Docker container?
  - Cloud service (AWS, GCP, Azure)?
- [ ] Request format example
- [ ] Response format example
- [ ] Authentication method (if any)
- [ ] Rate limits or usage constraints

**Example Questions to Ask:**
```
For your fine-tuned BERT model, please provide:
1. Model endpoint URL or deployment method
2. Example request format (JSON structure)
3. Example response format
4. Any API keys or authentication needed
5. Expected response time (latency)
```

### 2. Telegram Bot Token
**Need:**
- [ ] Bot Token (format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)
- [ ] Bot username (optional, for user instructions)

**Will be used for:**
- Sending emergency alerts to user's emergency contact
- Backend will use `python-telegram-bot` library
- Stored securely in backend `.env` file

---

## 🎨 DESIGN REFERENCE

User provided reference image showing:
- **Clean sidebar layout** (similar to Claude/ChatGPT desktop apps)
- Left sidebar: Logo, New Chat, Search, Navigation, Recent chats, User profile
- Main area: Chat interface with spacious layout
- Desktop window chrome (minimize, maximize, close buttons)

**Current Implementation Status:**
- ✅ Sidebar layout implemented
- ✅ Green wellness theme applied
- ✅ All UI components built
- ❌ Not in Electron desktop window yet
- ❌ Missing desktop window controls
- ❌ Missing desktop keyboard shortcuts

---

## 🚀 DEVELOPMENT PHASES

### Phase 1: Electron Desktop Conversion (CURRENT - HIGH PRIORITY)
**Goal:** Convert React web app to Electron desktop application

**Tasks:**
- [ ] Install Electron and electron-builder
- [ ] Create `electron/main.js` - Main process with window management
- [ ] Create `electron/preload.js` - Secure IPC bridge
- [ ] Update root `package.json` with Electron scripts
- [ ] Configure Electron to load React app
- [ ] Implement window state persistence
- [ ] Add system tray icon
- [ ] Add desktop notifications
- [ ] Implement keyboard shortcuts
- [ ] Configure electron-builder for packaging
- [ ] Test desktop app launch on development machine
- [ ] Ensure backend starts with desktop app

**Files to Create:**
```
/app/
├── electron/
│   ├── main.js           # Main Electron process
│   ├── preload.js        # Preload script
│   └── icon.png          # App icon
├── package.json          # Root package.json with Electron
└── electron-builder.json # Build configuration
```

### Phase 2: BERT Model Integration
**Goal:** Connect chat endpoint to fine-tuned BERT model

**Tasks:**
- [ ] Get model access details from user
- [ ] Update backend chat endpoint to call BERT API
- [ ] Handle model responses
- [ ] Implement conversation context passing
- [ ] Add error handling for model failures
- [ ] Test crisis detection from model
- [ ] Optimize response latency

### Phase 3: Telegram Emergency Alerts
**Goal:** Implement emergency notification system

**Tasks:**
- [ ] Get Telegram Bot Token from user
- [ ] Install `python-telegram-bot` in backend
- [ ] Create `/api/emergency-alert` endpoint
- [ ] Add Telegram send message function
- [ ] Connect crisis detection to alert system
- [ ] Add SOS button in UI
- [ ] Test alert sending
- [ ] Add alert history/logs

### Phase 4: MongoDB Full Integration
**Goal:** Move all data from localStorage to MongoDB

**Tasks:**
- [ ] Create user authentication endpoints
- [ ] Implement JWT token management
- [ ] Create conversations collection and CRUD
- [ ] Create mood_history collection and CRUD
- [ ] Update frontend hooks to call backend APIs
- [ ] Remove localStorage dependencies
- [ ] Add data migration tools (if needed)

### Phase 5: Desktop Features & Polish
**Goal:** Complete desktop-specific features

**Tasks:**
- [ ] Desktop notifications for alerts
- [ ] Auto-start on boot (optional)
- [ ] Minimize to tray
- [ ] Native context menus
- [ ] Desktop keyboard shortcuts (all working)
- [ ] Performance optimization
- [ ] Memory management
- [ ] Build installers (Windows, Mac, Linux)

### Phase 6: Testing & Quality Assurance
**Goal:** Comprehensive testing before release

**Tasks:**
- [ ] Backend testing (deep_testing_backend_v2)
- [ ] Frontend testing (auto_frontend_testing_agent)
- [ ] Manual testing of all features
- [ ] Crisis detection testing
- [ ] Telegram alert testing
- [ ] Cross-platform testing (Windows/Mac/Linux)
- [ ] Performance testing
- [ ] Security audit

---

## 🔐 SECURITY CONSIDERATIONS

1. **User Data:**
   - All conversations encrypted at rest in MongoDB
   - JWT tokens for authentication
   - Secure password hashing (bcrypt)

2. **Telegram Bot Token:**
   - Stored in backend `.env` only
   - Never exposed to frontend
   - Never committed to git

3. **BERT Model API:**
   - API keys stored securely
   - Rate limiting to prevent abuse
   - Error handling to prevent data leaks

4. **Desktop App:**
   - Context isolation enabled
   - Node integration disabled in renderer
   - Secure IPC communication via preload script

---

## 📦 DEPLOYMENT STRATEGY

### Development Build
```bash
# Start backend
cd backend && uvicorn server:app --reload

# Start frontend (in Electron window)
cd frontend && yarn start

# Start Electron (in development)
yarn electron:dev
```

### Production Build
```bash
# Build React app
cd frontend && yarn build

# Package Electron app
electron-builder --windows --mac --linux
```

### Distribution
- **Windows:** `.exe` installer
- **macOS:** `.dmg` installer
- **Linux:** `.AppImage` or `.deb`

---

## 🎯 SUCCESS CRITERIA

**Project is complete when:**
- ✅ Electron desktop app launches successfully
- ✅ All platforms supported (Windows, Mac, Linux)
- ✅ User can signup/login with MongoDB backend
- ✅ Fine-tuned BERT model responds to chat messages
- ✅ Crisis detection triggers Telegram alerts
- ✅ SOS button sends emergency alerts
- ✅ Mood tracking saves to MongoDB
- ✅ Conversations persist in MongoDB
- ✅ Desktop keyboard shortcuts all work
- ✅ System tray icon functional
- ✅ Desktop notifications working
- ✅ Theme toggle persists
- ✅ No console errors
- ✅ All tests passing (backend + frontend)
- ✅ Installers built for all platforms

---

## 📋 AGENT HANDOFF CHECKLIST

**When passing to next agent, ensure:**
- [ ] This file is up to date
- [ ] PROGRESS_TRACKING.md reflects current state
- [ ] test_result.md has latest testing data
- [ ] All completed tasks are checked off
- [ ] Any blockers are clearly documented
- [ ] Code is committed and working
- [ ] Services are running (supervisorctl status)

---

## 🔗 IMPORTANT FILES TO READ

1. **`/app/PROJECT_REQUIREMENTS.md`** - This file (requirements + context)
2. **`/app/PROGRESS_TRACKING.md`** - Detailed feature tracking
3. **`/app/test_result.md`** - Testing protocol and results
4. **`/app/frontend/src/index.css`** - Theme colors and design tokens
5. **`/app/backend/server.py`** - Backend API structure

---

## 💡 KEY DECISIONS MADE

| Decision | Reasoning | Date |
|----------|-----------|------|
| Use Electron for desktop | User requirement for native desktop app | Dec 2024 |
| Use fine-tuned BERT (no external LLM) | User has custom model trained on 50k mental health conversations | Dec 2024 |
| Telegram for emergency alerts | User already has bot, reliable delivery | Dec 2024 |
| Green wellness theme | Calming, mental health focused design | Dec 2024 |
| MongoDB for persistence | Scalable, flexible schema, async driver available | Dec 2024 |
| FastAPI for backend | Modern, async, great for AI integrations | Dec 2024 |

---

## 📞 CONTACT POINTS

**BERT Model Details:** Awaiting user response  
**Telegram Bot Token:** User has it, will provide when ready  
**Emergency Contact Flow:** User → Bot → Emergency Contact via Telegram  

---

**🔄 This document will be updated as the project progresses.**  
**📌 All agents MUST read this file before making changes.**

---

*Last updated by: Continuation Agent - Phase 1 (Electron Conversion) Starting*
