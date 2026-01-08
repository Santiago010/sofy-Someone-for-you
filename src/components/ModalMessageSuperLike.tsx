import React, {useEffect} from 'react';
import {Modal, View, Text, StyleSheet, Dimensions} from 'react-native';
import {colors} from '../theme/globalTheme';
import {ListGetUserForInterest} from '../interfaces/interfacesForAffinities';

const {width} = Dimensions.get('window');

interface ModalMessageSuperLikeProps {
  modalVisible: boolean;
  toggleModal: () => void;
  item: ListGetUserForInterest | null;
  onFinish: () => void;
}

export const ModalMessageSuperLike: React.FC<ModalMessageSuperLikeProps> = ({
  modalVisible,
  toggleModal,
  item,
  onFinish,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (modalVisible) {
      timer = setTimeout(() => {
        toggleModal();
        onFinish();
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [modalVisible, toggleModal, onFinish]);

  if (!item) return null;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={toggleModal}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.message}>
            Thanks for that superlike to {item.name}, I hope you’re lucky
          </Text>
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
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
});
