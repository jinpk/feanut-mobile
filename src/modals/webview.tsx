import React from 'react';
import {useModalStore} from '../libs/stores';
import {WebviewModalTemplate} from '../templates/modal/webview';

export const WebviewModal = (): JSX.Element => {
  const visible = useModalStore(s => s.webview);
  const uri = useModalStore(s => s.webviewURI);
  const close = useModalStore(s => s.actions.closeWebview);

  return <WebviewModalTemplate visible={visible} onClose={close} uri={uri} />;
};
