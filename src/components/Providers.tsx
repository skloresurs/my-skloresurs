'use client';

import { Affix, Button, MantineProvider, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import { ChevronUp } from 'lucide-react';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { Next13ProgressBar } from 'next13-progressbar';
import React from 'react';
import { SWRConfig } from 'swr';

import { env } from '@/env.mjs';
import fetcher from '@/libs/fetcher';
import theme from '@/libs/theme';

import AuthProvider from './AuthProvider';

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <SWRConfig
        value={{
          fetcher,
          onErrorRetry(error, key, config, revalidate, { retryCount }) {
            if (
              (error.response.status >= 400 && error.response.status <= 404) ||
              error.response.status === 429
            ) {
              return;
            }

            if (retryCount >= 3) {
              return;
            }

            setTimeout(() => revalidate({ retryCount }), 3000);
          },
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }}
      >
        <Next13ProgressBar
          height="4px"
          color="var(--mantine-color-blue-5)"
          options={{ showSpinner: true }}
          showOnShallow
        />
        <NavigationProgress />
        <Notifications position="top-right" />
        <AuthProvider>
          <Affix position={{ bottom: 20, right: 20 }}>
            <Transition transition="slide-up" mounted={scroll.y > 0}>
              {(transitionStyles) => (
                <Button
                  leftSection={<ChevronUp size={16} />}
                  style={transitionStyles}
                  onClick={() => scrollTo({ y: 0 })}
                >
                  Вверх
                </Button>
              )}
            </Transition>
          </Affix>
          <ReCaptchaProvider
            reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            language="uk"
          >
            {children}
          </ReCaptchaProvider>
        </AuthProvider>
      </SWRConfig>
    </MantineProvider>
  );
}
