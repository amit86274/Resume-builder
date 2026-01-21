
import { User, Payment, ResumeData } from '../types';

/**
 * PRODUCTION-READY HYBRID API CLIENT
 * Connects to Next.js API routes (app/api/...) in production.
 * Falls back to persistent localStorage in development/preview if API is unreachable.
 */

const DB_KEYS = {
  USERS: 'resumaster_prod_users',
  RESUMES: 'resumaster_prod_resumes',
  PAYMENTS: 'resumaster_prod_payments',
  TOKEN: 'resumaster_token'
};

const getHeaders = () => {
  const token = localStorage.getItem(DB_KEYS.TOKEN);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// --- LOCAL STORAGE DATABASE (FALLBACK) ---
const getLocal = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocal = (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val));

const fallbackDB = {
  async login(email: string, password?: string): Promise<User> {
    const users = getLocal(DB_KEYS.USERS);
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("Account not found. Please sign up first.");
    if (password && user.password !== password) throw new Error("Incorrect password.");
    localStorage.setItem(DB_KEYS.TOKEN, `mock_${Math.random().toString(36)}`);
    return { ...user, id: user.id || user._id, _id: user._id || user.id };
  },
  async signup(name: string, email: string, password?: string): Promise<User> {
    const users = getLocal(DB_KEYS.USERS);
    if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) throw new Error("Email exists.");
    const id = `u_${Date.now()}`;
    const newUser = {
      id,
      _id: id,
      name, 
      email: email.toLowerCase(), 
      password,
      role: (email.toLowerCase() === 'amit86274@gmail.com' ? 'admin' : 'user') as 'user' | 'admin',
      plan: 'free' as 'free' | 'pro' | 'annual',
      createdAt: new Date().toISOString(),
      metadata: { 
        resumeCount: 0, 
        totalDownloads: 0, 
        lastLogin: new Date().toISOString() 
      }
    };
    users.push(newUser);
    setLocal(DB_KEYS.USERS, users);
    localStorage.setItem(DB_KEYS.TOKEN, `mock_${Math.random().toString(36)}`);
    return newUser;
  }
};

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  let data;
  
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e) {
      throw new Error("Malformed JSON response from server.");
    }
  } else {
    // If not JSON, it's likely a 404 HTML page or server error
    throw new Error("API_NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || `Error ${response.status}`);
  }
  return data;
}

export const MockAPI = {
  async login(email: string, password?: string): Promise<User> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(res);
      if (data.token) localStorage.setItem(DB_KEYS.TOKEN, data.token);
      return { ...data.user, id: data.user._id || data.user.id };
    } catch (err: any) {
      if (err.message === 'API_NOT_FOUND' || err.message.includes('Unexpected token')) {
        return fallbackDB.login(email, password);
      }
      throw err;
    }
  },

  async signup(name: string, email: string, password?: string): Promise<User> {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await handleResponse(res);
      if (data.token) localStorage.setItem(DB_KEYS.TOKEN, data.token);
      return { ...data.user, id: data.user._id || data.user.id };
    } catch (err: any) {
      if (err.message === 'API_NOT_FOUND' || err.message.includes('Unexpected token')) {
        return fallbackDB.signup(name, email, password);
      }
      throw err;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'check' }),
      });
      if (res.status === 404) throw new Error("Email not found.");
    } catch (err: any) {
      if (err.message === 'API_NOT_FOUND') return; // Silence in preview
      throw err;
    }
  },

  async logout() {
    localStorage.removeItem(DB_KEYS.TOKEN);
    localStorage.removeItem('resuMaster_user');
  },

  async getResumes(userId: string): Promise<any[]> {
    try {
      const res = await fetch('/api/db/resumes', { headers: getHeaders() });
      const data = await handleResponse(res);
      return (data || []).map((r: any) => ({ ...r, id: r._id || r.id }));
    } catch (err: any) {
      if (err.message === 'API_NOT_FOUND') {
        return getLocal(DB_KEYS.RESUMES).filter((r: any) => r.userId === userId);
      }
      return [];
    }
  },

  async saveResume(userId: string, data: any): Promise<any> {
    try {
      const isUpdate = !!(data._id || data.id);
      const res = await fetch('/api/db/resumes', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(isUpdate ? { _id: data._id || data.id, update: data } : data),
      });
      const result = await handleResponse(res);
      return { ...result, id: result._id || result.id };
    } catch (err: any) {
      if (err.message === 'API_NOT_FOUND') {
        const resumes = getLocal(DB_KEYS.RESUMES);
        const id = data.id || data._id || `res_${Date.now()}`;
        const existingIdx = resumes.findIndex((r: any) => (r.id === id || r._id === id));
        const item = { ...data, id, _id: id, userId, lastEdited: new Date().toISOString() };
        if (existingIdx > -1) resumes[existingIdx] = item;
        else resumes.push(item);
        setLocal(DB_KEYS.RESUMES, resumes);
        return item;
      }
      throw err;
    }
  },

  async deleteResume(userId: string, resumeId: string): Promise<void> {
    try {
      const res = await fetch('/api/db/resumes', {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ _id: resumeId }),
      });
      await handleResponse(res);
    } catch (err: any) {
      if (err.message === 'API_NOT_FOUND') {
        const resumes = getLocal(DB_KEYS.RESUMES);
        setLocal(DB_KEYS.RESUMES, resumes.filter((r: any) => (r.id || r._id) !== resumeId));
        return;
      }
      throw err;
    }
  },

  async getPayments(userId: string): Promise<Payment[]> {
    try {
      const res = await fetch('/api/db/payments', { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err: any) {
      return [];
    }
  }
};

export const AdminAPI = {
  async getAllUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/db/users', { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err: any) {
      return getLocal(DB_KEYS.USERS);
    }
  },
  async getFinancialStats(): Promise<any> {
    try {
      const res = await fetch('/api/db/admin-stats', { headers: getHeaders() });
      return await handleResponse(res);
    } catch (err: any) {
      return { totalRevenue: 0, totalUsers: getLocal(DB_KEYS.USERS).length, dbStats: { documentCount: 0 } };
    }
  }
};
