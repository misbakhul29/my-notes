'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useLanguage();

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (values: typeof form.values) => {
        setIsLoading(true);
        try {
            const response = await fetch('https://notes-api.dicoding.dev/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (data.status === 'success') {
                localStorage.setItem('token', data.data.accessToken);
                notifications.show({
                    title: t('auth.success'),
                    message: t('auth.loginSuccess'),
                    color: 'green',
                });
                router.push('/dashboard');
            } else {
                notifications.show({
                    title: t('auth.error'),
                    message: data.message || t('auth.loginFailed'),
                    color: 'red',
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            notifications.show({
                title: t('auth.error'),
                message: t('auth.loginFailed'),
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
                        label={t('auth.email')}
                        placeholder={t('auth.emailPlaceholder')}
                        size="md"
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label={t('auth.password')}
                        placeholder={t('auth.passwordPlaceholder')}
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
