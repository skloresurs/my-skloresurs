import { Alert } from "@mantine/core";
import { Info } from "lucide-react";
import type React from "react";
import { memo } from "react";

interface IProps extends React.ComponentPropsWithoutRef<typeof Alert> {
  title: string;
  description: string;
}

function InfoAlert({ title, description, ...otherProps }: IProps) {
  return (
    <Alert title={title} icon={<Info />} radius="md" {...otherProps}>
      {description}
    </Alert>
  );
}

export default memo(InfoAlert);
