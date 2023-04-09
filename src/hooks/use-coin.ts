import {useCallback, useEffect} from 'react';
import {Alert} from 'react-native';
import {ErrorCode, requestPurchase} from 'react-native-iap';
import {getMyCoin} from '../libs/api/coin';
import {pngs} from '../libs/common';
import {CoinItem} from '../libs/interfaces';
import {useCoinStore, useModalStore, useUserStore} from '../libs/stores';

const data: CoinItem[] = [
  {
    amount: 5,
    icon: pngs.coin5,
    price: '₩1,100',
    productId: 'feanut.iap.coin.5',
  },
  {
    amount: 10,
    icon: pngs.coin10,
    price: '₩2,200',
    productId: 'feanut.iap.coin.10',
  },
  {
    amount: 30,
    icon: pngs.coin30,
    price: '₩5,500',
    productId: 'feanut.iap.coin.30',
  },
  {
    amount: 50,
    icon: pngs.coin50,
    price: '₩8,800',
    productId: 'feanut.iap.coin.50',
  },
  {
    amount: 100,
    icon: pngs.coin100,
    price: '₩15,000',
    productId: 'feanut.iap.coin.100',
  },
];

export function useCoin() {
  const amount = useCoinStore(s => s.amount);
  const logged = useUserStore(s => s.logged);
  const updateAmount = useCoinStore(s => s.actions.updateAmount);
  const openCoinModal = useModalStore(s => s.actions.openCoin);
  const setPending = useCoinStore(s => s.actions.setPending);
  const pending = useCoinStore(s => s.pending);

  const fetchCoinAmount = async () => {
    try {
      const data = await getMyCoin();
      updateAmount(data.total);
    } catch (error: any) {
      if (__DEV__) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (!logged) {
      return;
    }
    fetchCoinAmount();
  }, [logged]);

  const handlePurchase = useCallback(
    async (productId: string) => {
      if (pending) {
        return;
      }

      setPending(true);
      try {
        await requestPurchase({
          sku: productId,
          andDangerouslyFinishTransactionAutomaticallyIOS: false,
        });
      } catch (error: any) {
        if (
          error.code !== ErrorCode.E_DEFERRED_PAYMENT &&
          error.code !== ErrorCode.E_USER_CANCELLED
        ) {
          Alert.alert(error.message || error);
        }
        setPending(false);
      }
    },
    [pending],
  );

  return {
    amount,
    data,
    openPurchaseModal: openCoinModal,
    purchase: handlePurchase,
    fetchAmount: fetchCoinAmount,
    pending,
  };
}
