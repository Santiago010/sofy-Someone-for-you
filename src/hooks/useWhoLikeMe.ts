import {useState} from 'react';
import {privateDB} from '../db/db';
import {
  PayloadResInteractionsWithMe,
  ResInteractionsWithMe,
} from '../interfaces/interfacesApp';

export function useWhoLikesMe() {
  const [whoLikesMe, setWhoLikesMe] = useState<PayloadResInteractionsWithMe[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWhoLikedMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const {data} = await privateDB.get<ResInteractionsWithMe>(
        '/individuals/who-interacted-with-me',
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
