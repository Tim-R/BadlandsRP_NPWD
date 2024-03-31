import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { phoneState } from '@os/phone/hooks/state';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import usePlayerData from '@os/phone/hooks/usePlayerData';
import { Paper } from '@mui/material';
import { BleeterThemeProvider } from '../providers/BleeterThemeProvider';

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
  const config = useRecoilValue(phoneState.resourceConfig);
  const playerData = usePlayerData();
  const { addAlert } = useSnackbar();

  return (
      <BleeterThemeProvider>
        <Container square elevation={0}>
          <Content>
            Bleeter App
          </Content>
        </Container>
      </BleeterThemeProvider>
  );
};
