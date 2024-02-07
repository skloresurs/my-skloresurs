import { LoadingOverlay as MantineLoadingOverlay } from '@mantine/core';
import React, { memo } from 'react';

function LoadingOverlay() {
  return <MantineLoadingOverlay visible zIndex={100} overlayProps={{ blur: 2, radius: 'sm', zIndex: 100 }} />;
}

export default memo(LoadingOverlay);
