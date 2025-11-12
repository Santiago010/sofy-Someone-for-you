import {PayloadDetails2, SignUpResponse} from '../../interfaces/interfacesApp';

export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  transactionId: string;
  errorMessage: string;
  loading: boolean;
  access_token: string;
  signUpResponseWithInfoUser: SignUpResponse | null;
  detailsUser: PayloadDetails2 | null;
  editDetailsSuccess: boolean;
  idUserForChats?: number;
}

type AuthAction =
  | {type: 'login'; payload: {transactionId: string}}
  | {type: 'addError'; payload: string}
  | {type: 'removeError'}
  | {type: 'setLoading'; payload: boolean}
  | {type: 'notAuthenticated'}
  | {type: 'logout'}
  | {type: 'setAccess_token'; payload: {access_token: string}}
  | {type: 'GetDetailsUser'; payload: {detailsUser: PayloadDetails2}}
  | {
      type: 'setsignUpResponseWithInfoUser';
      payload: {signUpResponseWithInfoUser: SignUpResponse};
    }
  | {type: 'setEditDetailsSuccess'; payload: boolean}
  | {type: 'setIDUserForChats'; payload: {idUserForChats: number}};

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'addError':
      return {
        ...state,
        status: 'not-authenticated',
        errorMessage: action.payload,
        loading: false,
      };
    case 'removeError':
      return {
        ...state,
        errorMessage: '',
      };
    case 'setLoading':
      return {
        ...state,
        loading: action.payload,
      };
    case 'GetDetailsUser':
      return {
        ...state,
        detailsUser: action.payload.detailsUser,
      };
    case 'setsignUpResponseWithInfoUser':
      return {
        ...state,
        loading: false,
        signUpResponseWithInfoUser: action.payload.signUpResponseWithInfoUser,
      };

    case 'login':
      return {
        ...state,
        transactionId: action.payload.transactionId,
        loading: false,
      };
    case 'setIDUserForChats':
      return {
        ...state,
        idUserForChats: action.payload.idUserForChats,
      };
    case 'setAccess_token':
      return {
        ...state,
        status: 'authenticated',
        access_token: action.payload.access_token,
      };
    case 'logout':
    case 'notAuthenticated':
      return {
        ...state,
        access_token: '',
        transactionId: '',
        status: 'not-authenticated',
      };

    case 'setEditDetailsSuccess':
      return {
        ...state,
        editDetailsSuccess: action.payload,
      };

    default:
      return state;
  }
};
