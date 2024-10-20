import { DefaultValue, atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { Bleet, BleeterAccount, BleeterEvents, BleetsFetchResponse } from "@typings/bleeter";
import fetchNui from "@utils/fetchNui";
import { ServerPromiseResp } from "@typings/common";
import { buildRespObj, defaultOrMock, isEnvBrowser } from "@utils/misc";
import { MockBleeterAccounts, MockBleeterBleets, MockBleeterLikes } from "../utils/constants";
import { BleetItem } from "../components/pages/BleetItem";
import { phoneState } from "@os/phone/hooks/state";

export const bleeterState = {
  firstLoad: atom<boolean>({
    key: 'bleeterFirstLoad',
    default: true
  }),

  hasMore: atom<boolean>({
    key: 'bleeterHasMore',
    default: true,
  }),

  bleets: atom<Bleet[]>({
    key: 'bleeterBleets',
    default: defaultOrMock([], MockBleeterBleets),
  }),

  showCreateBleetForm: atom({
    key: 'showCreateBleetForm',
    default: false,
  }),

  bleeterModalMessage: atom({
    key: 'bleeterModalMessage',
    default: '',
  }),

  likedBleets: atom<number[]>({
    key: 'bleeterLikes',
    default: defaultOrMock([], MockBleeterLikes),
  }),

  accounts: atom<BleeterAccount[]>({
    key: 'bleeterAccounts',
    default: defaultOrMock([], MockBleeterAccounts),
  }),

  page: atom({
    key: 'bleeterPage',
    default: '/bleeter',
  }),
}

export const useFirstLoadValue = () => useRecoilValue(bleeterState.firstLoad);
export const useSetFirstLoad = () => useSetRecoilState(bleeterState.firstLoad);

export const useHasMoreValue = () => useRecoilValue(bleeterState.hasMore);
export const useSetHasMore = () => useSetRecoilState(bleeterState.hasMore);

export const useBleetsValue = () => useRecoilValue(bleeterState.bleets);
export const useSetBleets = () => useSetRecoilState(bleeterState.bleets);

export const useLikesValue = () => useRecoilValue(bleeterState.likedBleets);
export const useSetLikes = () => useSetRecoilState(bleeterState.likedBleets);

export const useAccountsValue = () => useRecoilValue(bleeterState.accounts);
export const useSetAccounts = () => useSetRecoilState(bleeterState.accounts);

export const usePageValue = () => useRecoilValue(bleeterState.page);
export const useSetPage = () => useSetRecoilState(bleeterState.page);

/* Derived states */

const myAccounts = selector<BleeterAccount[]>({
  key: 'myBleeterAccounts',
  get: ({ get }) => {
    let accounts = get(bleeterState.accounts);
    let playerData = get(phoneState.playerData);
    return accounts.filter(account => account.vrpId == playerData.vrp);
  }
});

export const useMyAccountsValue = () => useRecoilValue(myAccounts);

const currentAccount = selector<BleeterAccount>({
  key: 'currentBleeterAccount',
  get: ({ get }) => {
    let accounts = get(bleeterState.accounts);
    let playerData = get(phoneState.playerData);

    console.log( 'ACCOUNTS', accounts, 'Player data', playerData);
    let active = accounts.find((a: BleeterAccount) => a.characterId == playerData.id && a.active);

    if(active) {
      console.log('Found active account', active);
      return active;
    }


    if(accounts.length > 0) {
      return [...accounts].sort((a: BleeterAccount, b: BleeterAccount) => a.profileName.localeCompare(b.profileName))[0];
    }

    return null;
  },
  set: ({ get, set }, newAccount) => {
    let accounts = get(bleeterState.accounts);

    let found = false;

    set(bleeterState.accounts, accounts.map(account => {
      let active = newAccount instanceof DefaultValue ? false : account.id == newAccount.id;

      if(active) {
        found = true;
      }

      return { ...account, active: active };
    }));

    if(found && !(newAccount instanceof DefaultValue)) {
      fetchNui<ServerPromiseResp<void>>(BleeterEvents.SET_ACCOUNT_ACTIVE, { accountId: newAccount.id });
    }
  }
});

export const useCurrentAccount = () => useRecoilValue(currentAccount);
export const useSetCurrentAccount = () => useSetRecoilState(currentAccount);
