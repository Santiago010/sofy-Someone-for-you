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
} from 'react-native';
import {colors, commonStyles} from '../theme/globalTheme';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {AuthContext} from '../context/authContext/authContext';
import {type SubscriptionAndroid} from 'react-native-iap';
import Carousel from 'react-native-reanimated-carousel';
import ModalInfoPlanConnect from '../components/ModalInfoPlanConnect';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';

export const Profile = () => {
  const [dataInfouser, setdataInfouser] = useState({
    name: '',
    lastName: '',
    age: '',
    profile: '',
  });

  const userIdRef = useRef(0); // Nuevo ref para almacenar el userId actual

  const {detailsUser, GetDetailsUser} = useContext(AuthContext);
  const {suscriptions, isConnect} = useContext(PurchasesContext);
  const [modalVisible, setModalVisible] = useState(false);
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

  // Evitar que el Carousel repita productos si solo hay uno
  const carouselData =
    suscriptions.length > 1 ? suscriptions : suscriptions.slice(0, 1);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
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
            {!isConnect && (
              <View style={styles.carouselContainer}>
                <Carousel
                  loop={carouselData.length > 1}
                  width={Math.min(Dimensions.get('window').width * 0.85, 350)}
                  height={280}
                  data={carouselData}
                  scrollAnimationDuration={1000}
                  renderItem={({item, index}) => {
                    const subscriptionProduct = item as SubscriptionAndroid;

                    // Extracción del precio para la UI
                    const offer =
                      subscriptionProduct.subscriptionOfferDetails?.[0];
                    const pricePhase =
                      offer?.pricingPhases.pricingPhaseList?.[0];
                    const formattedPrice = pricePhase?.formattedPrice || 'N/A';
                    return (
                      <View style={styles.styleBoxTwo}>
                        <Text style={styles.platinumTitle}>{item.title}</Text>
                        <Text style={styles.platinumSubtitle}>
                          {item.description}
                        </Text>
                        <Text style={styles.priceText}>{formattedPrice}</Text>
                        <TouchableOpacity
                          onPress={() => setModalVisible(true)}
                          style={styles.platinumButton}>
                          <Text style={styles.platinumButtonText}>
                            GET {` ${item.title}`}
                          </Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                        onPress={() => handlePurchase(item)}
                        style={styles.platinumButton}>
                        <Text style={styles.platinumButtonText}>
                          GET {` ${item.title}`}
                        </Text>
                      </TouchableOpacity> */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.backgroundSecondary,
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
    height: 482,
    backgroundColor: colors.background,
    borderRadius: 66,
    margin: 15,
    padding: 20,
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
      height: 480,
    }),
    ...(Platform.OS === 'ios' && {
      top: -99,
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
    backgroundColor: colors.background,
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
});
