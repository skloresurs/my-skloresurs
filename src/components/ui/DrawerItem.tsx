import { Flex, Text } from "@mantine/core";
import type React from "react";
import { memo } from "react";

interface IProps {
  label: string;
  value?: string;
  children?: React.ReactNode;
}

function DrawerItem({ label, value, children }: IProps) {
  return (
    <Flex wrap="nowrap" align="center" gap="sm">
      <Text fw="bold">{label}:</Text>
      <div className="flex-1" />
      <Flex align="center" gap="xs">
        {value && <Text className="text-right">{value}</Text>}
        {children}
      </Flex>
    </Flex>
  );
}

export default memo(DrawerItem);
