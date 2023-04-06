import React from 'react';
import {useModalStore} from '../libs/stores';
import {GuideModalTemplate} from '../templates/modal/guide';

export const GuideModal = (): JSX.Element => {
  const visible = useModalStore(s => s.guide);
  const close = useModalStore(s => s.actions.closeGuide);

  return <GuideModalTemplate visible={visible} onClose={close} />;
};
