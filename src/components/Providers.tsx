"use client";

import { Affix, Button, MantineProvider, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { StatusCodes } from "http-status-codes";
import { includes } from "lodash";
import { ChevronUp } from "lucide-react";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import Next13ProgressBar from "next13-progressbar";
import type React from "react";
import { SWRConfig } from "swr";

import { env } from "@/env.mjs";
import fetcher from "@/libs/fetcher";
import theme from "@/libs/theme";

import AuthProvider from "./AuthProvider";

const NO_RETRY_STATUS_CODES: StatusCodes[] = [
  StatusCodes.BAD_REQUEST,
  StatusCodes.UNAUTHORIZED,
  StatusCodes.FORBIDDEN,
  StatusCodes.NOT_FOUND,
  StatusCodes.METHOD_NOT_ALLOWED,
  StatusCodes.NOT_ACCEPTABLE,
  StatusCodes.GONE,
  StatusCodes.LENGTH_REQUIRED,
  StatusCodes.PRECONDITION_FAILED,
  StatusCodes.REQUEST_TOO_LONG,
  StatusCodes.REQUEST_URI_TOO_LONG,
  StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE,
  StatusCodes.EXPECTATION_FAILED,
  StatusCodes.MISDIRECTED_REQUEST,
  StatusCodes.UNPROCESSABLE_ENTITY,
  StatusCodes.LOCKED,
  StatusCodes.TOO_MANY_REQUESTS,
  StatusCodes.INTERNAL_SERVER_ERROR,
  StatusCodes.NOT_IMPLEMENTED,
  StatusCodes.HTTP_VERSION_NOT_SUPPORTED,
];

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" />
      <SWRConfig
        value={{
          fetcher,
          onErrorRetry(error, _, __, revalidate, { retryCount }) {
            if (includes(NO_RETRY_STATUS_CODES, error.response?.status)) {
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
          showOnShallow={true}
        />
        <NavigationProgress />
        <AuthProvider>
          <Affix position={{ bottom: 90, right: 28 }}>
            <Transition transition="slide-up" mounted={scroll.y > 0}>
              {(transitionStyles) => (
                <Button radius="xl" style={transitionStyles} onClick={() => scrollTo({ y: 0 })}>
                  <ChevronUp size={16} />
                </Button>
              )}
            </Transition>
          </Affix>
          <ReCaptchaProvider reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} language="uk">
            {children}
          </ReCaptchaProvider>
        </AuthProvider>
      </SWRConfig>
    </MantineProvider>
  );
}
