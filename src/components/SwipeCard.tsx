import React, {useCallback, useEffect, useRef, useState} from 'react';
import {PanResponder, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors, commonStyles} from '../theme/globalTheme';
import {DeviceDimensions} from '../helpers/DeviceDimensiones';
import {data} from '../animations/data/data';
import {CardSwipe} from '../interfaces/interfacesApp';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {Text} from 'react-native-paper';
import CardView from './CardView';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface Location {
  latitude: number | null;
  longitude: number | null;
}

interface SwipeCardProps {
  location?: Location;
}

const {heightWindow, widthWindow} = DeviceDimensions();
const SWIPE_THRESHOLD = widthWindow * 0.25;
const SWIPE_OUT_DURATION = 250;
const REST_DURATION = 300;
const datami = data;
const sizeIcons = 30;

export default function SwipeCard({location}: SwipeCardProps) {
  const [data, setData] = useState<CardSwipe[]>(datami);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dummyTranslate = useSharedValue(0);
  const nextCardScale = useSharedValue(0.9);

  const resetPosition = useCallback(() => {
    translateX.value = withTiming(0, {duration: REST_DURATION});
    translateY.value = withTiming(0, {duration: REST_DURATION});
    nextCardScale.value = withTiming(0.9, {duration: REST_DURATION});
  }, []);

  const onSwipeComplete = useCallback(
    (direccion: 'right' | 'left' | 'up' | 'down') => {
      const action =
        direccion === 'right' || direccion === 'up' ? 'LIKED' : 'DISLIKED';

      console.log('action -->', action, data[0]?.firstName);

      if (data.length > 0) {
        setData(pre => pre.slice(1));
        translateX.value = 0;
        translateY.value = 0;

        nextCardScale.value = 0.8;
        nextCardScale.value = withDelay(
          100,
          withTiming(0.9, {duration: 400, easing: Easing.exp}),
        );
      } else {
        resetPosition();
      }
    },
    [data, nextCardScale, resetPosition, translateX, translateY],
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      console.log('Ubicación recibida en SwipeCard:', location);
      // Aquí puedes usar la ubicación para filtrar usuarios cercanos,
      // hacer llamadas API con parámetros de ubicación, etc.
    }
  }, [location]);

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
    [onSwipeComplete, translateX, translateY],
  );

  const handleLike = useCallback(() => forceSwipe('right'), [forceSwipe]);
  const handleDisliked = useCallback(() => forceSwipe('left'), [forceSwipe]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
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
    (card: CardSwipe, index: number) => (
      <CardView
        key={card.id}
        card={card}
        index={index}
        panHandlers={index === 0 ? panResponder.panHandlers : {}}
        totalCards={data.length}
        nextCardScale={index === 1 ? nextCardScale : dummyTranslate}
        translateX={index === 0 ? translateX : dummyTranslate}
        translateY={index === 0 ? translateY : dummyTranslate}
      />
    ),
    [
      data.length,
      translateX,
      translateY,
      nextCardScale,
      panResponder.panHandlers,
      dummyTranslate,
    ],
  );

  return (
    <View
      style={{
        ...commonStyles.container,
        alignItems: 'center',
      }}>
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No More Cards</Text>
        </View>
      ) : (
        <>
          {data.map(renderCard).reverse()}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleDisliked} style={styles.btn}>
              <MaterialDesignIcons
                name="close"
                size={sizeIcons}
                color={colors.error}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLike} style={styles.btn}>
              <MaterialDesignIcons
                name="cards-heart"
                size={sizeIcons}
                color={colors.success}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  btn: {
    backgroundColor: colors.background,
    height: 70,
    width: 70,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    elevation: 5,
  },
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
