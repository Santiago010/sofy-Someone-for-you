import {useState, useEffect} from 'react';
import {db} from '../db/db';
import {GenderResponse} from '../interfaces/interfacesApp';

const useGetGender = () => {
  const [data, setData] = useState<GenderResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoading(true);
        const response = await db.get<GenderResponse[]>('/gender');
        setData(response.data);
      } catch (err) {
        setError('Error to get Genders');
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  return {data, loading, error};
};

export default useGetGender;
