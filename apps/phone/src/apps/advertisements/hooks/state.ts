import { Advertisement, AdvertisementsEvents } from "@typings/advertisements";
import { ServerPromiseResp } from "@typings/common";
import fetchNui from "@utils/fetchNui";
import { atom, selector, useRecoilValue } from "recoil";
import { buildRespObj } from "@utils/misc";
import { MockAdvertisements } from "@apps/messages/utils/constants";

export const advertisementsState = {
  advertisements: atom<Advertisement[]>({
    key: 'advertisements',
    default: selector({
      key: 'defaultAdvertisement',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<Advertisement[]>>(
            AdvertisementsEvents.FETCH_ADVERTISEMENTS,
            undefined,
            buildRespObj(MockAdvertisements),
          );
          return resp.data;
        } catch (e) {
          console.error(e);
          return [];
        }
      },
    }),
  }),

}

export const useAdvertisementsValue = () => useRecoilValue(advertisementsState.advertisements);
