import {useEffect, useState} from 'react';
import {privateDB} from '../db/db';
import {
  PayloadMyLikeResponse,
  MyLikesResponse,
} from '../interfaces/interfacesApp';

export function useMyLikes() {
  const [myUsersLikes, setMyUsersLikes] = useState<PayloadMyLikeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      setLoading(true);
      setError(null);
      try {
        const {data} = await privateDB.get<MyLikesResponse>(
          '/individuals/my-likes',
        );
        setMyUsersLikes(data.payload);
      } catch (err: any) {
        setError('Error get my users likes');
      } finally {
        setLoading(false);
      }
    };
    fetchLikes();
  }, []);

  return {myUsersLikes, loading, error};
}
