'use client';

import { ThemeProvider } from './context/ThemeContext'; // Pastikan path ini benar
import { LanguageProvider } from './context/LanguageContext'; // Pastikan path ini benar
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { ReactNode } from "react";
import { SessionProvider } from 'next-auth/react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          <MantineProvider>
            <Notifications />
            {children}
          </MantineProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}