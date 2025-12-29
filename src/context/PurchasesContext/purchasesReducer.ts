import {Product, Subscription} from 'react-native-iap';

export interface PurchasesState {
  isConnect: boolean;
  expires: string;
  error: string | null;
  suscriptions: Subscription[];
  products: Product[];
  isLoadingProducts: boolean;
  isLoadingSuscritions: boolean;
  amountOfCompliments: number;
  amountOfSuperLikes: number;
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
    }
  | {
      type: 'setAmountOfCompliments';
      payload: number;
    }
  | {
      type: 'setAmountOfSuperLikes';
      payload: number;
    }
  | {
      type: 'setAmountProducts';
      payload: {
        superlikes: number;
        compliments: number;
      };
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

    case 'setAmountOfCompliments':
      return {
        ...state,
        amountOfCompliments: action.payload,
      };

    case 'setAmountOfSuperLikes':
      return {
        ...state,
        amountOfSuperLikes: action.payload,
      };
    case 'setAmountProducts':
      return {
        ...state,
        amountOfSuperLikes: action.payload.superlikes,
        amountOfCompliments: action.payload.compliments,
      };

    default:
      return state;
  }
};
