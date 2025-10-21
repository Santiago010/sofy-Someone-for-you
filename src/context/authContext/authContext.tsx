import React, {createContext, useEffect, useReducer} from 'react';
import {
  SignUpData,
  loginData,
  LoginResponse,
  verificationCodeData,
  VerificationCodeResponse,
  RefreshTokenResponse,
} from '../../interfaces/interfacesApp';
import {AuthState, authReducer} from './authReducer';
import {db} from '../../db/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decodeJWT} from '../../helpers/DecodeJWT';

interface AuthContextProps {
  errorMessage: string;
  transactionId: string;
  access_token: string;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signUp: (data: SignUpData) => void;
  login: (data: loginData) => void;
  logout: () => void;
  removeError: () => void;
  verificationCode: (data: verificationCodeData) => void;
}

const authInicialState: AuthState = {
  status: 'checking',
  access_token: '',
  transactionId: '',
  errorMessage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(authReducer, authInicialState);

  const login = async ({email, password}: loginData) => {
    console.log('login');
    try {
      const {data} = await db.post<LoginResponse>('/auth/login', {
        username: email,
        password: password,
      });

      console.log(data);
      dispatch({
        type: 'login',
        payload: {
          transactionId: data.payload.transactionId,
        },
      });
    } catch (error) {
      console.error(error);
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
      console.error(error);
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
      AsyncStorage.setItem('access_token', data.payload.access_token);
      console.log(data.payload.access_token);
      dispatch({
        type: 'setAccess_token',
        payload: {
          access_token: data.payload.access_token,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  function signUp({
    firstName,
    lastName,
    email,
    password,
    passwordVerification,
  }: SignUpData) {
    dispatch({type: 'authenticatedProv'});
  }

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
    setTimeout(() => {
      checkToken();
    }, 3000);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        verificationCode,
        login,
        signUp,
        logout,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
