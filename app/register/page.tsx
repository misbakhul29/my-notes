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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { useLanguage } from '../context/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://notes-api.dicoding.dev/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.status === 'success') {
        notifications.show({
          title: t('auth.success'),
          message: t('auth.registerSuccess'),
          color: 'green',
        });
        router.push('/login');
      } else {
        notifications.show({
          title: t('auth.error'),
          message: data.message || t('auth.registerFailed'),
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      notifications.show({
        title: t('auth.error'),
        message: t('auth.registerFailed'),
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

        <form onSubmit={form.onSubmit(handleSubmit)}>
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
