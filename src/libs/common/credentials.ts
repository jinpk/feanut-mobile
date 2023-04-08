import AsyncStorage from '@react-native-community/async-storage';
import dayjs from 'dayjs';
import jwtDecode from 'jwt-decode';
import {JWT, User} from '../interfaces';
import {constants} from './constants';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const clearUser = async () => {
  try {
    await AsyncStorage.removeItem(constants.userStorageKey);
    console.log('claer user');
  } catch (e) {
    console.error(e);
  }
};

export const setUser = async (user: User) => {
  try {
    await AsyncStorage.setItem(constants.userStorageKey, JSON.stringify(user));
    console.log('set user');
  } catch (e) {
    console.error(e);
  }
};

export const getUserFromStorage = async () => {
  try {
    let user = await AsyncStorage.getItem(constants.userStorageKey);

    if (user != null) {
      return JSON.parse(user) as User;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

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
