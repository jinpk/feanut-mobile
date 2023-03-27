/**
 * @format
 */

import {AppRegistry, Text, TextInput} from 'react-native';
import App from './src/app';
import {name as appName} from './app.json';

TextInput.defaultProps = {};
TextInput.defaultProps.allowFontScaling = false;

Text.defaultProps = {};
Text.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => App);