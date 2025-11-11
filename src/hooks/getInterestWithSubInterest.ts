import {useState, useEffect} from 'react';
import {db} from '../db/db';
import {InterestAndSubInterestResponse} from '../interfaces/interfacesApp';

const useGetInterestWithSubInterest = () => {
  const [data, setData] = useState<InterestAndSubInterestResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoading(true);
        const response = await db.get<InterestAndSubInterestResponse[]>(
          '/category',
        );
        setData(response.data);
      } catch (err) {
        setError('Error to get Interest');
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  return {data, loading, error};
};

export default useGetInterestWithSubInterest;
