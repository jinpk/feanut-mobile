import messaging from '@react-native-firebase/messaging';
import {useCallback, useEffect} from 'react';
import {NotificationAction, NotificationData} from '../libs/interfaces';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: false,
});

// 알림 수신과 클릭 처리만 담당
export function useFirebaseMessaging() {
  const handleNotification = useCallback((data: NotificationData) => {}, []);

  const requestUserPermission = useCallback(async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // 알림만 발송
      // 포그라운드 알림 클릭시 onNotificationOpenedApp 호출됨.
      console.log('foreground: ', remoteMessage);
      if (remoteMessage.data) {
        handleNotification({
          action: remoteMessage.data.action as NotificationAction,
          value: remoteMessage.data.value,
        });
      }
    });

    console.log('hi1');
    return () => {
      unsubscribe();
    };
  }, []);
}
