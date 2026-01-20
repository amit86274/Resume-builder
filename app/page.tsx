'use client';

import React from 'react';
import Landing from '../pages/Landing';
import { useRouter } from '../services/router';

export default function HomePage() {
  const { push } = useRouter();

  const handleStart = () => {
    push('/templates');
  };

  const handleNavigate = (path: string) => {
    push(path);
  };

  return <Landing onStart={handleStart} onNavigate={handleNavigate} />;
}