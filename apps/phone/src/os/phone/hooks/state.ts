import { atom } from 'recoil';
import { ResourceConfig } from '@typings/config';
import { PhonePlayerData } from '@typings/phone';

export const MockPlayerData: PhonePlayerData = {
  id: 0,
  vrp: 0,
  groups: [
    'staff',
    'moderator',
  ],
  permissions: [],
  aptitudes: [],
  businesses: [
    {
      name: 'A Business',
      id: 1,
      permissions: [
        'manage'
      ]
    },
    {
      name: 'B Business',
      id: 2,
      permissions: [
        'fire'
      ]
    },
  ]
}

export const phoneState = {
  visibility: atom<boolean>({
    key: 'phoneVisibility',
    default: false,
  }),
  resourceConfig: atom<ResourceConfig>({
    key: 'resourceConfig',
    default: null,
  }),
  phoneTime: atom<string>({
    key: 'phoneTime',
    default: null,
  }),
  playerData: atom<PhonePlayerData>({
    key: 'playerData',
    default: MockPlayerData,
  }),
  isPhoneDisabled: atom<boolean>({
    key: 'isPhoneDisabled',
    default: false,
  }),
  playerSource: atom<number>({
    key: 'playerSource',
    default: 0,
  }),
  playerIdentifier: atom<string>({
    key: 'playerIdentifier',
    default: null,
  }),
  extApps: atom({
    key: 'phoneExtApps',
    default: [],
  }),

  /* Staff permissions */
  permissionsComputed: atom({
    key: 'permissionsComputed',
    default: false,
  }),

  isSupportStaffOrGreater: atom({
    key: 'isSupportStaffOrGreater',
    default: false,
  }),

  isModeratorOrGreater: atom({
    key: 'isModeratorOrGreater',
    default: false,
  }),

  isAdminOrGreater: atom({
    key: 'isAdminOrGreater',
    default: false,
  }),

  isSuperadminOrGreater: atom({
    key: 'isSuperadminOrGreater',
    default: false,
  }),
};
