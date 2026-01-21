
import jwt from 'jsonwebtoken';

const JWT_SECRET = "resumaster_neural_key_2024_secure";

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export const signToken = (payload: AuthUser) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const getAuthenticatedUser = (req: Request): AuthUser | null => {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    
    if (!token) return null;
    
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (e) {
    return null;
  }
};
