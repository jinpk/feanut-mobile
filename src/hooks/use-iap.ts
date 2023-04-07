import {useEffect} from 'react';
import {Alert} from 'react-native';
import {
  ErrorCode,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getProducts,
  initConnection,
  ProductPurchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import {getMyCoin, postPurchaseCoin} from '../libs/api/coin';
import {constants, pngs} from '../libs/common';
import {APIError, CoinItem} from '../libs/interfaces';
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

export function useIAP() {
  const userId = useUserStore(s => s.user?.id);
  const updateAmount = useCoinStore(s => s.actions.updateAmount);
  const setPending = useCoinStore(s => s.actions.setPending);
  const closeCoin = useModalStore(s => s.actions.closeCoin);

  useEffect(() => {
    let purchaseUpdateSubscription: any = null;
    let purchaseErrorSubscription: any = null;

    const handleIAPListen = (userId: string) => {
      purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: ProductPurchase) => {
          setPending(false);
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            try {
              await postPurchaseCoin({
                productId: purchase.productId,
                os: constants.platform === 'ios' ? 'ios' : 'android',
                receipt,
                userId,
              });
              await finishTransaction({purchase, isConsumable: true});
            } catch (error: any) {
              const err = error as APIError;
              Alert.alert(err.message);
            }

            getMyCoin().then(result => {
              updateAmount(result.total);
              closeCoin();
            });
          } else {
            finishTransaction({purchase, isConsumable: true});
          }
        },
      );

      purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          setPending(false);
          if (error.code === ErrorCode.E_USER_CANCELLED) {
            return;
          }
          Alert.alert('인앱 결제 오류', error.message);
        },
      );
    };

    if (userId) {
      initConnection().then(inited => {
        getProducts({skus: data.map(x => x.productId)})
          .then(async products => {
            if (data.length !== products.length) {
              return Alert.alert(
                '스토어 연결 오류',
                '인앱 결제 상품이 일치하지 않습니다.',
              );
            }
            if (constants.platform === 'android') {
              flushFailedPurchasesCachedAsPendingAndroid()
                .then(() => {
                  handleIAPListen(userId);
                })
                .catch((error: any) => {
                  Alert.alert(error.message || error);
                });
            } else {
              handleIAPListen(userId);
            }
          })
          .catch(error => {
            if (__DEV__) {
              console.error(error);
            }
          });
      });

      return () => {
        if (purchaseUpdateSubscription) {
          purchaseUpdateSubscription.remove();
          purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
          purchaseErrorSubscription.remove();
          purchaseErrorSubscription = null;
        }
      };
    }
  }, [userId]);
}
