'use client';

import React from 'react';
import TemplatesGallery from '../../components/TemplatesGallery';
import { useRouter } from '../../services/router';

export default function TemplatesPage() {
  const { push } = useRouter();
  
  const handleSelect = (id: string) => {
    // Navigate to options (Upload vs Scratch) first
    push(`/resume-option?template=${id}`);
  };

  return <TemplatesGallery onSelect={handleSelect} onNavigate={(path) => push(path)} />;
}