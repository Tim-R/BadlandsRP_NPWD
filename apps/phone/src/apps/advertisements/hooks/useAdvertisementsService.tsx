import { useNuiEvent } from "@common/hooks/useNuiEvent";
import { Advertisement, AdvertisementsEvents } from "@typings/advertisements";
import { APP_ADVERTISEMENTS } from "../utils/constants";
import { useCallback } from "react";
import { useAdvertisementsActions } from "./useAdvertisementsActions";
import { Location } from "@typings/common";
import { useSettings } from "@apps/settings/hooks/useSettings";
import { useNotifications } from "@os/notifications/hooks/useNotifications";
import { useApp } from "@os/apps/hooks/useApps";
import { INotification } from "@os/notifications/providers/NotificationsProvider";

const NOTIFICATION_ID = 'advertisements:broadcast';

export const useAdvertisementsService = () => {
  const { bumpAdvertisement, deleteAdvertisement, editAdvertisement, createAdvertisement } = useAdvertisementsActions();
  const [settings] = useSettings();
  const { addNotificationAlert } = useNotifications();
  const { icon, notificationIcon } = useApp('ADVERTISEMENTS');

  const handleBumpAdBroadcast = useCallback((adId: number) => {
    bumpAdvertisement(adId);
  }, [bumpAdvertisement]);

  const handleDeleteAdBroadcast = useCallback((adId: number) => {
    deleteAdvertisement(adId);
  }, [deleteAdvertisement]);

  const handleEditAdBroadcast = useCallback((data: { adId: number, business?: string, body: string, phone?: string, location?: Location }) => {
    editAdvertisement(data);
  }, [editAdvertisement]);

  const handleCreateAdBroadcast = useCallback((advertisement: Advertisement) => {
    createAdvertisement(advertisement);

    // Send push notification (or don't if it's turned off)
    if (!settings.ADVERTISEMENTS_notifyNewAdvertisement) return;

    const id = `${NOTIFICATION_ID}:${advertisement.id}`;

    const notification: INotification = {
      app: 'ADVERTISEMENTS',
      id,
      title: 'New Advertisement',
      content: advertisement.body,
      icon,
      notificationIcon,
    };

    addNotificationAlert(notification);
  }, [createAdvertisement]);

  useNuiEvent(APP_ADVERTISEMENTS, AdvertisementsEvents.BUMP_AD_BROADCAST, handleBumpAdBroadcast);
  useNuiEvent(APP_ADVERTISEMENTS, AdvertisementsEvents.DELETE_AD_BROADCAST, handleDeleteAdBroadcast);
  useNuiEvent(APP_ADVERTISEMENTS, AdvertisementsEvents.EDIT_AD_BROADCAST, handleEditAdBroadcast);
  useNuiEvent(APP_ADVERTISEMENTS, AdvertisementsEvents.CREATE_AD_BROADCAST, handleCreateAdBroadcast);
}
