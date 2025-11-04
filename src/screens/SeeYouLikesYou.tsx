import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {colors} from '../theme/globalTheme';
import {CardViewWithoutAnimation} from '../components/CardViewWithoutAnimation';
import {DeviceDimensions} from '../helpers/DeviceDimensiones';
import {ModalInfoUser} from '../components/ModalInfoUser';
import {data} from '../animations/data/data';
import {PayloadDetails} from '../interfaces/interfacesApp';

export default function SeeWhoLikesYou() {
  const {widthWindow} = DeviceDimensions();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [modalVisible, setModalVisible] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [userToSee, setuserToSee] = useState({});

  // Calcular dimensiones para el grid
  const numColumns = 2;
  const spacing = 15;
  const cardWidth = (widthWindow - spacing * (numColumns + 1)) / numColumns;
  const cardHeight = cardWidth * 2.2; // Proporción 7:10

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleModalWithUser = (user: any) => {
    setuserToSee(user);
    setModalVisible(!modalVisible);
  };

  const renderCard = ({item, index}: {item: PayloadDetails; index: number}) => (
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
        <Text style={styles.title}>See who likes you</Text>
        <Text style={styles.subtitle}>
          Find out who showed interest in your profile
        </Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      <ModalInfoUser
        user={userToSee}
        modalVisible={modalVisible}
        completeInfo={true}
        toggleModal={toggleModal}
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
});
