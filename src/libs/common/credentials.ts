import AsyncStorage from '@react-native-community/async-storage';
import dayjs from 'dayjs';
import jwtDecode from 'jwt-decode';
import {JWT} from '../interfaces';
import {constants} from './constants';

export const clearCredentials = async () => {
  try {
    await AsyncStorage.removeItem(constants.credentialsStorageKey);
    console.log('Successfully cleared credentials');
  } catch (e) {
    console.error(e);
  }
};

export const setCredentials = async (keys: any) => {
  try {
    await AsyncStorage.setItem(
      constants.credentialsStorageKey,
      JSON.stringify(keys),
    );
    console.log('Successfully seted credentials');
  } catch (e) {
    console.error(e);
  }
};

export const getCredentials = async () => {
  try {
    let credentials = await AsyncStorage.getItem(
      constants.credentialsStorageKey,
    );

    if (credentials != null) {
      return JSON.parse(credentials);
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const isTokenExpired = (token: string) => {
  const decoded = jwtDecode(token) as JWT;
  if (decoded.exp <= dayjs().unix()) {
    return true;
  } else {
    return false;
  }
};
