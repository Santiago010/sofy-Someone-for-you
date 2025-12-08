import React, {useState} from 'react';
import {View, Platform} from 'react-native';
import SwipeCard from '../components/SwipeCard';
import {colors} from '../theme/globalTheme';
import LogoSofy from '../components/LogoSofy';
import {useLocation} from '../hooks/useLocation';
import {useFocusEffect} from '@react-navigation/native';

export const CardsUsers = () => {
  const {location, locationError, isLoadingLocation, retryLocationRequest} =
    useLocation();

  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'ios' ? 40 : 0,
      }}>
      <LogoSofy withMarginBotton={false} />
      <SwipeCard
        retryLocationRequest={retryLocationRequest}
        locationError={locationError}
        isLoadingLocation={isLoadingLocation}
        location={location}
        isFocused={isFocused}
      />
    </View>
  );
};
