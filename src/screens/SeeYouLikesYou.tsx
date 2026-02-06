import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {colors} from '../theme/globalTheme';
import {CardViewWithoutAnimation2} from '../components/CardViewWithoutAnimation2';
import {DeviceDimensions} from '../helpers/DeviceDimensiones';
import {useWhoLikesMe} from '../hooks/useWhoLikeMe';
import {PayloadResInteractionsWithMe} from '../interfaces/interfacesApp';
import {ModalInfoUser2} from '../components/ModalInfoUser2';
import {useFocusEffect} from '@react-navigation/native';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';
import ModalInfoPlanConnect from '../components/ModalInfoPlanConnect';
import {AuthContext} from '../context/authContext/authContext';

export default function SeeWhoLikesYou() {
  const {whoLikesMe, loading, error, fetchWhoLikedMe} = useWhoLikesMe();
  const {isConnect, suscriptions} = useContext(PurchasesContext);
  const {idUserForChats} = useContext(AuthContext);
  const {widthWindow} = DeviceDimensions();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleMatch, setModalVisibleMatch] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userToSee, setuserToSee] = useState<PayloadResInteractionsWithMe>(
    {} as PayloadResInteractionsWithMe,
  );

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const INTERACTION_TYPES = ['COMPLIMENT', 'SUPERLIKE', 'LIKE'];



  const [isFocused, setIsFocused] = useState(false);
  const [focusedFetched, setFocusedFetched] = useState(false);
  const [modalVisibleSofyConnect, setModalVisibleSofyConnect] = useState(false);

  const toggleFilter = (type: string) => {
    if (selectedFilters.includes(type)) {
      setSelectedFilters(selectedFilters.filter(item => item !== type));
    } else {
      setSelectedFilters([...selectedFilters, type]);
    }
  };

  const filteredUsers =
    selectedFilters.length > 0
      ? whoLikesMe.filter(user =>
          selectedFilters.includes(user.interactionType),
        )
      : whoLikesMe;

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

  const toggleModalWithUser = (user: PayloadResInteractionsWithMe) => {
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
    item: PayloadResInteractionsWithMe;
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
        isConnect={isConnect}
        setModalVisibleSofyConnect={() => setModalVisibleSofyConnect(true)}
        isBlur={item.interactionType === 'LIKE'}
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
        {!loading && (
          <View style={styles.chipsWrapper}>
            {INTERACTION_TYPES.map(type => {
              const isSelected = selectedFilters.includes(type);
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.modalChip,
                    isSelected
                      ? styles.modalChipSelected
                      : styles.modalChipUnselected,
                  ]}
                  onPress={() => toggleFilter(type)}>
                  <Text
                    style={[
                      styles.modalChipText,
                      isSelected
                        ? styles.modalChipTextSelected
                        : styles.modalChipTextUnselected,
                    ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {loading ? (
        <Text style={styles.subtitle}>Loading...</Text>
      ) : error ? (
        <Text style={styles.subtitle}>Try later or close section</Text>
      ) : whoLikesMe.length === 0 ? (
        <Text style={styles.subtitle}>You have no interactions yet</Text>
      ) : (
        <FlatList
          data={filteredUsers}
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
          modalVisible={modalVisible}
          toggleModal={toggleModal}
          toggleModalToMatch={toggleModalToMatch}
        />
      )}
      {/* Renderizar el modal siempre, no condicionalmente */}
      <ModalInfoPlanConnect
        modalVisible={modalVisibleSofyConnect}
        setModalVisible={setModalVisibleSofyConnect}
        productFromProfile={suscriptions[0]}
        userIdRef={idUserForChats}
      />
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
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
  },
  modalChip: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
  },
  modalChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modalChipUnselected: {
    backgroundColor: 'transparent',
    borderColor: colors.textSecondary,
  },
  modalChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalChipTextSelected: {
    color: '#fff',
  },
  modalChipTextUnselected: {
    color: colors.textSecondary,
  },
});
