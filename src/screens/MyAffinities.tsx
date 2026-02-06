import React, {useContext, useEffect, useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ListRenderItem,
  Platform,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import useMyAffinities from '../hooks/useMyAffinities';
import {AuthContext} from '../context/authContext/authContext';
import {InterestAndSubInterestResponse} from '../interfaces/interfacesApp';
import {BarIndicator} from 'react-native-indicators';
import {colors, commonStyles} from '../theme/globalTheme';
import {ListGetUserForInterest} from '../interfaces/interfacesForAffinities';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import LogoSofyMin from '../components/LogoSofyMin';
import useGetInterestWithSubInterest from '../hooks/getInterestWithSubInterest';
import {Button} from 'react-native-paper';
import {useLikeOrDislike} from '../hooks/useLikeOrDislike';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';
import {ModalForCompliment} from '../components/ModalForCompliment';
import {ModalMessageSuperLike} from '../components/ModalMessageSuperLike';
import {AffinitiesContext} from '../context/AffinitiesContext/AffinitiesContext';
import {ModalMessageErrorConsumeProduct} from '../components/ModalMessageErrorConsumeProduct';
import ModalMessageWithoutProduct from './ModalMessageWithoutProduct';

const {height, width} = Dimensions.get('window');

interface AffinityItemProps {
  item: ListGetUserForInterest;
  onInteraction: (action: string) => void;
}

const AffinityItem = memo(({item, onInteraction}: AffinityItemProps) => {
  const [showBtnChangeImagetoLeft, setShowBtnChangeImagetoLeft] =
    useState(false);
  const [showBtnChangeImagetoRight, setShowBtnChangeImagetoRight] =
    useState(true);
  const [positionContainerImage, setpositionContainerImage] = useState(0);

  const maxIndex = (item.individualFiles?.length || 1) - 1;

  useEffect(() => {
    if (positionContainerImage >= maxIndex) {
      setShowBtnChangeImagetoRight(false);
    } else {
      setShowBtnChangeImagetoRight(true);
    }

    if (positionContainerImage === 0) {
      setShowBtnChangeImagetoLeft(false);
    } else {
      setShowBtnChangeImagetoLeft(true);
    }
  }, [positionContainerImage, maxIndex]);

  const changeImageToRight = () => {
    if (positionContainerImage < maxIndex) {
      setpositionContainerImage(prev => prev + 1);
    }
  };

  const changeImageToLeft = () => {
    if (positionContainerImage > 0) {
      setpositionContainerImage(prev => prev - 1);
    }
  };

  const imageUrl =
    item.individualFiles && item.individualFiles[positionContainerImage]
      ? item.individualFiles[positionContainerImage].file.url
      : 'https://via.placeholder.com/400';

  return (
    <View style={styles.itemContainer}>
      {/* Card taking full screen height approx */}
      <View style={styles.card}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{uri: imageUrl}}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Navigation Arrows Overlay */}
          <View style={styles.navigationContainer}>
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                disabled={!showBtnChangeImagetoLeft}
                style={{opacity: showBtnChangeImagetoLeft ? 1 : 0}}
                onPress={changeImageToLeft}>
                <MaterialDesignIcons
                  name="arrow-left-circle-outline"
                  size={43}
                  color={colors.backgroundSecondary}
                />
              </TouchableOpacity>
            ) : (
              <Pressable
                disabled={!showBtnChangeImagetoLeft}
                style={{opacity: showBtnChangeImagetoLeft ? 1 : 0}}
                onPress={changeImageToLeft}>
                <MaterialDesignIcons
                  name="arrow-left-circle-outline"
                  size={43}
                  color={colors.backgroundSecondary}
                />
              </Pressable>
            )}

            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                disabled={!showBtnChangeImagetoRight}
                style={{opacity: showBtnChangeImagetoRight ? 1 : 0}}
                onPress={changeImageToRight}>
                <MaterialDesignIcons
                  name="arrow-right-circle-outline"
                  size={43}
                  color={colors.backgroundSecondary}
                />
              </TouchableOpacity>
            ) : (
              <Pressable
                disabled={!showBtnChangeImagetoRight}
                style={{opacity: showBtnChangeImagetoRight ? 1 : 0}}
                onPress={changeImageToRight}>
                <MaterialDesignIcons
                  name="arrow-right-circle-outline"
                  size={43}
                  color={colors.backgroundSecondary}
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            {item.name} {item.lastname}, {item.age}
          </Text>
          <Text style={styles.descriptionText} numberOfLines={3}>
            {item.description}
          </Text>

          {/* Chips */}
          <View style={styles.chipsContainer}>
            {item.categories &&
              item.categories.map((cat, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{cat.name}</Text>
                </View>
              ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Message Button */}
            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: colors.secondary}]}
              onPress={() => onInteraction('compliment')}>
              <MaterialDesignIcons
                name="message-flash"
                size={30}
                color={colors.backgroundSecondary}
              />
            </TouchableOpacity>

            {/* Star Button */}
            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: colors.primary}]}
              onPress={() => onInteraction('superlike')}>
              <MaterialDesignIcons
                name="star-four-points"
                size={30}
                color={colors.backgroundSecondary}
              />
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: colors.error}]}
              onPress={() => onInteraction('dislike')}>
              <MaterialDesignIcons
                name="close"
                size={30}
                color={colors.backgroundSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

const MyAffinities = () => {
  const {
    selectedInterests,
    setSelectedInterests,
    userList,
    setUserList,
    isInitialized,
  } = useContext(AffinitiesContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedInterests, setTempSelectedInterests] = useState<
    InterestAndSubInterestResponse[]
  >([]);

  // Interaction Modals State
  const [complimentModalVisible, setComplimentModalVisible] = useState(false);
  const [superLikeModalVisible, setSuperLikeModalVisible] = useState(false);
  const [withoutProductModalVisible, setWithoutProductModalVisible] =
    useState(false);
  const [errorConsumeModalVisible, setErrorConsumeModalVisible] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState<ListGetUserForInterest | null>(null);
  const [missingProduct, setMissingProduct] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {GetDetailsUser, detailsUser} = useContext(AuthContext);
  const {
    isConnect,
    amountOfSuperLikes,
    amountOfCompliments,
    consume,
    getBalanceProducts,
  } = useContext(PurchasesContext);
  const {superlike, dislike} = useLikeOrDislike();

  const {
    getListMyAffinities,
    listUserWithMyAffinities,
    isLoading,
    errorInGetListUser,
  } = useMyAffinities();

  const {
    data: allInterests,
    loading: loadingInterests,
    error: errorInterests,
  } = useGetInterestWithSubInterest();

  useEffect(() => {
    GetDetailsUser();
  }, [GetDetailsUser]);

  useEffect(() => {
    if (detailsUser) {
      if (!isInitialized) {
        const interestFromUser = detailsUser.categories || [];
        setSelectedInterests(interestFromUser);
      }
      getBalanceProducts(detailsUser.id);
    }
  }, [detailsUser, isInitialized]);

  useEffect(() => {
    if (selectedInterests.length > 0 && userList.length === 0) {
      getListMyAffinities(selectedInterests);
    }
  }, [selectedInterests, userList, getListMyAffinities]);

  useEffect(() => {
    if (listUserWithMyAffinities && listUserWithMyAffinities.length > 0) {
      setUserList(listUserWithMyAffinities);
    }
  }, [listUserWithMyAffinities, setUserList]);

  const removeUserFromList = useCallback(
    (id: number) => {
      setUserList(prev => prev.filter(user => user.id !== id));
      setSelectedItem(null);
    },
    [setUserList],
  );

  const openFilterModal = () => {
    setTempSelectedInterests(selectedInterests);
    setModalVisible(true);
  };

  const toggleInterest = (item: InterestAndSubInterestResponse) => {
    setTempSelectedInterests(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const applyFilter = () => {
    if (tempSelectedInterests.length > 0) {
      setSelectedInterests(tempSelectedInterests);
      setUserList([]);
      setModalVisible(false);
    }
  };

  const handleInteraction = async (
    action: string,
    item: ListGetUserForInterest,
  ) => {
    setSelectedItem(item);

    // Dislike logic (Always free?)
    if (action === 'dislike') {
      try {
        const res = await dislike(item.id);
        if (res) removeUserFromList(item.id);
      } catch (e) {
        console.error('Dislike Error', e);
      }
      return;
    }

    // Logic Flow for Paid Actions
    if (isConnect) {
      // PRO User
      if (action === 'compliment') {
        setComplimentModalVisible(true);
      } else if (action === 'superlike') {
        try {
          const res = await superlike(item.id);
          if (res) setSuperLikeModalVisible(true);
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      // FREE User
      let field: 'compliments' | 'superlikes' = 'compliments';
      let balance = 0;

      if (action === 'compliment') {
        field = 'compliments';
        balance = amountOfCompliments;
      } else if (action === 'superlike') {
        field = 'superlikes';
        balance = amountOfSuperLikes;
      }

      if (balance <= 0) {
        setMissingProduct(field);
        setWithoutProductModalVisible(true);
        return;
      }

      // Consume
      try {
        if (!detailsUser?.id) return;
        const res = await consume(detailsUser.id, field);

        // Assume success if no error thrown
        if (action === 'compliment') {
          setComplimentModalVisible(true);
        } else if (action === 'superlike') {
          const slRes = await superlike(item.id);
          if (slRes) setSuperLikeModalVisible(true);
        }
      } catch (error) {
        console.error('Consume Error', error);
        const msg =
          action === 'compliment'
            ? 'ups could not use compliment try later'
            : 'ups could not use superlike try later';
        setErrorMessage(msg);
        setErrorConsumeModalVisible(true);
      }
    }
  };

  const renderItem: ListRenderItem<ListGetUserForInterest> = useCallback(
    ({item}) => {
      return (
        <AffinityItem
          item={item}
          onInteraction={action => handleInteraction(action, item)}
        />
      );
    },
    [
      isConnect,
      amountOfCompliments,
      amountOfSuperLikes,
      detailsUser,
      removeUserFromList,
      handleInteraction,
    ],
  );

  if (isLoading && listUserWithMyAffinities.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.headerContainer}>
          <LogoSofyMin />
        </View>
        <BarIndicator count={4} size={50} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerButton} onPress={openFilterModal}>
          <MaterialDesignIcons name="tune" size={30} color={colors.text} />
        </TouchableOpacity>
        <LogoSofyMin />
      </View>

      <FlatList
        data={userList}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialDesignIcons
              name="account-alert"
              color={colors.text}
              size={50}
            />
            <Text style={styles.emptyText}>
              No users found with these interests, or you have already seen
              everyone.
            </Text>
          </View>
        )}
        // Using snapToInterval or pagingEnabled expects items to be full height of scroll view
      />

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select some interest</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialDesignIcons
                  name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            {loadingInterests ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading interests...</Text>
              </View>
            ) : errorInterests ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading interests</Text>
              </View>
            ) : (
              <ScrollView contentContainerStyle={styles.interestsScroll}>
                <View style={styles.chipsWrapper}>
                  {allInterests &&
                    allInterests.map(item => {
                      const isSelected = tempSelectedInterests.some(
                        i => i.id === item.id,
                      );
                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={[
                            styles.modalChip,
                            isSelected
                              ? styles.modalChipSelected
                              : styles.modalChipUnselected,
                          ]}
                          onPress={() => toggleInterest(item)}>
                          <Text
                            style={[
                              styles.modalChipText,
                              isSelected
                                ? styles.modalChipTextSelected
                                : styles.modalChipTextUnselected,
                            ]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <Button
                mode="contained"
                onPress={applyFilter}
                disabled={tempSelectedInterests.length === 0}
                style={commonStyles.primaryButton}
                labelStyle={commonStyles.primaryButtonText}>
                Filter
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <ModalForCompliment
        modalVisible={complimentModalVisible}
        toggleModal={() => setComplimentModalVisible(false)}
        item={selectedItem}
        onSuccess={() => {
          if (selectedItem) removeUserFromList(selectedItem.id);
        }}
      />

      <ModalMessageSuperLike
        modalVisible={superLikeModalVisible}
        toggleModal={() => setSuperLikeModalVisible(false)}
        item={selectedItem}
        onFinish={() => {
          if (selectedItem) removeUserFromList(selectedItem.id);
        }}
      />

      <ModalMessageWithoutProduct
        modalVisible={withoutProductModalVisible}
        toggleModal={() => setWithoutProductModalVisible(false)}
        productName={missingProduct}
      />

      <ModalMessageErrorConsumeProduct
        modalVisible={errorConsumeModalVisible}
        toggleModal={() => setErrorConsumeModalVisible(false)}
        message={errorMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: 10,
  },
  itemContainer: {
    // Calculated height to make paging work nicely.
    // Screen height - top offset (approx logo size + padding) - bottom inset if any
    height: height * 0.6,
    width: width,
    paddingHorizontal: 10,
    marginBottom: 5,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 0,
  },
  imageContainer: {
    flex: 0.5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  navigationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 10,
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
  },
  interestsScroll: {
    paddingBottom: 20,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
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
    fontSize: 14,
    fontWeight: '500',
  },
  modalChipTextSelected: {
    color: '#fff',
  },
  modalChipTextUnselected: {
    color: colors.textSecondary,
  },
  modalFooter: {
    marginTop: 10,
    paddingVertical: 10,
  },
  nameText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 0.4,
    padding: 15,
    justifyContent: 'space-between',
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginVertical: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    position: 'relative',
    // height: 50, // Ajustar según el tamaño del LogoSofyMin si es necesario
    marginBottom: 10,
  },
  headerButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default MyAffinities;
