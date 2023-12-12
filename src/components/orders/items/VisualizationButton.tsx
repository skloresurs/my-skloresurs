import { Button } from '@mantine/core';
import React, { Dispatch, SetStateAction } from 'react';

interface IProps {
  activeTab: string | null;
  setActiveTab: Dispatch<SetStateAction<string | null>>;
  id: number;
}

export default function VisualizationButton({
  setActiveTab,
  id,
  activeTab,
}: IProps) {
  const i = id;
  return (
    <Button
      onClick={() => setActiveTab(`${id}`)}
      size="xs"
      radius="xl"
      color={activeTab === `${id}` ? 'blue' : 'gray'}
      className="absolute bottom-0 left-[-15%] p-1 text-white"
    >
      {i}
    </Button>
  );
}
