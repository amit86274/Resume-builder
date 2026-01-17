'use client';

import React from 'react';
import Builder from '../../pages/Builder';
import { useUser } from '../../context/UserContext';
import { useSearchParams } from '../../services/router';

export default function BuilderPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || undefined;

  return <Builder user={user || undefined} initialTemplateId={templateId} />;
}
