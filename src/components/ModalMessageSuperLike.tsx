import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import {Modal as PaperModal, Portal} from 'react-native-paper';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {colors} from '../theme/globalTheme';
import {ListGetUserForInterest} from '../interfaces/interfacesForAffinities';

const {width: windowWidth} = Dimensions.get('window');

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
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (modalVisible) {
      // Trigger animation
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();

      timer = setTimeout(() => {
        toggleModal();
        onFinish();
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [modalVisible, toggleModal, onFinish]);

  const imageUrl =
    item?.individualFiles && item?.individualFiles[0]
      ? item.individualFiles[0].file.url
      : 'https://via.placeholder.com/400';

  if (!item) return null;

  return (
    <Portal>
      <PaperModal
        visible={modalVisible}
        onDismiss={toggleModal}
        contentContainerStyle={styles.modalContainer}
        style={styles.overlay}>
        <ImageBackground
          source={{uri: imageUrl}}
          style={styles.background}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
          blurRadius={1.5}>
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.successContainer,
                {transform: [{scale: scaleAnim}]},
              ]}>
              <MaterialDesignIcons
                name="party-popper"
                size={80}
                color="#FFD700"
                style={styles.successIcon}
              />
              <Text style={styles.successTitle}>Super Like! 🚀</Text>
              <Text style={styles.successText}>
                You really like {item.name}!
              </Text>
              <Text style={styles.successSubText}>Hoping for a match! 🤞</Text>
            </Animated.View>
          </View>
        </ImageBackground>
      </PaperModal>
    </Portal>
  );
};

const MODAL_WIDTH = windowWidth * 0.92;
const MODAL_HEIGHT = MODAL_WIDTH * 1.3;

const styles = StyleSheet.create({
  overlay: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: MODAL_WIDTH,
    height: MODAL_HEIGHT,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 4},
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Center content vertically too since it's just a message
  },
  successContainer: {
    padding: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
    marginVertical: 5,
  },
  successIcon: {
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 4,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF9800',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  successSubText: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.9,
  },
});
