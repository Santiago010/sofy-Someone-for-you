import {Platform} from 'react-native';

// TODO: ESTO NO USAR CUANDO EL BACKEND ESTE EN PRODUCCION
export const resolveLocalhostUrl = (url: string): string => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Reemplaza localhost por la IP para Android
      return url.replace('http://localhost:9000/', 'http://10.0.2.2:9000/');
    }
  }
  return url;
};
