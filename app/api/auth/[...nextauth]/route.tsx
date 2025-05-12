import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export default NextAuth({
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id as string    ;
            session.user.name = token.name as string;
            session.user.email = token.email as string;
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    return null;
                }

                const { email, password } = parsedCredentials.data;

                try {
                    const response = await fetch('https://notes-api.dicoding.dev/v1/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (data.status === 'success') {
                        return {
                            id: data.data.user.id,
                            name: data.data.user.name,
                            email: data.data.user.email,
                            accessToken: data.data.accessToken,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error('Error during authorization:', error);
                    return null;
                }
            },
        }),
    ],
});