import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Platform} from 'react-native';

const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3001/api/v1'
    : 'http://127.0.0.1:3001/api/v1';

export const db = axios.create({
  baseURL,
});

// Instancia para endpoints privados (con interceptor)
export const privateDB = axios.create({
  baseURL,
});

privateDB.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('access_token');
  console.log(token);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
