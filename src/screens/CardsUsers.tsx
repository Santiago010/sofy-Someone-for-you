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

  const renderLocationError = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'ios' ? 100 : 20,
        paddingHorizontal: 20,
      }}>
      <Text
        style={{
          fontSize: 18,
          color: colors.text,
          textAlign: 'center',
          marginBottom: 20,
        }}>
        No location, enable location to see your preferred users
      </Text>
      <Text
        style={{
          fontSize: 18,
          color: colors.text,
          textAlign: 'center',
          marginBottom: 30,
        }}>
        {locationError?.includes('denied')
          ? 'Enable location permissions in Settings > Sofy > Location'
          : locationError || 'Unable to get location'}
      </Text>
      <TouchableOpacity
        onPress={retryLocationRequest}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 8,
        }}>
        <Text
          style={{
            color: colors.background,
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          Reintentar
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingLocation = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'ios' ? 100 : 20,
      }}>
      <BarIndicator count={4} size={50} color={colors.primary} />
    </View>
  );

  if (isLoadingLocation) {
    return renderLoadingLocation();
  }

  if (locationError || !location.latitude || !location.longitude) {
    return renderLocationError();
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'ios' ? 40 : 0,
      }}>
      <LogoSofy withMarginBotton={false} />
      <SwipeCard location={location} />
    </View>
  );
};
