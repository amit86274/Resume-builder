'use client';

import React, { useEffect } from 'react';
import DirectPort from '../../pages/DirectPort';
import { useRouter, useSearchParams, builderSession } from '../../services/router';

export default function DirectPortPage() {
  const { push, replace } = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || 'yuki-blue';

  useEffect(() => {
    // If we land here without a file (e.g. browser refresh), go back to upload
    if (!builderSession.pendingFile) {
      replace(`/upload-method?template=${templateId}`);
    }
  }, [templateId, replace]);

  const handleImportComplete = (data: any) => {
    // Store data for the builder and move to the builder
    builderSession.prefilledData = data;
    builderSession.pendingFile = null; // Clean up
    push(`/builder?template=${templateId}`);
  };

  const handleCancel = () => {
    builderSession.pendingFile = null;
    push(`/upload-method?template=${templateId}`);
  };

  if (!builderSession.pendingFile) return null;

  return (
    <DirectPort 
      initialFile={builderSession.pendingFile} 
      onImportComplete={handleImportComplete} 
      onCancel={handleCancel} 
    />
  );
}