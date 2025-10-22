import React, {useState, useEffect} from 'react';
import {View, Platform, TouchableOpacity} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import SwipeCard from '../components/SwipeCard';
import {colors} from '../theme/globalTheme';
import {Text} from 'react-native-paper';
import LogoSofy from '../components/LogoSofy';

interface Location {
  latitude: number | null;
  longitude: number | null;
}

export const CardsUsers = () => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const requestLocationPermission = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      if (Platform.OS === 'ios') {
        // Para iOS, solicitar autorización primero
        Geolocation.requestAuthorization();
      }

      // Solicitar ubicación actual
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});
          setIsLoadingLocation(false);
          console.log('Ubicación obtenida:', {latitude, longitude});
        },
        error => {
          setIsLoadingLocation(false);
          let errorMessage = 'Error al obtener ubicación';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permisos de ubicación denegados';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Ubicación no disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Timeout al obtener ubicación';
              break;
            default:
              errorMessage = `Error de ubicación: ${error.message}`;
              break;
          }

          setLocationError(errorMessage);
          console.error('Error de geolocalización:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (error) {
      setIsLoadingLocation(false);
      const errorMessage = 'Error inesperado al solicitar ubicación';
      setLocationError(errorMessage);
      console.error('Error inesperado:', error);
    }
  };

  const retryLocationRequest = () => {
    requestLocationPermission();
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
        {locationError || 'No se pudo obtener la ubicación'}
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
        paddingTop: Platform.OS === 'ios' ? 40 : 20,
      }}>
      <LogoSofy withMarginBotton={false} />
      <SwipeCard location={location} />
    </View>
  );
};
