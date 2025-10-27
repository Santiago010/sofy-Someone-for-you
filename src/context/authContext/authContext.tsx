import React, {createContext, useEffect, useReducer} from 'react';
import {
  SignUpData,
  loginData,
  LoginResponse,
  verificationCodeData,
  VerificationCodeResponse,
  RefreshTokenResponse,
  SignUpResponse,
  SignUpError,
  SignInError,
  VerificationCodeError,
  CompleteInfoUser,
  CompleteInfoUSerResponse,
  CompleteInfoUserError,
  GetDetailsResponse,
  ResponseEditDetailsUser,
} from '../../interfaces/interfacesApp';
import {AuthState, authReducer} from './authReducer';
import {db, privateDB} from '../../db/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decodeJWT} from '../../helpers/DecodeJWT';
import {AxiosError} from 'axios';

interface AuthContextProps {
  signUpResponseWithInfoUser: SignUpResponse | null;
  errorMessage: string;
  transactionId: string;
  access_token: string;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signUp: (data: SignUpData) => void;
  login: (data: loginData) => void;
  logout: () => void;
  removeError: () => void;
  verificationCode: (data: verificationCodeData) => void;
  completeInfoUser: (completeInfoUser: CompleteInfoUser) => void;
  GetDetailsUser: () => void;
  EditDetailsInfo: (data: any) => void;
}

const authInicialState: AuthState = {
  status: 'checking',
  access_token: '',
  transactionId: '',
  errorMessage: '',
  signUpResponseWithInfoUser: null,
  detailsUser: null,
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(authReducer, authInicialState);

  const login = async ({email, password}: loginData) => {
    try {
      const {data} = await db.post<LoginResponse>('/auth/login', {
        username: email,
        password: password,
      });

      dispatch({
        type: 'login',
        payload: {
          transactionId: data.payload.transactionId,
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data as SignInError;
          dispatch({type: 'addError', payload: errorData.message});
        } else if (error.request) {
          dispatch({
            type: 'addError',
            payload: 'Error in the Request',
          });
        } else {
          dispatch({
            type: 'addError',
            payload: error.message,
          });
        }
      } else {
        dispatch({
          type: 'addError',
          payload: 'Unexpected error in the server',
        });
      }
    }
  };

  const verificationCode = async ({
    transactionId,
    code,
  }: verificationCodeData) => {
    try {
      const {data} = await db.post<VerificationCodeResponse>(
        '/auth/verify-code',
        {
          transactionId,
          code,
        },
      );
      refreshToken(data.payload.messageAuth.refreshToken);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data as VerificationCodeError;

          dispatch({type: 'addError', payload: errorData.message});
        } else if (error.request) {
          dispatch({
            type: 'addError',
            payload: 'Error in the Request',
          });
        } else {
          dispatch({type: 'addError', payload: error.message});
        }
      } else {
        dispatch({
          type: 'addError',
          payload: 'Unexpected error in the server',
        });
      }
    }
  };

  const refreshToken = async (refreshTokenData: string) => {
    try {
      const {data} = await db.post<RefreshTokenResponse>(
        '/auth/refresh-token',
        {
          refreshToken: refreshTokenData,
        },
      );
      console.log({access_token: data.payload.access_token});
      AsyncStorage.setItem('access_token', data.payload.access_token);
      dispatch({
        type: 'setAccess_token',
        payload: {
          access_token: data.payload.access_token,
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.log({...error.response});
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const EditDetailsInfo = async (dataToEdit: any) => {
    try {
      const {data} = await privateDB.patch<ResponseEditDetailsUser>(
        '/individuals/me',
        dataToEdit,
      );
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const GetDetailsUser = async () => {
    try {
      const {data} = await privateDB.get<GetDetailsResponse>(
        '/individuals/me/details',
      );

      dispatch({
        type: 'GetDetailsUser',
        payload: {
          detailsUser: data,
        },
      });
      console.log(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data;

          console.log(errorData);
          //   dispatch({type: 'addError', payload: errorData.message});
        } else if (error.request) {
          //   dispatch({type: 'addError', payload: 'Error in the Request'});
        } else {
          //   dispatch({type: 'addError', payload: error.message});
        }
      } else {
        dispatch({
          type: 'addError',
          payload: 'Unexpected error in the server',
        });
      }
    }
  };

  const signUp = async ({firstName, lastName, email, password}: SignUpData) => {
    try {
      const {data} = await db.post<SignUpResponse>('/signup', {
        name: firstName,
        lastname: lastName,
        email,
        password,
      });
      dispatch({
        type: 'setsignUpResponseWithInfoUser',
        payload: {signUpResponseWithInfoUser: data},
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data as SignUpError;
          dispatch({type: 'addError', payload: errorData.message});
        } else if (error.request) {
          dispatch({type: 'addError', payload: 'Error in the Request'});
        } else {
          dispatch({type: 'addError', payload: error.message});
        }
      } else {
        dispatch({type: 'addError', payload: 'Unexpected error in the server'});
      }
    }
    // dispatch({type: 'authenticatedProv'});
  };

  const completeInfoUser = async (completeInfoUser: CompleteInfoUser) => {
    console.log({data: 'data', complete: completeInfoUser});
    try {
      const {data} = await db.patch<CompleteInfoUSerResponse>(
        '/individuals/complete-profile',
        completeInfoUser,
      );

      dispatch({type: 'authenticatedProv'});
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data as CompleteInfoUserError;
          dispatch({type: 'addError', payload: errorData.message});
        } else if (error.request) {
          dispatch({type: 'addError', payload: 'Error in the Request'});
        } else {
          dispatch({type: 'addError', payload: error.message});
        }
      } else {
        dispatch({
          type: 'addError',
          payload: 'Unexpected error in the server',
        });
      }
    }
  };

  function logout() {
    dispatch({type: 'logout'});
  }

  function removeError() {
    dispatch({type: 'removeError'});
  }

  const checkToken = async () => {
    const access_token = await AsyncStorage.getItem('access_token');

    if (!access_token) {
      dispatch({
        type: 'notAuthenticated',
      });
      return;
    }

    // Verificar expiración del token
    const decodedToken = decodeJWT(access_token);

    if (!decodedToken) {
      // Token inválido, remover y marcar como no autenticado
      await AsyncStorage.removeItem('access_token');
      dispatch({
        type: 'notAuthenticated',
      });
      return;
    }

    // Verificar si el token tiene la propiedad 'exp'
    if (!decodedToken.exp) {
      console.warn('JWT no tiene propiedad exp, asumiendo válido');
      dispatch({
        type: 'setAccess_token',
        payload: {access_token: access_token},
      });
      return;
    }

    // Obtener timestamp actual en segundos
    const currentTime = Math.floor(Date.now() / 1000);

    // Verificar si el token ha expirado
    if (currentTime >= decodedToken.exp) {
      // Token expirado, remover y marcar como no autenticado
      await AsyncStorage.removeItem('access_token');
      dispatch({
        type: 'notAuthenticated',
      });
    } else {
      // Token válido
      dispatch({
        type: 'setAccess_token',
        payload: {access_token: access_token},
      });
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        GetDetailsUser,
        ...state,
        verificationCode,
        login,
        signUp,
        logout,
        removeError,
        completeInfoUser,
        EditDetailsInfo,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
