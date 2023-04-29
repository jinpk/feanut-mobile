import React from 'react';
import {useMessageModalStore} from '../libs/stores/message-modal';
import {MessageModalTemplate} from '../templates/modal';

export const MessageModal = (): JSX.Element => {
  const close = useMessageModalStore(s => s.actions.close);
  const visible = useMessageModalStore(s => s.open);
  const message = useMessageModalStore(s => s.message);
  const buttons = useMessageModalStore(s => s.buttons);
  const icon = useMessageModalStore(s => s.icon);

  return (
    <MessageModalTemplate
      visible={visible}
      message={message}
      buttons={buttons}
      icon={icon}
      onClose={close}
    />
  );
};
