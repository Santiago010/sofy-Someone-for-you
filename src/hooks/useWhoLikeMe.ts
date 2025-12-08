import {useEffect, useState} from 'react';
import {privateDB} from '../db/db';
import {
  PayloadWhoLikedMe,
  ResponseWhoLikedMe,
} from '../interfaces/interfacesApp';

export function useWhoLikesMe() {
  const [whoLikesMe, setWhoLikesMe] = useState<PayloadWhoLikedMe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWhoLikedMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const {data} = await privateDB.get<ResponseWhoLikedMe>(
        '/individuals/who-liked-me',
      );
      setWhoLikesMe(data.payload);
    } catch (err) {
      setError('Error get my users likes');
    } finally {
      setLoading(false);
    }
  };

  return {whoLikesMe, loading, error, fetchWhoLikedMe};
}
