import plurals from "@/libs/plurals";
import type Project from "@/types/projects/Project";
import { Card, Flex, Text, Title } from "@mantine/core";
import { Mail, User } from "lucide-react";
import plural from "plurals-cldr";

interface IProps {
  project: Project;
}

export default function ProjectCard({ project }: IProps) {
  console.log(project);
  return (
    <Card className="hover:bg-[var(--mantine-color-dark-5)] duration-300 cursor-pointer" h="100%">
      <Flex direction="column" gap="0">
        <Flex align="center" gap="4px">
          <User size={16} />
          <Text size="sm">{project.responsible.name || "Не вказано"}</Text>
        </Flex>
        <Title order={2} size="h3" mt="sm" mb="xs">
          {project.title || project.id}
        </Title>
        <div className="flex-1" />
        <Flex align="center" gap="xs" c="dimmed">
          <Mail size={16} />
          <Text size="sm">{`${project.messagesCount} ${
            plurals.message?.[plural("uk", project.messagesCount) ?? ""]
          }`}</Text>
        </Flex>
      </Flex>
    </Card>
  );
}
