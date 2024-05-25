import { Bleet, BleeterAccount, BleeterAccountLevel, BleetsFetchResponse } from "@typings/bleeter";

export const APP_BLEETER = 'BLEETER';

export const MockBleeterLikes: number[] = [

];

export const MockBleeterBleets: Bleet[] = [
  {
    id: 1,
    accountId: 1,
    characterId: 9102,
    body: "The San Andreas Highway Patrol thanks all citizens for their safe driving!",
    likes: 0,
    rebleets: 0,
    createdAt: 1712516778,
  }

  /*
  const BLEET_SELECT_FIELDS = `
  npwd_bleeter_bleets.id,
  npwd_bleeter_bleets.account_id as accountId,
  npwd_bleeter_bleets.character_id as characterId,
  npwd_bleeter_bleets.replied_id as repliedId,
  npwd_bleeter_bleets.rebleeted_id as rebleetedId,
  npwd_bleeter_bleets.base_account_id as baseAccountId,
  npwd_bleeter_bleets.body,
  npwd_bleeter_bleets.likes,
  npwd_bleeter_bleets.images,
  npwd_bleeter_bleets.rebleets,
  npwd_bleeter_bleets.created_at as createdAt,
`;
  */
];

export const MockBleeterAccounts: BleeterAccount[] = [
  {
    id: 0,
    vrpId: 0,
    characterId: 0,
    profileName: 'Test Account 0',
    avatarUrl: 'https://i.pravatar.cc/150?u=0',
    createdAt: 123456789,
    level: 2,
    active: true,
  },
  {
    id: 1,
    vrpId: 1,
    characterId: 1,
    profileName: 'Test Account 1',
    avatarUrl: 'https://i.pravatar.cc/150?u=1',
    createdAt: 123456789,
    level: 1,
    active: false,
  },
  {
    id: 2,
    vrpId: 2,
    characterId: 2,
    profileName: 'Test Account 2',
    avatarUrl: 'https://i.pravatar.cc/150?u=2',
    createdAt: 123456789,
    level: 2,
    active: false,
  },
  {
    id: 3,
    vrpId: 3,
    characterId: 3,
    profileName: 'A Test Account 3',
    avatarUrl: 'https://i.pravatar.cc/150?u=3',
    createdAt: 123456789,
    level: 2,
    active: false,
  },
];

export const MockBleeterHome: BleetsFetchResponse = {
  bleets: MockBleeterBleets,
  accounts: MockBleeterAccounts
}

export const MockBleeterAccountUsers: BleeterAccount[] = [
  {
    id: 3,
    vrpId: 3,
    characterId: 3,
    profileName: 'Test User 3',
    avatarUrl: 'https://i.pravatar.cc/150?u=3',
    level: BleeterAccountLevel.LEVEL_ADMIN
  },
  {
    id: 4,
    vrpId: 4,
    characterId: 4,
    profileName: 'Test User 4',
    avatarUrl: 'https://i.pravatar.cc/150?u=4',
    level: BleeterAccountLevel.LEVEL_MEMBER
  },
  {
    id: 5,
    vrpId: 5,
    characterId: 5,
    profileName: 'Test User 5',
    avatarUrl: 'https://i.pravatar.cc/150?u=5',
    level: BleeterAccountLevel.LEVEL_MEMBER
  },
  {
    id: 6,
    vrpId: 6,
    characterId: 6,
    profileName: 'Test User 6',
    avatarUrl: 'https://i.pravatar.cc/150?u=6',
    level: BleeterAccountLevel.LEVEL_MEMBER
  },
  {
    id: 7,
    vrpId: 7,
    characterId: 7,
    profileName: 'Test User 7',
    avatarUrl: 'https://i.pravatar.cc/150?u=7',
    level: BleeterAccountLevel.LEVEL_MEMBER
  },
  {
    id: 8,
    vrpId: 8,
    characterId: 8,
    profileName: 'Test User 8',
    avatarUrl: 'https://i.pravatar.cc/150?u=8',
    level: BleeterAccountLevel.LEVEL_MEMBER
  },
  {
    id: 9,
    vrpId: 9,
    characterId: 9,
    profileName: 'Test User 9',
    avatarUrl: 'https://i.pravatar.cc/150?u=9',
    level: BleeterAccountLevel.LEVEL_MEMBER
  },
  {
    id: 10,
    vrpId: 10,
    characterId: 10,
    profileName: 'Test User 10',
    avatarUrl: 'https://i.pravatar.cc/150?u=10',
    level: BleeterAccountLevel.LEVEL_MEMBER
  },
  {
    id: 11,
    vrpId: 11,
    characterId: 11,
    profileName: 'Test User 11',
    avatarUrl: 'https://i.pravatar.cc/150?u=11',
    level: BleeterAccountLevel.LEVEL_MEMBER
  },
  {
    id: 12,
    vrpId: 12,
    characterId: 12,
    profileName: 'Test User 12',
    avatarUrl: 'https://i.pravatar.cc/150?u=12',
    level: BleeterAccountLevel.LEVEL_MEMBER
  },
  {
    id: 13,
    vrpId: 13,
    characterId: 13,
    profileName: 'Test User 13',
    avatarUrl: 'https://i.pravatar.cc/150?u=13',
    level: BleeterAccountLevel.LEVEL_MEMBER
  },
  {
    id: 14,
    vrpId: 14,
    characterId: 14,
    profileName: 'Test User 14',
    avatarUrl: 'https://i.pravatar.cc/150?u=14',
    level: BleeterAccountLevel.LEVEL_ADMIN
  },
];
