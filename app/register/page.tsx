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
import { useForm } from '@mantine/form';
import { useLanguage } from '../context/LanguageContext';
import { signup } from '../actions/auth';

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

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await signup(undefined, formData);
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
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

        <form action={handleSubmit}>
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
