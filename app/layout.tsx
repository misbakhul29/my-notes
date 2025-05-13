import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Container, Group } from '@mantine/core';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ActionToggle } from './components/ActionToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { Providers } from './providers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Notes",
  description: "A simple note-taking app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Container fluid py="md">
            <Group justify="flex-end" mb="md" gap={0}>
              <LanguageToggle />
              <ActionToggle />
            </Group>
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}
