import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import routes from './libs/routes';
import Login from './pages/login';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './pages/home';
import LoginEmail from './pages/login/email';
import LoginEmailVerification from './pages/login/email/verification';
import Welcome from './pages/welcome';

type AppProps = React.PropsWithChildren<{}>;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Main() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={routes.home} component={Home} />
      <Tab.Screen name={routes.profile} component={Home} />
      <Tab.Screen name={routes.inbox} component={Home} />
    </Tab.Navigator>
  );
}

function AuthStack(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={routes.login} component={Login} />
      <Stack.Screen name={routes.loginEmail} component={LoginEmail} />
      <Stack.Screen
        name={routes.loginEmailVerification}
        component={LoginEmailVerification}
      />
      <Stack.Screen name={routes.welcome} component={Welcome} />
    </Stack.Navigator>
  );
}

function NavigationApp() {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}

function FeanutApp(props: AppProps): JSX.Element {
  return <NavigationApp />;
}

export default FeanutApp;
