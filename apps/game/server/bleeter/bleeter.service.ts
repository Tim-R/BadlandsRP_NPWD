import { ResourceConfig } from "@typings/config";
import { getConfig } from "../utils/config";
import { BleeterDB, _BleeterDB } from "./bleeter.database";
import { PromiseEventResp, PromiseRequest } from "../lib/PromiseNetEvents/promise.types";
import { Bleet, BleeterAccount, BleeterAccountLevel, BleeterEvents, BleetsFetchResponse } from "@typings/bleeter";
import PlayerService from "../players/player.service";
import { scanInputForBadWords } from "../utils/badWords";
import { checkAndFilterImage } from "../utils/imageFiltering";

class _BleeterService {
  private readonly bleeterDB: _BleeterDB
  private readonly config: ResourceConfig;

  constructor() {
    this.bleeterDB = BleeterDB;
    this.config = getConfig();
  }

  async handleFetchBleets(
    reqObj: PromiseRequest<{ vrpId: number, excludedAccountIds?: number[], from?: number }>,
    resp: PromiseEventResp<BleetsFetchResponse>,
  ) {
    const response = await this.bleeterDB.fetchBleetsHome(reqObj.data.vrpId, reqObj.data?.excludedAccountIds, reqObj.data?.from);

    console.log('handleFetchBleets response');
    console.log(response);

    resp({ status: 'ok', data: response });
  }

  async handleFetchMyAccounts(
    reqObj: PromiseRequest,
    resp: PromiseEventResp<BleeterAccount[]>,
  ) {
    const accounts = await this.bleeterDB.fetchAccounts('npwd_bleeter_account_access.vrp_id', PlayerService.getVrpId(reqObj.source));

    resp({ status: 'ok', data: accounts });
  }

  async handleFetchAccountUsers(
    reqObj: PromiseRequest<{ accountId: number }>,
    resp: PromiseEventResp<BleeterAccount[]>,
  ) {
    const accounts = await this.bleeterDB.fetchAccountUsers(reqObj.data.accountId);

    resp({ status: 'ok', data: accounts });
  }

  async handleEditAccount(
    reqObj: PromiseRequest<{ accountId: number, profileName: string, avatarUrl: string }>,
    resp: PromiseEventResp<BleeterAccount>,
  ) {
    let characterId = PlayerService.getCharacterId(reqObj.source);
    let accountCheck = await this.bleeterDB.fetchAccount('id', reqObj.data.accountId);

    if(characterId != accountCheck.characterId) {
      return resp({ status: 'error', errorMsg: 'Access denied' });
    }

    let accountNamed = await this.bleeterDB.fetchAccount('BINARY `npwd_bleeter_accounts`.`profile_name`', reqObj.data.profileName);

    if(accountNamed && accountNamed.id != reqObj.data.accountId) {
      return resp({ status: 'error', errorMsg: "An account with this handle already exists" });
    }

    const account = await this.bleeterDB.editAccount(reqObj.data.accountId, reqObj.data.profileName, reqObj.data.avatarUrl);

    if(!account) {
      return resp({ status: 'error', errorMsg: 'Unknown error' });
    }

    resp({ status: 'ok', data: account });
    emitNet(BleeterEvents.EDIT_ACCOUNT_BROADCAST, -1, reqObj.data);
  }

  async handleDeleteAccount(
    reqObj: PromiseRequest<{ accountId: number }>,
    resp: PromiseEventResp<boolean>,
  ) {
    let characterId = PlayerService.getCharacterId(reqObj.source);
    let account = await this.bleeterDB.fetchAccount('id', reqObj.data.accountId);

    if(characterId != account.characterId) {
      return resp({ status: 'error', errorMsg: 'Access denied' });
    }

    const success = await this.bleeterDB.deleteAccount(reqObj.data.accountId);

    if(!success) {
      return resp({ status: 'error', errorMsg: 'Unknown error' });
    }

    resp({ status: 'ok', data: success });
    emitNet(BleeterEvents.DELETE_ACCOUNT_BROADCAST, -1, reqObj.data.accountId);
  }

  async handleCreateAccount(
    reqObj: PromiseRequest<{ profileName: string, avatarUrl?: string }>,
    resp: PromiseEventResp<BleeterAccount>,
  ) {
    try {
      let vrpId = PlayerService.getVrpId(reqObj.source);
      let characterId = PlayerService.getCharacterId(reqObj.source);

      let avatarUrl = reqObj.data.avatarUrl;

      if(avatarUrl == '') {
        avatarUrl = null;
      }

      if(avatarUrl) {
        avatarUrl = checkAndFilterImage(avatarUrl);

        if(avatarUrl == null) {
          return resp({ status: 'error', errorMsg: 'The image host you tried to use is not allowed by this server' });
        }
      }

      if(!avatarUrl) {
        avatarUrl = 'https://i.fivemanage.com/images/3ClWwmpwkFhL.png';
      }

      let maxAccountLength = this.config.bleeter.maxAccountNameLength;

      let profileName = reqObj.data.profileName;

      if(profileName.length > maxAccountLength) {
        return resp({ status: 'error', errorMsg: `Maximum handle length is ${maxAccountLength} characters`})
      }

      let accountNamed = await this.bleeterDB.fetchAccount('BINARY `npwd_bleeter_accounts`.`profile_name`', profileName);

      if(accountNamed) {
        return resp({ status: 'error', errorMsg: "An account with this handle already exists" });
      }

      let accounts = await this.bleeterDB.fetchAccounts('npwd_bleeter_accounts.vrp_id', vrpId);
      let maximum = this.config.bleeter.maxAccountsPerPlayer;

      if(accounts.length >= maximum) {
        return resp({ status: 'error', errorMsg: `You can only own a maximum of ${maximum} accounts across all characters` });
      }

      let badWords = await scanInputForBadWords(reqObj.source, 'PHONE-BLEETER-ACCOUNT-DETAILS', profileName);

      if(badWords) {
        return resp({ status: 'error', errorMsg: 'Bad word filter failed' });
      }

      const createdAccount = await this.bleeterDB.createAccount(vrpId, characterId, profileName, avatarUrl);

      if(!createdAccount) {
        return resp({ status: 'error', errorMsg: 'Unknown error while creating account' });
      }

      resp({ status: 'ok', data: createdAccount });
    } catch(err) {
      resp({ status: 'error', errorMsg: err.message });
    }
  }

  async handleSetActiveAccount(
    reqObj: PromiseRequest<{ accountId: number }>,
    resp: PromiseEventResp<void>,
  ) {
    const success = await this.bleeterDB.setActiveAccount(PlayerService.getVrpId(reqObj.source), reqObj.data.accountId);

    if(!success) {
      return resp({ status: 'error', errorMsg: 'Unknown error' });
    }

    resp({ status: 'ok', data: success });
  }

  async handleDeleteAccountUser(
    reqObj: PromiseRequest<{ accountId: number, characterId: number }>,
    resp: PromiseEventResp<boolean>,
  ) {
    let characterId = PlayerService.getCharacterId(reqObj.source);

    if(characterId == reqObj.data.characterId) {
      return resp({ status: 'error', errorMsg: 'Cannot remove yourself' });
    }

    let access = await this.bleeterDB.getCharacterAccess(reqObj.data.accountId, characterId);

    if(access < BleeterAccountLevel.LEVEL_ADMIN) {
      return resp({ status: 'error', errorMsg: 'Access denied' });
    }

    const success = await this.bleeterDB.deleteAccountUser(reqObj.data.accountId, reqObj.data.characterId);

    if(!success) {
      return resp({ status: 'error', errorMsg: 'Unknown error' });
    }

    resp({ status: 'ok', data: success });
  }

  async handleAddAccountUser(
    reqObj: PromiseRequest<{ accountId: number, profileName: string, level: number }>,
    resp: PromiseEventResp<boolean>,
  ) {
    let characterId = PlayerService.getCharacterId(reqObj.source);
    let access = await this.bleeterDB.getCharacterAccess(reqObj.data.accountId, characterId);

    if(access < BleeterAccountLevel.LEVEL_ADMIN) {
      return resp({ status: 'error', errorMsg: 'Access denied' });
    }

    let matchedAccount = await this.bleeterDB.fetchAccount('BINARY `profile_name`', reqObj.data.profileName);

    if(!matchedAccount) {
      return resp({ status: 'error', errorMsg: 'Username not found' });
    }

    if(matchedAccount.characterId == characterId) {
      return resp({ status: 'error', errorMsg: 'Cannot add yourself' });
    }

    const success = await this.bleeterDB.addAccountUser(matchedAccount, reqObj.data.accountId, reqObj.data.level);

    if(!success) {
      return resp({ status: 'error', errorMsg: 'Unknown error' });
    }

    return resp({ status: 'ok', data: success });
  }

  async handleEditAccountUser(
    reqObj: PromiseRequest<{ vrpId: number, characterId: number, accountId: number, level: number }>,
    resp: PromiseEventResp<boolean>,
  ) {
    let characterId = PlayerService.getCharacterId(reqObj.source);
    let access = await this.bleeterDB.getCharacterAccess(reqObj.data.accountId, characterId);

    if(access < BleeterAccountLevel.LEVEL_ADMIN) {
      return resp({ status: 'error', errorMsg: 'Access denied' });
    }

    if(reqObj.data.characterId == characterId) {
      return resp({ status: 'error', errorMsg: 'Cannot edit your own permissions' });
    }

    const success = await this.bleeterDB.editAccountUser(reqObj.data.vrpId, reqObj.data.characterId, reqObj.data.accountId, reqObj.data.level);

    if(!success) {
      return resp({ status: 'error', errorMsg: 'Unknown error' });
    }

    return resp({ status: 'ok', data: success });
  }
}

const BleeterService = new _BleeterService();

export default BleeterService;
