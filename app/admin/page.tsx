'use client';

import React, { useEffect } from 'react';
import AdminDashboard from '../../pages/AdminDashboard';
import { useUser } from '../../context/UserContext';
import { useRouter } from '../../services/router';

export default function AdminPage() {
  const { user, isLoading } = useUser();
  const { push } = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        push('/auth?mode=login');
      } else if (user.role !== 'admin') {
        push('/dashboard');
      }
    }
  }, [user, isLoading, push]);

  if (isLoading || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return <AdminDashboard />;
}
