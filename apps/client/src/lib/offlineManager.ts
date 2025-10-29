/**
 * Offline Manager
 * Handles offline detection, queue management, and sync when online
 */

export type OfflineAction = {
  id: string;
  type: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: any;
  timestamp: number;
  retries: number;
};

class OfflineManager {
  private static instance: OfflineManager;
  private isOnline: boolean = navigator.onLine;
  private queue: OfflineAction[] = [];
  private listeners: Set<(isOnline: boolean) => void> = new Set();
  private syncInProgress = false;

  private constructor() {
    this.initializeListeners();
    this.loadQueue();
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  /**
   * Initialize online/offline event listeners
   */
  private initializeListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 Connection restored - going online');
      this.isOnline = true;
      this.notifyListeners(true);
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      console.log('📴 Connection lost - going offline');
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue() {
    try {
      const stored = localStorage.getItem('offline_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue() {
    try {
      localStorage.setItem('offline_queue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  /**
   * Check if currently online
   */
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Subscribe to online status changes
   */
  subscribe(listener: (isOnline: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach((listener) => listener(isOnline));
  }

  /**
   * Add action to offline queue
   */
  addToQueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retries'>) {
    const newAction: OfflineAction = {
      ...action,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(newAction);
    this.saveQueue();
    
    console.log('📋 Added to offline queue:', newAction);
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Get all queued actions
   */
  getQueue(): OfflineAction[] {
    return [...this.queue];
  }

  /**
   * Clear the queue
   */
  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }

  /**
   * Sync all queued actions when online
   */
  async syncQueue(): Promise<{ success: number; failed: number }> {
    if (!this.isOnline || this.syncInProgress) {
      return { success: 0, failed: 0 };
    }

    if (this.queue.length === 0) {
      console.log('✅ Offline queue is empty - nothing to sync');
      return { success: 0, failed: 0 };
    }

    this.syncInProgress = true;
    console.log(`🔄 Syncing ${this.queue.length} queued actions...`);

    let successCount = 0;
    let failedCount = 0;
    const failedActions: OfflineAction[] = [];

    for (const action of this.queue) {
      try {
        await this.executeAction(action);
        successCount++;
        console.log(`✅ Synced: ${action.type} ${action.url}`);
      } catch (error) {
        console.error(`❌ Failed to sync: ${action.type} ${action.url}`, error);
        
        action.retries++;
        if (action.retries < 3) {
          failedActions.push(action);
        } else {
          console.error(`Max retries reached for action:`, action);
        }
        failedCount++;
      }
    }

    // Update queue with only failed actions
    this.queue = failedActions;
    this.saveQueue();
    this.syncInProgress = false;

    console.log(`🎉 Sync complete: ${successCount} succeeded, ${failedCount} failed`);
    return { success: successCount, failed: failedCount };
  }

  /**
   * Execute a single queued action
   */
  private async executeAction(action: OfflineAction): Promise<void> {
    const response = await fetch(action.url, {
      method: action.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: action.data ? JSON.stringify(action.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Make a request that queues automatically when offline
   */
  async request(
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      data?: any;
      type?: string;
    } = {}
  ): Promise<Response> {
    const { method = 'GET', data, type = 'request' } = options;

    // If online, make request directly
    if (this.isOnline) {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok && response.status >= 500) {
        // Server error - queue for retry
        this.addToQueue({ type, url, method, data });
      }

      return response;
    }

    // If offline, queue the action
    this.addToQueue({ type, url, method, data });
    
    // Return a mock response
    return new Response(JSON.stringify({ queued: true }), {
      status: 202,
      statusText: 'Queued for sync',
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Export singleton instance
export const offlineManager = OfflineManager.getInstance();
