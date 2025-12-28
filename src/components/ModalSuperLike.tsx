import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
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
  const [superLikeDone, setSuperLikeDone] = useState(false);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePurchase = async () => {
    if (!selectedProduct) {
      return;
    }

    try {
      await requestPurchase({skus: [selectedProduct.productId]});
      setSuperLikeDone(true);
    } catch (error) {
      console.error('❌ Error al solicitar la compra:', err);
    }
  };

  useEffect(() => {
    if (!superLikeDone) return;

    const purchaseUpdateProduct = purchaseUpdatedListener(
      async (purchase: Purchase) => {
        console.info('✅ Compra recibida de Google:', purchase);

        const receipt = purchase.transactionReceipt;

        if (receipt) {
          try {
            // AQUÍ ES DONDE LLAMAREMOS AL BACKEND (Paso siguiente)
            // const validation = await verifyPurchaseOnBackend(purchase);

            // IMPORTANTE: Una vez el backend confirme, debemos finalizar la transacción
            // para que Google sepa que entregamos el producto y no devuelva el dinero.
            await finishTransaction({purchase, isConsumable: true});

            console.info('🚀 Transacción finalizada con éxito');
          } catch (error) {
            console.error('❌ Error validando o finalizando la compra:', error);
          }
        }
      },
    );

    // 2. Escuchador de errores
    const purchaseErrorProduct = purchaseErrorListener(error => {
      console.warn('purchaseErrorListener', error);
    });

    return () => {
      purchaseUpdateProduct.remove();
      purchaseErrorProduct.remove();
    };
  }, [superLikeDone]);

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

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePurchase}>
            <Text style={styles.actionButtonText}>
              Get {selectedProduct?.name || 'Super Like'}
            </Text>
          </TouchableOpacity>
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
    backgroundColor: '#E95D2A',
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
    borderColor: '#E95D2A',
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
    backgroundColor: '#E95D2A',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
