export interface GetCoinResponse {
  total: number;
}

export interface CoinItem {
  price: string;
  amount: number;
  icon: number;
  productId: string;
}

export interface PurchaseCoin {
  userId: string;
  productId: string;
  purchaseReceipt: string;
  os: 'android' | 'ios';
}
