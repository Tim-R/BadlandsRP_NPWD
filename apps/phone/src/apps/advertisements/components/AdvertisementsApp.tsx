import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { Advertisements } from './Advertisements';
import { useApp } from '@os/apps/hooks/useApps';
import { BottomNavigation, BottomNavigationAction, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import useStyles from '../advertisements.styles';
import { usePageValue, useSetModalAcceptText, useSetModalAction, useSetModalOpen, useSetModalText, useSetPage } from '../hooks/state';
import { useConfig } from '@os/phone/hooks';
import { HomeRounded, List } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

export const AdvertisementsApp: React.FC = () => {
  const classes = useStyles();
  const advertisements = useApp('ADVERTISEMENTS');
  const config = useConfig();

  const setModalOpen = useSetModalOpen();
  const setModalText = useSetModalText();
  const setModalAcceptText = useSetModalAcceptText();
  const setModalAction = useSetModalAction();

  const page = usePageValue();
  const setPage = useSetPage();

  const handlePageChange = (_e: any, newPage: any) => {
    setPage(newPage);
  }

  const onClickCreate = () => {
    setModalText(`Create advertisement`);
    setModalAcceptText(`Pay $${config.advertisements.priceInitial}`);
    setModalAction('create');
    setModalOpen(true);
  };

  return (
    <AppWrapper>
      <AppTitle app={advertisements} />
      <AppContent className="flex flex-col" sx={{ overflow: 'hidden'}}>
        <Advertisements />
      </AppContent>
      <Fab className={`bg-green-100 text-green-500 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-neutral-700 ${classes.absolute}`} onClick={onClickCreate} color="primary">
        <AddIcon />
      </Fab>
      <BottomNavigation value={page} onChange={handlePageChange} showLabels>
        <BottomNavigationAction label={'Home'} value="/advertisements" icon={<HomeRounded />} component={NavLink} to={'/advertisements'} />
        <BottomNavigationAction label={'My Advertisements'} value="/advertisements/mine" icon={<List />} component={NavLink} to={'/advertisements/mine'} />
      </BottomNavigation>
    </AppWrapper>
  );
};
