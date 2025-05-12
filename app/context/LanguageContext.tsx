'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'app.title': 'My Notes',
    'app.description': 'A simple note-taking app',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.loginSuccess': 'Login successful!',
    'auth.registerSuccess': 'Registration successful! Please login.',
    'auth.loginError': 'Login failed',
    'auth.registerError': 'Registration failed',
    'notes.add': 'Add Note',
    'notes.edit': 'Edit Note',
    'notes.delete': 'Delete Note',
    'notes.title': 'Title',
    'notes.content': 'Content',
    'notes.create': 'Create',
    'notes.update': 'Update',
    'notes.cancel': 'Cancel',
    'notes.close': 'Close',
    'notes.created': 'Created',
    'notes.deleteSuccess': 'Note deleted successfully',
    'notes.deleteError': 'Failed to delete note',
    'notes.createSuccess': 'Note created successfully',
    'notes.updateSuccess': 'Note updated successfully',
    'notes.createError': 'Failed to create note',
    'notes.updateError': 'Failed to update note',
  },
  id: {
    'app.title': 'Catatan Saya',
    'app.description': 'Aplikasi catatan sederhana',
    'auth.login': 'Masuk',
    'auth.register': 'Daftar',
    'auth.logout': 'Keluar',
    'auth.email': 'Email',
    'auth.password': 'Kata Sandi',
    'auth.name': 'Nama',
    'auth.loginSuccess': 'Berhasil masuk!',
    'auth.registerSuccess': 'Pendaftaran berhasil! Silakan masuk.',
    'auth.loginError': 'Gagal masuk',
    'auth.registerError': 'Gagal mendaftar',
    'notes.add': 'Tambah Catatan',
    'notes.edit': 'Edit Catatan',
    'notes.delete': 'Hapus Catatan',
    'notes.title': 'Judul',
    'notes.content': 'Isi',
    'notes.create': 'Buat',
    'notes.update': 'Perbarui',
    'notes.cancel': 'Batal',
    'notes.close': 'Tutup',
    'notes.created': 'Dibuat',
    'notes.deleteSuccess': 'Catatan berhasil dihapus',
    'notes.deleteError': 'Gagal menghapus catatan',
    'notes.createSuccess': 'Catatan berhasil dibuat',
    'notes.updateSuccess': 'Catatan berhasil diperbarui',
    'notes.createError': 'Gagal membuat catatan',
    'notes.updateError': 'Gagal memperbarui catatan',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    setMounted(true);
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'id' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 