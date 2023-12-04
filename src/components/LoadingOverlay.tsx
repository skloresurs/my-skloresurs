import { LoadingOverlay as MantineLoadingOverlay } from '@mantine/core';
import React from 'react';

export default function LoadingOverlay() {
  return (
    <MantineLoadingOverlay
      visible
      zIndex={100}
      overlayProps={{ blur: 2, radius: 'sm', zIndex: 100 }}
    />
  );
}
