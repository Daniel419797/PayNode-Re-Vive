'use client';

import React from 'react';
import { AppProvider } from '@/app/contexts/AppContext';
import { MeshProvider } from '@meshsdk/react';
import '@meshsdk/react/styles.css';


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MeshProvider>
      <AppProvider>     
        {children}
      </AppProvider>
    </MeshProvider>  
  );
}
