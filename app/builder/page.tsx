'use client';

import React, { useEffect, useState } from 'react';
import Builder from '../../pages/Builder';
import { useUser } from '../../context/UserContext';
import { useSearchParams, builderSession } from '../../services/router';

export default function BuilderPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || undefined;
  
  // Pick up prefilled data if we just came from DirectPort
  const [prefilled, setPrefilled] = useState<any>(builderSession.prefilledData);

  useEffect(() => {
    // Clear the session after picking up the data
    if (builderSession.prefilledData) {
      builderSession.prefilledData = null;
    }
  }, []);

  return (
    <Builder 
      user={user || undefined} 
      initialTemplateId={templateId} 
      prefilledData={prefilled || undefined} 
    />
  );
}