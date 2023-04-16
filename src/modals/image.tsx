import React, {useEffect} from 'react';
import {useModalStore} from '../libs/stores';
import {ImageModalTemplate} from '../templates/modal/image';
import {StatusBar, useColorScheme} from 'react-native';
import {colors, constants} from '../libs/common';

export const ImageModal = (): JSX.Element => {
  const visible = useModalStore(s => s.image);
  const source = useModalStore(s => s.imageSource);
  const close = useModalStore(s => s.actions.closeImage);
  const schema = useColorScheme();
  useEffect(() => {
    if (visible) {
      StatusBar.setBarStyle('light-content');
      return () => {
        if (schema !== 'dark') {
          StatusBar.setBarStyle('dark-content');
        }
      };
    }
  }, [visible]);

  return (
    <ImageModalTemplate source={source} visible={visible} onClose={close} />
  );
};
