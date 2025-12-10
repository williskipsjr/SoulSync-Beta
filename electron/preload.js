const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Platform info
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Persistent storage (electron-store)
  store: {
    get: (key, defaultValue) => ipcRenderer.invoke('store-get', key, defaultValue),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
    delete: (key) => ipcRenderer.invoke('store-delete', key)
  },
  
  // Notifications
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),
  
  // External links
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Listen to main process events
  onNewChat: (callback) => {
    ipcRenderer.on('new-chat', callback);
    return () => ipcRenderer.removeListener('new-chat', callback);
  },
  
  onOpenSearch: (callback) => {
    ipcRenderer.on('open-search', callback);
    return () => ipcRenderer.removeListener('open-search', callback);
  },
  
  onOpenSettings: (callback) => {
    ipcRenderer.on('open-settings', callback);
    return () => ipcRenderer.removeListener('open-settings', callback);
  },
  
  onTriggerSOS: (callback) => {
    ipcRenderer.on('trigger-sos', callback);
    return () => ipcRenderer.removeListener('trigger-sos', callback);
  },
  
  // Check if running in Electron
  isElectron: true
});

// Disable right-click context menu in production
window.addEventListener('DOMContentLoaded', () => {
  const isProduction = !process.env.NODE_ENV || process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    }, false);
  }
});
