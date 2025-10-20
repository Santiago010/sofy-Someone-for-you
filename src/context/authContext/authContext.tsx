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
  }: SignUpData) {}

  function logout() {
    dispatch({type: 'logout'});
  }

  function removeError() {
    dispatch({type: 'removeError'});
  }

  function checkToken() {
    dispatch({
      type: 'notAuthenticated',
    });
  }

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
