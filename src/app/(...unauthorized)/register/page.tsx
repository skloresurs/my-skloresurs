'use client';

import { Button, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useReCaptcha } from 'next-recaptcha-v3';
import React from 'react';
import useSWR from 'swr';
import { z } from 'zod';

import classes from '@/css/Auth.module.css';
import IUser from '@/interfaces/User';

const formSchema = z
  .object({
    confirm: z
      .string({ required_error: "Підтвердження пароля є обов'язковим" })
      .min(8, 'Підтвердження пароля не може бути меншим за 8 символів'),
    email: z.string({ required_error: "Email є обов'язковим" }).email({
      message: 'Невірний формат email',
    }),
    fullname: z
      .string({ required_error: "Повне ім'я є обов'язковим" })
      .min(3, "Повне ім'я не може бути меншим за 3 символів"),
    password: z
      .string({ required_error: "Пароль є обов'язковим" })
      .min(8, 'Пароль не може бути меншим за 8 символів'),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Паролі не співпадають',
    path: ['confirm'],
  });

const NotificationTitle = 'Реєстрація';
type ValidationSchema = z.infer<typeof formSchema>;

export default function AuthenticationImage() {
  const router = useRouter();
  const { executeRecaptcha } = useReCaptcha();
  const { data: user, mutate } = useSWR<IUser>('/api/user');
  const form = useForm({
    initialValues: {
      confirm: '',
      email: '',
      fullname: '',
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
      message: 'Створення облікового запису...',
      title: NotificationTitle,
      withCloseButton: false,
    });

    const token = await executeRecaptcha('register');

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
      .post('/api/auth/register', {
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
      message: 'Обліковий запис створено',
      title: NotificationTitle,
      withCloseButton: true,
    });
    router.push('/');
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Реєстрація
        </Title>
        <form
          className="space-y-3"
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
          <TextInput
            label="Повне ім'я"
            size="md"
            withAsterisk
            {...form.getInputProps('fullname')}
          />
          <PasswordInput
            label="Пароль"
            size="md"
            withAsterisk
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Підтвердіть пароль"
            size="md"
            withAsterisk
            {...form.getInputProps('confirm')}
          />
          <Button type="submit" fullWidth mt="xl" size="md" variant="filled">
            Зареєструватись
          </Button>
        </form>
        <div className="mt-5">
          <span>This site is protected by reCAPTCHA and the Google </span>
          <Link href="https://policies.google.com/privacy">Privacy Policy</Link>
          <span> and </span>
          <Link href="https://policies.google.com/terms">Terms of Service</Link>
          <span> apply.</span>
        </div>
        <div className="mt-5">
          <span>Вже є аккаунт? </span>
          <Link href="/login">Увійти</Link>
        </div>
      </Paper>
    </div>
  );
}
