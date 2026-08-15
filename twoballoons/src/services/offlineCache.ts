export interface CacheEntry<T> {
  id: string;
  data: T;
  timestamp: number;
}

export class OfflineCache {
  private dbName = 'twoballoons_vault_db';
  private dbVersion = 1;

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      // For SSR or testing environments where indexedDB might not exist
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('indexedDB is not supported'));
      }

      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('vault_state')) {
          db.createObjectStore('vault_state', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('keyframes')) {
          db.createObjectStore('keyframes', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  private async save<T>(storeName: string, id: string, data: T): Promise<void> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        const request = store.put({ id, data, timestamp: Date.now() });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      if ((e as Error).message !== 'indexedDB is not supported') {
          console.warn(`Failed to save to ${storeName}:`, e);
      }
    }
  }

  private async get<T>(storeName: string, id: string): Promise<T | null> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.data as T);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      if ((e as Error).message !== 'indexedDB is not supported') {
          console.warn(`Failed to get from ${storeName}:`, e);
      }
      return null;
    }
  }

  async saveVaultState(id: string, data: any): Promise<void> {
    return this.save('vault_state', id, data);
  }

  async getVaultState(id: string): Promise<any | null> {
    return this.get('vault_state', id);
  }

  async saveDocument(id: string, content: string): Promise<void> {
    return this.save('documents', id, content);
  }

  async getDocument(id: string): Promise<string | null> {
    return this.get<string>('documents', id);
  }

  async saveKeyframes(id: string, keyframes: any[]): Promise<void> {
    return this.save('keyframes', id, keyframes);
  }

  async getKeyframes(id: string): Promise<any[] | null> {
    return this.get<any[]>('keyframes', id);
  }
}

export const offlineCache = new OfflineCache();
