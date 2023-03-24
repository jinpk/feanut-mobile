import React from 'react';
import {useModalStore} from '../../libs/stores';
import {WelcomeModalTemplate} from '../../templates/welcome-modal';

export const WelcomeModalFeature = (): JSX.Element => {
  const visible = useModalStore(s => s.welcome);
  const close = useModalStore(s => s.actions.closeWelcome);

  return <WelcomeModalTemplate visible={visible} onClose={close} />;
};
