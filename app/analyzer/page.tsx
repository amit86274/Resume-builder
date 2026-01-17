'use client';

import React from 'react';
import Onboarding from '../../pages/Onboarding';
import { useRouter } from '../../services/router';

export default function AnalyzerPage() {
  const { push } = useRouter();
  
  const handleUploadSuccess = () => {
    push('/builder');
  };

  return <Onboarding onSelectUpload={handleUploadSuccess} />;
}
