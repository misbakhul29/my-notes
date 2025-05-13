// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Text,
  Anchor,
  Stack // Added Stack for better layout
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLanguage } from '../context/LanguageContext';
import { notifications } from '@mantine/notifications'; // Import notifications

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate: {
      name: (value: string) => (value.length < 2 ? t('auth.nameLength') : null),
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : t('auth.invalidEmail')),
      password: (value: string | unknown[]) => (value.length < 6 ? t('auth.passwordLength') : null),
    },
  });

  // Change handleSubmit to accept form values directly and make the API call
  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const REGISTER_API_URL = "https://notes-api.dicoding.dev/v1/register";

      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const responseData = await response.json();

      // Check API response status and body status
      if (response.ok && responseData.status === 'success') {
        notifications.show({
          title: t('auth.success'),
          message: t('auth.registerSuccess'), // Use a success message
          color: 'green',
        });
        // Redirect to login page on successful registration
        router.push('/login');
      } else {
        // Handle API errors (e.g., email already exists, validation errors)
        const errorMessage = responseData.message || t('auth.registerError');
        notifications.show({
          title: t('auth.error'),
          message: errorMessage,
          color: 'red',
        });
        console.error('Registration failed:', responseData); // Log full API response for debugging
      }
    } catch (error: any) {
      // Handle network errors or other unexpected issues
      console.error('Registration failed:', error);
      notifications.show({
        title: t('auth.error'),
        message: t('auth.registerError'), // Generic error message for unexpected errors
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
          {t('auth.register')}
        </Title>

        {/* Change form prop from 'action' to 'onSubmit' and use form.onSubmit */}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack> {/* Wrap form controls in Stack */}
            <TextInput
              label={t('auth.name')}
              placeholder={t('auth.namePlaceholder')}
              size="md"
              {...form.getInputProps('name')}
            />
            <TextInput
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              mt="md"
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
              {t('auth.register')}
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="md">
          {t('auth.haveAccount')}{' '}
          <Anchor component="button" type="button" fw={700} onClick={() => router.push('/login')}>
            {t('auth.login')}
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}