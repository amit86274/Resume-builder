
import { API_BASE } from './api';

/**
 * MongoDB Client Service Proxy
 * Communicates with server.js via API_BASE
 */

const getAuthToken = () => localStorage.getItem('resumaster_token');

export class Collection<T extends { _id?: string }> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private async apiRequest(method: string, body?: any) {
    const token = getAuthToken();
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE}/db/${this.collectionName}`;

    try {
      const response = await fetch(url, {
        method: method,
        headers,
        body: (method !== 'GET') ? JSON.stringify(body) : undefined
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errData = await response.json();
        throw new Error(errData.error || "Database error");
      }
    } catch (e: any) {
      console.error(`[Collection API Error] ${method} ${this.collectionName}:`, e.message);
      throw e;
    }
  }

  async find(): Promise<T[]> {
    return this.apiRequest('GET'); 
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    const all = await this.find();
    return all.find(item => 
      Object.entries(query).every(([k, v]) => (item as any)[k] === v)
    ) || null;
  }

  async insertOne(doc: T): Promise<T> {
    return this.apiRequest('POST', doc);
  }

  async updateOne(query: Partial<T>, update: Partial<T>): Promise<boolean> {
    const existing = await this.findOne(query);
    if (!existing || !existing._id) return false;
    
    const result = await this.apiRequest('PUT', { 
      _id: existing._id, 
      update: { ...existing, ...update } 
    });
    return !!result.success;
  }

  async deleteOne(query: Partial<T>): Promise<boolean> {
    const existing = await this.findOne(query);
    if (!existing || !existing._id) return false;
    
    const result = await this.apiRequest('DELETE', { _id: existing._id });
    return !!result.success;
  }
}

export const db = {
  engine: "Atlas Neural Storage",
  region: "aws-ap-south-1",
  users: new Collection<any>('users'),
  resumes: new Collection<any>('resumes'),
  payments: new Collection<any>('payments')
};
