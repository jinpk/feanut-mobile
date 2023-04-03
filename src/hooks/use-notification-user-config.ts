import messaging from '@react-native-firebase/messaging';
import {useCallback, useEffect, useState} from 'react';
import {
  getNotificationUserConfig,
  patchNotificationUserConfig,
} from '../libs/api/notification';
import {NotificationUserConfig} from '../libs/interfaces';
import {useUserStore} from '../libs/stores';

export function useNotificationUserConfig(tokenRefresh?: boolean) {
  const userId = useUserStore(s => s.user?.id);

  const [config, setConfig] = useState<NotificationUserConfig>({
    receivePoll: false,
    receivePull: false,
  });

  useEffect(() => {
    if (userId && tokenRefresh) {
      const remove = messaging().onTokenRefresh(token => {
        // 갱신되면 업데이트
        patchNotificationUserConfig(userId, {fcmToken: token});
      });

      return () => {
        remove();
      };
    }
  }, [userId]);

  // 알림 조회
  useEffect(() => {
    if (userId) {
      getNotificationUserConfig(userId).then(config => {
        setConfig({
          receivePoll: config.receivePoll,
          receivePull: config.receivePull,
        });

        messaging()
          .requestPermission()
          .then(authStatus => {
            const enabled =
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
              messaging()
                .getToken()
                .then(token => {
                  // 다른 경우만 업데이트
                  if (token !== config.fcmToken) {
                    patchNotificationUserConfig(userId, {fcmToken: token});
                  }
                });
            } else {
              // 권한 설정해 주세요
            }
          });
      });
    }
  }, [userId]);

  const handleChangePoll = useCallback(
    (state: boolean) => {
      if (!userId) {
        return;
      }
      patchNotificationUserConfig(userId, {receivePoll: state}).then(() => {
        setConfig(prev => ({...prev, receivePoll: state}));
      });
    },
    [userId],
  );

  const handleChangePull = useCallback(
    (state: boolean) => {
      if (!userId) {
        return;
      }
      patchNotificationUserConfig(userId, {receivePull: state}).then(() => {
        setConfig(prev => ({...prev, receivePull: state}));
      });
    },
    [userId],
  );

  return {
    config,
    changePull: handleChangePull,
    changePoll: handleChangePoll,
  };
}
