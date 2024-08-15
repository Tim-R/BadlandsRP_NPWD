import { Bleet, BleeterAccount, BleeterEvents, BleetsFetchResponse, RepliesFetchResponse } from "@typings/bleeter";
import { onNetPromise } from "../lib/PromiseNetEvents/onNetPromise";
import BleeterService from "./bleeter.service";
import { mainLogger } from "../sv_logger";

onNetPromise<void, BleeterAccount[]>(
  BleeterEvents.FETCH_MY_ACCOUNTS,
  async (reqObj, resp) => {
    BleeterService.handleFetchMyAccounts(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in fetch my Bleeter accounts (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ accountId: number, profileName: string, avatarUrl: string }, BleeterAccount>(
  BleeterEvents.EDIT_ACCOUNT,
  async (reqObj, resp) => {
    BleeterService.handleEditAccount(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in edit my Bleeter account (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ accountId: number }, BleeterAccount>(
  BleeterEvents.DELETE_ACCOUNT,
  async (reqObj, resp) => {
    BleeterService.handleDeleteAccount(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in delete my Bleeter account (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ profileName: string, avatarUrl?: string }, BleeterAccount>(
  BleeterEvents.CREATE_ACCOUNT,
  async (reqObj, resp) => {
    BleeterService.handleCreateAccount(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in create Bleeter account (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ accountId: number }, void>(
  BleeterEvents.SET_ACCOUNT_ACTIVE,
  async (reqObj, resp) => {
    BleeterService.handleSetActiveAccount(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in set active Bleeter account (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  }
)

onNetPromise<{ accountId: number }, BleeterAccount[]>(
  BleeterEvents.FETCH_ACCOUNT_USERS,
  async (reqObj, resp) => {
    BleeterService.handleFetchAccountUsers(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in fetch Bleeter account users (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ accountId: number, characterId: number }, boolean>(
  BleeterEvents.DELETE_ACCOUNT_USER,
  async (reqObj, resp) => {
    BleeterService.handleDeleteAccountUser(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in delete Bleeter account user (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ accountId: number, profileName: string, level: number }, boolean>(
  BleeterEvents.ADD_ACCOUNT_USER,
  async (reqObj, resp) => {
    BleeterService.handleAddAccountUser(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in add Bleeter account user (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ vrpId: number, characterId: number, accountId: number, level: number }, boolean>(
  BleeterEvents.EDIT_ACCOUNT_USER,
  async (reqObj, resp) => {
    BleeterService.handleEditAccountUser(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in edit Bleeter account user (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ vrpId: number, excludedAccountIds?: number[], from?: number }, BleetsFetchResponse>(
  BleeterEvents.FETCH_BLEETS_HOME,
  async (reqObj, resp) => {
    BleeterService.handleFetchBleets(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in fetch Bleeter bleets (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ id: number, accountId: number }, boolean>(
  BleeterEvents.DELETE_BLEET,
  async (reqObj, resp) => {
    BleeterService.handleDeleteBleet(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in delete bleet (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ vrpId: number, repliedId: number }, RepliesFetchResponse>(
  BleeterEvents.FETCH_BLEETS_REPLY,
  async (reqObj, resp) => {
    BleeterService.handleFetchReplies(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in fetch Bleeter replies (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);

onNetPromise<{ bleet: Bleet }, boolean>(
  BleeterEvents.ADD_BLEET,
  async (reqObj, resp) => {
    console.log('Bleet content:', reqObj);
    BleeterService.handleCreateBleet(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in add Bleet (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);