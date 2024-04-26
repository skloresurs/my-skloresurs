import { Button } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";

interface IProps {
  activeTab: string | null;
  setActiveTab: Dispatch<SetStateAction<string | null>>;
  index: number;
}

export default function VisualizationButton({ setActiveTab, index, activeTab }: IProps) {
  return (
    <Button
      onClick={() => setActiveTab(index.toString())}
      size="xs"
      radius="xl"
      color={activeTab === `${index}` ? "blue" : "gray"}
      className="absolute bottom-0 left-[-15%] p-1 text-white"
    >
      {index}
    </Button>
  );
}
