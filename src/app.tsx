import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors, constants, routes, setUser} from './libs/common';
import Home from './pages/home';
import {useUserStore} from './libs/stores';
import {CoinModal, MessageModal, WelcomeModal} from './modals';
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
import {GuideModal} from './modals/guide';
import NetInfo from '@react-native-community/netinfo';
import {Alert, Appearance, StatusBar, View} from 'react-native';
import {VersionCheckerModal} from './modals/version-checker';
import {WebviewModal} from './modals/webview';
import {ImageModal} from './modals/image';
import Setting from './pages/setting';
import SignUpSchool from './pages/signup/school';
import SignUpGrade from './pages/signup/grade';

PushNotification.configure({
  onNotification: notification => {
    if (constants.platform === 'android' && notification.foreground) {
      if (notification['channelId'] !== 'feanut-android-notification-channel') {
        return;
      }
    }

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

  // 로그인후 사용자 정보 받아오면 로컬 스토리지에 업데이트
  const user = useUserStore(state => state.user);
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  useEffect(() => {
    checkLogin();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        title: remoteMessage.notification?.title,
        message: remoteMessage.notification?.body as string,
        userInfo: remoteMessage.data,
        ...(constants.platform === 'android' && {
          channelId: 'feanut-android-notification-channel',
        }),
      });
    });

    let internetConnected = false;
    const unsubscribe2 = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        if (internetConnected) return;
        Alert.alert('오프라인 상태입니다.', '인터넷에 연결을 확인해 주세요', [
          {text: '확인'},
        ]);
        internetConnected = true;
      } else {
        internetConnected = false;
      }
    });

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  useEffect(() => {
    if (constants.platform === 'android') {
      const colorScheme = Appearance.getColorScheme();
      if (colorScheme === 'light') {
        StatusBar.setBackgroundColor('#fff');
        StatusBar.setBarStyle('dark-content');
      }
    }
  }, []);

  if (loginLoading) {
    return <View style={{flex: 1, backgroundColor: colors.white}} />;
  }

  return (
    <NavigationContainer>
      {logged && (
        <Stack.Navigator
          initialRouteName={routes.home}
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name={routes.home} component={Home} />
          <Stack.Screen name={routes.inbox} component={Inbox} />
          <Stack.Screen name={routes.inboxDetail} component={InboxDetail} />
          <Stack.Screen name={routes.feanutCard} component={FeanutCard} />
          <Stack.Screen name={routes.profile} component={Profile} />
          <Stack.Screen name={routes.profileEdit} component={ProfileEdit} />
          <Stack.Screen name={routes.setting} component={Setting} />

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
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name={routes.start} component={Start} />
          <Stack.Screen
            name={routes.signup}
            component={SignUp}
            options={{
              //  회원가입 정보 입력 도중 뒤로 나가지는 불편 예방
              gestureEnabled: false,
            }}
          />
          <Stack.Screen name={routes.signupSchool} component={SignUpSchool} />
          <Stack.Screen name={routes.signupGrade} component={SignUpGrade} />
          <Stack.Screen
            name={routes.verification}
            component={Verification}
            options={{
              gestureEnabled: false,
            }}
          />
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
      <GuideModal />
      <ImageModal />
      <WebviewModal />
      <WelcomeModal />
      <CoinModal />
      <VersionCheckerModal />
      <MessageModal />
    </SafeAreaProvider>
  );
}

export default FeanutApp;
