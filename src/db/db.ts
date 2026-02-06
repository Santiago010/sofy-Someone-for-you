import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { emojiForPlatform } from '../helpers/emojiForPlatform';

export const baseURL = 'https://someoneforyou.com.mx/api/v1';

export const socketurl = 'https://someoneforyou.com.mx/matches';

export const baseURLForIAP = 'https://someoneforyou.com.mx/api/v1/iap';

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

export const privateDBForIAP = axios.create({
  baseURL: baseURLForIAP,
});

privateDBForIAP.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
