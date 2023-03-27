import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {routes} from './libs/common';
import Login from './pages/login';
import Home from './pages/home';
import {useUserStore} from './libs/stores';
import {Text} from './components/text';
import {CoinModal, WelcomeModal} from './modals';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Inbox from './pages/inbox';
import Profile from './pages/profile';
import SignUp from './pages/signup';
import ResetPassword from './pages/reset-password';
import ProfileEdit from './pages/profile/edit';
import {
  useCoin,
  useFirebaseMessaging,
  useNotificationUserConfig,
} from './hooks';
import Friend from './pages/friend';

type AppProps = React.PropsWithChildren<{}>;

const Stack = createNativeStackNavigator();

function NavigationApp() {
  useFirebaseMessaging();
  useCoin(true);
  useNotificationUserConfig(true);
  const logged = useUserStore(state => state.logged);
  const loginLoading = useUserStore(state => state.loading);
  const checkLogin = useUserStore(state => state.actions.check);

  useEffect(() => {
    checkLogin();
  }, []);

  if (loginLoading) {
    return <Text mt={100}>Checking credidental...</Text>;
  }

  return (
    <NavigationContainer>
      {logged && (
        <Stack.Navigator
          initialRouteName={routes.home}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name={routes.home} component={Home} />
          <Stack.Screen name={routes.inbox} component={Inbox} />
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
        </Stack.Navigator>
      )}
      {!logged && (
        <Stack.Navigator
          initialRouteName={routes.login}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name={routes.login} component={Login} />
          <Stack.Screen name={routes.signup} component={SignUp} />
          <Stack.Screen name={routes.resetPassword} component={ResetPassword} />
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
