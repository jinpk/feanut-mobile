import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

export function useKeyboardShown() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const showListener = (e: KeyboardEvent) => {
      setShown(true);
    };

    const hideListener = (e: KeyboardEvent) => {
      setShown(false);
    };

    const li1 = Keyboard.addListener('keyboardDidShow', showListener);
    const li2 = Keyboard.addListener('keyboardDidHide', hideListener);

    const li3 = Keyboard.addListener('keyboardWillShow', showListener);
    const li4 = Keyboard.addListener('keyboardWillHide', hideListener);

    return () => {
      li1.remove();
      li2.remove();
      li3.remove();
      li4.remove();
    };
  }, []);

  return shown;
}
