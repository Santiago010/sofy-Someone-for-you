import axios from 'axios';

export const db = axios.create({
  baseURL: 'http://127.0.0.1:3001/api/v1',
});
