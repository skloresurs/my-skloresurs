'use client';

import { Button, Paper, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { deleteCookie, getCookie } from 'cookies-next';
import { XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';

import classes from '@/css/Auth.module.css';
import { IUserMeRequest } from '@/types/User';

export default function AuthenticationImage() {
  const { data: user } = useSWR<IUserMeRequest>(`/api/user`);

  if (user) {
    redirect('/');
  }

  const errorCookie = getCookie('oauth_error');
  if (errorCookie) {
    notifications.show({
      autoClose: 3000,
      color: 'red',
      icon: <XCircle />,
      message: errorCookie,
      title: 'Авторизація',
      withCloseButton: true,
    });
    deleteCookie('auth_error');
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta='center' mt='md' mb={50}>
          My Skloresurs
        </Title>
        <Stack>
          <Button
            component={Link}
            href='/api/auth/google'
            leftSection={<Image src='https://cdn.simpleicons.org/google/white' alt='Google' width={20} height={20} />}
            variant='outline'
            fullWidth
            size='md'
          >
            Вхід за допомогою Google
          </Button>
          <Button
            component={Link}
            href='/api/auth/facebook'
            leftSection={
              <Image src='https://cdn.simpleicons.org/facebook/white' alt='Facebook' width={20} height={20} />
            }
            variant='outline'
            fullWidth
            size='md'
          >
            Вхід за допомогою Facebook
          </Button>
        </Stack>
        <Text mt='md'>
          <Text span>This site is protected by reCAPTCHA and the Google </Text>
          <Link href='https://policies.google.com/privacy'>Privacy Policy</Link>
          <Text span> and </Text>
          <Link href='https://policies.google.com/terms'>Terms of Service</Link>
          <Text span> apply.</Text>
        </Text>
      </Paper>
    </div>
  );
}
