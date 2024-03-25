import { Advertisement, AdvertisementsEvents } from "@typings/advertisements";
import { ServerPromiseResp } from "@typings/common";
import fetchNui from "@utils/fetchNui";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { buildRespObj } from "@utils/misc";
import { MockAdvertisements } from "../utils/constants";
import usePlayerData from "@os/phone/hooks/usePlayerData";

export const advertisementsState = {
  advertisements: atom<Advertisement[]>({
    key: 'advertisements',
    default: selector({
      key: 'defaultAdvertisements',
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

  myAdvertisements: atom<Advertisement[]>({
    key: 'myAdvertisements',
    default: selector({
      key: 'defaultMyAdvertisements',
      get: async () => {
        const playerData = usePlayerData();

        try {
          const resp = await fetchNui<ServerPromiseResp<Advertisement[]>>(
            AdvertisementsEvents.FETCH_MY_ADVERTISEMENTS,
            undefined,
            buildRespObj(MockAdvertisements.filter(a => a.characterId == playerData.id)),
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

  page: atom({
    key: 'advertisementsPage',
    default: '/advertisements',
  }),
}

export const useMyAdvertisementsValue = () => useRecoilValue(advertisementsState.myAdvertisements);
export const useSetMyAdvertisements = () => useSetRecoilState(advertisementsState.myAdvertisements);

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

export const usePageValue = () => useRecoilValue(advertisementsState.page);
export const useSetPage = () => useSetRecoilState(advertisementsState.page);
