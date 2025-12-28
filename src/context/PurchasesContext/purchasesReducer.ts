import {Product, Subscription} from 'react-native-iap';

export interface PurchasesState {
  isConnect: boolean;
  expires: string;
  error: string | null;
  suscriptions: Subscription[];
  products: Product[];
  isLoadingProducts: boolean;
  isLoadingSuscritions: boolean;
}

type PurchasesAction =
  | {
      type: 'setStateSuscription';
      payload: {
        isConnect: boolean;
        expires: string;
      };
    }
  | {
      type: 'setSuscriptions';
      payload: {
        suscriptions: Subscription[];
      };
    }
  | {
      type: 'setLoadingSuscriptions';
      payload: {
        isLoadingSuscritions: boolean;
      };
    }
  | {
      type: 'resetPurchaseState';
    }
  | {
      type: 'setLoadingProducts';
      payload: boolean;
    }
  | {
      type: 'setProducts';
      payload: Product[];
    };

export const purchasesReducer = (
  state: PurchasesState,
  action: PurchasesAction,
): PurchasesState => {
  switch (action.type) {
    case 'setStateSuscription':
      return {
        ...state,
        isConnect: action.payload.isConnect,
        expires: action.payload.expires,
      };
    case 'setLoadingSuscriptions':
      return {
        ...state,
        isLoadingSuscritions: action.payload.isLoadingSuscritions,
      };
    case 'setSuscriptions':
      return {
        ...state,
        isLoadingSuscritions: false,
        suscriptions: action.payload.suscriptions,
      };
    case 'resetPurchaseState':
      return {
        ...state,
        isConnect: false,
        expires: '',
        suscriptions: [],
      };
    case 'setLoadingProducts':
      return {
        ...state,
        isLoadingProducts: action.payload,
      };

    case 'setProducts':
      return {
        ...state,
        products: action.payload,
      };

    default:
      return state;
  }
};
