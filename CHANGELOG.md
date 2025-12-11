# Changelog

All notable changes to SoulSync Desktop App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2024-12-11

### 🎉 Major Release - Desktop App Ready

#### Added

##### Desktop Features
- ✅ **True Desktop App** - Full Electron integration for Windows, macOS, and Linux
- ✅ **System Tray Integration** - Minimize to tray with quick actions
- ✅ **Global Keyboard Shortcuts** - Quick access from anywhere on your system
  - `Ctrl/Cmd + N` - New chat conversation
  - `Ctrl/Cmd + K` - Open search
  - `Ctrl/Cmd + ,` - Open settings
  - `Ctrl/Cmd + Shift + E` - Emergency SOS button
  - `Ctrl/Cmd + Q` - Quit application
- ✅ **Window State Persistence** - Remembers size, position, and maximized state
- ✅ **Desktop Notifications** - Stay informed with system notifications
- ✅ **Offline-First Architecture** - Works completely without internet after installation

##### Storage & Backend
- ✅ **Local JSON Storage** - Replaced MongoDB with lightweight JSON file storage
  - No database installation required
  - All data stored locally on user's device
  - Privacy-first approach
  - Files: `users.json`, `conversations.json`, `mood_entries.json`, `status_checks.json`
- ✅ **Async File Operations** - Fast, non-blocking file I/O with aiofiles
- ✅ **RESTful API** - Complete FastAPI backend with proper endpoints
  - User management (register, login, profile)
  - Chat conversations with history
  - Mood tracking with statistics
  - Emergency notification system

##### Frontend Features
- ✅ **Beautiful UI** - Calming green theme designed for mental wellness
- ✅ **Smooth Animations** - Framer Motion for delightful interactions
- ✅ **Accessible Components** - Radix UI primitives for accessibility
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Loading States** - Proper loading indicators everywhere
- ✅ **Error Handling** - User-friendly error messages

##### Documentation
- ✅ **Comprehensive README** - Complete guide with screenshots
- ✅ **Desktop App Guide** - Detailed building and distribution instructions
- ✅ **Screenshots** - All pages documented with high-quality screenshots
  - Authentication (login/signup)
  - Onboarding flow (emergency contact setup, welcome)
  - Mood Dashboard
  - AI Chat Interface
  - Settings Page
- ✅ **Installation Guide** - Step-by-step for all platforms
- ✅ **Troubleshooting Section** - Common issues and solutions
- ✅ **Contributing Guidelines** - How to contribute to the project

#### Changed

##### Configuration
- 🔄 **Frontend Backend URL** - Changed from cloud URL to `http://localhost:8001`
- 🔄 **Environment Files** - Simplified .env configuration
- 🔄 **Backend Dependencies** - Updated requirements.txt with aiofiles

##### Architecture  
- 🔄 **Storage Layer** - Migrated from MongoDB to local JSON files
- 🔄 **Data Models** - Updated Pydantic models for JSON serialization
- 🔄 **API Responses** - Improved response format and error handling

#### Fixed
- ✅ **MongoDB Dependency** - Removed requirement for MongoDB installation
- ✅ **Backend URL Configuration** - Fixed hardcoded URLs
- ✅ **Data Persistence** - Ensured data saves correctly to JSON files
- ✅ **Authentication Flow** - Fixed auth loading states and redirects
- ✅ **Emergency Contact Setup** - Fixed validation and skip functionality

#### Security
- 🔒 **Context Isolation** - Enabled in Electron for security
- 🔒 **Node Integration Disabled** - Renderer process runs in sandbox
- 🔒 **Preload Script** - Secure IPC communication bridge
- 🔒 **Local Storage Only** - No data sent to external servers

---

## [1.0.0] - 2024-11-XX

### 🎉 Initial Release

#### Added
- Initial web-based version of SoulSync
- Basic authentication system
- Mood tracking functionality
- AI chat interface
- Emergency contact setup
- Settings management

---

## Unreleased

### Planned for v2.1.0

#### Features
- [ ] AI model integration (GPT-4, Claude)
- [ ] Voice input for chat
- [ ] Mood visualization charts with trends
- [ ] Daily wellness reminders
- [ ] Journaling feature with tags
- [ ] Export conversation history (PDF/JSON)
- [ ] Multiple language support (Spanish, French, German)
- [ ] Dark mode improvements
- [ ] Auto-update functionality

#### Improvements
- [ ] Better error messages
- [ ] Performance optimizations
- [ ] Reduced bundle size
- [ ] Faster startup time
- [ ] Better keyboard navigation

#### Developer Experience
- [ ] Unit tests for backend
- [ ] Integration tests for API
- [ ] E2E tests with Playwright
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Automated releases

### Planned for v3.0.0

#### Major Features
- [ ] Mobile app companion (iOS/Android)
- [ ] End-to-end encryption for optional cloud sync
- [ ] Group therapy sessions
- [ ] Integration with wearables
- [ ] Meditation timer and guides
- [ ] Sleep tracking integration
- [ ] Professional therapist matching
- [ ] Insurance integration

---

## Version History

| Version | Release Date | Type | Summary |
|---------|-------------|------|---------|
| 2.0.0 | 2024-12-11 | Major | Desktop app release with local storage |
| 1.0.0 | 2024-11-XX | Major | Initial web-based release |

---

## How to Update

### For Users

**Desktop App:**
1. Download the latest installer for your platform
2. Run the installer (it will replace the old version)
3. Your data is preserved in the user data folder

**From Source:**
```bash
git pull origin main
yarn install
cd frontend && yarn install && cd ..
cd backend && pip install -r requirements.txt && cd ..
yarn dev
```

### For Developers

```bash
# Update dependencies
yarn upgrade
cd frontend && yarn upgrade && cd ..
pip install -r backend/requirements.txt --upgrade

# Rebuild
yarn electron:build
```

---

## Migration Notes

### Migrating from v1.0 to v2.0

#### Storage Migration
v2.0 uses local JSON files instead of MongoDB. If you have data in MongoDB from v1.0:

```bash
# Export MongoDB data (v1.0)
mongoexport --db soulsync --collection users --out users.json
mongoexport --db soulsync --collection conversations --out conversations.json
mongoexport --db soulsync --collection mood_entries --out mood_entries.json

# Move to v2.0 data directory
mv *.json backend/data/
```

#### Configuration Changes
- Update `frontend/.env`:
  ```env
  REACT_APP_BACKEND_URL=http://localhost:8001
  ```
- Backend `.env` now uses `DATA_DIR` instead of `MONGO_URL`

---

## Support & Feedback

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/soulsync-desktop/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/soulsync-desktop/discussions)
- 💬 **Community**: [Discord Server](https://discord.gg/soulsync)

---

## Contributors

Thank you to all contributors who helped with this release! 💚

---

[⬆ Back to README](README.md)
