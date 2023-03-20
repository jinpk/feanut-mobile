import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import routes from './libs/routes';
import Login from './pages/login';
import Home from './pages/home';
import LoginEmail from './pages/login/email';
import LoginEmailVerification from './pages/login/email/verification';
import {useUserStore} from './store';
import {Text} from './components/text';
import WelcomeModal from './modals/welcome';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Inbox from './pages/inbox';
import {View} from 'react-native';
import Profile from './pages/profile';

type AppProps = React.PropsWithChildren<{}>;

const Stack = createNativeStackNavigator();

function NavigationApp() {
  const logged = useUserStore(state => state.logged);
  const loginLoading = useUserStore(state => state.loading);
  const checkLogin = useUserStore(state => state.actions.check);

  useEffect(() => {
    let tm = setTimeout(() => {
      checkLogin();
    }, 1000);
    return () => {
      clearTimeout(tm);
    };
  }, []);

  if (loginLoading) {
    return <Text mt={100}>auth checking...</Text>;
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
          <Stack.Screen name={routes.loginEmail} component={LoginEmail} />
          <Stack.Screen
            name={routes.loginEmailVerification}
            component={LoginEmailVerification}
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
      <WelcomeModal />
    </SafeAreaProvider>
  );
}

export default FeanutApp;
