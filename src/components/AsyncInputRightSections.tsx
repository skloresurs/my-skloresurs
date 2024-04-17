import { Loader } from "@mantine/core";
import { CircleSlash, ServerCrash } from "lucide-react";
import { type ReactNode, memo } from "react";

interface IProps {
  isValidating?: boolean;
  error: unknown;
  forbidden?: boolean;
  defaultValue?: ReactNode;
}

function AsyncInputRightSections({ isValidating, error, forbidden, defaultValue }: IProps) {
  if (isValidating) {
    return <Loader color="blue" />;
  }
  if (error) {
    <ServerCrash />;
  }
  if (forbidden) {
    <CircleSlash />;
  }
  return defaultValue;
}

export default memo(AsyncInputRightSections);
