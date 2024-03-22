import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { Advertisements } from './Advertisements';
import { useApp } from '@os/apps/hooks/useApps';

export const AdvertisementsApp: React.FC = () => {
  const advertisements = useApp('ADVERTISEMENTS');
  return (
    <AppWrapper>
      <AppTitle app={advertisements} />
      <AppContent>
        <Advertisements />
      </AppContent>
    </AppWrapper>
  );
};
