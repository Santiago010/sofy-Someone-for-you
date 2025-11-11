import React from 'react';
import {View, Platform, TouchableOpacity} from 'react-native';
import SwipeCard from '../components/SwipeCard';
import {colors} from '../theme/globalTheme';
import {Text} from 'react-native-paper';
import LogoSofy from '../components/LogoSofy';
import {useLocation} from '../hooks/useLocation';

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
        Sin ubicación, Activa la ubicación para ver a tus usuarios de prefencia
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.textSecondary || colors.text,
          textAlign: 'center',
          marginBottom: 30,
        }}>
        {locationError?.includes('denegados')
          ? 'Activa los permisos de ubicación en Configuración > Sofy > Ubicación'
          : locationError || 'No se pudo obtener la ubicación'}
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
      <Text
        style={{
          fontSize: 16,
          color: colors.text,
          textAlign: 'center',
        }}>
        Obteniendo ubicación...
      </Text>
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
