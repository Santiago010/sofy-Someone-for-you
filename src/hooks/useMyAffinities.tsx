import {useState, useCallback} from 'react';
import {InterestAndSubInterestResponse} from '../interfaces/interfacesApp';
import {
  ListGetUserForInterest,
  ResGetUserForInterest,
} from '../interfaces/interfacesForAffinities';
import {privateDB} from '../db/db';

const useMyAffinities = () => {
  const [listUserWithMyAffinities, setListUserWithMyAffinities] = useState<
    ListGetUserForInterest[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [errorInGetListUser, setErrorInGetListUser] = useState<string | null>(
    null,
  );

  const getListMyAffinities = useCallback(
    async (categories: InterestAndSubInterestResponse[]) => {
      setIsLoading(true);
      const ids = categories.map(cat => cat.id).join(',');
      try {
        const {data} = await privateDB.get<ResGetUserForInterest>(
          `/individuals/by-categories?ids=${ids}`,
        );
        setListUserWithMyAffinities(data.payload);
      } catch (error) {
        setErrorInGetListUser('Error fetching affinities');
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    },
    [],
  );

  // TODO:return of hook
  return {
    getListMyAffinities,
    listUserWithMyAffinities,
    isLoading,
    hasFetched,
    errorInGetListUser,
  };
};

export default useMyAffinities;
