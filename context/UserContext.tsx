
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('resuMaster_user');
      const token = localStorage.getItem('resumaster_token');
      
      // We only restore user if both data and token are present
      if (savedUser && token) {
        setUserState(JSON.parse(savedUser));
      } else {
        localStorage.removeItem('resuMaster_user');
        localStorage.removeItem('resumaster_token');
      }
    } catch (e) {
      console.warn('[UserContext] Failed to load user session.');
    }
    setIsLoading(false);
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    try {
      if (newUser) {
        localStorage.setItem('resuMaster_user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('resuMaster_user');
        localStorage.removeItem('resumaster_token');
      }
    } catch (e) {
      console.warn('[UserContext] Failed to sync user session.');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
