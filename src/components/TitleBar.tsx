"use client";

import { ActionIcon, Divider, Text, Title } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

interface IProps {
  title: string;
  description?: string;
  enableBackButton?: true;
}

function TitleBar({ title, description, enableBackButton }: IProps) {
  const router = useRouter();
  return (
    <div>
      <Text span>
        {enableBackButton && (
          <ActionIcon
            display="inline-flex"
            variant="subtle"
            aria-label="Back"
            mr="sm"
            h="100%"
            onClick={() => router.back()}
          >
            <ArrowLeft size={28} />
          </ActionIcon>
        )}
        <Title display="inline" order={1}>
          {title}
        </Title>
      </Text>
      {description && (
        <Text size="sm" my="sm">
          {description}
        </Text>
      )}
      <Divider className="my-2" />
    </div>
  );
}

export default memo(TitleBar);
