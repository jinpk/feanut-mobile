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
  setup,
} from 'react-native-iap';
import {getMyCoin, postPurchaseCoin} from '../libs/api/coin';
import {constants, pngs} from '../libs/common';
import {CoinItem} from '../libs/interfaces';
import {useCoinStore, useUserStore} from '../libs/stores';

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

export function useIAP() {
  const updateAmount = useCoinStore(s => s.actions.updateAmount);
  const setPending = useCoinStore(s => s.actions.setPending);
  useEffect(() => {
    let purchaseUpdateSubscription: any = null;
    let purchaseErrorSubscription: any = null;

    const handleIAPListen = () => {
      purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: ProductPurchase) => {
          setPending(false);
          if (!purchase.transactionReceipt) {
            if (purchase.productId) {
              finishTransaction({purchase, isConsumable: true});
            }
            return;
          }

          const userId = useUserStore().user?.id;
          if (!userId) {
            Alert.alert('인증 오류', '로그인 후 앱을 다시 시작해 주세요');
            return;
          }

          await postPurchaseCoin({
            productId: purchase.productId,
            os: constants.platform === 'ios' ? 'ios' : 'android',
            purchaseReceipt: (constants.platform === 'ios'
              ? purchase.transactionReceipt
              : purchase.purchaseToken)!,
            userId,
          })
            .then(() => {
              finishTransaction({purchase, isConsumable: true}).then(() => {
                getMyCoin().then(result => {
                  updateAmount(result.total);
                });
              });
            })
            .catch(error => {
              Alert.alert('결제 검증 오류', error.message || error);
            });
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

    initConnection()
      .then(inited => {
        console.log('iap inited state: ', inited);
        getProducts({skus: data.map(x => x.productId)})
          .then(async products => {
            console.log('get iap products length: ', products.length);

            if (constants.platform === 'android') {
              flushFailedPurchasesCachedAsPendingAndroid()
                .then(() => {
                  handleIAPListen();
                })
                .catch((error: any) => {
                  Alert.alert(error.message || error);
                });
            } else {
              handleIAPListen();
            }
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
  }, []);
}
