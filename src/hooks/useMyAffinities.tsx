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
        setIsLoading(false);
      } catch (error) {
        setErrorInGetListUser('Error fetching affinities');
        setIsLoading(false);
      }
    },
    [],
  );

  // TODO:return of hook
  return {
    getListMyAffinities,
    listUserWithMyAffinities,
    isLoading,
    errorInGetListUser,
  };
};

export default useMyAffinities;
