'use client';

import { ReactNode } from 'react';
import { Theme } from '@radix-ui/themes';
import AuthProvider from './auth/Provider';
import QueryClientProvider from './QueryClientProvider';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider>
        <Theme accentColor="ruby">
          {children}
        </Theme>
      </QueryClientProvider>
    </AuthProvider>
  );
}
