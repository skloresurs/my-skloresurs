'use client';

import {
  Button,
  Divider,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { zodResolver } from 'mantine-form-zod-resolver';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useReCaptcha } from 'next-recaptcha-v3';
import React from 'react';
import useSWR from 'swr';
import { z } from 'zod';

import classes from '@/css/Auth.module.css';
import IUser from '@/types/User';

const formSchema = z.object({
  email: z.string({ required_error: "E-mail є обов'язковим" }).email({
    message: 'Некоректний E-mail',
  }),
  password: z
    .string({ required_error: "Пароль є обов'язковим" })
    .min(8, 'Пароль не може бути меншим за 8 символів'),
});

const NotificationTitle = 'Вхід';
type ValidationSchema = z.infer<typeof formSchema>;

export default function AuthenticationImage() {
  const router = useRouter();
  const { executeRecaptcha } = useReCaptcha();
  const { data: user, mutate } = useSWR<IUser>('/api/user');
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(formSchema),
  });

  if (user) {
    redirect('/');
  }

  const onSubmit = async (values: ValidationSchema) => {
    const notification = notifications.show({
      autoClose: false,
      loading: true,
      message: 'Авторизація...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const token = await executeRecaptcha('login');

    if (!token) {
      notifications.update({
        autoClose: 3000,
        color: 'red',
        icon: <XCircle />,
        id: notification,
        loading: false,
        message: 'Помилка reCaptcha',
        title: NotificationTitle,
        withCloseButton: true,
      });
      return;
    }

    const response = await axios
      .post('/api/auth/login', {
        ...values,
        captcha: token,
      })
      .catch((error) => {
        notifications.update({
          autoClose: 3000,
          color: 'red',
          icon: <XCircle />,
          id: notification,
          loading: false,
          message:
            error.response?.data.error ?? error.message ?? 'Невідома помилка',
          title: NotificationTitle,
          withCloseButton: true,
        });
      });

    if (!response || response.status !== 200) return;
    await mutate();

    notifications.update({
      autoClose: 3000,
      color: 'green',
      icon: <CheckCircle />,
      id: notification,
      loading: false,
      message: 'Авторизація успішна',
      title: NotificationTitle,
      withCloseButton: true,
    });
    router.push('/');
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          З поверненням!
        </Title>
        <form
          onSubmit={form.onSubmit((values: ValidationSchema) =>
            onSubmit(values)
          )}
        >
          <TextInput
            label="E-mail"
            size="md"
            withAsterisk
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Пароль"
            mt="md"
            size="md"
            withAsterisk
            {...form.getInputProps('password')}
          />
          <Button type="submit" fullWidth mt="xl" size="md" variant="filled">
            Увійти
          </Button>
          <Divider className="my-3" />
          <Button
            component={Link}
            href="/api/auth/google"
            variant="outline"
            fullWidth
            size="md"
          >
            Sign in with Google
          </Button>
          <div className="mt-5">
            <span>This site is protected by reCAPTCHA and the Google </span>
            <Link href="https://policies.google.com/privacy">
              Privacy Policy
            </Link>
            <span> and </span>
            <Link href="https://policies.google.com/terms">
              Terms of Service
            </Link>
            <span> apply.</span>
          </div>
          <div className="mt-5">
            <span>Немає облікового запису? </span>
            <Link href="/register">Зареєструватися</Link>
          </div>
        </form>
      </Paper>
    </div>
  );
}
