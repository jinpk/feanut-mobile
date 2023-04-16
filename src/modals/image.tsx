import React, {useEffect} from 'react';
import {useModalStore} from '../libs/stores';
import {ImageModalTemplate} from '../templates/modal/image';
import {StatusBar} from 'react-native';

export const ImageModal = (): JSX.Element => {
  const visible = useModalStore(s => s.image);
  const source = useModalStore(s => s.imageSource);
  const close = useModalStore(s => s.actions.closeImage);

  useEffect(() => {
    if (visible) {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
  }, [visible]);

  return (
    <ImageModalTemplate source={source} visible={visible} onClose={close} />
  );
};
