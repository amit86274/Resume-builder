'use client';

import React from 'react';
import ResumeOption from '../../pages/ResumeOption';
import { useRouter, useSearchParams } from '../../services/router';

export default function ResumeOptionPage() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || 'yuki-blue';

  const handleSelect = (method: 'upload' | 'scratch') => {
    if (method === 'upload') {
      push(`/upload-method?template=${templateId}`);
    } else {
      push(`/builder?template=${templateId}`);
    }
  };

  return <ResumeOption onSelect={handleSelect} templateId={templateId} />;
}