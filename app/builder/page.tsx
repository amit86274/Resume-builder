
'use client';

import React, { useEffect, useState } from 'react';
import Builder from '../../pages/Builder';
import { useUser } from '../../context/UserContext';
import { useSearchParams, builderSession } from '../../lib/router';

export default function BuilderPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || undefined;
  
  const [prefilled, setPrefilled] = useState<any>(builderSession.prefilledData);

  useEffect(() => {
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
