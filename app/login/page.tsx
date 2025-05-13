'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLanguage } from '../context/LanguageContext';
import { notifications } from '@mantine/notifications';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useLanguage();
    const { data: session } = useSession();

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value: string) => (/^\S+@\S+$/.test(value) ? null : t('auth.invalidEmail')),
            password: (value: string | unknown[]) => (value.length < 6 ? t('auth.passwordLength') : null),
        },
    });

    const handleSubmit = async (values: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            const loginResponse = await fetch('https://notes-api.dicoding.dev/v1/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            const loginData = await loginResponse.json();

            if (loginData.status === 'success') {
                const response = await signIn('credentials', {
                    email: values.email,
                    password: values.password,
                    redirect: false,
                });

                if (response?.ok) {
                    notifications.show({
                        title: t('auth.success'),
                        message: loginData.message,
                        color: 'green',
                    });
                    router.push('/dashboard');
                }
            } else {
                notifications.show({
                    title: t('auth.error'),
                    message: loginData.message,
                    color: 'red',
                });
            }
        } catch (error) {
            notifications.show({
                title: t('auth.error'),
                message: t('auth.unexpectedError'),
                color: 'red',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container size="xs" py="xl">
            <Paper radius="md" p="xl" withBorder>
                <Title order={2} ta="center" mt="md" mb={50}>
                    {t('auth.login')} {t('app.title')}
                </Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        name="Email"
                        label="Email"
                        placeholder="Email"
                        size="md"
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        name="Password"
                        label="Password"
                        placeholder="Password"
                        mt="md"
                        size="md"
                        {...form.getInputProps('password')}
                    />
                    <Button fullWidth mt="xl" size="md" type="submit" loading={isLoading}>
                        {t('auth.login')}
                    </Button>
                </form>

                <Text ta="center" mt="md">
                    {t('auth.noAccount')}{' '}
                    <Anchor component="button" type="button" fw={700} onClick={() => router.push('/register')}>
                        {t('auth.register')}
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
}
