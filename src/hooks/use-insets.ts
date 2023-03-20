import {useSafeAreaInsets} from 'react-native-safe-area-context';

export function useInsets() {
  const insets = useSafeAreaInsets();
  const topBarHeight = 50;

  return {
    topBarHeight,
    marginTop: insets.top,
    top: topBarHeight + insets.top,
  };
}
