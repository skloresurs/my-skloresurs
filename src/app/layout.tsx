import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import '@mantine/nprogress/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import './globals.css';

import { ColorSchemeScript } from '@mantine/core';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import React from 'react';

import Providers from '@/components/Providers';

const APP_TITLE = 'My Skloresurs';

export const metadata: Metadata = {
  applicationName: APP_TITLE,
  title: APP_TITLE,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_TITLE,
  },
};

export const viewport: Viewport = {
  themeColor: '#1b73bf',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='uk'>
      <head>
        <ColorSchemeScript defaultColorScheme='dark' />
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>
      <body className={GeistSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
