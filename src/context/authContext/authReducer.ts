import {
  GetDetailsResponse,
  PayloadDetails,
  SignUpResponse,
} from '../../interfaces/interfacesApp';

export interface AuthState {
  status: 'checking' | 'authenticated' | 'not-authenticated';
  transactionId: string;
  errorMessage: string;
  access_token: string;
  signUpResponseWithInfoUser: SignUpResponse | null;
  detailsUser: PayloadDetails | null;
}

type AuthAction =
  | {type: 'login'; payload: {transactionId: string}}
  | {type: 'addError'; payload: string}
  | {type: 'removeError'}
  | {type: 'notAuthenticated'}
  | {type: 'logout'}
  | {type: 'setAccess_token'; payload: {access_token: string}}
  | {type: 'authenticatedProv'}
  | {type: 'GetDetailsUser'; payload: {detailsUser: GetDetailsResponse}}
  | {
      type: 'setsignUpResponseWithInfoUser';
      payload: {signUpResponseWithInfoUser: SignUpResponse};
    };

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
      };
    case 'GetDetailsUser':
      return {
        ...state,
        detailsUser: action.payload.detailsUser.payload,
      };
    case 'setsignUpResponseWithInfoUser':
      return {
        ...state,
        signUpResponseWithInfoUser: action.payload.signUpResponseWithInfoUser,
      };
    case 'removeError':
      return {
        ...state,
        errorMessage: '',
      };
    case 'authenticatedProv':
      return {
        ...state,
        status: 'authenticated',
      };
    case 'login':
      return {
        ...state,
        transactionId: action.payload.transactionId,
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
        status: 'not-authenticated',
      };

    default:
      return state;
  }
};
