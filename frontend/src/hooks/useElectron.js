import { useState, useEffect } from 'react';

/**
 * Hook to interact with Electron API
 * Provides desktop-specific features when running in Electron
 */
export const useElectron = () => {
  const [isElectron, setIsElectron] = useState(false);
  const [platform, setPlatform] = useState(null);
  const [appVersion, setAppVersion] = useState(null);

  useEffect(() => {
    // Check if running in Electron
    if (window.electronAPI?.isElectron) {
      setIsElectron(true);

      // Get platform info
      window.electronAPI.getPlatform().then(info => {
        setPlatform(info);
      });

      // Get app version
      window.electronAPI.getAppVersion().then(version => {
        setAppVersion(version);
      });

      // Set up keyboard shortcut listeners
      const unsubNewChat = window.electronAPI.onNewChat(() => {
        // Trigger new chat event
        window.dispatchEvent(new CustomEvent('electron-new-chat'));
      });

      const unsubSearch = window.electronAPI.onOpenSearch(() => {
        // Trigger search event
        window.dispatchEvent(new CustomEvent('electron-open-search'));
      });

      const unsubSettings = window.electronAPI.onOpenSettings(() => {
        // Trigger settings event
        window.dispatchEvent(new CustomEvent('electron-open-settings'));
      });

      const unsubSOS = window.electronAPI.onTriggerSOS(() => {
        // Trigger SOS event
        window.dispatchEvent(new CustomEvent('electron-trigger-sos'));
      });

      return () => {
        unsubNewChat();
        unsubSearch();
        unsubSettings();
        unsubSOS();
      };
    }
  }, []);

  /**
   * Show desktop notification
   */
  const showNotification = async (title, body, options = {}) => {
    if (isElectron && window.electronAPI) {
      return window.electronAPI.showNotification({
        title,
        body,
        ...options
      });
    }
    // Fallback to web notifications
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, ...options });
      return true;
    }
    return false;
  };

  /**
   * Open external URL in default browser
   */
  const openExternal = async (url) => {
    if (isElectron && window.electronAPI) {
      return window.electronAPI.openExternal(url);
    }
    // Fallback to window.open
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  };

  /**
   * Persistent storage (electron-store or localStorage fallback)
   */
  const store = {
    get: async (key, defaultValue) => {
      if (isElectron && window.electronAPI) {
        return window.electronAPI.store.get(key, defaultValue);
      }
      // Fallback to localStorage
      try {
        const value = localStorage.getItem(`electron_store_${key}`);
        return value ? JSON.parse(value) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    
    set: async (key, value) => {
      if (isElectron && window.electronAPI) {
        return window.electronAPI.store.set(key, value);
      }
      // Fallback to localStorage
      try {
        localStorage.setItem(`electron_store_${key}`, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    
    delete: async (key) => {
      if (isElectron && window.electronAPI) {
        return window.electronAPI.store.delete(key);
      }
      // Fallback to localStorage
      localStorage.removeItem(`electron_store_${key}`);
      return true;
    }
  };

  return {
    isElectron,
    platform,
    appVersion,
    showNotification,
    openExternal,
    store
  };
};
