export interface BleeterConfig {
  resultsPerPage: number;
  maxAccountNameLength: number;
  maxAccountsPerPlayer: number;
  characterLimit: number;
  newLineLimit: number;
  /*
    showNotifications: boolean;
    generateProfileNameFromUsers: boolean;
    allowEditableProfileName: boolean;
    allowDeleteTweets: boolean;
    allowReportTweets: boolean;
    allowRetweet: boolean;
    characterLimit: number;
    newLineLimit: number;
    enableAvatars: boolean;
    enableEmojis: boolean;
    enableImages: boolean;
    maxImages: number;
    resultsLimit: number;
  */
}

export interface BleetsFetchResponse {
  bleets: Bleet[],
  accounts: BleeterAccount[],
  hasMore: boolean,
}

export interface RepliesFetchResponse {
  bleets: Bleet[]
}

export interface Bleet {
  id?: number,
  accountId: number,
  characterId: number,
  repliedId?: number,
  rebleetedId?: number,
  baseAccountId?: number,
  body?: string,
  likes: number,
  images?: string,
  rebleets?: number,
  createdAt: number,

  /* From account relation */
  // profileName: string,
  // avatarUrl: string,
}

export interface BleeterAccount {
  id: number,
  vrpId?: number,
  characterId?: number,
  profileName: string,
  avatarUrl: string,
  createdAt?: number,
  level: number
  active?: boolean,
}

export enum BleeterAccountLevel {
  LEVEL_MEMBER = 1,
  LEVEL_ADMIN = 2,
}

export interface BleeterProps {
  bleet: Bleet,
  deleteBleet?: (bleetId: number) => Promise<void>
}

export enum BleeterEvents {
  FETCH_MY_ACCOUNTS = 'npwd:fetchMyBleeterAccounts',
  EDIT_ACCOUNT = 'npwd:editBleeterAccount',
  DELETE_ACCOUNT = 'npwd:deleteBleeterAccount',
  FETCH_ACCOUNT_USERS = 'npwd:fetchBleeterAccountUsers',
  CREATE_ACCOUNT = 'npwd:createBleeterAccount',
  SET_ACCOUNT_ACTIVE = 'npwd:setActiveBleeterAccount',
  DELETE_ACCOUNT_USER = 'npwd:deleteBleeterAccountUser',
  ADD_ACCOUNT_USER = 'npwd:addBleeterAccountUser',
  EDIT_ACCOUNT_USER = 'npwd:editBleeterAccountUser',

  EDIT_ACCOUNT_BROADCAST = 'npwd:broadcastEditBleeterAccount',
  DELETE_ACCOUNT_BROADCAST = 'npwd:broadcastDeleteBleeterAccount',

  FETCH_BLEETS_HOME = 'npwd:fetchBleetsHomepage',
  FETCH_BLEETS_REPLY = 'npwd:fetchBleetsReply',

  DELETE_BLEET = 'npwd:deleteBleet',
  ADD_BLEET = 'npwd:addBleet',
}
