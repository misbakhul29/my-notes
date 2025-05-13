/* eslint-disable */
// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      // Tambahkan properti kustom Anda di sini
    } & DefaultSession['user'];
    accessToken?: string; // Tambahkan accessToken ke objek Session
  }

  interface User {
    id: string;
    name: string;
    email: string;
    accessToken?: string; // Tambahkan accessToken ke objek User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    accessToken?: string; // Tambahkan accessToken ke objek JWT
  }
}