import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
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

interface ContentInfoPlanConnectProps {
  setModalVisible: (visible: boolean) => void;
  productFromProfile: Subscription;
  userIdRef: number;
  origin: 'modal' | 'screen';
}

export default function ContentInfoPlanConnect({
  setModalVisible,
  productFromProfile,
  userIdRef,
  origin,
}: ContentInfoPlanConnectProps) {
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

  const [isPurchasing, setIsPurchasing] = useState(false);
  const {verifySubscription} = useContext(PurchasesContext);
  // Usamos una ref para trackear si estamos esperando una compra iniciada por este componente
  const isWaitingForPurchaseRef = React.useRef(false);

  const handlePurchase = async (product: Subscription) => {
    if (isPurchasing) return;
    setIsPurchasing(true);
    
    // Marcamos que AHORA SÍ estamos esperando una compra legítima
    isWaitingForPurchaseRef.current = true;

    try {
      if (Platform.OS === 'android') {
        const offer = (product as SubscriptionAndroid)
          .subscriptionOfferDetails?.[0];

        const offerToken = offer?.offerToken;

        if (!offerToken) {
          console.error(
            'Offer Token no encontrado. Asegúrate de que el plan base está configurado correctamente.',
          );
          setIsPurchasing(false);
          isWaitingForPurchaseRef.current = false;
          return;
        }

        await requestSubscription({
          sku: product.productId,
          subscriptionOffers: [
            {sku: product.productId, offerToken: offerToken},
          ],
        });
      } else {
        await requestSubscription({
          sku: product.productId,
        });
      }

      // NO seteamos isPurchaseDone aquí - el listener lo manejará
    } catch (error) {
      console.error('Error al solicitar suscripción:', error);
      setIsPurchasing(false);
      isWaitingForPurchaseRef.current = false;
    }
  };

  // Los listeners deben estar SIEMPRE activos, no solo cuando isPurchaseDone es true
  useEffect(() => {
    let purchaseUpdateSubscription;
    let purchaseErrorSubscription;

    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: Purchase) => {
        console.log('📦 Transacción recibida:', purchase.productId);
        
        // CRÍTICO: Solo procesamos si estamos esperando una compra de ESTE usuario
        if (!isWaitingForPurchaseRef.current) {
          console.warn('⚠️ Transacción ignorada - no iniciada por este usuario/sesión');
          // Limpiamos transacciones pendientes de otros usuarios
          await finishTransaction({purchase, isConsumable: false});
          return;
        }

        setIsPurchasing(false);
        console.log('✅ Compra Exitosa recibida:');

        if (purchase.transactionReceipt) {
          const purchaseToken =
            Platform.OS === 'android'
              ? purchase.purchaseToken
              : purchase.transactionReceipt;

          verifySubscription({
            productId: purchase.productId,
            token: purchaseToken,
            platform: Platform.OS === 'android' ? 'android' : 'ios',
            userId: userIdRef,
          })
            .then(response => {
              console.log(response.message, response.res);
              finishTransaction({purchase, isConsumable: false}).then(() => {
                isWaitingForPurchaseRef.current = false;
                setModalVisible(false);
                console.log(
                  '✅ Transacción finalizada correctamente con finishTransaction.',
                );
              });
            })
            .catch(error => {
              console.error(error.message, error.error);
              // Aunque falle la verificación, finalizamos la transacción para no dejarla pendiente
              finishTransaction({purchase, isConsumable: false}).then(() => {
                isWaitingForPurchaseRef.current = false;
                console.log('⚠️ Transacción finalizada a pesar del error de verificación');
              });
            });
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(error => {
      setIsPurchasing(false);
      isWaitingForPurchaseRef.current = false;
      console.warn('❌ Error en la compra:', error);
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert(`Error de Pago: ${error.message}`);
      }
    });

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, [userIdRef, verifySubscription, setModalVisible]); // Dependencias estables

  return (
    <View
      style={
        origin === 'modal' ? styles.containerInModal : styles.containerInScreen
      }>
      <ScrollView style={styles.scrollContent}>
        <LogoSofy withMarginBotton={false} />
        {origin === 'modal' && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}

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
          onPress={() => handlePurchase(productFromProfile)}
          disabled={isPurchasing}>
          <Text style={styles.actionButtonText}>Get Sofy Connect™</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerInModal: {
    backgroundColor: colors.background,
    borderRadius: 20,
    width: '90%',
    maxHeight: '90%',
    padding: 30,
  },
  containerInScreen: {
    backgroundColor: colors.background,
    width: '90%',
    maxHeight: '90%',
  },
  scrollContent: {
    // alignItems: 'center',
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
