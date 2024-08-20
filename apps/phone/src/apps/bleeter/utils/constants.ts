import { Bleet, BleeterAccount, BleeterAccountLevel, BleetsFetchResponse } from '@typings/bleeter';

export const APP_BLEETER = 'BLEETER';

export const MockBleeterLikes: number[] = [];

export const MockBleeterBleetsReplies: Bleet[] = [
  {
    id: 8,
    accountId: 0,
    characterId: 9102,
    body: 'reply to a bleet',
    likes: 5,
    rebleets: 0,
    createdAt: 1712516778,
    repliedId: 1,
  },
  {
    id: 9,
    accountId: 1,
    characterId: 9102,
    body: 'another reply to a bleet',
    likes: 3,
    rebleets: 0,
    createdAt: 1712518779,
    repliedId: 1,
  },
];

export const MockBleeterBleets: Bleet[] = [
  {
    id: 1,
    accountId: 0,
    characterId: 9102,
    body: 'I am account id 0',
    likes: 5,
    rebleets: 0,
    createdAt: 1712516778,
  },
  {
    id: 2,
    accountId: 1,
    characterId: 9102,
    body: 'The San Andreas Highway Patrol thanks all citizens for their safe driving!',
    likes: 3,
    rebleets: 0,
    createdAt: 1712518779,
  },
  {
    id: 3,
    accountId: 1,
    characterId: 9102,
    body: 'The San Andreas Highway Patrol thanks all citizens for their safe driving!',
    likes: 4,
    rebleets: 0,
    createdAt: 1716724495,
  },
  {
    id: 4,
    accountId: 2,
    characterId: 9102,
    body: 'I am account id 2',
    likes: 0,
    rebleets: 0,
    createdAt: 1712516781,
  },
  {
    id: 5,
    accountId: 3,
    characterId: 9102,
    body: 'I am account id 3',
    likes: 2,
    rebleets: 0,
    createdAt: 1712516782,
  },
//   {
//     id: 6,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 4",
//     likes: 1,
//     rebleets: 0,
//     createdAt: 1712516783,
// },
// {
//     id: 7,
//     accountId: 1,
//     characterId: 9102,
//     body: "Drive safe and keep the roads clear!",
//     likes: 6,
//     rebleets: 1,
//     createdAt: 1712518780,
// },
// {
//     id: 8,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 6",
//     likes: 0,
//     rebleets: 0,
//     createdAt: 1712516784,
// },
// {
//     id: 9,
//     accountId: 1,
//     characterId: 9102,
//     body: "The traffic this morning was heavy but manageable.",
//     likes: 5,
//     rebleets: 2,
//     createdAt: 1712518781,
// },
// {
//     id: 10,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 8",
//     likes: 3,
//     rebleets: 0,
//     createdAt: 1712516785,
// },
// {
//     id: 11,
//     accountId: 1,
//     characterId: 9102,
//     body: "Drive safe everyone!",
//     likes: 4,
//     rebleets: 1,
//     createdAt: 1712518782,
// },
// {
//     id: 12,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 10",
//     likes: 2,
//     rebleets: 0,
//     createdAt: 1712516786,
// },
// {
//     id: 13,
//     accountId: 1,
//     characterId: 9102,
//     body: "Safe driving is everyone's responsibility.",
//     likes: 6,
//     rebleets: 3,
//     createdAt: 1712518783,
// },
// {
//     id: 14,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 12",
//     likes: 1,
//     rebleets: 0,
//     createdAt: 1712516787,
// },
// {
//     id: 15,
//     accountId: 1,
//     characterId: 9102,
//     body: "The San Andreas Highway Patrol urges caution during this busy holiday season.",
//     likes: 7,
//     rebleets: 2,
//     createdAt: 1712518784,
// },
// {
//     id: 16,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 14",
//     likes: 3,
//     rebleets: 0,
//     createdAt: 1712516788,
// },
// {
//     id: 17,
//     accountId: 1,
//     characterId: 9102,
//     body: "Watch out for icy roads!",
//     likes: 5,
//     rebleets: 1,
//     createdAt: 1712518785,
// },
// {
//     id: 18,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 16",
//     likes: 0,
//     rebleets: 0,
//     createdAt: 1712516789,
// },
// {
//     id: 19,
//     accountId: 1,
//     characterId: 9102,
//     body: "Slow down, speed limits are there for your safety.",
//     likes: 4,
//     rebleets: 1,
//     createdAt: 1712518786,
// },
// {
//     id: 20,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 18",
//     likes: 2,
//     rebleets: 0,
//     createdAt: 1712516790,
// },
// {
//     id: 21,
//     accountId: 1,
//     characterId: 9102,
//     body: "Road construction ahead, expect delays.",
//     likes: 3,
//     rebleets: 0,
//     createdAt: 1712518787,
// },
// {
//     id: 22,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 20",
//     likes: 1,
//     rebleets: 0,
//     createdAt: 1712516791,
// },
// {
//     id: 23,
//     accountId: 1,
//     characterId: 9102,
//     body: "Remember to buckle up!",
//     likes: 6,
//     rebleets: 2,
//     createdAt: 1712518788,
// },
// {
//     id: 24,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 22",
//     likes: 4,
//     rebleets: 0,
//     createdAt: 1712516792,
// },
// {
//     id: 25,
//     accountId: 1,
//     characterId: 9102,
//     body: "Heavy rain is expected, drive with caution.",
//     likes: 7,
//     rebleets: 3,
//     createdAt: 1712518789,
// },
// {
//     id: 26,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 24",
//     likes: 3,
//     rebleets: 0,
//     createdAt: 1712516793,
// },
// {
//     id: 27,
//     accountId: 1,
//     characterId: 9102,
//     body: "Keep your headlights on during foggy conditions.",
//     likes: 5,
//     rebleets: 1,
//     createdAt: 1712518790,
// },
// {
//     id: 28,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 26",
//     likes: 0,
//     rebleets: 0,
//     createdAt: 1712516794,
// },
// {
//     id: 29,
//     accountId: 1,
//     characterId: 9102,
//     body: "Avoid distractions while driving, stay focused on the road.",
//     likes: 6,
//     rebleets: 2,
//     createdAt: 1712518791,
// },
// {
//     id: 30,
//     accountId: 1,
//     characterId: 9102,
//     body: "I am account id 28",
//     likes: 2,
//     rebleets: 0,
//     createdAt: 1712516795,
// },
// {
//     id: 31,
//     accountId: 1,
//     characterId: 9102,
//     body: "The San Andreas Highway Patrol thanks you for driving safe!",
//     likes: 5,
//     rebleets: 1,
//     createdAt: 1712518792,
// }


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
  accounts: MockBleeterAccounts,
  hasMore: false,
};

export const MockBleeterAccountUsers: BleeterAccount[] = [
  {
    id: 3,
    vrpId: 3,
    characterId: 3,
    profileName: 'Test User 3',
    avatarUrl: 'https://i.pravatar.cc/150?u=3',
    level: BleeterAccountLevel.LEVEL_ADMIN,
  },
  {
    id: 4,
    vrpId: 4,
    characterId: 4,
    profileName: 'Test User 4',
    avatarUrl: 'https://i.pravatar.cc/150?u=4',
    level: BleeterAccountLevel.LEVEL_MEMBER,
  },
  {
    id: 5,
    vrpId: 5,
    characterId: 5,
    profileName: 'Test User 5',
    avatarUrl: 'https://i.pravatar.cc/150?u=5',
    level: BleeterAccountLevel.LEVEL_MEMBER,
  },
  {
    id: 6,
    vrpId: 6,
    characterId: 6,
    profileName: 'Test User 6',
    avatarUrl: 'https://i.pravatar.cc/150?u=6',
    level: BleeterAccountLevel.LEVEL_MEMBER,
  },
  {
    id: 7,
    vrpId: 7,
    characterId: 7,
    profileName: 'Test User 7',
    avatarUrl: 'https://i.pravatar.cc/150?u=7',
    level: BleeterAccountLevel.LEVEL_MEMBER,
  },
  {
    id: 8,
    vrpId: 8,
    characterId: 8,
    profileName: 'Test User 8',
    avatarUrl: 'https://i.pravatar.cc/150?u=8',
    level: BleeterAccountLevel.LEVEL_MEMBER,
  },
  {
    id: 9,
    vrpId: 9,
    characterId: 9,
    profileName: 'Test User 9',
    avatarUrl: 'https://i.pravatar.cc/150?u=9',
    level: BleeterAccountLevel.LEVEL_MEMBER,
  },
  {
    id: 10,
    vrpId: 10,
    characterId: 10,
    profileName: 'Test User 10',
    avatarUrl: 'https://i.pravatar.cc/150?u=10',
    level: BleeterAccountLevel.LEVEL_MEMBER,
  },
  {
    id: 11,
    vrpId: 11,
    characterId: 11,
    profileName: 'Test User 11',
    avatarUrl: 'https://i.pravatar.cc/150?u=11',
    level: BleeterAccountLevel.LEVEL_MEMBER,
  },
  {
    id: 12,
    vrpId: 12,
    characterId: 12,
    profileName: 'Test User 12',
    avatarUrl: 'https://i.pravatar.cc/150?u=12',
    level: BleeterAccountLevel.LEVEL_MEMBER,
  },
  {
    id: 13,
    vrpId: 13,
    characterId: 13,
    profileName: 'Test User 13',
    avatarUrl: 'https://i.pravatar.cc/150?u=13',
    level: BleeterAccountLevel.LEVEL_MEMBER,
  },
  {
    id: 14,
    vrpId: 14,
    characterId: 14,
    profileName: 'Test User 14',
    avatarUrl: 'https://i.pravatar.cc/150?u=14',
    level: BleeterAccountLevel.LEVEL_ADMIN,
  },
];
