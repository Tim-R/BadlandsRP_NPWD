import { advertisementsState, useSetAdvertisements } from './state';
import { useCallback } from 'react';
import { Snapshot, useRecoilCallback } from 'recoil';
import { Advertisement } from '@typings/advertisements';
import { Location } from '@typings/common';

interface AdvertisementsActionProps {
  bumpAdvertisement: (adId: number) => void;
  deleteAdvertisement: (adId: number) => void;
  editAdvertisement: (data: { adId: number, business?: string, body: string, phone?: string, location?: Location }) => void;
  createAdvertisement: (advertisement: Advertisement) => void;
}

const getAreAdsLoading = (snapshot: Snapshot) => snapshot.getLoadable<Advertisement[]>(advertisementsState.advertisements).state !== 'hasValue';

export const useAdvertisementsActions = (): AdvertisementsActionProps => {
  const setAdvertisements = useSetAdvertisements();

  const bumpAdvertisement = useCallback(
    (adId: number) => {
      setAdvertisements((curVal) =>
        [...curVal].map((advertisement) => {
          if (advertisement.id === adId) {
            return {
              ...advertisement,
              bumpedAt: Math.floor(Date.now() / 1000)
            };
          }

          return advertisement;
        }),
      );
    },
    [setAdvertisements]
  );

  const deleteAdvertisement = useRecoilCallback(({ snapshot, set }) => (adId: number) => {
    const adsLoading = getAreAdsLoading(snapshot);

    if (adsLoading) return;

    set(advertisementsState.advertisements, (curVal) => [...curVal].filter((a) => a.id !== adId));
  }, [setAdvertisements]);

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
    },
    [setAdvertisements]
  );

  const createAdvertisement = useRecoilCallback(({ snapshot, set}) => async (advertisement: Advertisement) => {
    const adsLoading = getAreAdsLoading(snapshot);

    if (adsLoading) return;

    set(advertisementsState.advertisements, (curVal) => [advertisement, ...curVal]);
  }, [setAdvertisements]);

  return {
    bumpAdvertisement,
    deleteAdvertisement,
    editAdvertisement,
    createAdvertisement
  };
};
