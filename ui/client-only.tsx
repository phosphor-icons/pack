'use client';

import { useState, useEffect, ReactNode } from 'react';

const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return <>{children}</>;
};

export default ClientOnly;
