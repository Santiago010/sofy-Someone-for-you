export interface PurchasesState {
  isConnect: boolean;
  expires: string;
  error: string | null;
}

type PurchasesAction = {
  type: 'setStateSuscription';
  payload: {
    isConnect: boolean;
    expires: string;
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
    default:
      return state;
  }
};
