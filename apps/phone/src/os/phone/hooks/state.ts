import { atom } from 'recoil';
import { ResourceConfig } from '@typings/config';
import { PhonePlayerData } from '@typings/phone';

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
    default: null,
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
};
