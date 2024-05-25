import { useAccountsValue, useBleetsValue, useHasMoreValue, useSetAccounts, useSetBleets, useSetHasMore } from '@apps/bleeter/hooks/state';
import React, { useEffect, useState } from 'react';
import { BleetItem } from './BleetItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { Bleet, BleeterEvents, BleetsFetchResponse } from '@typings/bleeter';
import { BleeterIcon } from '../BleeterIcon';

export const Home: React.FC = () => {
  const accounts = useAccountsValue();
  const bleets = useBleetsValue();
  const setBleets = useSetBleets();
  const setAccounts = useSetAccounts();

  const hasMore = useHasMoreValue();
  const setHasMore = useSetHasMore();

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

  let bleetsRendered = [];

  useEffect(() => {
    if(!bleets) {
      return;
    }

    bleetsRendered = bleets
      .sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
      .map((bleet) => {
        return <BleetItem key={bleet.id} bleet={bleet} />
      });
  }, [bleets]);

  return (
    <div className="flex flex-col" id="bleeter-home">
      <InfiniteScroll
        dataLength={bleets.length}
        height={'55vh'}
        next={fetchBleets}
        hasMore={hasMore}
        loader={<h4>Loading... {bleets.length} {bleetsRendered.length}</h4>}
        scrollableTarget="bleeter-home"
        endMessage={
          <div className="flex justify-center mt-2">
            <BleeterIcon />
          </div>
        }
      >
        {bleets && bleets.map((bleet) => <BleetItem key={bleet.id} bleet={bleet} /> )}
      </InfiniteScroll>

    </div>
  );
};
