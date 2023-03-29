import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {constants} from '../libs/common';

export function useHandleBack(callback: () => void) {
  useEffect(() => {
    if (constants.platform === 'android') {
      const listener = () => {
        callback();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', listener);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', listener);
      };
    }
  }, [callback]);
}
