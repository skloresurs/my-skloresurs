"use client";

import { redirect } from "next/navigation";
import useSWR from "swr";

import verifyPermission from "@/libs/verify-permission";
import type { IUserMeRequest } from "@/types/User";

export default function Start() {
  const { data: user } = useSWR<IUserMeRequest>("/api/user");

  if (!user) {
    return <div />;
  }

  if (verifyPermission(user.permissions ?? [], "Admin")) {
    redirect("/admin");
  }

  if (verifyPermission(user.permissions ?? [], "Manager")) {
    redirect("/manager");
  }

  if (verifyPermission(user.permissions ?? [], "Driver")) {
    redirect("/routes");
  }

  redirect("/");
}
