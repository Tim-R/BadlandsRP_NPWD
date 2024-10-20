import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { Bleeter } from './Bleeter';
import { useApp } from '@os/apps/hooks/useApps';
import { BottomNavigation, BottomNavigationAction, Fab } from '@mui/material';
import { bleeterState, useCurrentAccount, usePageValue, useSetPage } from '../hooks/state';
import { AccountBox, Create, HomeRounded, Star, TrendingUp } from '@mui/icons-material';
import { NavLink, Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import useStyles from '../bleeter.styles';
import { WordFilterProvider } from '@os/wordfilter/providers/WordFilterProvider';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CreateBleetForm } from './pages/CreateBleetForm';



export const BleeterApp: React.FC = () => {
  const classes = useStyles();
  const bleeter = useApp('BLEETER');

  const setModalVisible = useSetRecoilState(bleeterState.showCreateBleetForm);
  console.log(useRecoilState(bleeterState.showCreateBleetForm));
  const openModal = () => setModalVisible(true);
  const page = usePageValue();
  const setPage = useSetPage();
  const currentAccount = useCurrentAccount();

  const handlePageChange = (_e: any, newPage: any) => {
    setPage(newPage);
  }

  const onClickCreate = () => {
    setPage('/bleeter/createbleetform');
  };

  return (
    <AppWrapper>
      { /* <AppTitle app={bleeter} /> */ }
      <AppContent className="flex flex-col" sx={{ overflow: 'hidden'}}>
        <WordFilterProvider>
        <Bleeter />
        <CreateBleetForm />
        </WordFilterProvider>
      </AppContent>
      { (page == '/bleeter' && currentAccount) &&
        <Fab className={`bg-green-100 text-green-500 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-neutral-700 ${classes.absolute}`} onClick={openModal}  color="primary">
          <AddIcon />
        </Fab>
      }
      <BottomNavigation value={page} onChange={handlePageChange} showLabels>
        <BottomNavigationAction label={'Home'} value="/bleeter" icon={<HomeRounded />} component={NavLink} to={'/bleeter'} />
        <BottomNavigationAction label={'Top'} value="/bleeter/top" icon={<Star />} component={NavLink} to={'/bleeter/top'} />
        <BottomNavigationAction label={'Trending'} value="/bleeter/trending" icon={<TrendingUp />} component={NavLink} to={'/bleeter/trending'} />
        <BottomNavigationAction label={'Me'} value="/bleeter/me" icon={<AccountBox />} component={NavLink} to={'/bleeter/me'} />
      </BottomNavigation>
    </AppWrapper>
  );
};
