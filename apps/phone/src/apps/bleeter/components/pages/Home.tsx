import { bleeterState, useAccountsValue, useBleetsValue, useHasMoreValue, useSetAccounts, useSetBleets, useSetHasMore } from '@apps/bleeter/hooks/state';
import React, { useEffect, useState } from 'react';
import { BleetItem } from './BleetItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { Bleet, BleeterEvents, BleetsFetchResponse } from '@typings/bleeter';
import { BleeterIcon } from '../BleeterIcon';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 



export const Home: React.FC = () => {
  const accounts = useAccountsValue();
  const bleets = useBleetsValue();
  const setBleets = useSetBleets();
  const setAccounts = useSetAccounts();

  const hasMore = useHasMoreValue();
  const setHasMore = useSetHasMore();
  const [showAlert, setShowAlert] = useState(false);

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

// need some user permissions to delete bleets
  const deleteBleet = async (bleetId) => {
    console.log('Deleting bleet')

    try {
      // Add call to backend 
      // delete bleet in database by id???

      // then update state on success
      setBleets(bleets => bleets.filter(bleet => bleet.id !== bleetId))

      // Bleet delete alert
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (e) {
      console.error('Error deleting bleet:', e)
    }

  }

  let bleetsRendered = [];

  useEffect(() => {
    if(!bleets) {
      return;
    }

    bleetsRendered = [...bleets]
      .sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
      .map((bleet) => {
        return <BleetItem key={bleet.id} bleet={bleet} deleteBleet={deleteBleet}/>
      });
  }, [bleets]);

  return (
    <div className="flex flex-col" id="bleeter-home">
      <InfiniteScroll
        dataLength={bleets.length}
        height={'58vh'}
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
        {bleets && [...bleets]
          .sort((a, b) => {
            return b.createdAt - a.createdAt;
          })
          .map((bleet) => <BleetItem key={bleet.id} bleet={bleet} deleteBleet={deleteBleet}/> )}
      </InfiniteScroll>
      
      {showAlert && (
        <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success">
          Bleet Deleted
        </Alert>
      )}
    </div>
  );
};
