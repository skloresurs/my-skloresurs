"use client";

import verifyPermission from "@/libs/verify-permission";
import type { IUserMeRequest } from "@/types/User";
import { Badge } from "@mantine/core";
import { FolderOpenDot } from "lucide-react";
import useSWR from "swr";
import NavBarItem from "./NavBarItem";

interface IProps {
  user?: IUserMeRequest;
}

export default function NavBarItemProjects({ user }: IProps) {
  const { data, error } = useSWR<{ total: number }>("/api/projects/expired");
  return (
    <NavBarItem
      label="Проекти"
      href="/projects"
      icon={<FolderOpenDot />}
      hide={!verifyPermission(user?.permissions ?? [], "Projects")}
      rightSection={
        !error &&
        data && (
          <Badge variant="light" radius="xl" color="orange">
            {data?.total}
          </Badge>
        )
      }
    />
  );
}
