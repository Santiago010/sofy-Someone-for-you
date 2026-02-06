import React, {createContext, useState, ReactNode} from 'react';
import {InterestAndSubInterestResponse} from '../../interfaces/interfacesApp';
import {ListGetUserForInterest} from '../../interfaces/interfacesForAffinities';

type AffinitiesContextType = {
  selectedInterests: InterestAndSubInterestResponse[];
  userList: ListGetUserForInterest[];
  setSelectedInterests: (interests: InterestAndSubInterestResponse[]) => void;
  setUserList: React.Dispatch<React.SetStateAction<ListGetUserForInterest[]>>;
  isInitialized: boolean;
  resetAffinities: () => void;
};

export const AffinitiesContext = createContext<AffinitiesContextType>(
  {} as AffinitiesContextType,
);

interface Props {
  children: ReactNode;
}

export const AffinitiesProvider = ({children}: Props) => {
  const [selectedInterests, setSelectedInterestsValue] = useState<
    InterestAndSubInterestResponse[]
  >([]);
  const [userList, setUserList] = useState<ListGetUserForInterest[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const setSelectedInterests = (
    interests: InterestAndSubInterestResponse[],
  ) => {
    setSelectedInterestsValue(interests);
    setIsInitialized(true);
  };

  const resetAffinities = () => {
    setSelectedInterestsValue([]);
    setUserList([]);
    setIsInitialized(false);
  };

  return (
    <AffinitiesContext.Provider
      value={{
        selectedInterests,
        userList,
        setSelectedInterests,
        setUserList,
        isInitialized,
        resetAffinities,
      }}>
      {children}
    </AffinitiesContext.Provider>
  );
};
