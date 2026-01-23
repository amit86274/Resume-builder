'use client';

import React from 'react';
import Blog from '../../pages/Blog';
import { useRouter } from '../../services/router';

export default function BlogPage() {
  const { push } = useRouter();
  return <Blog onNavigate={(path) => push(path)} />;
}
