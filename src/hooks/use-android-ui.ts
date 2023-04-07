import {NativeModules} from 'react-native';
import {UIModule as UIModuleI} from '../libs/interfaces';

const UIModule = NativeModules.UIModule as UIModuleI;

export function useAndroidUI() {
  const handleOffFullscreen = () => {
    UIModule.offFullscreen();
  };

  const handleOnFullscreen = () => {
    UIModule.onFullscreen();
  };

  return {
    onFullscreen: handleOnFullscreen,
    offFullscreen: handleOffFullscreen,
  };
}
