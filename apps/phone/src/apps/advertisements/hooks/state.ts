import { Advertisement, AdvertisementsEvents } from "@typings/advertisements";
import { ServerPromiseResp } from "@typings/common";
import fetchNui from "@utils/fetchNui";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { buildRespObj } from "@utils/misc";
import { MockAdvertisements } from "../utils/constants";

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

  modalText: atom({
    key: 'advertisementsModalText',
    default: '',
  }),

  modalAcceptText: atom({
    key: 'advertisementsModalAcceptText',
    default: '',
  }),

  modalAction: atom({
    key: 'advertisementsModalAction',
    default: '',
  }),

  modalOpen: atom({
    key: 'advertisementsModalOpen',
    default: false,
  }),
}

export const useAdvertisementsValue = () => useRecoilValue(advertisementsState.advertisements);
export const useSetAdvertisements = () => useSetRecoilState(advertisementsState.advertisements);

export const useModalTextValue = () => useRecoilValue(advertisementsState.modalText);
export const useSetModalText = () => useSetRecoilState(advertisementsState.modalText);

export const useModalAcceptTextValue = () => useRecoilValue(advertisementsState.modalAcceptText);
export const useSetModalAcceptText = () => useSetRecoilState(advertisementsState.modalAcceptText);

export const useModalAction = () => useRecoilValue(advertisementsState.modalAction);
export const useSetModalAction = () => useSetRecoilState(advertisementsState.modalAction);

export const useModalOpenValue = () => useRecoilValue(advertisementsState.modalOpen);
export const useSetModalOpen = () => useSetRecoilState(advertisementsState.modalOpen);
