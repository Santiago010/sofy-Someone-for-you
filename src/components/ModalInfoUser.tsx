import React, {FC} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {colors} from '../theme/globalTheme';
import {Chip} from 'react-native-paper';

interface ModalInfoProps {
  modalVisible: boolean;
  toggleModal: () => void;
  completeInfo: boolean;
  user: any;
}

export const ModalInfoUser: FC<ModalInfoProps> = ({
  modalVisible,
  toggleModal,
  user,
  completeInfo,
}) => {
  if (completeInfo) {
    console.log(completeInfo);
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContentContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => toggleModal()}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              {user.images && user.images[0] ? (
                <Image
                  source={user.images[0] as any}
                  style={styles.modalImage}
                />
              ) : (
                <View style={styles.modalImagePlaceholder}>
                  <Text style={styles.modalImageText}>👤</Text>
                </View>
              )}
              <Text style={styles.modalTitle}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.modalAge}>{user.age} years</Text>

              {/* Carrusel Parallax de Imágenes */}
              {user.images && user.images.length > 0 ? (
                <View style={styles.carouselContainer}>
                  <Carousel
                    loop
                    width={Dimensions.get('window').width * 0.7}
                    height={200}
                    data={user.images}
                    scrollAnimationDuration={1000}
                    mode="parallax"
                    modeConfig={{
                      parallaxScrollingScale: 0.9,
                      parallaxScrollingOffset: 50,
                      parallaxAdjacentItemScale: 0.8,
                    }}
                    renderItem={({item, index}) => (
                      <View style={styles.carouselItem}>
                        <Image
                          source={item as any}
                          style={styles.carouselImage}
                          resizeMode="cover"
                        />
                        <View style={styles.imageIndicator}>
                          <Text style={styles.imageIndicatorText}>
                            {index + 1} / {user.images.length}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                </View>
              ) : (
                <View style={styles.carouselPlaceholder}>
                  <Text style={styles.carouselPlaceholderText}>👤</Text>
                  <Text style={styles.carouselPlaceholderSubtext}>
                    Sin imágenes disponibles
                  </Text>
                </View>
              )}

              <Text style={styles.modalBiography}>{user.biography}</Text>
              {/* <View>
                {user.interest.map(interest => (
                  <Chip
                    key={interest}
                    mode="flat"
                    onPress={() => {}}
                    style={{
                      margin: 2,
                      backgroundColor: colors.text,
                      opacity: 0.8,
                    }}
                    textStyle={{
                      color: colors.backgroundSecondary,
                    }}>
                    {interest}
                  </Chip>
                ))}
              </View> */}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  } else {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.modalAge}>{user.age} years</Text>
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.background,
  },
  scrollContent: {
    width: '100%',
  },
  scrollContentContainer: {
    alignItems: 'center',
    paddingBottom: 20,
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
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  modalImagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImageText: {
    fontSize: 80,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  modalAge: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  // Estilos para el Carrusel Parallax
  carouselContainer: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  carouselItem: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  carouselPlaceholder: {
    width: Dimensions.get('window').width * 0.8,
    height: 250,
    borderRadius: 15,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  carouselPlaceholderText: {
    fontSize: 60,
    marginBottom: 10,
  },
  carouselPlaceholderSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalBiography: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 15,
    paddingHorizontal: 10,
  },
});
