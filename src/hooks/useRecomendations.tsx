import {useState} from 'react';
import {privateDB} from '../db/db';
import {RecomendationsResponse} from '../interfaces/interfacesApp';

const useRecomendations = () => {
  // Placeholder for future recommendation logic

  const [recomendations, setRecomendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchRecomendations = async (
    lat: number,
    log: number,
    limit: number,
  ) => {
    try {
      setLoading(true);
      // Placeholder for fetching recommendations logic
      const res = await privateDB.get<RecomendationsResponse>(
        '/individuals/recommendations',
        {
          params: {lat, log, limit},
        },
      );
      setRecomendations(res.data.payload);
    } catch (err) {
      setError('Error fetching recommendations');
    } finally {
      setLoading(false);
    }
  };

  return {recomendations, loading, error, fetchRecomendations};
};

export default useRecomendations;
