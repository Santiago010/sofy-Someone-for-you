import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../theme/globalTheme';

const {width} = Dimensions.get('window');

interface ModalMessageWithoutProductProps {
  modalVisible: boolean;
  toggleModal: () => void;
  productName: string;
}

const ModalMessageWithoutProduct: React.FC<ModalMessageWithoutProductProps> = ({
  modalVisible,
  toggleModal,
  productName,
}) => {
  const navigation = useNavigation<any>();

  const handleNavigate = () => {
    toggleModal();
    navigation.navigate('StackProfile');
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      // Prevent closing by back button effectively forcing choice or explicit close?
      // User didn't specify, but usually we allow close.
      onRequestClose={toggleModal}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Oops!</Text>
          <Text style={styles.message}>You don’t have {productName}</Text>

          <TouchableOpacity style={styles.button} onPress={handleNavigate}>
            <Text style={styles.buttonText}>Go to Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});

export default ModalMessageWithoutProduct;
