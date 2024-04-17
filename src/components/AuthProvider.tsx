"use client";

import type React from "react";
import useSWR from "swr";

import LoadingOverlay from "@/components/LoadingOverlay";
import type { IUserMeRequest } from "@/types/User";

export default function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isLoading, isValidating } = useSWR<IUserMeRequest>("/api/user");

  if (isLoading || isValidating) return <LoadingOverlay />;

  return children;
}
