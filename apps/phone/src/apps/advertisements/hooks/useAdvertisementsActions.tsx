import { advertisementsState, useSetAdvertisements, useSetMyAdvertisements } from './state';
import { useCallback } from 'react';
import { Snapshot, useRecoilCallback } from 'recoil';
import { Advertisement } from '@typings/advertisements';
import { Location } from '@typings/common';
import usePlayerData from '@os/phone/hooks/usePlayerData';

interface AdvertisementsActionProps {
  bumpAdvertisement: (advertisement: Advertisement) => void;
  deleteAdvertisement: (adId: number) => void;
  editAdvertisement: (data: { adId: number, business?: string, body: string, phone?: string, location?: Location }) => void;
  createAdvertisement: (advertisement: Advertisement) => void;
}

const getAreAdsLoading = (snapshot: Snapshot) => snapshot.getLoadable<Advertisement[]>(advertisementsState.advertisements).state !== 'hasValue';
const getAreMyAdsLoading = (snapshot: Snapshot) => snapshot.getLoadable<Advertisement[]>(advertisementsState.myAdvertisements).state !== 'hasValue';

export const useAdvertisementsActions = (): AdvertisementsActionProps => {
  const setAdvertisements = useSetAdvertisements();
  const setMyAdvertisements = useSetMyAdvertisements();

  const bumpAdvertisement = useCallback(
    (advertisement: Advertisement) => {
      setAdvertisements((curVal) => {
        let newVal = [...curVal];
        let exists = newVal.some(a => a.id == advertisement.id);

        if(!exists) {
          return [advertisement, ...newVal];
        }

        return newVal.map((a) => {
          if (a.id === advertisement.id) {
            return {
              ...a,
              bumpedAt: Math.floor(Date.now() / 1000)
            };
          }

          return a;
        })
      });

      setMyAdvertisements((curVal) => {
        let newVal = [...curVal];
        let exists = newVal.some(a => a.id == advertisement.id);

        if(!exists) {
          return [advertisement, ...newVal];
        }

        return newVal.map((a) => {
          if (a.id === advertisement.id) {
            return {
              ...a,
              bumpedAt: Math.floor(Date.now() / 1000)
            };
          }

          return a;
        })
      });
    },
    [setAdvertisements, setMyAdvertisements]
  );

  const deleteAdvertisement = useRecoilCallback(({ snapshot, set }) => (adId: number) => {
    if(!getAreAdsLoading(snapshot)) {
      set(advertisementsState.advertisements, (curVal) => [...curVal].filter((a) => a.id !== adId));
    }

    if(!getAreMyAdsLoading(snapshot)) {
      set(advertisementsState.myAdvertisements, (curVal) => [...curVal].filter((a) => a.id !== adId));
    }
  }, [setAdvertisements, setMyAdvertisements]);

  const editAdvertisement = useCallback(
    (data: { adId: number, business?: string, body: string, phone?: string, location?: Location }) => {
      setAdvertisements((curVal) =>
        [...curVal].map((advertisement) => {
          if (advertisement.id === data.adId) {
            return {
              ...advertisement,
              business: data.business,
              body: data.body,
              phone: data.phone,
              location: data.location,
            };
          }

          return advertisement;
        }),
      );

      setMyAdvertisements((curVal) =>
        [...curVal].map((advertisement) => {
          if (advertisement.id === data.adId) {
            return {
              ...advertisement,
              business: data.business,
              body: data.body,
              phone: data.phone,
              location: data.location,
            };
          }

          return advertisement;
        }),
      );
    },
    [setAdvertisements, setMyAdvertisements]
  );

  const createAdvertisement = useRecoilCallback(({ snapshot, set}) => async (advertisement: Advertisement) => {
    if(!getAreAdsLoading(snapshot)) {
      set(advertisementsState.advertisements, (curVal) => [advertisement, ...curVal]);
    }

    if(!getAreMyAdsLoading(snapshot)) {
      set(advertisementsState.myAdvertisements, (curVal) => [advertisement, ...curVal]);
    }
  }, [setAdvertisements, useSetMyAdvertisements]);

  return {
    bumpAdvertisement,
    deleteAdvertisement,
    editAdvertisement,
    createAdvertisement
  };
};
