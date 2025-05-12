'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLanguage } from '../context/LanguageContext';
import { login } from '../actions/auth';
import { notifications } from '@mantine/notifications';

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

    const handleSubmit = async (values: { email: string; password: string }) => {
        setIsLoading(true);
        try {
          const formData = new FormData();
          formData.append('email', values.email);
          formData.append('password', values.password);
          const response = await login(undefined, formData);
          notifications.show({
            title: 'Login successful',
            message: 'You have successfully logged in',
            color: 'green',
          });
          localStorage.setItem('token', response.token || '');
          router.push('/dashboard');
        } catch (error) {
          console.error('Login failed:', error);
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
