import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { Services } from './Services';
import { useApp } from '@os/apps/hooks/useApps';

export const ServicesApp: React.FC = () => {
  const services = useApp('SERVICES');
  return (
    <AppWrapper>
      <AppTitle app={services} />
      <AppContent>
        <Services />
      </AppContent>
    </AppWrapper>
  );
};
