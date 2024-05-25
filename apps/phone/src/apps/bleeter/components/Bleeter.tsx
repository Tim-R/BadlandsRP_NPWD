import React from 'react';
import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import { BleeterThemeProvider } from '../providers/BleeterThemeProvider';
import { useFirstLoadValue, usePageValue, useSetAccounts, useSetBleets, useSetFirstLoad, useSetHasMore } from '../hooks/state';
import { Home } from './pages/Home';
import { Trending } from './pages/Trending';
import { Me } from './pages/Me';
import { Top } from './pages/Top';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { BleeterEvents, BleetsFetchResponse } from '@typings/bleeter';
import { buildRespObj } from '@utils/misc';
import { MockBleeterHome } from '../utils/constants';
import usePlayerData from '@os/phone/hooks/usePlayerData';

const Container = styled(Paper)`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-height: 100%;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 1.5rem;
  overflow: auto;
`;

export const Bleeter: React.FC = () => {
  const page = usePageValue();
  const firstLoad = useFirstLoadValue();
  const playerData = usePlayerData();

  const setHasMore = useSetHasMore();
  const setAccounts = useSetAccounts();
  const setBleets = useSetBleets();
  const setFirstLoad = useSetFirstLoad();

  if(firstLoad) {
    try {
      fetchNui<ServerPromiseResp<BleetsFetchResponse>>(
        BleeterEvents.FETCH_BLEETS_HOME,
        { vrpId: playerData.vrp },
        buildRespObj(MockBleeterHome),
      ).then(resp => {
        setHasMore(resp.data.hasMore);
        setAccounts(resp.data.accounts);
        setBleets(resp.data.bleets);
        setFirstLoad(false);
      });
    } catch(e) {
      console.error(e);
    }
  }

  return (
      <BleeterThemeProvider>
        <Container square elevation={0}>
          <Content>
            { page == '/bleeter' && <Home /> }
            { page == '/bleeter/top' && <Top /> }
            { page == '/bleeter/trending' && <Trending /> }
            { page == '/bleeter/me' && <Me /> }
          </Content>
        </Container>
      </BleeterThemeProvider>
  );
};
