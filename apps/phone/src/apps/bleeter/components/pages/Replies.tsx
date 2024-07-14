import { useAccountsValue, useBleetsValue, useHasMoreValue, useSetAccounts, useSetBleets, useSetHasMore } from '@apps/bleeter/hooks/state';
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

export const Replies: React.FC = () => {

  const url = useLocation().pathname;
  const id = url.split("replies/")[1];  

  const bleets = useBleetsValue();
  const singleBleet = bleets.find(bleet => bleet.id === Number(id));

  const accounts = useAccountsValue();
  const setAccounts = useSetAccounts();
  const setHasMore = useSetHasMore();
  const setBleets = useSetBleets();

  const fetchBleets = async () => {
    console.log("trying to load more bleets from: " + Math.min(...bleets.map(o => o.id)));

    try {
      const resp = await fetchNui<ServerPromiseResp<BleetsFetchResponse>>(
        BleeterEvents.FETCH_BLEETS_HOME,
        {
          vrpId: 0,
          excludedAccountIds: [...accounts].map(a => a.id),
          from: Math.min(...bleets.map(o => o.id))
        }
      );

      setHasMore(resp.data.hasMore);

      console.log('next bleets are', resp.data);

      setAccounts(accounts => [...accounts, ...resp.data.accounts]); // TODO: ensure unique - loop to add?
      setBleets(bleets => [...bleets, ...resp.data.bleets]);
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <div>
      <BleetItem key={singleBleet.id} bleet={singleBleet}/>
    </div>
  );
};
