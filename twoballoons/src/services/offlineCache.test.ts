import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { offlineCache, OfflineCache } from './offlineCache';

// Mock IndexedDB
const mockObjectStore = {
  put: vi.fn(),
  get: vi.fn()
};

const mockTransaction = {
  objectStore: vi.fn(() => mockObjectStore)
};

const mockDB = {
  transaction: vi.fn(() => mockTransaction),
  objectStoreNames: {
    contains: vi.fn(() => false)
  },
  createObjectStore: vi.fn()
};

const mockIDBOpenDBRequest = {
  onupgradeneeded: null as any,
  onsuccess: null as any,
  onerror: null as any,
  result: mockDB,
  error: new Error('IDB error')
};

// Replace window.indexedDB
const originalIndexedDB = window.indexedDB;

describe('OfflineCache', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the window.indexedDB.open implementation
    (window as any).indexedDB = {
      open: vi.fn(() => mockIDBOpenDBRequest)
    };
  });

  afterEach(() => {
    (window as any).indexedDB = originalIndexedDB;
  });

  it('initializes DB correctly', async () => {
    mockObjectStore.put.mockImplementationOnce(() => {
        const req = { onsuccess: null as any, onerror: null as any };
        setTimeout(() => req.onsuccess && req.onsuccess(), 0);
        return req;
    });

    const cache = new OfflineCache();
    const p = cache.saveVaultState('test_id', { nodes: [] });

    // Simulate db open success
    setTimeout(() => {
        mockIDBOpenDBRequest.onsuccess({ target: mockIDBOpenDBRequest });
    }, 10);

    await p;
    expect(window.indexedDB.open).toHaveBeenCalledWith('twoballoons_vault_db', 1);
  });

  it('handles saveVaultState correctly', async () => {
    mockObjectStore.put.mockImplementationOnce(() => {
        const req = { onsuccess: null as any, onerror: null as any };
        setTimeout(() => req.onsuccess && req.onsuccess(), 0);
        return req;
    });

    const p = offlineCache.saveVaultState('vault_1', { data: 123 });
    setTimeout(() => {
        mockIDBOpenDBRequest.onsuccess({ target: mockIDBOpenDBRequest });
    }, 10);
    await p;

    expect(mockTransaction.objectStore).toHaveBeenCalledWith('vault_state');
    expect(mockObjectStore.put).toHaveBeenCalledWith(expect.objectContaining({
      id: 'vault_1',
      data: { data: 123 }
    }));
  });

  it('handles getVaultState correctly', async () => {
    mockObjectStore.get.mockImplementationOnce(() => {
        const req = { onsuccess: null as any, onerror: null as any, result: { data: { data: 123 } } };
        setTimeout(() => req.onsuccess && req.onsuccess(), 0);
        return req;
    });

    const p = offlineCache.getVaultState('vault_1');
    setTimeout(() => {
        mockIDBOpenDBRequest.onsuccess({ target: mockIDBOpenDBRequest });
    }, 10);
    const res = await p;

    expect(mockTransaction.objectStore).toHaveBeenCalledWith('vault_state');
    expect(mockObjectStore.get).toHaveBeenCalledWith('vault_1');
    expect(res).toEqual({ data: 123 });
  });

  it('fails gracefully when indexedDB is not supported', async () => {
    (window as any).indexedDB = undefined;

    const cache = new OfflineCache();
    await cache.saveVaultState('id', {});

    const res = await cache.getVaultState('id');
    expect(res).toBeNull(); // Should catch error and return null
  });
});
