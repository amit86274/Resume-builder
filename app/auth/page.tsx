'use client';

import React from 'react';
import Auth from '../../pages/Auth';
import { useUser } from '../../context/UserContext';
import { useRouter, useSearchParams } from '../../services/router';

export default function AuthPage() {
  const { setUser } = useUser();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') as 'login' | 'signup') || 'login';

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    push(userData.role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <Auth 
      initialMode={mode} 
      onAuthSuccess={handleAuthSuccess} 
      onNavigate={(path) => push(path)} 
    />
  );
}
