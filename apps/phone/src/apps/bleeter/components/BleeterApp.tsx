import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { Bleeter } from './Bleeter';
import { useApp } from '@os/apps/hooks/useApps';

export const BleeterApp: React.FC = () => {
  const bleeter = useApp('BLEETER');

  return (
    <AppWrapper>
      <AppTitle app={bleeter} />
      <AppContent className="flex flex-col" sx={{ overflow: 'hidden'}}>
        <Bleeter />
      </AppContent>
    </AppWrapper>
  );
};
