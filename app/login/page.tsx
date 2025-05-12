'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value: string | unknown[]) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
        },
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (values: typeof form.values) => {
        setIsLoading(true);
        try {
            const res = await fetch('https://notes-api.dicoding.dev/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            const data = await res.json();
            
            if (data.status === 'success') {
                localStorage.setItem('token', data.data.accessToken);
                notifications.show({
                    title: 'Success',
                    message: 'Login successful!',
                    color: 'green',
                });
                router.push('/dashboard');
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Login failed',
                color: 'red',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" fw={900}>
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Do not have an account yet?{' '}
                <Anchor size="sm" component="a" href="/register">
                    Create account
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Email"
                        placeholder="you@example.com"
                        required
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required
                        mt="md"
                        {...form.getInputProps('password')}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        mt="xl"
                        loading={isLoading}
                    >
                        Sign in
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
