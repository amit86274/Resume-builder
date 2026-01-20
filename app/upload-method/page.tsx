'use client';

import React from 'react';
import UploadMethod from '../../pages/UploadMethod';
import { useRouter, useSearchParams, builderSession } from '../../services/router';

export default function UploadMethodPage() {
  const { push, back } = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || 'yuki-blue';

  const handleFileSelect = (file: File) => {
    // Persist file in session as it can't be put in URL
    builderSession.pendingFile = file;
    push(`/direct-port?template=${templateId}`);
  };

  return (
    <UploadMethod 
      onFileSelect={handleFileSelect} 
      onBack={() => back()} 
    />
  );
}