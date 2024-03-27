export interface Bleet {
  id: number,
  accountId: number,
  characterId: number,
  repliedId: number,
  body: string,
  likes: number,
  images?: string,
  rebleets: number,
  createdAt: number,

  /* From account relation */
  profileName: string,
  avatarUrl: string,
}

export interface BleeterAccount {
  id: number,
  characterId: number,
  profileName: string,
  avatarUrl: string,
  createdAt: number,
  level: number
}
