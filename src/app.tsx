import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {constants, routes} from './libs/common';
import Home from './pages/home';
import {useUserStore} from './libs/stores';
import {CoinModal, WelcomeModal} from './modals';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Inbox from './pages/inbox';
import Profile from './pages/profile';
import SignUp from './pages/signup';
import ProfileEdit from './pages/profile/edit';
import {useIAP, useInitEmoji, useNotificationUserConfig} from './hooks';
import Friend from './pages/friend';
import DeleteMe from './pages/delete-me';
import FeanutCard from './pages/feanut-card';
import InboxDetail from './pages/inbox/detail';
import PushNotification from 'react-native-push-notification';
import {NotificationAction} from './libs/interfaces';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import Start from './pages/start';
import Verification from './pages/verification';

PushNotification.configure({
  onNotification: notification => {
    const data = {
      action: notification.data.action as NotificationAction,
      value: notification.data.value,
    };
    useUserStore.setState(prev => ({
      ...prev,
      notification: data,
    }));
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: false,
});

type AppProps = React.PropsWithChildren<{}>;

const Stack = createNativeStackNavigator();

function NavigationApp() {
  useIAP();
  useInitEmoji();
  useNotificationUserConfig(true);
  const logged = useUserStore(state => state.logged);
  const loginLoading = useUserStore(state => state.loading);
  const checkLogin = useUserStore(state => state.actions.check);

  useEffect(() => {
    checkLogin();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body as string,
        userInfo: remoteMessage.data,
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (loginLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {logged && (
        <Stack.Navigator
          initialRouteName={routes.home}
          screenOptions={{
            headerShown: false,
            animation:
              constants.platform === 'android' ? 'fade_from_bottom' : 'default',
          }}>
          <Stack.Screen name={routes.home} component={Home} />
          <Stack.Screen name={routes.inbox} component={Inbox} />
          <Stack.Screen name={routes.inboxDetail} component={InboxDetail} />
          <Stack.Screen name={routes.feanutCard} component={FeanutCard} />
          <Stack.Screen name={routes.profile} component={Profile} />
          <Stack.Screen name={routes.profileEdit} component={ProfileEdit} />
          <Stack.Screen
            name={routes.friend}
            initialParams={{hidden: false}}
            component={Friend}
          />
          <Stack.Screen
            name={routes.friendHidden}
            initialParams={{hidden: true}}
            component={Friend}
          />
          <Stack.Screen name={routes.deleteMe} component={DeleteMe} />
        </Stack.Navigator>
      )}
      {!logged && (
        <Stack.Navigator
          initialRouteName={routes.start}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name={routes.start} component={Start} />
          {
            //              <Stack.Screen name={routes.login} component={Login} />
          }
          <Stack.Screen name={routes.signup} component={SignUp} />
          <Stack.Screen name={routes.verification} component={Verification} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function FeanutApp(props: AppProps): JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationApp />
      {/** Modals */}
      <WelcomeModal />
      <CoinModal />
    </SafeAreaProvider>
  );
}

export default FeanutApp;
