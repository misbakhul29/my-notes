'use client';

import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <ThemeProvider>
        <LanguageProvider>
          <MantineProvider>
            <Notifications />
            {children}
          </MantineProvider>
        </LanguageProvider>
      </ThemeProvider>
  );
} 