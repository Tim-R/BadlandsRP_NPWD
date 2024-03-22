import { useCurrentCallValue } from '@os/call/hooks/state';
import { useActiveNotifications } from '@os/new-notifications/state';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useSettings } from '../../../apps/settings/hooks/useSettings';
import { isEnvBrowser } from '../../../utils/misc';
import { phoneState } from './state';

export const usePhoneVisibility = () => {
  const visibility = useRecoilValue(phoneState.visibility);
  const [{ zoom }] = useSettings();
  const [notifVisibility, setNotifVisibility] = useState<boolean>(false);
  const currentCall = useCurrentCallValue();
  const notifications = useActiveNotifications();

  const hasNotis = currentCall || notifications.length;

  const longestNotification = notifications && notifications.length > 0 ? (notifications.reduce((a, b) => {
    let aLength = 0;
    let bLength = 0;

    if(typeof(a.content) == 'string') {
      aLength = (a.content as string).length;
    }

    if(typeof(b.content) == 'string') {
      bLength = (b.content as string).length;
    }

    return aLength > bLength ? a : b;
  }).content as string).length : 0;

  let lines = Math.min(4, Math.ceil(longestNotification / 45));

  useEffect(() => {
    if (hasNotis && !visibility) {
      setNotifVisibility(true);
    } else {
      setNotifVisibility(false);
    }
  }, [hasNotis, notifications, visibility]);

  const bottom = useMemo(() => {
    if (!visibility && !isEnvBrowser()) {
      let basePadding = -750;

      basePadding += (Math.max(0, lines - 2) * 40);

      return `${basePadding * zoom.value}px`; // was -750px
    }
    return '0px';
  }, [visibility, zoom, lines]);

  return {
    bottom,
    visibility: notifVisibility || visibility || isEnvBrowser(),
  };
};
