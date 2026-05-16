const SYNC_STORAGE_KEY = "glp_pending_sync";
const SYNC_INTERVAL = 30000;

class LocalSyncManager {
  constructor() {
    this.pendingItems = this.loadPending();
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.listeners = new Set();
    
    this.init();
  }

  init() {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.sync();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
    });

    if (this.isOnline && this.pendingItems.length > 0) {
      this.sync();
    }

    setInterval(() => {
      if (this.isOnline && this.pendingItems.length > 0) {
        this.sync();
      }
    }, SYNC_INTERVAL);
  }

  loadPending() {
    try {
      const stored = localStorage.getItem(SYNC_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  savePending() {
    try {
      localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(this.pendingItems));
    } catch (e) {
      console.error("[LocalSync] Failed to save pending items:", e);
    }
  }

  addItem(type, data) {
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      createdAt: new Date().toISOString(),
      attempts: 0
    };

    this.pendingItems.push(item);
    this.savePending();

    if (this.isOnline) {
      this.sync();
    }

    return item.id;
  }

  async sync() {
    if (this.syncInProgress || !this.isOnline || this.pendingItems.length === 0) {
      return;
    }

    this.syncInProgress = true;
    const itemsToSync = [...this.pendingItems];
    const synced = [];
    const failed = [];

    for (const item of itemsToSync) {
      try {
        await this.syncItem(item);
        synced.push(item.id);
        this.notify("synced", item);
      } catch (error) {
        item.attempts++;
        item.lastError = error.message;
        
        if (item.attempts >= 3) {
          failed.push(item);
          this.notify("failed", item);
        }
      }
    }

    this.pendingItems = this.pendingItems.filter(
      item => !synced.includes(item.id) && item.attempts < 3
    );
    this.savePending();
    this.syncInProgress = false;

    if (synced.length > 0) {
      this.notify("batch_synced", { count: synced.length });
    }
  }

  async syncItem(item) {
    const endpoints = {
      mood: "/api/moods",
      journal: "/api/journal"
    };

    const endpoint = endpoints[item.type];
    if (!endpoint) {
      throw new Error(`Unknown sync type: ${item.type}`);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(item.data)
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }

    return response.json();
  }

  onSync(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (e) {
        console.error("[LocalSync] Listener error:", e);
      }
    });
  }

  getPendingCount() {
    return this.pendingItems.length;
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      pendingCount: this.pendingItems.length,
      syncInProgress: this.syncInProgress
    };
  }

  clearPending() {
    this.pendingItems = [];
    this.savePending();
  }
}

export const localSync = new LocalSyncManager();

export function saveMoodOffline(moodData) {
  return localSync.addItem("mood", moodData);
}

export function saveJournalOffline(journalData) {
  return localSync.addItem("journal", journalData);
}

export function getSyncStatus() {
  return localSync.getStatus();
}

export function onSyncEvent(callback) {
  return localSync.onSync(callback);
}

export default localSync;
