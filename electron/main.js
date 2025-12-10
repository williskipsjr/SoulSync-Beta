const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, shell, Notification } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { spawn } = require('child_process');

// Initialize electron-store for persistent settings
const store = new Store();

// Keep references to prevent garbage collection
let mainWindow = null;
let tray = null;
let backendProcess = null;

// Configuration
const isDev = !app.isPackaged;
const FRONTEND_URL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../frontend/build/index.html')}`;
const BACKEND_PORT = 8001;

// Start backend server
function startBackend() {
  if (backendProcess) {
    console.log('Backend already running');
    return;
  }

  const backendPath = isDev 
    ? path.join(__dirname, '../backend')
    : path.join(process.resourcesPath, 'backend');

  console.log('Starting backend from:', backendPath);

  // In development, assume backend is started by supervisor
  if (isDev) {
    console.log('Development mode: Backend should be running via supervisor');
    return;
  }

  // In production, start backend process
  backendProcess = spawn('python', ['-m', 'uvicorn', 'server:app', '--host', '0.0.0.0', '--port', BACKEND_PORT.toString()], {
    cwd: backendPath,
    stdio: 'inherit'
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend exited with code ${code}`);
    backendProcess = null;
  });
}

// Stop backend server
function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

// Create main window
function createWindow() {
  // Load window state from store
  const windowState = store.get('windowState', {
    width: 1280,
    height: 800,
    x: undefined,
    y: undefined,
    isMaximized: false
  });

  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 1024,
    minHeight: 600,
    backgroundColor: '#F9FDF9', // Light mint background
    show: false, // Show only when ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png'),
    titleBarStyle: 'default',
    frame: true
  });

  // Restore maximized state
  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  // Load the app
  mainWindow.loadURL(FRONTEND_URL);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Save window state on resize/move
  const saveWindowState = () => {
    const bounds = mainWindow.getBounds();
    const isMaximized = mainWindow.isMaximized();
    
    store.set('windowState', {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      isMaximized
    });
  };

  mainWindow.on('resize', saveWindowState);
  mainWindow.on('move', saveWindowState);
  mainWindow.on('maximize', saveWindowState);
  mainWindow.on('unmaximize', saveWindowState);

  // Handle window close
  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin' || store.get('minimizeToTray', true)) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create system tray
function createTray() {
  const iconPath = path.join(__dirname, 'icon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show SoulSync',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'New Chat',
      accelerator: 'CmdOrCtrl+N',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.webContents.send('new-chat');
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Settings',
      accelerator: 'CmdOrCtrl+,',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          mainWindow.webContents.send('open-settings');
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit SoulSync',
      accelerator: 'CmdOrCtrl+Q',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('SoulSync - Mental Health Companion');

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Register global keyboard shortcuts
function registerShortcuts() {
  // New Chat: Ctrl/Cmd + N
  globalShortcut.register('CmdOrCtrl+N', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('new-chat');
    }
  });

  // Search: Ctrl/Cmd + K
  globalShortcut.register('CmdOrCtrl+K', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('open-search');
    }
  });

  // Settings: Ctrl/Cmd + ,
  globalShortcut.register('CmdOrCtrl+,', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('open-settings');
    }
  });

  // SOS Emergency: Ctrl/Cmd + Shift + E
  globalShortcut.register('CmdOrCtrl+Shift+E', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('trigger-sos');
    }
  });
}

// IPC Handlers
function setupIPC() {
  // Get app version
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  // Get store value
  ipcMain.handle('store-get', (event, key, defaultValue) => {
    return store.get(key, defaultValue);
  });

  // Set store value
  ipcMain.handle('store-set', (event, key, value) => {
    store.set(key, value);
    return true;
  });

  // Delete store value
  ipcMain.handle('store-delete', (event, key) => {
    store.delete(key);
    return true;
  });

  // Show notification
  ipcMain.handle('show-notification', (event, options) => {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title: options.title || 'SoulSync',
        body: options.body || '',
        icon: path.join(__dirname, 'icon.png'),
        silent: options.silent || false
      });

      notification.show();

      notification.on('click', () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      });

      return true;
    }
    return false;
  });

  // Open external URL
  ipcMain.handle('open-external', (event, url) => {
    shell.openExternal(url);
    return true;
  });

  // Get platform info
  ipcMain.handle('get-platform', () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.getSystemVersion()
    };
  });
}

// App lifecycle
app.whenReady().then(() => {
  // Start backend
  startBackend();

  // Wait a bit for backend to start
  setTimeout(() => {
    createWindow();
    createTray();
    registerShortcuts();
    setupIPC();
  }, isDev ? 1000 : 3000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && !store.get('minimizeToTray', true)) {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
  globalShortcut.unregisterAll();
  stopBackend();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});
