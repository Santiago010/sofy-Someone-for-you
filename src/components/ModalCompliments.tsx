import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
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

interface ModalComplimentsProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  products: Product[];
}

export default function ModalCompliments({
  modalVisible,
  setModalVisible,
  products,
}: ModalComplimentsProps) {
  // Ordenar productos por precio o cantidad si es posible.
  // Asumiremos que el orden viene dado o lo ordenamos por precio ascendente.
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
  const [complimentsDone, setComplimentsDone] = useState(false);

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

    try {
      await requestPurchase({skus: [selectedProduct.productId]});
      setComplimentsDone(true);
    } catch (error) {
      console.error('❌ Error al solicitar la compra:', error);
      setIsPurchasing(false);
    }
  };

  useEffect(() => {
    if (!complimentsDone) return;

    const purchaseUpdateProduct = purchaseUpdatedListener(
      async (purchase: Purchase) => {
        console.info('✅ Compra recibida de Google:', purchase);

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
                setComplimentsDone(false);
                setShowSuccessMessage(true);
                setIsPurchasing(false);
                startBounceAnimation();

                setTimeout(() => {
                  setModalVisible(false);
                  setShowSuccessMessage(false);
                }, 3330);

                console.log(
                  '✅ Transacción finalizada correctamente con finishTransaction.',
                );
              });
            })
            .catch(error => {
              console.error(error.message, error.error);
              setIsPurchasing(false);
            });
        }
      },
    );

    // 2. Escuchador de errores
    const purchaseErrorProduct = purchaseErrorListener(error => {
      console.warn('purchaseErrorListener', error);
      setIsPurchasing(false);
    });

    return () => {
      purchaseUpdateProduct.remove();
      purchaseErrorProduct.remove();
    };
  }, [complimentsDone]);

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

          <Text style={styles.headerTitle}>Compliments</Text>

          <View style={styles.iconContainer}>
            <MaterialDesignIcons
              name="message-flash"
              size={50}
              color={colors.background}
            />
          </View>

          <Text style={styles.subtitle}>{products[0]?.description}</Text>

          <View style={styles.cardsContainer}>
            {sortedProducts.map((item, index) => {
              const isSelected = selectedProduct?.productId === item.productId;
              // Extraer cantidad del nombre (ej: "10 Compliments")
              const quantity = item.name.match(/\d+/)?.[0] || '';
              const name = item.name.replace(/\d+/, '').trim();
              const price =
                item.oneTimePurchaseOfferDetails?.formattedPrice ||
                item.localizedPrice ||
                item.price;

              return (
                <TouchableOpacity
                  key={item.productId}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => handleSelect(item)}>
                  {/* Badges simulados - lógica simple para ejemplo */}
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
                  : `Get ${selectedProduct?.name || 'Compliments'}`}
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
    justifyContent: 'flex-end', // Modal tipo bottom sheet o full screen
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '90%', // Ocupa gran parte de la pantalla
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
    backgroundColor: colors.primary, // Color naranja del screenshot
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
    backgroundColor: '#FFF5F0', // Un fondo ligero naranja
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
