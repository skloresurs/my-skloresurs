import React from 'react';

import ProfileTabs from '@/components/profile/ProfileTabs';
import TitleBar from '@/components/TitleBar';

export default function Profile() {
  return (
    <>
      <TitleBar title="Профіль" />
      <ProfileTabs />
    </>
  );
}
