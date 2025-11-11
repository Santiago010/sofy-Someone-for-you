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
  CompleteInfoUserResponse,
  CompleteInfoUserError,
  GetDetailsResponse,
  ResponseEditDetailsUser,
  EditDetailsInfoUser2,
  UploadFile,
  CompleteInfoUser2,
  PayloadDetails2,
  IDResponse,
} from '../../interfaces/interfacesApp';
import {AuthState, authReducer} from './authReducer';
import {db, privateDB, publicDBForCompleteUser} from '../../db/db';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decodeJWT} from '../../helpers/DecodeJWT';
import {AxiosError} from 'axios';

interface AuthContextProps {
  signUpResponseWithInfoUser: SignUpResponse | null;
  detailsUser: PayloadDetails2 | null;
  errorMessage: string;
  transactionId: string;
  access_token: string;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  editDetailsSuccess: boolean;
  idUserForChats?: number;
  signUp: (data: SignUpData) => void;
  login: (data: loginData) => void;
  logout: () => void;
  removeError: () => void;
  verificationCode: (data: verificationCodeData) => void;
  completeInfoUser: (completeInfoUser: CompleteInfoUser2) => void;
  GetDetailsUser: () => void;
  EditDetailsInfo: (data: EditDetailsInfoUser2) => void;
  setEditDetailsSuccessFun: (stateEdit: boolean) => void;
  addImage: (photo: UploadFile) => Promise<void>;
  removeImage: (id: string) => Promise<void>;
  getIDUserForChats: () => void;
}

const authInicialState: AuthState = {
  status: 'checking',
  access_token: '',
  transactionId: '',
  errorMessage: '',
  signUpResponseWithInfoUser: null,
  detailsUser: null,
  editDetailsSuccess: false,
  idUserForChats: undefined,
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
      await AsyncStorage.setItem('access_token', data.payload.access_token);
      dispatch({
        type: 'setAccess_token',
        payload: {
          access_token: data.payload.access_token,
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
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

  const setEditDetailsSuccessFun = (stateEdit: boolean) => {
    dispatch({type: 'setEditDetailsSuccess', payload: stateEdit});
  };

  const EditDetailsInfo = async (editDetailsInfoUser: EditDetailsInfoUser2) => {
    try {
      await privateDB.patch<ResponseEditDetailsUser>('/individuals/me', {
        subcategories: editDetailsInfoUser.subcategories,
        age: editDetailsInfoUser.age,
        gender_id: editDetailsInfoUser.gender_id,
        interested_gender_id: editDetailsInfoUser.interested_gender_id,
        max_distance_km: editDetailsInfoUser.max_distance_km,
        min_age: editDetailsInfoUser.min_age,
        max_age: editDetailsInfoUser.max_age,
        name: editDetailsInfoUser.name,
        lastname: editDetailsInfoUser.lastname,
        description: editDetailsInfoUser.description,
      });
      setEditDetailsSuccessFun(true);
      GetDetailsUser();
    } catch (error) {
      setEditDetailsSuccessFun(false);
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data;

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

  const GetDetailsUser = async () => {
    try {
      const {data} = await privateDB.get<GetDetailsResponse>(
        '/individuals/me/details',
      );

      dispatch({
        type: 'GetDetailsUser',
        payload: {
          detailsUser: data.payload,
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data;

          console.error(errorData);
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
      await AsyncStorage.setItem(
        'access_token_only_complete_user',
        data.payload.access_token,
      );
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
  };

  const addImage = async (photo: UploadFile): Promise<void> => {
    try {
      const formData = new FormData();

      formData.append('photo', {
        uri: photo.uri,
        type: photo.type,
        name: photo.name,
      } as any);

      const {data} = await privateDB.post(
        '/individuals-files/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return Promise.resolve();
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
      return Promise.reject(error);
    }
  };

  const completeInfoUser = async (completeInfoUser: CompleteInfoUser2) => {
    try {
      const formData = new FormData();

      // Agregar todos los campos excepto photos
      formData.append('subcategories', completeInfoUser.subcategories);
      formData.append('age', completeInfoUser.age);
      formData.append('gender_id', completeInfoUser.gender_id.toString());
      formData.append(
        'interested_gender_id',
        completeInfoUser.interested_gender_id.toString(),
      );
      formData.append(
        'max_distance_km',
        completeInfoUser.max_distance_km.toString(),
      );
      formData.append('min_age', completeInfoUser.min_age.toString());
      formData.append('max_age', completeInfoUser.max_age.toString());
      formData.append('email', completeInfoUser.email);
      formData.append('description', completeInfoUser.description);

      // Agregar las fotos
      completeInfoUser.photos.forEach(photo => {
        formData.append('photos', {
          uri: photo.uri,
          type: photo.type,
          name: photo.name,
        } as any);
      });

      await publicDBForCompleteUser.patch<CompleteInfoUserResponse>(
        '/individuals/complete-profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const access_token_only_complete_user = await AsyncStorage.getItem(
        'access_token_only_complete_user',
      );
      if (access_token_only_complete_user) {
        dispatch({
          type: 'setAccess_token',
          payload: {
            access_token: access_token_only_complete_user,
          },
        });
        await AsyncStorage.setItem(
          'access_token',
          access_token_only_complete_user,
        );
        await AsyncStorage.setItem('access_token_only_complete_user', '');
      }
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

  const removeImage = async (id: string): Promise<void> => {
    try {
      const {data} = await privateDB.delete(`individuals-files/${id}`);
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting image:', error);
      return Promise.reject(error);
    }
  };

  async function logout() {
    try {
      await AsyncStorage.setItem('access_token', '');
      dispatch({type: 'logout'});
    } catch (error) {}
  }

  function removeError() {
    dispatch({type: 'removeError'});
  }

  const checkToken = async () => {
    const access_token = await AsyncStorage.getItem('access_token');
    const access_token_only_complete_user = await AsyncStorage.getItem(
      'access_token_only_complete_user',
    );

    if (access_token_only_complete_user) {
      dispatch({
        type: 'notAuthenticated',
      });
      return;
    }

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

  const getIDUserForChats = async () => {
    try {
      const {data} = await privateDB.get<IDResponse>('/individuals/me/id');
      console.log('ID User for Chats:', data.payload.id);
      dispatch({
        type: 'setIDUserForChats',
        payload: {
          idUserForChats: data.payload.id,
        },
      });
    } catch (error) {}
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        getIDUserForChats,
        GetDetailsUser,
        ...state,
        verificationCode,
        login,
        signUp,
        logout,
        removeError,
        completeInfoUser,
        EditDetailsInfo,
        setEditDetailsSuccessFun,
        removeImage,
        addImage,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
