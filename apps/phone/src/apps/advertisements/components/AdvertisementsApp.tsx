import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { Advertisements } from './Advertisements';
import { useApp } from '@os/apps/hooks/useApps';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import useStyles from '../advertisements.styles';
import { useSetModalAcceptText, useSetModalAction, useSetModalOpen, useSetModalText } from '../hooks/state';
import { useConfig } from '@os/phone/hooks';

export const AdvertisementsApp: React.FC = () => {
  const classes = useStyles();
  const advertisements = useApp('ADVERTISEMENTS');
  const config = useConfig();

  const setModalOpen = useSetModalOpen();
  const setModalText = useSetModalText();
  const setModalAcceptText = useSetModalAcceptText();
  const setModalAction = useSetModalAction();

  const onClickCreate = () => {
    setModalText(`Create advertisement`);
    setModalAcceptText(`Pay $${config.advertisements.priceInitial}`);
    setModalAction('create');
    setModalOpen(true);
  };

  return (
    <AppWrapper>
      <AppTitle app={advertisements} />
      <AppContent className="flex flex-col">
        <Advertisements />
      </AppContent>
      <Fab className={`bg-green-100 text-green-500 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-neutral-700 ${classes.absolute}`} onClick={onClickCreate} color="primary">
        <AddIcon />
      </Fab>
    </AppWrapper>
  );
};
