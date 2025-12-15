import {useEffect, useState} from 'react';
import {
  CometChatUIKit,
  UIKitSettings,
} from '@cometchat/chat-uikit-react-native';
import {CometChat} from '@cometchat/chat-sdk-react-native';
import {appId, authKey, region, restKey} from '../assets/KeysCometChat';
import axios, {AxiosError} from 'axios';

export const useCometChat = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const urlApiUsers = `https://${appId}.api-${region}.cometchat.io/v3/users`;
  const urlApiMessages = `https://${appId}.api-${region}.cometchat.io/v3/messages`;

  useEffect(() => {
    const uikitSettings: UIKitSettings = {
      appId: appId,
      authKey: authKey,
      region: region,
      subscriptionType: CometChat.AppSettings
        .SUBSCRIPTION_TYPE_ALL_USERS as UIKitSettings['subscriptionType'],
      autoEstablishSocketConnection: true,
    };

    CometChatUIKit.init(uikitSettings)
      .then(value => {
        setIsInitialized(true);
        // console.log('CometChatUiKit successfully initialized');
      })
      .catch(error => {
        console.error('Initialization failed with exception:', error);
        setError(`Initialization failed with exception : ${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Login de usuario
  const loginUser = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);

      const user = await CometChatUIKit.login({uid});
      setCurrentUser(user);
      setIsLoggedIn(true);
      //   console.log(`Usuario logeado: ${user.getName()}`);
      return {success: true, user};
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión en el chat');
      return {success: false, error: err};
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logoutUser = async () => {
    try {
      await CometChatUIKit.logout();
      setCurrentUser(null);
      setIsLoggedIn(false);
    } catch (err) {
      console.error('Error en logout:', err);
    }
  };

  const createCometChatUser = async (
    uid: string,
    name: string,
    avatar: string,
  ) => {
    try {
      const body = {
        uid,
        name,
        avatar,
      };

      const response = await axios.post(urlApiUsers, body, {
        headers: {
          apikey: authKey,
          'Content-Type': 'application/json',
        },
      });

      return {success: true, data: response.data};
    } catch (error) {
      return {success: false, error};
    }
  };

  const sendMessageToUser = async (
    senderUid: string,
    receiverId: string,
    message: string,
  ) => {
    try {
      const body = {
        receiver: receiverId,
        receiverType: 'user',
        category: 'message',
        type: 'text',
        data: {
          text: message,
        },
      };

      const response = await axios.post(urlApiMessages, body, {
        headers: {
          apikey: restKey,
          onBehalfOf: senderUid,
          'Content-Type': 'application/json',
        },
      });

      return {success: true, data: response.data};
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(
          'Error al enviar mensaje en CometChat:',
          error.response?.data,
        );
        return {success: false, error};
      }
    }
  };

  return {
    // Estados
    isInitialized,
    isLoggedIn,
    currentUser,
    loading,
    error,
    loginUser,
    logoutUser,
    createCometChatUser,
    sendMessageToUser,
  };
};
