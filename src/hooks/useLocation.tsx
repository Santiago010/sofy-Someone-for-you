import {useState, useEffect, useCallback} from 'react';
import {Platform} from 'react-native';
import {PERMISSIONS, check, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import axios, {AxiosError} from 'axios';

interface Location {
  latitude: number | null;
  longitude: number | null;
}

interface UseLocationReturn {
  location: Location;
  address: string | null;
  locationError: string | null;
  isLoadingLocation: boolean;
  requestLocationPermission: () => Promise<void>;
  retryLocationRequest: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
  });
  const [address, setAddress] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SofyApp/1.0',
          },
        },
      );

      const data = await response.data;

      // Construir dirección legible
      const addressParts = [];
      if (data.address.road) addressParts.push(data.address.road);
      if (data.address.suburb) addressParts.push(data.address.suburb);
      if (data.address.city) addressParts.push(data.address.city);
      if (data.address.state) addressParts.push(data.address.state);
      if (data.address.country) addressParts.push(data.address.country);

      const formattedAddress = addressParts.join(', ') || data.display_name;
      setAddress(formattedAddress);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const requestLocationPermission = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      if (Platform.OS === 'ios') {
        const permissionStatus = await check(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );

        if (permissionStatus === 'denied') {
          const requestStatus = await request(
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          );
          if (requestStatus !== 'granted') {
            throw new Error('Permisos de ubicación denegados');
          }
        } else if (permissionStatus !== 'granted') {
          throw new Error('Permisos de ubicación requeridos');
        }
      }

      // Solicitar ubicación actual con popup nativo
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          setLocation({latitude, longitude});

          // Realizar geocodificación inversa
          await reverseGeocode(latitude, longitude);

          setIsLoadingLocation(false);
          //   console.log('Ubicación obtenida:', {latitude, longitude});
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
  }, []);

  const retryLocationRequest = useCallback(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  return {
    location,
    address,
    locationError,
    isLoadingLocation,
    requestLocationPermission,
    retryLocationRequest,
  };
};
