import React, {memo, useEffect} from 'react';
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors, constants, routes, setUser, svgs} from './libs/common';
import Home from './pages/home';
import {useUserStore} from './libs/stores';
import {
  CoinModal,
  LegacyFriendshipModal,
  MessageModal,
  WelcomeModal,
} from './modals';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Inbox from './pages/inbox';
import Profile from './pages/profile';
import SignUp from './pages/signup';
import ProfileEdit from './pages/profile/edit';
import {
  useIAP,
  useInitEmoji,
  useLegacyFriendship,
  useNotificationUserConfig,
} from './hooks';
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
import ProfileEditSchool from './pages/profile/school';
import ProfileEditGrade from './pages/profile/grade';
import FriendHidden from './pages/friend/hidden';
import InboxEdit from './pages/inbox/edit';
import SignUpFriend from './pages/signup/friend';
import {useDynamicLinkStore} from './libs/stores/dynamic-link';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBar from './components/tabbar';

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
const Tab = createBottomTabNavigator();

function NavigationApp() {
  useIAP();
  useInitEmoji();
  useNotificationUserConfig(true);
  // 친구 추가 방법 변경전 기존회원 친구 초기화 기능 제공
  useLegacyFriendship();

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

  /** 파이어베이스 다이나믹 링크 */
  const setDynamicLink = useDynamicLinkStore(s => s.actions.set);
  useEffect(() => {
    const handleLink = (link: FirebaseDynamicLinksTypes.DynamicLink | null) => {
      if (link && link.url) {
        setDynamicLink(link.url);
      }
    };
    dynamicLinks().getInitialLink().then(handleLink);
    const unsubscribe = dynamicLinks().onLink(handleLink);
    return () => unsubscribe();
  }, []);

  if (loginLoading) {
    return <View style={{flex: 1, backgroundColor: colors.white}} />;
  }

  return (
    <NavigationContainer>
      <>
        {logged && <MainStack />}
        {!logged && <AuthStacks />}
        <LegacyFriendshipModal />
      </>
    </NavigationContainer>
  );
}

const MainStack = memo(() => {
  return (
    <Stack.Navigator
      initialRouteName={routes.mainTabs}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={routes.mainTabs} component={MainTabs} />
      <Stack.Screen name={routes.inboxDetail} component={InboxDetail} />
      <Stack.Screen name={routes.profile} component={Profile} />
      <Stack.Screen name={routes.setting} component={Setting} />
      <Stack.Screen name={routes.deleteMe} component={DeleteMe} />

      <Stack.Screen name={routes.feanutCard} component={FeanutCard} />
      <Stack.Screen name={routes.profileEdit} component={ProfileEdit} />
      <Stack.Screen
        name={routes.profileEditSchool}
        component={ProfileEditSchool}
      />
      <Stack.Screen
        name={routes.profileEditGrade}
        component={ProfileEditGrade}
      />
    </Stack.Navigator>
  );
});

const MainTabs = memo(function () {
  return (
    <Tab.Navigator
      initialRouteName={routes.homeStack}
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
      tabBar={props => <TabBar {...props} />}>
      <Tab.Screen
        options={{
          tabBarIcon: svgs.tabHome,
          tabBarLabel: '투표',
        }}
        name={routes.homeStack}
        component={HomeStacks}
      />
      <Tab.Screen
        options={{
          tabBarIcon: svgs.tabInbox,
          tabBarLabel: '수신함',
        }}
        name={routes.inboxStack}
        component={InboxStacks}
      />
      <Tab.Screen
        options={{
          tabBarIcon: svgs.tabProfile,
          tabBarLabel: '친구',
        }}
        name={routes.friendStack}
        component={FriendStacks}
      />
      <Tab.Screen
        options={{
          tabBarIcon: svgs.tabFriend,
          tabBarLabel: '프로필',
        }}
        name={routes.profileTab}
        component={Profile}
      />
    </Tab.Navigator>
  );
});

const AuthStacks = memo(function () {
  return (
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
      <Stack.Screen name={routes.signupFriend} component={SignUpFriend} />
      <Stack.Screen
        name={routes.verification}
        component={Verification}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
});

function HomeStacks() {
  return (
    <Stack.Navigator
      initialRouteName={routes.home}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={routes.home} component={Home} />
      <Stack.Screen name={routes.inboxDetail} component={InboxDetail} />
    </Stack.Navigator>
  );
}

function InboxStacks() {
  return (
    <Stack.Navigator
      initialRouteName={routes.inbox}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={routes.inbox} component={Inbox} />
      <Stack.Screen name={routes.inboxEdit} component={InboxEdit} />
    </Stack.Navigator>
  );
}

function FriendStacks() {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    navigation.navigate(routes.friend, route.params);
  }, [route.params]);

  return (
    <Stack.Navigator
      initialRouteName={routes.friend}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={routes.friend} component={Friend} />
      <Stack.Screen name={routes.friendHidden} component={FriendHidden} />
    </Stack.Navigator>
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
