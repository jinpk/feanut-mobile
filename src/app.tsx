import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {routes} from './libs/common';
import Login from './pages/login';
import Home from './pages/home';
import {useUserStore} from './libs/stores';
import {Text} from './components/text';
import {WelcomeModalFeature} from './features/modals';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Inbox from './pages/inbox';
import Profile from './pages/profile';
import SignUp from './pages/signup';
import ResetPassword from './pages/reset-password';

type AppProps = React.PropsWithChildren<{}>;

const Stack = createNativeStackNavigator();

function NavigationApp() {
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
      <WelcomeModalFeature />
    </SafeAreaProvider>
  );
}

export default FeanutApp;
