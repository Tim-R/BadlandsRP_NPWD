import { useSettingsValue } from '@apps/settings/hooks/useSettings';
import { Advertisement } from '@typings/advertisements';
import { useNotification } from '@os/new-notifications/useNotification';

export const useAdvertisementsNotifications = () => {
  const { ADVERTISEMENTS_notifyNewAdvertisement } = useSettingsValue();
  const { enqueueNotification } = useNotification();

  const setNotification = (advertisement: Advertisement) => {
    if (!ADVERTISEMENTS_notifyNewAdvertisement) return;

    let posterName = advertisement.business ?? advertisement.characterName;

    enqueueNotification({
      appId: 'ADVERTISEMENTS',
      content: advertisement.body,
      secondaryTitle: posterName,
      duration: 5000,
      keepOpen: false,
      path: '/advertisements',
      notisId: `npwd:advertisements:${advertisement.id}`,
    });
  };

  return { setNotification };
};
