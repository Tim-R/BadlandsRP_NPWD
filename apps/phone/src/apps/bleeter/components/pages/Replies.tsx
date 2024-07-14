import {
  useAccountsValue,
  useBleetsValue,
  useHasMoreValue,
  useSetAccounts,
  useSetBleets,
  useSetHasMore,
} from '@apps/bleeter/hooks/state';
import React, { useEffect, useState } from 'react';
import { BleetItem } from './BleetItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { Bleet, BleeterEvents, BleetsFetchResponse } from '@typings/bleeter';
import { BleeterIcon } from '../BleeterIcon';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useLocation } from 'react-router-dom';
import { CircularProgress, Stack } from '@mui/material';

export const Replies: React.FC = () => {
  const [isDataLoading, setIsDataLoading] = useState(true);

  const url = useLocation().pathname;
  const id = url.split('replies/')[1];

  const bleets = useBleetsValue();
  const singleBleet = bleets.find((bleet) => bleet.id === Number(id));

  const accounts = useAccountsValue();
  const setAccounts = useSetAccounts();
  const setHasMore = useSetHasMore();
  const setBleets = useSetBleets();

  const fetchReplies = async () => {
    try {
      const resp = await fetchNui<ServerPromiseResp<BleetsFetchResponse>>(
        BleeterEvents.FETCH_BLEETS_REPLY,
      );
      setBleets((bleets) => [...bleets, ...resp.data.bleets]);
      setIsDataLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div>
        <BleetItem key={singleBleet.id} bleet={singleBleet} />
      </div>
      <div>
        {isDataLoading ? (
          <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          paddingTop={10}
          // sx={{ width: 1, height: "100vh" }}
        >
          <CircularProgress />
        </Stack>
        ) : (
          bleets.map((bleet) => <BleetItem key={bleet.id} bleet={bleet} />)
        )}
      </div>
    </div>
  );
};
