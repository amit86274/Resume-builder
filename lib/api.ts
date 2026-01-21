
import { User, Payment } from '../types';

export const API_BASE = '/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('resumaster_token')}`
});

export const MockAPI = {
  getDebugUrl: () => API_BASE,

  async socialLogin(provider: string, profile: any): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/social`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: profile.email,
        name: profile.name,
        providerId: profile.sub || profile.id
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Social Login Failed");
    if (data.token) localStorage.setItem('resumaster_token', data.token);
    return { ...data.user, id: data.user._id || data.user.id };
  },

  async login(email: string, password?: string): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Login Failed");
    if (data.token) localStorage.setItem('resumaster_token', data.token);
    return { ...data.user, id: data.user._id || data.user.id };
  },

  async signup(name: string, email: string, password?: string): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Signup Failed");
    if (data.token) localStorage.setItem('resumaster_token', data.token);
    return { ...data.user, id: data.user._id || data.user.id };
  },

  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!response.ok && response.status !== 404) {
      const data = await response.json();
      throw new Error(data.error || "Reset request failed");
    }
  },

  async logout() {
    localStorage.removeItem('resumaster_token');
    localStorage.removeItem('resuMaster_user');
  },

  async getResumes(userId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE}/db/resumes`, { headers: getHeaders() });
    return await response.json() || [];
  },

  async getPayments(userId: string): Promise<Payment[]> {
    const response = await fetch(`${API_BASE}/db/payments`, { headers: getHeaders() });
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  async saveResume(userId: string, data: any): Promise<any> {
    const isUpdate = !!(data._id || data.id);
    const method = isUpdate ? 'PUT' : 'POST';
    const response = await fetch(`${API_BASE}/db/resumes`, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(isUpdate ? { _id: data._id || data.id, update: data } : data)
    });
    return await response.json();
  },

  async deleteResume(userId: string, resumeId: string): Promise<void> {
    await fetch(`${API_BASE}/db/resumes`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ _id: resumeId })
    });
  }
};

export const AdminAPI = {
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/db/users`, { headers: getHeaders() });
    return await response.json() || [];
  },
  async getFinancialStats(): Promise<any> {
    const response = await fetch(`${API_BASE}/db/admin-stats`, { headers: getHeaders() });
    return await response.json() || { totalRevenue: 0, totalUsers: 0, dbStats: { documentCount: 0 } };
  }
};
