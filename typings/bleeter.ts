export interface BleeterConfig {
  resultsPerPage: number;
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

export interface Bleet {
  id: number,
  accountId: number,
  characterId: number,
  repliedId?: number,
  rebleetedId?: number,
  baseAccountId?: number,
  body: string,
  likes: number,
  images?: string,
  rebleets: number,
  createdAt: number,

  /* From account relation */
  profileName: string,
  avatarUrl: string,

  /* From the base bleet (if replied / rebleeted) */
  baseProfileName?: string,
  baseAvatarUrl?: string,
}

export interface BleeterAccount {
  id: number,
  characterId: number,
  profileName: string,
  avatarUrl: string,
  createdAt: number,
  level: number
  active: boolean,
}
