import { User } from '../types';
import { db } from './mongodb';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Strict Admin Configuration
const ADMIN_EMAIL = 'amit86274@gmail.com';
const ADMIN_PASSWORD = 'Chandigarh@321';

export const MockAPI = {
  async socialLogin(provider: string, profile?: any): Promise<User> {
    await sleep(800); 
    
    const finalProfile = profile || { 
      name: 'Professional User', 
      email: 'user@gmail.com',
      picture: `https://i.pravatar.cc/150?u=${provider}`
    };
    
    const emailLower = finalProfile.email.toLowerCase();
    let user = await db.users.findOne({ email: emailLower });

    if (!user) {
      user = await db.users.insertOne({
        name: finalProfile.name,
        email: emailLower,
        role: emailLower === ADMIN_EMAIL ? 'admin' : 'user',
        plan: 'free',
        resumeCount: 0,
        createdAt: new Date().toISOString(),
        authProvider: provider,
        avatar: finalProfile.picture || null
      });
    } else {
      const updatedRole = emailLower === ADMIN_EMAIL ? 'admin' : 'user';
      await db.users.updateOne(
        { _id: user._id }, 
        { 
          authProvider: provider, 
          avatar: finalProfile.picture || user.avatar,
          role: updatedRole
        }
      );
      user = await db.users.findOne({ _id: user._id });
    }
    
    return { ...user, id: user._id };
  },

  async login(email: string, password?: string): Promise<User> {
    await sleep(600);
    const emailLower = email.toLowerCase();
    const user = await db.users.findOne({ email: emailLower });
    
    if (!user) throw new Error('Account not found. Please sign up first.');

    if (emailLower === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        throw new Error('Invalid credentials. Access denied.');
      }
      if (user.role !== 'admin') {
        await db.users.updateOne({ _id: user._id }, { role: 'admin' });
      }
    } else {
      if (user.role === 'admin') {
        await db.users.updateOne({ _id: user._id }, { role: 'user' });
      }
    }

    return { ...user, id: user._id, role: emailLower === ADMIN_EMAIL ? 'admin' : 'user' };
  },

  async signup(name: string, email: string): Promise<User> {
    await sleep(800);
    const emailLower = email.toLowerCase();
    const existing = await db.users.findOne({ email: emailLower });
    
    if (existing) throw new Error('This email is already registered. Please sign in.');

    const user = await db.users.insertOne({
      name,
      email: emailLower,
      role: emailLower === ADMIN_EMAIL ? 'admin' : 'user',
      plan: 'free',
      resumeCount: 0,
      createdAt: new Date().toISOString()
    });
    
    return { ...user, id: user._id };
  },

  async forgotPassword(email: string): Promise<void> {
    await sleep(1000);
    const emailLower = email.toLowerCase();
    const user = await db.users.findOne({ email: emailLower });
    
    if (!user) {
      throw new Error('Account not found with this email address.');
    }
    return;
  },

  async getResumes(userId: string): Promise<any[]> {
    const resumes = await db.resumes.find();
    return resumes.filter((r: any) => r.userId === userId).map(r => ({ ...r, id: r._id }));
  },

  async saveResume(userId: string, resume: any): Promise<void> {
    const resumeId = resume._id || resume.id;
    if (resumeId) {
      await db.resumes.updateOne({ _id: resumeId }, { ...resume, userId, lastEdited: new Date().toISOString() });
    } else {
      await db.resumes.insertOne({ 
        ...resume, 
        userId, 
        lastEdited: new Date().toISOString() 
      });
    }
  },

  async deleteResume(userId: string, resumeId: string): Promise<void> {
    await db.resumes.deleteOne({ _id: resumeId });
  },

  async processPayment(userId: string, planId: string, razorpayResponse?: any): Promise<User> {
    await sleep(500); 
    const amount = planId === 'pro' ? 195 : 1195;
    
    await db.transactions.insertOne({
      userId,
      amount,
      plan: planId,
      status: 'success',
      timestamp: new Date().toISOString(),
      txnId: razorpayResponse?.razorpay_payment_id || `TXN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      razorpay_order_id: razorpayResponse?.razorpay_order_id
    });

    const success = await db.users.updateOne({ _id: userId }, { plan: planId as any });
    if (!success) throw new Error('Transaction failed.');
    
    const user = await db.users.findOne({ _id: userId });
    return { ...user, id: user._id };
  }
};

export const AdminAPI = {
  async getAllUsers(): Promise<any[]> {
    const users = await db.users.find();
    return users.map(u => ({ ...u, id: u._id }));
  },

  async getAllResumes(): Promise<any[]> {
    const resumes = await db.resumes.find();
    const users = await db.users.find();
    return resumes.map(r => {
      const owner = users.find(u => u._id === r.userId);
      return { ...r, id: r._id, ownerEmail: owner?.email || 'Unknown' };
    });
  },

  async getTransactions(): Promise<any[]> {
    const txns = await db.transactions.find();
    const users = await db.users.find();
    return txns.map(t => {
      const owner = users.find(u => u._id === t.userId);
      return { ...t, id: t._id, ownerEmail: owner?.email || 'Unknown' };
    });
  },

  async getUserDetails(userId: string) {
    const users = await db.users.find();
    const resumes = await db.resumes.find();
    const txns = await db.transactions.find();
    
    const user = users.find(u => u._id === userId);
    if (!user) return null;

    return {
      user: { ...user, id: user._id },
      resumes: resumes.filter(r => r.userId === userId).map(r => ({ ...r, id: r._id })),
      transactions: txns.filter(t => t.userId === userId).map(t => ({ ...t, id: t._id }))
    };
  },

  async updateUser(userId: string, update: { role?: string, plan?: string }) {
    await sleep(300);
    return await db.users.updateOne({ _id: userId }, update);
  },

  async createUser(data: { name: string, email: string, role: string, plan: string }) {
    await sleep(500);
    const existing = await db.users.findOne({ email: data.email.toLowerCase() });
    if (existing) throw new Error('User already exists');

    return await db.users.insertOne({
      ...data,
      email: data.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      resumeCount: 0
    });
  },

  async getFinancialStats() {
    const users = await db.users.find();
    const resumes = await db.resumes.find();
    const txns = await db.transactions.find();
    
    const proCount = users.filter(u => u.plan === 'pro').length;
    const annualCount = users.filter(u => u.plan === 'annual').length;
    const totalRevenue = txns.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    return {
      totalUsers: users.length,
      totalResumes: resumes.length,
      totalTransactions: txns.length,
      proUsers: proCount,
      annualUsers: annualCount,
      totalRevenue: totalRevenue,
      conversionRate: users.length > 0 ? ((proCount + annualCount) / users.length * 100).toFixed(1) : 0,
      dbStats: {
        engine: db.engine,
        status: db.status,
        collections: ['users', 'resumes', 'transactions'],
        documentCount: users.length + resumes.length + txns.length
      }
    };
  },

  async deleteUser(userId: string) {
    await db.users.deleteOne({ _id: userId });
    const allResumes = await db.resumes.find();
    const userResumes = allResumes.filter(r => r.userId === userId);
    for (const r of userResumes) {
      await db.resumes.deleteOne({ _id: r._id });
    }
  }
};