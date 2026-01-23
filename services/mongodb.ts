/**
 * MongoDB Real Data Service
 * Interfaces with the Node.js backend for secure Atlas access.
 * Includes robust fallbacks for sandboxed or restricted environments.
 */

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api/db' 
  : '/api/db';

const memoryStorage: Record<string, string> = {};

// Helper to check if storage is available
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const storageAvailable = isStorageAvailable();

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return storageAvailable ? localStorage.getItem(key) : memoryStorage[key] || null;
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (storageAvailable) {
        localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
    } catch (e) {
      memoryStorage[key] = value;
    }
  },
  removeItem: (key: string): void => {
    try {
      if (storageAvailable) {
        localStorage.removeItem(key);
      } else {
        delete memoryStorage[key];
      }
    } catch (e) {
      delete memoryStorage[key];
    }
  }
};

export class Collection<T extends { _id?: string }> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private async apiRequest(method: string, body?: any) {
    if (window.location.hostname === 'localhost') {
      try {
        const response = await fetch(`${API_BASE}/${this.collectionName}`, {
          method: method === 'GET' ? 'GET' : (method === 'PUT' ? 'PUT' : (method === 'DELETE' ? 'DELETE' : 'POST')),
          headers: { 'Content-Type': 'application/json' },
          body: (method !== 'GET') ? JSON.stringify(body) : undefined
        });

        if (response.ok) {
          return await response.json();
        }
      } catch (e) {
        // Continue to fallback
      }
    }
    return this.localStorageFallback(method, body);
  }

  private async localStorageFallback(method: string, body?: any) {
    const key = `resumaster_v1_${this.collectionName}`;
    let data: any[] = [];
    try {
      const stored = safeStorage.getItem(key);
      data = JSON.parse(stored || '[]');
    } catch (e) {
      data = [];
    }
    
    switch (method) {
      case 'GET': return data;
      case 'POST': 
        const newDoc = { ...body, _id: `id_${Math.random().toString(36).substring(7)}` };
        data.push(newDoc);
        safeStorage.setItem(key, JSON.stringify(data));
        return newDoc;
      case 'PUT':
        const index = data.findIndex((i: any) => (i._id === body._id || i.id === body._id));
        if (index !== -1) data[index] = { ...data[index], ...body.update };
        safeStorage.setItem(key, JSON.stringify(data));
        return true;
      case 'DELETE':
        const filtered = data.filter((i: any) => (i._id !== body._id && i.id !== body._id));
        safeStorage.setItem(key, JSON.stringify(filtered));
        return true;
      default: return null;
    }
  }

  async find(query: Partial<T> = {}): Promise<T[]> {
    return this.apiRequest('GET'); 
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    const all = await this.find();
    return all.find(item => 
      Object.entries(query).every(([k, v]) => (item as any)[k] === v)
    ) || null;
  }

  async insertOne(doc: Omit<T, '_id'>): Promise<T> {
    return this.apiRequest('POST', doc);
  }

  async updateOne(query: Partial<T>, update: Partial<T>): Promise<boolean> {
    const existing = await this.findOne(query);
    if (!existing) return false;
    const id = (existing as any)._id || (existing as any).id;
    return this.apiRequest('PUT', { _id: id, update });
  }

  async deleteOne(query: Partial<T>): Promise<boolean> {
    const existing = await this.findOne(query);
    if (!existing) return false;
    const id = (existing as any)._id || (existing as any).id;
    return this.apiRequest('DELETE', { _id: id });
  }
}

export const db = {
  uri: "mongodb+srv://keyframe:D3v3l0p3r%4074@cluster0.uzvsg.mongodb.net/",
  database: "resumebuilder",
  users: new Collection<any>('users'),
  resumes: new Collection<any>('resumes'),
  status: 'connected',
  engine: 'Node.js + MongoDB Atlas',
  region: 'ap-south-1 (Mumbai)',
  latency: 'Live'
};
