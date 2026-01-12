import {useState} from 'react';
import {privateDB} from '../db/db';
import {
  PayloadResMyInteractionsWithOthers,
  ResMyInterectionsWithOthers,
} from '../interfaces/interfacesApp';

export function useMyLikes() {
  const [myUsersLikes, setMyUsersLikes] = useState<
    PayloadResMyInteractionsWithOthers[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = async () => {
    setLoading(true);
    setError(null);
    try {
      const {data} = await privateDB.get<ResMyInterectionsWithOthers>(
        '/individuals/my-interactions',
      );
      setMyUsersLikes(data.payload);
    } catch (err) {
      setError('Error get my users likes');
    } finally {
      setLoading(false);
    }
  };

  return {myUsersLikes, loading, error, fetchLikes};
}
