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

  async getResumes(userId: string): Promise<any[]> {
    const resumes = await db.resumes.find();
    // Filter locally if necessary, but the Collection simulator handles basic retrieval
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

  async processPayment(userId: string, planId: string): Promise<User> {
    await sleep(1500); 
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

  async getFinancialStats() {
    const users = await db.users.find();
    const resumes = await db.resumes.find();
    
    const proCount = users.filter(u => u.plan === 'pro').length;
    const annualCount = users.filter(u => u.plan === 'annual').length;
    
    const totalRevenue = (proCount * 195) + (annualCount * 1195);
    
    return {
      totalUsers: users.length,
      proUsers: proCount,
      annualUsers: annualCount,
      totalRevenue: totalRevenue,
      conversionRate: users.length > 0 ? ((proCount + annualCount) / users.length * 100).toFixed(1) : 0,
      dbStats: {
        engine: db.engine,
        status: db.status,
        collections: ['users', 'resumes'],
        documentCount: users.length + resumes.length
      }
    };
  }
};