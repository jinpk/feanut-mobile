import React from 'react';
import {useCoin} from '../hooks';
import {useModalStore} from '../libs/stores';
import {CoinModalTemplate} from '../templates/modal';

export const CoinModal = (): JSX.Element => {
  const visible = useModalStore(s => s.coin);
  const close = useModalStore(s => s.actions.closeCoin);
  const coin = useCoin();

  return (
    <CoinModalTemplate
      visible={visible}
      onClose={close}
      onPurchase={coin.purchase}
      data={coin.data}
    />
  );
};
