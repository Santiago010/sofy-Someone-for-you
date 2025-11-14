import React from 'react';
import {View, Platform, TouchableOpacity} from 'react-native';
import SwipeCard from '../components/SwipeCard';
import {colors} from '../theme/globalTheme';
import {Text} from 'react-native-paper';
import LogoSofy from '../components/LogoSofy';
import {useLocation} from '../hooks/useLocation';
import {BarIndicator} from 'react-native-indicators';

export const CardsUsers = () => {
  const {location, locationError, isLoadingLocation, retryLocationRequest} =
    useLocation();

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
      />
    </View>
  );
};
