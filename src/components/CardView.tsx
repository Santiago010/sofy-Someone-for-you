import React, {FC, memo, useEffect, useState} from 'react';
import {PayloadDetails} from '../interfaces/interfacesApp';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {DeviceDimensions} from '../helpers/DeviceDimensiones';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../theme/globalTheme';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {Chip} from 'react-native-paper';
import {resolveLocalhostUrl} from '../helpers/GetImageTemp';

const {heightWindow, widthWindow} = DeviceDimensions();
const ROTATION_RANGE = 15;

interface CardViewProps {
  card: PayloadDetails;
  index: number;
  totalCards: any;
  panHandlers: any;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  nextCardScale: SharedValue<number>;
  onLike?: () => void;
  onDislike?: () => void;
}

const CardView: FC<CardViewProps> = ({
  card,
  index,
  totalCards,
  translateX,
  translateY,
  nextCardScale,
  panHandlers,
  onLike,
  onDislike,
}) => {
  const [showBtnChangeImagetoLeft, setShowBtnChangeImagetoLeft] =
    useState(false);
  const [showBtnChangeImagetoRight, setShowBtnChangeImagetoRight] =
    useState(true);
  const [positionContainerImage, setpositionContainerImage] = useState(0);
  const isTopCard = index === 0;
  const isSecondCard = index === 1;

  const leftOffset = useSharedValue(0);
  const cardScale = useSharedValue(isTopCard ? 1 : isSecondCard ? 0.9 : 0.8);
  const cardOpacity = useSharedValue(isTopCard ? 1 : isSecondCard ? 0.9 : 0.8);

  useEffect(() => {
    const targetOffset = isTopCard ? 10 : -25;
    leftOffset.value = withTiming(targetOffset, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [index, isTopCard, leftOffset]);

  useEffect(() => {
    const targetScale = isTopCard ? 1 : isSecondCard ? 0.8 : 0.7;
    cardScale.value = withTiming(targetScale, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });

    const targetOpacity = isTopCard ? 1 : isSecondCard ? 0.9 : 0;

    cardOpacity.value = withTiming(targetOpacity, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [index, isTopCard, isSecondCard, cardScale, cardOpacity]);

  const animationStyle = useAnimatedStyle(() => {
    const currentX = isTopCard ? translateX.value : 0;
    const currentY = isTopCard ? translateY.value : 0;

    const rotate = interpolate(
      currentX,
      [-widthWindow / 2, 0, widthWindow / 2],
      [-ROTATION_RANGE, 0, ROTATION_RANGE],
      Extrapolation.CLAMP,
    );

    const distance = Math.sqrt(currentX * currentX + currentY * currentY);
    const opacity = interpolate(
      distance,
      [0, widthWindow * 0.5],
      [1, 0],
      Extrapolation.CLAMP,
    );

    const scale = isTopCard ? 1 : isSecondCard ? nextCardScale.value : 0.8;
    return {
      transform: [
        {translateX: currentX + leftOffset.value},
        {translateY: currentY},
        {rotate: ` ${rotate}deg`},
        {scale},
      ],
      opacity: isTopCard ? opacity : cardOpacity.value,
      zIndex: totalCards - index,
    };
  });

  // Nuevo: estilo animado para el fondo que cambia con el swipe
  const backgroundStyle = useAnimatedStyle(() => {
    const currentX = isTopCard ? translateX.value : 0;

    let backgroundColor = colors.background; // Color por defecto

    if (currentX > 10) {
      // Umbral mínimo para evitar cambios por movimientos pequeños
      backgroundColor = colors.success;
    } else if (currentX < -10) {
      backgroundColor = colors.error;
    }

    return {
      backgroundColor,
    };
  });

  useEffect(() => {
    if (positionContainerImage === 5) {
      setShowBtnChangeImagetoRight(false);
    }

    if (positionContainerImage === 0) {
      setShowBtnChangeImagetoLeft(false);
    }
  }, [positionContainerImage]);

  const changeImageToRight = () => {
    setShowBtnChangeImagetoLeft(true);
    if (positionContainerImage <= 5) {
      setpositionContainerImage(positionContainerImage + 1);
    }
  };

  const changeImageToLeft = () => {
    setShowBtnChangeImagetoRight(true);
    if (showBtnChangeImagetoLeft) {
      setpositionContainerImage(positionContainerImage - 1);
    }
  };

  return (
    <Animated.View style={[styles.card, animationStyle]} {...panHandlers}>
      <Animated.View style={[styles.cardImage, backgroundStyle]}>
        <Image
          source={{
            uri: resolveLocalhostUrl(
              card.individualFiles[positionContainerImage]?.file.url,
            ),
          }}
          style={styles.image}
        />
      </Animated.View>
      <View style={styles.cardFooter}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 70,
          }}>
          <TouchableOpacity
            style={{opacity: showBtnChangeImagetoLeft ? 1 : 0}}
            onPress={() => changeImageToLeft()}>
            <MaterialDesignIcons
              name="arrow-left-circle-outline"
              size={43}
              color={colors.backgroundSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{opacity: showBtnChangeImagetoRight ? 1 : 0}}
            onPress={() => changeImageToRight()}>
            <MaterialDesignIcons
              name="arrow-right-circle-outline"
              size={43}
              color={colors.backgroundSecondary}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.cardFooterName}>
            {card.name} {card.lastname}
          </Text>
          <Text style={styles.cardFooterAge}>, {card.age}</Text>
        </View>

        {positionContainerImage === 0 ? (
          <View style={{height: 110}}>
            <View style={styles.boxInterest}>
              <MaterialDesignIcons
                name="library"
                size={20}
                color={colors.backgroundSecondary}
              />
              <Text
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  color: colors.backgroundSecondary,
                  fontSize: 20,
                }}>
                Interests
              </Text>
            </View>
            <View style={styles.interestContainer}>
              {card.categories.map(category => (
                <Chip
                  key={category.id}
                  mode="flat"
                  onPress={() => {}}
                  style={{
                    margin: 2,
                    backgroundColor: colors.text,
                    opacity: 0.8,
                  }}
                  textStyle={{
                    color: colors.backgroundSecondary,
                  }}>
                  {category.name}
                </Chip>
              ))}
            </View>
          </View>
        ) : (
          <View style={{height: 110}}>
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.backgroundSecondary,
                fontSize: 22,
              }}>
              About Me:
            </Text>
            <Text
              style={{
                fontWeight: '300',
                color: colors.backgroundSecondary,
                fontSize: 16,
              }}>
              {card.description}
            </Text>
          </View>
        )}

        {isTopCard && onLike && onDislike && (
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity onPress={onDislike} style={styles.actionBtn}>
              <MaterialDesignIcons
                name="close"
                size={30}
                color={colors.error}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onLike} style={styles.actionBtn}>
              <MaterialDesignIcons
                name="cards-heart"
                size={30}
                color={colors.success}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default memo(CardView);

const styles = StyleSheet.create({
  card: {
    marginTop: 0,
    width: widthWindow * 0.8,
    height: heightWindow * 0.7,
    backgroundColor: colors.background,
    borderRadius: 15,
    position: 'absolute',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    height: '100%',
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  cardFooter: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  cardFooterName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.backgroundSecondary,
  },
  cardFooterAge: {
    fontSize: 26,
    color: colors.backgroundSecondary,
  },
  boxInterest: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    width: '100%',
  },
  actionBtn: {
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
});
