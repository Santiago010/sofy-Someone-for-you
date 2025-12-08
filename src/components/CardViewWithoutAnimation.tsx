import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../theme/globalTheme';
import {Chip} from 'react-native-paper';
import {PayloadResponseMyLikes} from '../interfaces/interfacesApp';
interface CardViewWithoutAnimationProps {
  card: PayloadResponseMyLikes;
  index: number;
  width?: number;
  height?: number;
  toggleModalWithUser: (user: PayloadResponseMyLikes) => void;
}

export const CardViewWithoutAnimation: FC<CardViewWithoutAnimationProps> = ({
  card,
  width = 200,
  height = 400,
  toggleModalWithUser,
}) => {
  const dynamicStyles = styles(width, height);

  return (
    <TouchableOpacity
      style={dynamicStyles.card}
      onPress={() => toggleModalWithUser(card)}>
      <View style={dynamicStyles.cardImage}>
        <Image
          source={{
            uri: card.toIndividual.individualFiles[0]?.file.url,
          }}
          style={dynamicStyles.image}
        />
      </View>
      <View style={dynamicStyles.cardFooter}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <Text style={dynamicStyles.cardFooterName}>
            {card.toIndividual.name} {card.toIndividual.lastname}
          </Text>
          <Text style={dynamicStyles.cardFooterAge}>
            {card.toIndividual.age}
          </Text>
        </View>

        <View style={{height: height * 0.55}}>
          <View style={dynamicStyles.boxInterest}>
            <MaterialDesignIcons
              name="library"
              size={Math.min(width, height) * 0.1}
              color={colors.backgroundSecondary}
            />
            <Text
              style={{
                marginLeft: 10,
                fontWeight: 'bold',
                color: colors.backgroundSecondary,
                fontSize: Math.min(width, height) * 0.1,
              }}>
              Interests
            </Text>
          </View>
          <View style={dynamicStyles.interestContainer}>
            {card.toIndividual.categories.map(category => (
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
                  fontSize: Math.min(width, height) * 0.07,
                }}>
                {category.name}
              </Chip>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = (width: number, height: number) =>
  StyleSheet.create({
    card: {
      marginTop: 10,
      width,
      height,
      backgroundColor: colors.background,
      borderRadius: 15,
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
      height: '58%',
      zIndex: 1,
      position: 'absolute',
      bottom: 0,
      marginLeft: 6,
    },
    cardFooterName: {
      fontSize: Math.min(width, height) * 0.12,
      fontWeight: 'bold',
      color: colors.backgroundSecondary,
    },
    cardFooterAge: {
      fontSize: Math.min(width, height) * 0.11,
      color: colors.backgroundSecondary,
    },
    boxInterest: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    interestContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 2,
    },
  });
