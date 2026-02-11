import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import {colors, commonStyles} from '../theme/globalTheme';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {AuthContext} from '../context/authContext/authContext';
import {type SubscriptionAndroid} from 'react-native-iap';
import Carousel from 'react-native-reanimated-carousel';
import ModalInfoPlanConnect from '../components/ModalInfoPlanConnect';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';
import ModalCompliments from '../components/ModalCompliments';
import ModalSuperLike from '../components/ModalSuperLike';
import LogoSofyMin from '../components/LogoSofyMin';
import {Button} from 'react-native-paper';

const ShakeBell = () => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
      ]),
    ).start();
  }, [shakeAnimation]);

  const rotation = shakeAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-25deg', '25deg'],
  });

  return (
    <Animated.View style={{transform: [{rotate: rotation}], marginRight: 8}}>
      <MaterialDesignIcons name="bell" size={20} color={colors.primary} />
    </Animated.View>
  );
};

export const Profile = () => {
  const [dataInfouser, setdataInfouser] = useState({
    name: '',
    lastName: '',
    age: '',
    profile: '',
  });

  const userIdRef = useRef(0); // Nuevo ref para almacenar el userId actual

  const {detailsUser, GetDetailsUser} = useContext(AuthContext);
  const {suscriptions, isConnect, products} = useContext(PurchasesContext);
  const [modalVisible, setModalVisible] = useState(false);

  const [modalComplimentsVisible, setModalComplimentsVisible] = useState(false);
  const [modalSuperLikeVisible, setModalSuperLikeVisible] = useState(false);
  const navigation = useNavigation();



  // Llamar a GetDetailsUser cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      GetDetailsUser();
    }, [GetDetailsUser]),
  );

  useEffect(() => {
    if (detailsUser !== null) {
      setdataInfouser({
        name: detailsUser.name,
        lastName: detailsUser.lastname,
        age: `${detailsUser.age}`,
        profile: detailsUser.individualFiles[0].file.url,
      });
      userIdRef.current = detailsUser.id; // Actualiza el ref con el userId
    }
  }, [detailsUser]);

  // Agrupar productos
  const complimentsProducts = products.filter(p =>
    (p.name || p.title).toLowerCase().includes('compliment'),
  );
  const superLikeProducts = products.filter(p =>
    (p.name || p.title).toLowerCase().includes('super like'),
  );

  const getLowestPrice = (items: any[]) => {
    if (!items || items.length === 0) return '';
    const sorted = [...items].sort((a, b) => {
      const priceA = a.oneTimePurchaseOfferDetails?.priceAmountMicros
        ? Number(a.oneTimePurchaseOfferDetails.priceAmountMicros)
        : Number(a.price) || 0;
      const priceB = b.oneTimePurchaseOfferDetails?.priceAmountMicros
        ? Number(b.oneTimePurchaseOfferDetails.priceAmountMicros)
        : Number(b.price) || 0;
      return priceA - priceB;
    });
    const lowest = sorted[0];
    return (
      lowest.oneTimePurchaseOfferDetails?.formattedPrice ||
      lowest.localizedPrice ||
      lowest.price
    );
  };

  const complimentsSummary =
    complimentsProducts.length > 0
      ? {
          origin: 'product-group',
          type: 'compliment',
          title: 'Compliments',
          description: complimentsProducts[0].description,
          formattedPrice: `From ${getLowestPrice(complimentsProducts)}`,
          products: complimentsProducts,
        }
      : null;

  const superLikeSummary =
    superLikeProducts.length > 0
      ? {
          origin: 'product-group',
          type: 'superlike',
          title: 'Super Like',
          description: superLikeProducts[0].description,
          formattedPrice: `From ${getLowestPrice(superLikeProducts)}`,
          products: superLikeProducts,
        }
      : null;

  // Combinar suscripciones y grupos de productos
  const carouselData = [
    ...suscriptions.map(s => ({...s, origin: 'subscription'})),
    ...(complimentsSummary ? [complimentsSummary] : []),
    ...(superLikeSummary ? [superLikeSummary] : []),
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <LogoSofyMin />
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 100}}>
          <View style={commonStyles.content}>
            <View style={styles.styleBoxOne}>
              {/* Foto de perfil circular centrada */}
              <View style={styles.profileImageContainer}>
                <TouchableOpacity style={styles.profileImage}>
                  {dataInfouser.profile.length !== 0 ? (
                    <Image
                      source={{uri: dataInfouser.profile}}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.profileImageText}>👤</Text>
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.cardFooterName}>
                    {dataInfouser?.name} {dataInfouser?.lastName}
                  </Text>
                  <Text style={styles.cardFooterAge}>, </Text>
                  <Text style={styles.cardFooterAge}>{dataInfouser.age}</Text>
                </View>
              </View>

              {/* Tres botones de acción */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={{
                    ...styles.actionButton,
                  }}
                  onPress={() =>
                    navigation.navigate('StackSettingsApps' as never)
                  }>
                  <MaterialDesignIcons
                    name="cog"
                    size={43}
                    color={colors.secondary}
                  />
                  <Text
                    style={{
                      ...styles.actionButtonText,
                      color: colors.secondary,
                    }}>
                    Setting
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...styles.actionButton,
                    ...styles.actionButtonProfile,
                  }}
                  onPress={() => navigation.navigate('EditProfile' as never)}>
                  <MaterialDesignIcons
                    name="face-man-profile"
                    size={43}
                    color={colors.primary}
                  />
                  <Text
                    style={{...styles.actionButtonText, color: colors.primary}}>
                    Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...styles.actionButton,
                  }}
                  onPress={() => navigation.navigate('EditPhotos' as never)}>
                  <MaterialDesignIcons
                    name="plus-box-multiple"
                    size={43}
                    color={colors.secondary}
                  />
                  <Text
                    style={{
                      ...styles.actionButtonText,
                      color: colors.secondary,
                    }}>
                    Photos
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.interactionsContainer}>
              <Text style={styles.interactionsTitle}>My Interactions</Text>

              <View style={styles.interactionRow}>
                <ShakeBell />
                <Text style={styles.interactionText}>
                  Interactions Sent: {detailsUser?.my_interactions}
                </Text>
              </View>

              <View style={styles.interactionRow}>
                <ShakeBell />
                <Text style={styles.interactionText}>
                  Interactions Received: {detailsUser?.interactions_with_me}
                </Text>
              </View>
              <Button
                mode="contained"
                style={styles.interactionsButton}
                labelStyle={styles.interactionsButtonLabel}
                onPress={() => {
                  navigation.navigate('Interactions' as never);
                }}>
                See My Interactions
              </Button>
            </View>
            {!isConnect && (
              <View style={styles.carouselContainer}>
                <Carousel
                  loop={carouselData.length > 1}
                  width={Math.min(Dimensions.get('window').width * 0.9, 350)}
                  height={500}
                  data={carouselData}
                  scrollAnimationDuration={1000}
                  renderItem={({item}: {item: any}) => {
                    const origin = item.origin;
                    let formattedPrice = 'N/A';
                    let title = item.title;
                    let description = item.description;

                    if (origin === 'subscription') {
                      if (Platform.OS === 'ios') {
                        formattedPrice = item.localizedPrice || 'N/A';
                      } else {
                        const subscriptionProduct = item as SubscriptionAndroid;
                        const offer =
                          subscriptionProduct.subscriptionOfferDetails?.[0];
                        const pricePhase =
                          offer?.pricingPhases.pricingPhaseList?.[0];
                        formattedPrice = pricePhase?.formattedPrice || 'N/A';
                      }
                    } else if (origin === 'product-group') {
                      formattedPrice = item.formattedPrice;
                      title = item.title;
                      description = item.description;
                    } else {
                      // Fallback para productos individuales si quedaran
                      formattedPrice =
                        item.oneTimePurchaseOfferDetails?.formattedPrice ||
                        item.localizedPrice ||
                        item.price ||
                        'N/A';
                    }

                    return (
                      <View style={styles.styleBoxTwo}>
                        <Text style={styles.platinumTitle}>{title}</Text>
                        <Text style={styles.platinumSubtitle}>
                          {description}
                        </Text>
                        <Text style={styles.priceText}>{formattedPrice}</Text>
                        {origin === 'subscription' ? (
                          <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={styles.platinumButton}>
                            <Text style={styles.platinumButtonText}>
                              GET {` ${title}`}
                            </Text>
                          </TouchableOpacity>
                        ) : origin === 'product-group' ? (
                          <TouchableOpacity
                            onPress={() => {
                              if (item.type === 'compliment') {
                                setModalComplimentsVisible(true);
                              } else if (item.type === 'superlike') {
                                setModalSuperLikeVisible(true);
                              }
                            }}
                            style={styles.platinumButton}>
                            <Text style={styles.platinumButtonText}>
                              GET {` ${title}`}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                            {}
                            //   console.log('Product pressed:', title)
                            }
                            style={styles.platinumButton}>
                            <Text style={styles.platinumButtonText}>
                              GET {` ${title}`}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {suscriptions.length > 0 && userIdRef.current !== 0 && (
        <ModalInfoPlanConnect
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          productFromProfile={suscriptions[0]}
          userIdRef={userIdRef.current}
        />
      )}

      {complimentsSummary && (
        <ModalCompliments
          modalVisible={modalComplimentsVisible}
          setModalVisible={setModalComplimentsVisible}
          products={complimentsSummary.products}
        />
      )}

      {superLikeSummary && (
        <ModalSuperLike
          modalVisible={modalSuperLikeVisible}
          setModalVisible={setModalSuperLikeVisible}
          products={superLikeSummary.products}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.background,
  },
  cardFooterName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  name: {
    color: colors.text,
    fontSize: 22,
  },
  styleBoxOne: {
    justifyContent: 'center',
    // height: 482, // Removed fixed height
    minHeight: 480,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 66,
    margin: 15,
    padding: 20,
    paddingBottom: 30, // Added padding for safety
    shadowColor: colors.textSecondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    ...(Platform.OS === 'android' && {
      top: 0,
      marginTop: 20,
      height: 480, // Keep fixed height for Android as it was working fine, or change to minHeight if testing shows
    }),
    ...(Platform.OS === 'ios' && {
      // height: 'auto', // Let it grow
      justifyContent: 'flex-start', // Align to top to avoid centering shift when growing
      paddingTop: 40, // Adjust top padding if needed due to shift
    }),
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 193,
    height: 193,
    borderRadius: 50,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  profileImageText: {
    fontSize: 99,
  },
  image: {
    width: 193,
    height: 193,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  actionButtonProfile: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 50,
    top: 33,
    padding: 18,
    shadowColor: colors.textSecondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardFooterAge: {
    fontSize: 26,
    color: colors.text,
  },
  progressContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonIcon: {
    fontSize: 39,
    marginBottom: 5,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  carouselContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  styleBoxTwo: {
    backgroundColor: colors.backgroundSecondary,
    margin: 15,
    marginTop: 5,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    ...(Platform.OS === 'android' && {
      marginTop: 15,
    }),
    width: Math.min(Dimensions.get('window').width * 0.8, 320),
  },
  platinumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  platinumSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text,
    marginHorizontal: 3,
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textDisabled,
    marginHorizontal: 3,
  },
  platinumButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  platinumButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary, // O el color que uses para precios
    marginBottom: 15,
  },
  interactionsContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: colors.textSecondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  interactionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  interactionText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  interactionsButton: {
    marginTop: 15,
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: '80%',
  },
  interactionsButtonLabel: {
    color: colors.background,
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 2,
  },
});
