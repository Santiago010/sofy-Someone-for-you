import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import LogoSofy from './LogoSofy';
import {colors} from '../theme/globalTheme';
import {
  finishTransaction,
  Purchase,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestSubscription,
  Subscription,
  SubscriptionAndroid,
} from 'react-native-iap';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';

interface ModalInfoPlanConnectProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  productFromProfile: Subscription;
  userIdRef: number;
}

export default function ModalInfoPlanConnect({
  modalVisible,
  setModalVisible,
  productFromProfile,
  userIdRef,
}: ModalInfoPlanConnectProps) {
  const benefits = [
    {
      icon: 'eye-outline',
      title: 'See Who Likes You',
    },
    {
      icon: 'eye-check',
      title: 'See Who Super Likes You',
    },
    {
      icon: 'message-badge',
      title: 'Unlimited Compliments & Super Likes',
    },
    {
      icon: 'comment-flash',
      title: 'Community Access & Admin Rights',
    },
  ];

  const [isPurchasing, setIsPurchasing] = useState(false); //TODO:estado para desactivar el boton mientras se procesa la compra
  const {verifySubscription} = useContext(PurchasesContext);
  const [isPurchaseDone, setIsPurchaseDone] = useState(false);

  //   TODO:show modal del plan Sofy Connect
  const handlePurchase = async (product: Subscription) => {
    if (isPurchasing) return;
    setIsPurchasing(true);

    // Necesitamos el Offer Token para la compra de suscripciones en Android
    const offer = (product as SubscriptionAndroid)
      .subscriptionOfferDetails?.[0];

    const offerToken = offer?.offerToken;

    if (!offerToken) {
      console.error(
        'Offer Token no encontrado. Asegúrate de que el plan base está configurado correctamente.',
      );
      setIsPurchasing(false);
      return;
    }

    try {
      console.log('Iniciando compra para:', product.productId);

      await requestSubscription({
        sku: product.productId,
        subscriptionOffers: [{sku: product.productId, offerToken: offerToken}],
      });

      // Activar el estado para que el useEffect se ejecute
      setIsPurchaseDone(true);

      // Nota: Si esto tiene éxito, el control pasa al purchaseUpdatedListener.
    } catch (error) {
      console.error('Error al solicitar suscripción:', error);
      setIsPurchasing(false); // Si hay un error aquí, liberamos el botón
    }
  };

  //TODO: 💰 Lógica de Compra y Listeners (NUEVO useEffect)
  // ----------------------------------------------------------------------
  useEffect(() => {
    // Solo ejecutar si isPurchaseDone es true
    if (!isPurchaseDone) return;

    let purchaseUpdateSubscription;
    let purchaseErrorSubscription;

    // Se recomienda inicializar aquí también si no lo haces en el primer useEffect
    // En este caso, ya lo hiciste en el primero, así que solo añadimos listeners.

    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: Purchase) => {
        setIsPurchasing(false);
        setIsPurchaseDone(false); // Resetear después de procesar
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
            userId: userIdRef, // Usa el ref en lugar de dataInfouser.userId
          })
            .then(response => {
              console.log(response.message, response.res);
              finishTransaction({purchase, isConsumable: false}).then(() => {
                setModalVisible(false);
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
      setIsPurchaseDone(false); // Resetear después de procesar
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
  }, [isPurchaseDone]); // Ejecutar cuando isPurchaseDone cambie

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <LogoSofy withMarginBotton={false} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.title}>
              Connect with the most{'\n'}like-minded people without limits.
            </Text>

            <Text style={styles.subtitle}>What you get with Connect:</Text>

            <View style={styles.benefitsContainer}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={styles.iconContainer}>
                    <MaterialDesignIcons
                      name={benefit.icon}
                      size={28}
                      color={colors.background}
                    />
                  </View>
                  <Text style={styles.benefitText}>{benefit.title}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handlePurchase(productFromProfile)}>
              <Text style={styles.actionButtonText}>Get Sofy Connect™</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderRadius: 20,
    width: '90%',
    maxHeight: '90%',
    padding: 30,
  },
  scrollContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
