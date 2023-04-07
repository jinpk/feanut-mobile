/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './src/app';
import {name as appName} from './app.json';
import {constants} from './src/libs/common';
import PushNotification from 'react-native-push-notification';

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
}

AppRegistry.registerComponent(appName, () => App);
