import { useNuiEvent } from "@common/hooks/useNuiEvent";
import { Advertisement, AdvertisementsEvents } from "@typings/advertisements";
import { APP_ADVERTISEMENTS } from "../utils/constants";
import { useCallback } from "react";
import { useAdvertisementsActions } from "./useAdvertisementsActions";
import { Location } from "@typings/common";
import { useAdvertisementsNotifications } from "./useAdvertisementsNotifications";
import { useSettingsValue } from "@apps/settings/hooks/useSettings";

export const useAdvertisementsService = () => {
  const { bumpAdvertisement, deleteAdvertisement, editAdvertisement, createAdvertisement } = useAdvertisementsActions();
  const { setNotification } = useAdvertisementsNotifications();
  const { ADVERTISEMENTS_notifyNewAdvertisement } = useSettingsValue();

  const handleBumpAdBroadcast = useCallback((advertisement: Advertisement) => {
    bumpAdvertisement(advertisement);
  }, [bumpAdvertisement]);

  const handleDeleteAdBroadcast = useCallback((adId: number) => {
    deleteAdvertisement(adId);
  }, [deleteAdvertisement]);

  const handleEditAdBroadcast = useCallback((data: { adId: number, business?: string, body: string, phone?: string, location?: Location }) => {
    editAdvertisement(data);
  }, [editAdvertisement]);

  const handleCreateAdBroadcast = useCallback((advertisement: Advertisement) => {
    createAdvertisement(advertisement);
    setNotification(advertisement);
  }, [createAdvertisement, ADVERTISEMENTS_notifyNewAdvertisement]);

  useNuiEvent(APP_ADVERTISEMENTS, AdvertisementsEvents.BUMP_AD_BROADCAST, handleBumpAdBroadcast);
  useNuiEvent(APP_ADVERTISEMENTS, AdvertisementsEvents.DELETE_AD_BROADCAST, handleDeleteAdBroadcast);
  useNuiEvent(APP_ADVERTISEMENTS, AdvertisementsEvents.EDIT_AD_BROADCAST, handleEditAdBroadcast);
  useNuiEvent(APP_ADVERTISEMENTS, AdvertisementsEvents.CREATE_AD_BROADCAST, handleCreateAdBroadcast);
}
