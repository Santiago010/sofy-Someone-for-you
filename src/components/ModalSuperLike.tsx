import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {colors} from '../theme/globalTheme';
import {
  finishTransaction,
  Product,
  Purchase,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
} from 'react-native-iap';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';
import {AuthContext} from '../context/authContext/authContext';

interface ModalSuperLikeProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  products: Product[];
}

export default function ModalSuperLike({
  modalVisible,
  setModalVisible,
  products,
}: ModalSuperLikeProps) {
  // Ordenar productos por precio o cantidad
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = parseFloat(
      a.oneTimePurchaseOfferDetails?.priceAmountMicros || '0',
    );
    const priceB = parseFloat(
      b.oneTimePurchaseOfferDetails?.priceAmountMicros || '0',
    );
    return priceA - priceB;
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    sortedProducts.length > 0 ? sortedProducts[1] || sortedProducts[0] : null,
  );
  // Ref para trackear si estamos esperando una compra iniciada por este componente
  const isWaitingForPurchaseRef = useRef(false);
  const {verifyProduct} = useContext(PurchasesContext);
  const {idUserForChats} = useContext(AuthContext);

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const bounceValue = useRef(new Animated.Value(0)).current;

  const startBounceAnimation = () => {
    bounceValue.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -10,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePurchase = async () => {
    if (!selectedProduct) {
      return;
    }

    setIsPurchasing(true);
    // Marcamos que AHORA SÍ estamos esperando una compra legítima
    isWaitingForPurchaseRef.current = true;

    try {
      if (Platform.OS === 'android') {
        await requestPurchase({skus: [selectedProduct.productId]});
      } else {
        await requestPurchase({sku: selectedProduct.productId});
      }
      // Listener is always active
    } catch (error) {
      console.error('❌ Error al solicitar la compra:', error);
      setIsPurchasing(false);
      isWaitingForPurchaseRef.current = false;
    }
  };

  useEffect(() => {
    const purchaseUpdateProduct = purchaseUpdatedListener(
      async (purchase: Purchase) => {
        console.log('📦 Transacción de producto recibida:', purchase.productId);

        // Verificar si este producto pertenece a este modal
        const isMyProduct = products.some(p => p.productId === purchase.productId);
        if (!isMyProduct) return;

        // CRÍTICO: Solo procesamos si estamos esperando una compra de ESTE usuario
        if (!isWaitingForPurchaseRef.current) {
          console.warn('⚠️ Transacción de producto ignorada - no iniciada por este usuario/sesión');
          // Limpiamos transacciones pendientes de otros usuarios
          await finishTransaction({purchase, isConsumable: true});
          return;
        }

        if (purchase.transactionReceipt) {
          const purchaseToken =
            Platform.OS === 'android'
              ? purchase.purchaseToken
              : purchase.transactionReceipt;

          verifyProduct({
            productId: purchase.productId,
            token: purchaseToken,
            platform: Platform.OS === 'android' ? 'android' : 'ios',
            userId: idUserForChats,
          })
            .then(response => {
              finishTransaction({purchase, isConsumable: true}).then(() => {
                isWaitingForPurchaseRef.current = false;
                setShowSuccessMessage(true);
                setIsPurchasing(false);
                startBounceAnimation();

                setTimeout(() => {
                  setModalVisible(false);
                  setShowSuccessMessage(false);
                }, 3330);
              });
            })
            .catch(error => {
              console.error(error.message, error.error);
              // Aunque falle la verificación, finalizamos la transacción para no dejarla pendiente
              finishTransaction({purchase, isConsumable: true}).then(() => {
                isWaitingForPurchaseRef.current = false;
                setIsPurchasing(false);
                console.log('⚠️ Transacción de producto finalizada a pesar del error de verificación');
              });
            });
        }
      },
    );

    // 2. Escuchador de errores
    const purchaseErrorProduct = purchaseErrorListener(error => {
      console.warn('purchaseErrorListener', error);
      setIsPurchasing(false);
      isWaitingForPurchaseRef.current = false;
    });

    return () => {
      purchaseUpdateProduct.remove();
      purchaseErrorProduct.remove();
    };
  }, [products, idUserForChats, verifyProduct, setModalVisible]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <MaterialDesignIcons name="close" size={30} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Super Like</Text>

          <View style={styles.iconContainer}>
            <MaterialDesignIcons
              name="star-four-points"
              size={50}
              color={colors.background}
            />
          </View>

          <Text style={styles.subtitle}>{products[0]?.description}</Text>

          <View style={styles.cardsContainer}>
            {sortedProducts.map((item, index) => {
              const isSelected = selectedProduct?.productId === item.productId;
              // Extraer cantidad del nombre (ej: "5 Super Like")
              const displayName = item.name || item.title || '';
              // Extraer cantidad del nombre (ej: "5 Super Like")
              const quantity = displayName.match(/\d+/)?.[0] || '';
              const name = displayName.replace(/\d+/, '').trim();
              const price =
                item.oneTimePurchaseOfferDetails?.formattedPrice ||
                item.localizedPrice ||
                item.price;

              return (
                <TouchableOpacity
                  key={item.productId}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => handleSelect(item)}>
                  {/* Badges simulados */}
                  {index === 2 && (
                    <View style={styles.badgePopular}>
                      <Text style={styles.badgeTextWhite}>MOST POPULAR</Text>
                    </View>
                  )}

                  <Text style={styles.cardQuantity}>{quantity}</Text>
                  <Text style={styles.cardName}>{name}</Text>
                  <Text style={styles.cardPrice}>{price}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.disclaimer}>
            One-time payment. By purchasing, you agree to this transaction and
            our Terms.
          </Text>

          {showSuccessMessage ? (
            <View style={styles.successContainer}>
              <Animated.Text
                style={[
                  styles.successTitle,
                  {transform: [{translateY: bounceValue}]},
                ]}>
                Unlock your potential: Your purchase is live!
              </Animated.Text>
              <Text style={styles.successSubtitle}>
                {selectedProduct?.name}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.actionButton,
                isPurchasing && styles.actionButtonDisabled,
              ]}
              onPress={handlePurchase}
              disabled={isPurchasing}>
              <Text style={styles.actionButtonText}>
                {isPurchasing
                  ? 'Processing...'
                  : `Get ${selectedProduct?.name || 'Super Like'}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '90%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  card: {
    width: '30%',
    backgroundColor: colors.background,
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#FFF5F0',
  },
  cardQuantity: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  cardName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  cardPrice: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  badgePopular: {
    position: 'absolute',
    top: -10,
    backgroundColor: 'black',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeSave: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeTextWhite: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeTextBlack: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 18,
    color: colors.text,
    fontWeight: 'bold',
  },
});
