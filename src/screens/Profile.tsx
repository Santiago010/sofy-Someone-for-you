import React, {useContext, useEffect, useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
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
  Alert,
} from 'react-native';
import {colors, commonStyles} from '../theme/globalTheme';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {AuthContext} from '../context/authContext/authContext';
import {
  type Subscription,
  type SubscriptionAndroid,
  type Purchase,
  initConnection,
  endConnection,
  getSubscriptions,
  requestSubscription,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
} from 'react-native-iap';
import Carousel from 'react-native-reanimated-carousel';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';
import ModalInfoPlanConnect from '../components/ModalInfoPlanConnect';

export const Profile = () => {
  const ANDROID_SUBSCRIPTION_SKUS = ['sofy_connect_895_1m'];
  const [products, setProducts] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false); //TODO:estado para desactivar el boton mientras se procesa la compra

  const [dataInfouser, setdataInfouser] = useState({
    name: '',
    lastName: '',
    age: '',
    profile: '',
  });

  const userIdRef = useRef(0); // Nuevo ref para almacenar el userId actual

  const {detailsUser} = useContext(AuthContext);
  const {verifySubscription} = useContext(PurchasesContext);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      //TODO: Solo intentamos la conexión si estamos en Android, ya que el SKU es de Play Console
      if (Platform.OS !== 'android') {
        console.error(
          'Esta prueba solo es válida para Android con el SKU proporcionado.',
        );
        setIsLoading(false);
        return;
      }

      try {
        // 1. Inicializar la conexión con el servicio de facturación
        await initConnection();

        console.log('✅ Conexión IAP inicializada correctamente.');

        // 2. Obtener la lista de suscripciones (usando tu SKU)
        const subscriptions = await getSubscriptions({
          skus: ANDROID_SUBSCRIPTION_SKUS,
        });

        if (subscriptions.length > 0) {
          const subscriptionProduct = subscriptions[0] as SubscriptionAndroid;

          const offerDetails =
            subscriptionProduct.subscriptionOfferDetails?.[0];

          // 2. Acceder a la lista de fases de precios y obtener la fase principal (índice 0)
          //    Esta fase contiene el precio real (formattedPrice).
          const pricePhase = offerDetails?.pricingPhases.pricingPhaseList?.[0];

          const formattedPrice =
            pricePhase?.formattedPrice || 'Precio no encontrado';
          console.warn(
            `Producto encontrado con titulo : ${subscriptions[0].title} descripción: ${subscriptions[0].description} y precio: ${formattedPrice}`,
          );
          setProducts(subscriptions);
        } else {
          console.error(
            '⚠️ Producto no encontrado. Revisa el SKU o el estado de la app en Play Console.',
          );
        }
      } catch (err) {
        console.error('❌ Error al obtener la suscripción:', err);
        console.error(`Fallo de conexión o producto: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionDetails();

    // Limpieza: Cerramos la conexión cuando el componente se desmonta
    return () => {
      endConnection();
      console.log('🔌 Conexión IAP finalizada.');
    };
  }, []); //TODO: El array vacío asegura que se ejecuta solo al montar

  //TODO: 💰 Lógica de Compra y Listeners (NUEVO useEffect)
  // ----------------------------------------------------------------------
  useEffect(() => {
    let purchaseUpdateSubscription;
    let purchaseErrorSubscription;

    // Se recomienda inicializar aquí también si no lo haces en el primer useEffect
    // En este caso, ya lo hiciste en el primero, así que solo añadimos listeners.

    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: Purchase) => {
        setIsPurchasing(false);
        console.log('✅ Compra Exitosa recibida:', purchase);

        // --- PUNTO CRÍTICO: CAPTURA Y LOG DEL TOKEN PARA BACKEND ---
        if (purchase.transactionReceipt) {
          const purchaseToken =
            Platform.OS === 'android'
              ? purchase.purchaseToken // Token que usaremos en NestJS
              : purchase.transactionReceipt; // Recibo para iOS/Apple

          verifySubscription({
            productId: purchase.productId,
            token: purchaseToken,
            platform: Platform.OS === 'android' ? 'android' : 'ios',
            userId: userIdRef.current, // Usa el ref en lugar de dataInfouser.userId
          })
            .then(response => {
              console.log(response.message, response.res);
              finishTransaction({purchase, isConsumable: false}).then(() => {
                console.log(
                  '✅ Transacción finalizada correctamente con finishTransaction.',
                );
              });
            })
            .catch(error => {
              console.error(error.message, error.error);
            });
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(error => {
      setIsPurchasing(false);
      console.warn('❌ Error en la compra:', error);
      // Solo mostramos error si no fue una cancelación del usuario
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert(`Error de Pago: ${error.message}`);
      }
    });

    // Limpieza
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
      // No cerramos la conexión aquí ya que el otro useEffect ya lo hace.
    };
  }, []); // Mantén el array vacío, ya que el ref asegura el valor actual

  useEffect(() => {
    console.log('Productos actualizados:', products);
  }, [products]);

  //   TODO:show modal del plan Sofy Connect
  //   const handlePurchase = async (product: Subscription) => {
  //     if (isPurchasing) return;
  //     setIsPurchasing(true);

  //     // Necesitamos el Offer Token para la compra de suscripciones en Android
  //     const offer = (product as SubscriptionAndroid)
  //       .subscriptionOfferDetails?.[0];

  //     const offerToken = offer?.offerToken;

  //     if (!offerToken) {
  //       console.error(
  //         'Offer Token no encontrado. Asegúrate de que el plan base está configurado correctamente.',
  //       );
  //       setIsPurchasing(false);
  //       return;
  //     }

  //     try {
  //       console.log('Iniciando compra para:', product.productId);

  //       await requestSubscription({
  //         sku: product.productId,
  //         subscriptionOffers: [{sku: product.productId, offerToken: offerToken}],
  //       });
  //       // Nota: Si esto tiene éxito, el control pasa al purchaseUpdatedListener.
  //     } catch (error) {
  //       console.error('Error al solicitar suscripción:', error);
  //       setIsPurchasing(false); // Si hay un error aquí, liberamos el botón
  //     }
  //   };

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
  const carouselData = products.length > 1 ? products : products.slice(0, 1);

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
                  const pricePhase = offer?.pricingPhases.pricingPhaseList?.[0];
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
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <ModalInfoPlanConnect
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
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
