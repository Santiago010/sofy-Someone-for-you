import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  PanResponder,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {colors, commonStyles} from '../theme/globalTheme';
import {DeviceDimensions} from '../helpers/DeviceDimensiones';
import {PayloadRecomendationsResponse} from '../interfaces/interfacesApp';
import {Text} from 'react-native-paper';
import CardView from './CardView';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import useRecomendations from '../hooks/useRecomendations';
import {BarIndicator} from 'react-native-indicators';
import {useLikeOrDislike} from '../hooks/useLikeOrDislike';

interface Location {
  latitude: number | null;
  longitude: number | null;
}

interface SwipeCardProps {
  locationError?: string | null;
  isLoadingLocation?: boolean;
  location?: Location;
  retryLocationRequest: () => void;
  isFocused: boolean;
}

const {heightWindow, widthWindow} = DeviceDimensions();
const SWIPE_THRESHOLD = widthWindow * 0.25;
const SWIPE_OUT_DURATION = 250;
const REST_DURATION = 300;

export default function SwipeCard({
  location,
  isLoadingLocation,
  locationError,
  retryLocationRequest,
  isFocused,
}: SwipeCardProps) {
  // --- TODOS LOS HOOKS VAN AQUÍ ---
  const {
    recomendations,
    fetchRecomendations,
    setRecomendations,
    error,
    loading,
    currentPage,
    hasMorePages,
    isFetching,
  } = useRecomendations();
  const {like, dislike} = useLikeOrDislike();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dummyTranslate = useSharedValue(0);
  const nextCardScale = useSharedValue(0.9);

  const [requestedRecs, setRequestedRecs] = useState(false);
  const [focusedFetched, setFocusedFetched] = useState(false);

  // Ref para manejar el nextPage
  const nextPageRef = useRef(1);

  // --- LÓGICA DE EFECTOS ---
  useEffect(() => {
    if (
      location &&
      location.latitude != null &&
      location.longitude != null &&
      !requestedRecs
    ) {
      fetchRecomendations(
        location.latitude,
        location.longitude,
        10,
        nextPageRef.current,
      );
      setRequestedRecs(true);
    }
  }, [location, requestedRecs, fetchRecomendations]);

  // Efecto para cargar más recomendaciones cuando quedan pocas
  useEffect(() => {
    if (
      recomendations &&
      hasMorePages &&
      recomendations.length &&
      !isFetching &&
      location &&
      location.latitude != null &&
      location.longitude != null
    ) {
      nextPageRef.current = nextPageRef.current + 1;
      fetchRecomendations(
        location.latitude,
        location.longitude,
        10,
        nextPageRef.current,
      );
      console.log(
        'entra al if de use Effect donde esta en fetchRecomendations',
      );
    }
  }, [
    recomendations,
    hasMorePages,
    isFetching,
    currentPage,
    location,
    fetchRecomendations,
  ]);

  // --- NUEVO EFECTO PARA isFocused ---
  useEffect(() => {
    if (
      isFocused &&
      !focusedFetched &&
      location &&
      location.latitude != null &&
      location.longitude != null
    ) {
      nextPageRef.current = 1; // Reinicia el contador cuando se hace focus
      fetchRecomendations(
        location.latitude,
        location.longitude,
        10,
        nextPageRef.current,
      );
      setFocusedFetched(true);
    }
    if (!isFocused) {
      setFocusedFetched(false);
    }
  }, [isFocused, location, fetchRecomendations, focusedFetched]);

  // --- FUNCIONES ---
  const resetPosition = useCallback(() => {
    translateX.value = withTiming(0, {duration: REST_DURATION});
    translateY.value = withTiming(0, {duration: REST_DURATION});
    nextCardScale.value = withTiming(0.9, {duration: REST_DURATION});
  }, [translateX, translateY, nextCardScale]);

  // onSwipeComplete ya no usa useCallback, así accede siempre al estado más reciente
  function onSwipeComplete(direccion: 'right' | 'left' | 'up' | 'down') {
    const action =
      direccion === 'right' || direccion === 'up' ? 'LIKED' : 'DISLIKED';
    console.log(action);

    setRecomendations(prev => {
      if (prev.length > 0) {
        const currentCardId = prev[0].id;
        // Llama a like o dislike según la dirección
        if (direccion === 'right') {
          like(currentCardId);
        } else if (direccion === 'left') {
          dislike(currentCardId);
        }
        // Elimina la primera tarjeta
        const newRecs = prev.slice(1);
        // Animaciones
        translateX.value = 0;
        translateY.value = 0;
        nextCardScale.value = 0.8;
        nextCardScale.value = withDelay(
          100,
          withTiming(0.9, {duration: 400, easing: Easing.exp}),
        );
        return newRecs;
      } else {
        // Si no hay tarjetas, resetea la posición
        resetPosition();
        return prev;
      }
    });
  }

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

  const forceSwipe = useCallback(
    (direccion: 'right' | 'left' | 'up' | 'down') => {
      const swipeConfig = {
        right: {x: widthWindow * 1.5, y: 0},
        left: {x: -widthWindow * 1.5, y: 0},
        up: {x: 0, y: heightWindow * 1.5},
        down: {x: 0, y: -heightWindow * 1.5},
      };

      translateX.value = withTiming(swipeConfig[direccion].x, {
        duration: SWIPE_OUT_DURATION,
      });

      translateY.value = withTiming(
        swipeConfig[direccion].y,
        {
          duration: SWIPE_OUT_DURATION,
        },
        () => runOnJS(onSwipeComplete)(direccion),
      );
    },
    [translateX, translateY], // ya no depende de recomendations ni de onSwipeComplete
  );

  const handleLike = useCallback(() => forceSwipe('right'), [forceSwipe]);
  const handleDisliked = useCallback(() => forceSwipe('left'), [forceSwipe]);

  const panResponder = useRef(
    PanResponder.create({
      // Antes: siempre true -> bloqueaba los TouchableOpacity
      onStartShouldSetPanResponder: () => false,
      // Solo activar el gesto si se supera un pequeño umbral de movimiento
      onMoveShouldSetPanResponder: (e, gesture) =>
        Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4,
      onPanResponderMove: (e, gesture) => {
        translateX.value = gesture.dx;
        translateY.value = gesture.dy;
        const dragDistance = Math.sqrt(gesture.dx ** 2 + gesture.dy ** 2);
        const progress = Math.min(dragDistance / SWIPE_THRESHOLD, 1);
        nextCardScale.value = 0.9 + 0.1 * progress;
      },
      onPanResponderRelease: (e, gesture) => {
        const adbDx = Math.abs(gesture.dx);
        const adbDY = Math.abs(gesture.dy);

        if (adbDx > adbDY) {
          // Movimiento dominante es vertical (up/down)
          if (gesture.dy < -SWIPE_THRESHOLD) {
            forceSwipe('up');
          } else if (gesture.dy > SWIPE_THRESHOLD) {
            forceSwipe('down');
          } else {
            resetPosition();
          }
        } else {
          // Movimiento dominante es horizontal (left/right)
          if (gesture.dx > SWIPE_THRESHOLD) {
            forceSwipe('right');
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            forceSwipe('left');
          } else {
            resetPosition();
          }
        }
      },
    }),
  ).current;
  const renderCard = useCallback(
    (card: PayloadRecomendationsResponse, index: number) => (
      <CardView
        key={card.id}
        card={card}
        index={index}
        panHandlers={index === 0 ? panResponder.panHandlers : {}}
        totalCards={recomendations.length}
        nextCardScale={index === 1 ? nextCardScale : dummyTranslate}
        translateX={index === 0 ? translateX : dummyTranslate}
        translateY={index === 0 ? translateY : dummyTranslate}
        onLike={handleLike}
        onDislike={handleDisliked}
      />
    ),
    [
      recomendations,
      translateX,
      translateY,
      nextCardScale,
      panResponder.panHandlers,
      dummyTranslate,
      handleLike,
      handleDisliked,
    ],
  );

  // --- RENDER ---
  let content;
  if (isLoadingLocation) {
    content = (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <BarIndicator count={4} size={50} color={colors.primary} />
        <Text style={{color: colors.text, marginBottom: 20, fontSize: 18}}>
          Loading Location...
        </Text>
      </View>
    );
  } else if (locationError || !location?.latitude || !location?.longitude) {
    content = renderLocationError();
  } else if (loading) {
    content = (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <BarIndicator count={4} size={50} color={colors.primary} />
        <Text style={{color: colors.text, marginBottom: 20, fontSize: 18}}>
          Loading Users ...
        </Text>
      </View>
    );
  } else {
    content = (
      <View
        style={{
          ...commonStyles.container,
          alignItems: 'center',
        }}>
        {(recomendations?.length || 0) === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Ups No more User for you</Text>
          </View>
        ) : (
          <>{(recomendations || []).map(renderCard).reverse()}</>
        )}
      </View>
    );
  }

  // --- SIEMPRE UN SOLO RETURN ---
  return content;
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: colors.text,
  },
});
