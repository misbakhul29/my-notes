'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

type TranslationValue = string | { [key: string]: TranslationValue };

interface Translations {
  [key: string]: {
    [key: string]: TranslationValue;
  };
}

const translations: Translations = {
  en: {
    app: {
      title: 'My Notes',
    },
    auth: {
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: 'Your password',
      namePlaceholder: 'Your name',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      success: 'Success',
      error: 'Error',
      loginSuccess: 'Login successful!',
      registerSuccess: 'Registration successful! Please login.',
      loginFailed: 'Login failed',
      registerFailed: 'Registration failed',
      invalidEmail: 'Invalid email',
      passwordLength: 'Password must be at least 6 characters',
      nameLength: 'Name must be at least 2 characters',
    },
    notes: {
      add: 'Add Note',
      edit: 'Edit',
      delete: 'Delete',
      update: 'Update',
      create: 'Create',
      cancel: 'Cancel',
      close: 'Close',
      title: 'Title',
      content: 'Content',
      created: 'Created',
      fetchError: 'Failed to fetch notes',
      deleteSuccess: 'Note deleted successfully',
      deleteError: 'Failed to delete note',
      createSuccess: 'Note created successfully',
      updateSuccess: 'Note updated successfully',
      createError: 'Failed to create note',
      updateError: 'Failed to update note',
    },
    common: {
      close: 'Close',
      loading: 'Loading...',
    },
  },
  id: {
    app: {
      title: 'Catatan Saya',
    },
    auth: {
      login: 'Masuk',
      register: 'Daftar',
      logout: 'Keluar',
      email: 'Email',
      password: 'Kata Sandi',
      name: 'Nama',
      emailPlaceholder: 'anda@contoh.com',
      passwordPlaceholder: 'Kata sandi Anda',
      namePlaceholder: 'Nama Anda',
      noAccount: 'Belum punya akun?',
      haveAccount: 'Sudah punya akun?',
      success: 'Berhasil',
      error: 'Kesalahan',
      loginSuccess: 'Login berhasil!',
      registerSuccess: 'Pendaftaran berhasil! Silakan login.',
      loginFailed: 'Login gagal',
      registerFailed: 'Pendaftaran gagal',
      invalidEmail: 'Email tidak valid',
      passwordLength: 'Kata sandi minimal 6 karakter',
      nameLength: 'Nama minimal 2 karakter',
    },
    notes: {
      add: 'Tambah Catatan',
      edit: 'Ubah',
      delete: 'Hapus',
      update: 'Perbarui',
      create: 'Buat',
      cancel: 'Batal',
      close: 'Tutup',
      title: 'Judul',
      content: 'Isi',
      created: 'Dibuat',
      fetchError: 'Gagal mengambil catatan',
      deleteSuccess: 'Catatan berhasil dihapus',
      deleteError: 'Gagal menghapus catatan',
      createSuccess: 'Catatan berhasil dibuat',
      updateSuccess: 'Catatan berhasil diperbarui',
      createError: 'Gagal membuat catatan',
      updateError: 'Gagal memperbarui catatan',
    },
    common: {
      close: 'Tutup',
      loading: 'Memuat...',
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'id' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: TranslationValue = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
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