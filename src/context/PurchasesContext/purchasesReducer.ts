import {Subscription} from 'react-native-iap';

export interface PurchasesState {
  isConnect: boolean;
  expires: string;
  error: string | null;
  suscriptions: Subscription[];
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

    default:
      return state;
  }
};
