import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {colors} from '../theme/globalTheme';
import {CardViewWithoutAnimation2} from '../components/CardViewWithoutAnimation2';
import {DeviceDimensions} from '../helpers/DeviceDimensiones';
import {ModalMatch} from '../components/ModalMatch';
import {useWhoLikesMe} from '../hooks/useWhoLikeMe';
import {PayloadWhoLikedMe} from '../interfaces/interfacesApp';
import {ModalInfoUser2} from '../components/ModalInfoUser2';
import {useFocusEffect} from '@react-navigation/native';

export default function SeeWhoLikesYou() {
  const {whoLikesMe, loading, error, fetchWhoLikedMe} = useWhoLikesMe();
  const {widthWindow} = DeviceDimensions();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleMatch, setModalVisibleMatch] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userToSee, setuserToSee] = useState<PayloadWhoLikedMe>(
    {} as PayloadWhoLikedMe,
  );

  const [isFocused, setIsFocused] = useState(false);
  const [focusedFetched, setFocusedFetched] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  useEffect(() => {
    if (isFocused && !focusedFetched) {
      // Llama a la primera página, ajusta si necesitas otro valor
      fetchWhoLikedMe();
      setFocusedFetched(true);
    }
    if (!isFocused) {
      setFocusedFetched(false);
    }
  }, [isFocused, fetchWhoLikedMe, focusedFetched]);

  // Calcular dimensiones para el grid
  const numColumns = 2;
  const spacing = 15;
  const cardWidth = (widthWindow - spacing * (numColumns + 1)) / numColumns;
  const cardHeight = cardWidth * 2.2; // Proporción 7:10

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleModalWithUser = (user: PayloadWhoLikedMe) => {
    setuserToSee(user);
    setModalVisible(!modalVisible);
  };

  const toggleModalMatch = () => {
    setModalVisibleMatch(!modalVisibleMatch);
  };

  const toggleModalToMatch = () => {
    setModalVisible(false);
    setModalVisibleMatch(true);
  };

  const renderCard = ({
    item,
    index,
  }: {
    item: PayloadWhoLikedMe;
    index: number;
  }) => (
    <View
      style={[
        styles.cardContainer,
        {marginLeft: index % numColumns === 0 ? spacing : spacing / 2},
      ]}>
      <CardViewWithoutAnimation2
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
        <Text style={styles.title}>See who likes you</Text>
        <Text style={styles.subtitle}>
          Find out who showed interest in your profile
        </Text>
      </View>

      {loading ? (
        <Text style={styles.subtitle}>Loading...</Text>
      ) : error ? (
        <Text style={styles.subtitle}>Try later or close section</Text>
      ) : whoLikesMe.length === 0 ? (
        <Text style={styles.subtitle}>
          you have not yet given any user a like
        </Text>
      ) : (
        <FlatList
          data={whoLikesMe}
          renderItem={renderCard}
          keyExtractor={item => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Renderizar el modal solo si está visible y hay usuario válido */}
      {modalVisible && userToSee.fromIndividual !== null && (
        <ModalInfoUser2
          user={userToSee}
          originScreen={'SeeWhoLikesYou'}
          modalVisible={modalVisible}
          toggleModal={toggleModal}
          toggleModalToMatch={toggleModalToMatch}
        />
      )}

      {modalVisibleMatch && userToSee.fromIndividual !== null && (
        <ModalMatch
          user={userToSee}
          modalVisible={modalVisibleMatch}
          toggleModal={toggleModalMatch}
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
