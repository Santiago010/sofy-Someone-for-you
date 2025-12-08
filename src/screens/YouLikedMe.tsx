import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {CardViewWithoutAnimation} from '../components/CardViewWithoutAnimation';
import {DeviceDimensions} from '../helpers/DeviceDimensiones';

import {PayloadResponseMyLikes} from '../interfaces/interfacesApp';
import {colors} from '../theme/globalTheme';
import {ModalInfoUser} from '../components/ModalInfoUser';
import {useMyLikes} from '../hooks/useMyLikes';
import {useFocusEffect} from '@react-navigation/native';

export default function YouLikedMe() {
  const {widthWindow} = DeviceDimensions();
  const [modalVisible, setModalVisible] = useState(false);
  const [userToSee, setuserToSee] = useState<PayloadResponseMyLikes>(
    {} as PayloadResponseMyLikes,
  );
  const {myUsersLikes, loading, error, fetchLikes} = useMyLikes();
  const [focusedFetched, setFocusedFetched] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  useEffect(() => {
    if (isFocused && !focusedFetched) {
      // Llama a la primera página, ajusta si necesitas otro valor
      fetchLikes();
      setFocusedFetched(true);
    }
    if (!isFocused) {
      setFocusedFetched(false);
    }
  }, [isFocused, fetchLikes, focusedFetched]);

  // Calcular dimensiones para el grid
  const numColumns = 2;
  const spacing = 15;
  const cardWidth = (widthWindow - spacing * (numColumns + 1)) / numColumns;
  const cardHeight = cardWidth * 2.2; // Proporción 7:10

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleModalWithUser = (user: PayloadResponseMyLikes) => {
    setuserToSee(user);
    setModalVisible(!modalVisible);
  };

  const renderCard = ({
    item,
    index,
  }: {
    item: PayloadResponseMyLikes;
    index: number;
  }) => (
    <View
      style={[
        styles.cardContainer,
        {marginLeft: index % numColumns === 0 ? spacing : spacing / 2},
      ]}>
      <CardViewWithoutAnimation
        card={item}
        index={index}
        width={cardWidth}
        height={cardHeight}
        toggleModalWithUser={toggleModalWithUser}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Users you like</Text>
        <Text style={styles.subtitle}>Find out who you like</Text>
      </View>

      {loading ? (
        <Text style={styles.subtitle}>Loading...</Text>
      ) : error ? (
        <Text style={styles.subtitle}>Try later or close section</Text>
      ) : myUsersLikes.length === 0 ? (
        <Text style={styles.subtitle}>
          you have not yet given any user a like
        </Text>
      ) : (
        <FlatList
          data={myUsersLikes}
          renderItem={renderCard}
          keyExtractor={item => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Renderizar el modal solo si está visible y hay usuario válido */}
      {modalVisible && userToSee.toIndividual !== null && (
        <ModalInfoUser
          user={userToSee}
          originScreen={'YouLikedMe'}
          modalVisible={modalVisible}
          completeInfo={true}
          toggleModal={toggleModal}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,

    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center' as const,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  gridContainer: {},
  cardContainer: {
    marginBottom: 15,
    alignItems: 'center' as const,
  },
});
