
'use client';

import React, { useEffect } from 'react';
import { useRouter } from '../../services/router';

export default function AnalyzerPage() {
  const { push } = useRouter();
  
  useEffect(() => {
    // Redirect anyone trying to reach /analyzer back to the start
    push('/resume-option');
  }, [push]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
    </div>
  );
}
