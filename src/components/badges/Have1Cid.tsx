import { Tooltip } from '@mantine/core';
import { BadgeInfo } from 'lucide-react';
import React, { memo } from 'react';

function Have1Cid() {
  return (
    <Tooltip label="Користувач прив'язаний до 1С">
      <BadgeInfo color='yellow' />
    </Tooltip>
  );
}

export default memo(Have1Cid);
