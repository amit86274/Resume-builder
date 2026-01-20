
import React, { useEffect } from 'react';
import { useRouter } from '../services/router';

const Onboarding: React.FC = () => {
  const { push } = useRouter();

  useEffect(() => {
    // If somehow landed here, redirect to resume options
    push('/resume-option');
  }, [push]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
    </div>
  );
};

export default Onboarding;
