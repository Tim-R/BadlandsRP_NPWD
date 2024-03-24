import { Location, NamedLocation } from "./common";

export interface Advertisement {
  id: number,
  characterId: number,
  characterName: string,
  business?: string,
  body: string,
  bumpedAt: number,
  phone?: string,
  location?: Location,
}

export function deserializeAdvertisement(advertisement: Advertisement) {
  advertisement.location = NamedLocation.fromJson(advertisement.location);

  return advertisement;
}

export interface AdvertisementsConfig {
  priceInitial: number,
  priceBump: number,
  hideAfter: number,
  bumpFor: number,
  maxLength: number,
}

export interface AdvertisementProps {
  advertisement: Advertisement,
  actionHandler: (advertisement: Advertisement, action: string) => void,
}

export enum AdvertisementsEvents {
  FETCH_ADVERTISEMENTS = 'npwd:fetchAdvertisements',

  BUMP_AD = 'npwd:bumpAd',
  BUMP_AD_BROADCAST = 'npwd:bumpAdBroadcast',

  DELETE_AD = 'npwd:deleteAd',
  DELETE_AD_BROADCAST = 'npwd:deleteAdBroadcast',

  EDIT_AD = 'npwd:editAd',
  EDIT_AD_BROADCAST = 'npwd:editAdBroadcast',

  CREATE_AD = 'npwd:createAd',
  CREATE_AD_BROADCAST = 'npwd:createAdBroadcast',
}
