import React, {useEffect} from 'react';
import {Modal, View, Text, StyleSheet, Dimensions} from 'react-native';
import {colors} from '../theme/globalTheme';

const {width} = Dimensions.get('window');

interface ModalMessageErrorConsumeProductProps {
  modalVisible: boolean;
  toggleModal: () => void;
  message: string;
}

export const ModalMessageErrorConsumeProduct: React.FC<
  ModalMessageErrorConsumeProductProps
> = ({modalVisible, toggleModal, message}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (modalVisible) {
      timer = setTimeout(() => {
        toggleModal();
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [modalVisible, toggleModal]);

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={toggleModal}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.error,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.error,
    textAlign: 'center',
  },
});
