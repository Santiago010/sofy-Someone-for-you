import {useState, useCallback, useEffect} from 'react';
import {privateDB} from '../db/db';
import {
  PayloadRecomendationsResponse,
  RecomendationsResponse,
} from '../interfaces/interfacesApp';

const useRecomendations = () => {
  const [recomendations, setRecomendations] = useState<
    PayloadRecomendationsResponse[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMorePages, setHasMorePages] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchRecomendations = useCallback(
    async (lat: number, log: number, limit: number, page: number) => {
      if (isFetching) return;

      try {
        setIsFetching(true);
        setLoading(true);

        const res = await privateDB.get<RecomendationsResponse>(
          '/individuals/recommendations',
          {
            params: {lat, log, limit, page},
          },
        );

        const newRecomendations = res.data.payload;

        if (page === 1) {
          setRecomendations(newRecomendations);
        } else {
          setRecomendations(prev => [...prev, ...newRecomendations]);
        }

        setCurrentPage(page);

        if (newRecomendations.length < limit) {
          setHasMorePages(false);
        }
      } catch (err) {
        setError('Error fetching recommendations');
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    },
    [isFetching],
  );

  useEffect(() => {
  }, [recomendations]);

  return {
    recomendations,
    loading,
    error,
    fetchRecomendations,
    setRecomendations,
    currentPage,
    hasMorePages,
    isFetching,
  };
};

export default useRecomendations;
