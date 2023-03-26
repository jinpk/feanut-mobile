import {useCallback, useEffect} from 'react';
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
  requestPurchase,
  setup,
} from 'react-native-iap';
import {getMyCoin, postPurchaseCoin} from '../libs/api/coin';
import {constants, pngs} from '../libs/common';
import {CoinItem} from '../libs/interfaces';
import {useCoinStore, useModalStore, useUserStore} from '../libs/stores';

setup({storekitMode: 'STOREKIT2_MODE'});

const data: CoinItem[] = [
  {
    amount: 5,
    icon: pngs.coin5,
    price: `₩1,100`,
    productId: 'feanut.iap.coin.5',
  },
  {
    amount: 10,
    icon: pngs.coin10,
    price: `₩2,200`,
    productId: 'feanut.iap.coin.10',
  },
  {
    amount: 30,
    icon: pngs.coin30,
    price: `₩5,500`,
    productId: 'feanut.iap.coin.30',
  },
  {
    amount: 50,
    icon: pngs.coin50,
    price: `₩8,800`,
    productId: 'feanut.iap.coin.50',
  },
  {
    amount: 100,
    icon: pngs.coin100,
    price: `₩15,000`,
    productId: 'feanut.iap.coin.100',
  },
];

export function useCoin(topComponent?: boolean) {
  const amount = useCoinStore(s => s.amount);
  const logged = useUserStore(s => s.logged);
  const updateAmount = useCoinStore(s => s.actions.updateAmount);
  const openCoinModal = useModalStore(s => s.actions.openCoin);

  useEffect(() => {
    if (topComponent) {
      let purchaseUpdateSubscription: any = null;
      let purchaseErrorSubscription: any = null;

      initConnection()
        .then(() => {
          getProducts({skus: data.map(x => x.productId)})
            .then(products => {
              console.log('get iap products length: ', products.length);
              flushFailedPurchasesCachedAsPendingAndroid().then(() => {
                purchaseUpdateSubscription = purchaseUpdatedListener(
                  async (purchase: ProductPurchase) => {
                    console.log('purchaseUpdatedListener', purchase);

                    const userId = useUserStore().user?.id;
                    if (!userId) {
                      Alert.alert('입앤 결제 오류', '로그인 후 진행해 주세요');
                      return;
                    }

                    const receipt =
                      constants.platform === 'ios'
                        ? purchase.transactionReceipt
                        : purchase.purchaseToken;

                    if (receipt) {
                      await postPurchaseCoin({
                        productId: purchase.productId,
                        os: constants.platform === 'ios' ? 'ios' : 'android',
                        purchaseReceipt: receipt,
                        userId,
                      }).then(async () => {
                        await finishTransaction({purchase, isConsumable: true});

                        getMyCoin().then(result => {
                          updateAmount(result.total);
                        });
                      });
                    } else {
                      Alert.alert(
                        '입앤 결제 오류',
                        '영수증이 확인되지 않습니다.',
                      );
                    }
                  },
                );

                purchaseErrorSubscription = purchaseErrorListener(
                  (error: PurchaseError) => {
                    if (error.code === ErrorCode.E_USER_CANCELLED) {
                      return;
                    }
                    Alert.alert('인앱 결제 오류', error.message);
                  },
                );
              });
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
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
  }, []);

  useEffect(() => {
    if (!logged) return;

    getMyCoin()
      .then(result => {
        updateAmount(result.total);
      })
      .catch(error => {
        Alert.alert(error.message || error);
      });
  }, [logged]);

  const handlePurchase = useCallback(async (productId: string) => {
    try {
      await requestPurchase({
        sku: productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  }, []);

  return {
    amount,
    data,
    openPurchaseModal: openCoinModal,
    purchase: handlePurchase,
  };
}
