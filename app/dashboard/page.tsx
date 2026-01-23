'use client';

import React, { useEffect } from 'react';
import Dashboard from '../../pages/Dashboard';
import { useUser } from '../../context/UserContext';
import { useRouter } from '../../services/router';

export default function DashboardPage() {
  const { user, setUser, isLoading } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      push('/auth?mode=login');
    }
  }, [user, isLoading, push]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Dashboard 
      user={user} 
      onNavigate={(path) => push(path)} 
      onUpdateUser={setUser} 
    />
  );
}
