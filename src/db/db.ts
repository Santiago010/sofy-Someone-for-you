import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// export const baseURL =
//   Platform.OS === 'android'
//     ? 'http://10.0.2.2:3001/api/v1'
//     : 'http://127.0.0.1:3001/api/v1';

export const baseURL = 'https://someoneforyou.com.mx/api/v1';

// export const socketurl =
//   Platform.OS === 'android'
//     ? 'http://10.0.2.2:3001/matches'
//     : 'http://127.0.0.1:3001/matches';

export const socketurl = 'https://someoneforyou.com.mx/matches';

export const db = axios.create({
  baseURL,
});

// Instancia para endpoints privados (con interceptor)
export const privateDB = axios.create({
  baseURL,
});

privateDB.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const publicDBForCompleteUser = axios.create({
  baseURL,
});

publicDBForCompleteUser.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('access_token_only_complete_user');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
