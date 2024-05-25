import { Snapshot, useRecoilCallback } from 'recoil';
import { bleeterState, useSetAccounts } from './state';
import { BleeterAccount } from '@typings/bleeter';

interface BleeterActionProps {
  editAccount: (data: { accountId: number, profileName: string, avatarUrl: string }) => void;
  deleteAccount: (accountId: number) => void;
}

const getAreAccountsLoading = (snapshot: Snapshot) => snapshot.getLoadable<BleeterAccount[]>(bleeterState.accounts).state !== 'hasValue';

export const useBleeterActions = (): BleeterActionProps => {
  const setAccounts = useSetAccounts();

  const editAccount = useRecoilCallback(({ snapshot, set }) => (data: { accountId: number, profileName: string, avatarUrl: string }) => {
    if(!getAreAccountsLoading(snapshot)) {
      set(bleeterState.accounts, (accounts) => {
        return [...accounts].map((account) => {
          const newProfileName = account.id == data.accountId ? data.profileName : account.profileName;
          const newAvatarUrl = account.id == data.accountId ? data.avatarUrl : account.avatarUrl;

          return { ...account, profileName: newProfileName, avatarUrl: newAvatarUrl };
        });
      });
    }
  }, [setAccounts]);

  const deleteAccount = useRecoilCallback(({ snapshot, set }) => (accountId: number) => {
    if(!getAreAccountsLoading(snapshot)) {
      set(bleeterState.accounts, (accounts) => {
        return [...accounts].filter((account) => account.id != accountId);
      });
    }

    // TODO: filter bleets
  }, [setAccounts]);

  return {
    editAccount,
    deleteAccount
  };
};
