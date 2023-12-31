import '@mantine/core/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import '@mantine/nprogress/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import './globals.css';

import { ColorSchemeScript } from '@mantine/core';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import React from 'react';

import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'My Skloresurs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='uk'>
      <head>
        <ColorSchemeScript defaultColorScheme='dark' />
      </head>
      <body className={GeistSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
