/**
 * @format
 */

import {AppRegistry, Text, TextInput, Appearance} from 'react-native';
import App from './src/app';
import {name as appName} from './app.json';
import {colors, constants} from './src/libs/common';
import PushNotification from 'react-native-push-notification';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { StatusBar } from 'react-native';

if (constants.platform === 'ios') {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;

  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
} else {
  PushNotification.createChannel({
    channelId: 'feanut-android-notification-channel',
    channelName: 'Feanut Notification Channel',
    playSound: true,
    vibrate: true,
  });

  const colorScheme = Appearance.getColorScheme();
  if (colorScheme === 'light') {
    StatusBar.setBackgroundColor('#fff');
    StatusBar.setBarStyle('dark-content');
    changeNavigationBarColor(colors.white, true, true);
  }
}

AppRegistry.registerComponent(appName, () => App);
