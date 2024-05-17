import type Project from "@/types/projects/Project";
import { Card, Flex, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { Calendar, CheckCheck, Fingerprint, UserRound } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface IProps {
  project: Project;
}

export default function ProjectCard({ project }: IProps) {
  return (
    <Card
      component={Link}
      href={`/projects/${project.id}`}
      className={twMerge(
        "hover:bg-[var(--mantine-color-dark-5)] duration-300 cursor-pointer",
        dayjs(project.date).isBefore(dayjs()) && "bg-[#3d2f2f] hover:bg-[#4d3f3f]",
      )}
      h="100%"
    >
      <Flex direction="column" gap="0">
        <Title order={2} size="h3" mb="xs">
          {project.title || project.id}
        </Title>
        <div className="flex-1" />
        <Flex align="center" gap="xs" c="dimmed">
          <Fingerprint size={16} />
          <Text size="sm">{project.id}</Text>
        </Flex>
        <Flex align="center" gap="xs" c="dimmed">
          <Calendar size={16} />
          <Text size="sm">{dayjs(project.date).format("DD.MM.YYYY")}</Text>
        </Flex>
        <Flex align="center" gap="xs" c="dimmed">
          <UserRound size={16} />
          <Text size="sm">{project.agent?.name}</Text>
        </Flex>
        <Flex align="center" gap="xs" c="dimmed">
          <CheckCheck size={16} />
          <Text size="sm">{project.status}</Text>
        </Flex>
      </Flex>
    </Card>
  );
}
