import React, {useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import LogoSofy from '../components/LogoSofy';
import {
  FAB,
  Surface,
  Text,
  Portal,
  Modal,
  List,
  Button,
} from 'react-native-paper';
import {colors} from '../theme/globalTheme';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface GridImageProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function GridImage({images, setImages}: GridImageProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // Eliminar imagen
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // Opciones para image picker
  const imagePickerOptions = {
    mediaType: 'photo' as const,
    quality: 0.8 as const,
    maxWidth: 800,
    maxHeight: 800,
    includeBase64: false,
    saveToPhotos: false,
  };

  // Solicitar permisos para Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de Cámara',
            message: 'Esta app necesita acceso a tu cámara',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Procesar respuesta de imagen
  const handleImageResponse = (response: any) => {
    setLoading(false);
    hideModal();

    console.log('Image picker response:', response); // Debug log

    if (response.didCancel) {
      console.log('Usuario canceló la selección');
      return;
    }

    if (response.errorCode) {
      console.log('Error code:', response.errorCode);
      console.log('Error message:', response.errorMessage);

      let errorMessage = 'Error desconocido';

      // Manejar diferentes tipos de errores comunes en iOS
      switch (response.errorCode) {
        case 'camera_unavailable':
          errorMessage = 'La cámara no está disponible en este dispositivo';
          break;
        case 'permission':
          errorMessage =
            'Permiso de cámara denegado. Por favor, habilita el acceso a la cámara en la configuración';
          break;
        case 'others':
          errorMessage =
            response.errorMessage || 'Error desconocido al acceder a la cámara';
          break;
        default:
          errorMessage =
            response.errorMessage || `Error (${response.errorCode})`;
      }

      Alert.alert('Error', `Error al seleccionar imagen: ${errorMessage}`);
      return;
    }

    if (response.assets && response.assets[0]) {
      const newImage = response.assets[0].uri;

      if (images.length >= 6) {
        Alert.alert('Límite alcanzado', 'Solo puedes agregar hasta 6 imágenes');
        return;
      }

      setImages(prev => [...prev, newImage]);
    }
  };

  // Manejar selección de cámara
  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permiso denegado',
        'Necesitas permitir el acceso a la cámara',
      );
      return;
    }

    setLoading(true);
    launchCamera(imagePickerOptions, handleImageResponse);
  };

  // Manejar selección de galería
  const handleChooseFromLibrary = () => {
    setLoading(true);
    launchImageLibrary(imagePickerOptions, handleImageResponse);
  };
  // Renderizar slot de imagen
  const renderImageSlot = (index: number) => {
    const hasImage = images[index];

    return (
      <Surface key={index} style={styles.imageSlot} elevation={2}>
        {hasImage ? (
          <View style={styles.imageContainer}>
            <Image source={{uri: hasImage}} style={styles.image} />
            <FAB
              icon="close"
              style={styles.removeFab}
              size="small"
              onPress={() => removeImage(index)}
              color={colors.background}
            />
          </View>
        ) : (
          <FAB
            icon="plus"
            style={styles.addFab}
            size="small"
            onPress={showModal}
            mode="flat"
            disabled={loading}
          />
        )}
      </Surface>
    );
  };
  return (
    <View>
      <LogoSofy />
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Add your recent pics
        </Text>
        <Text variant="bodyMedium" style={styles.recommendation}>
          We recommend a face photo
        </Text>
      </View>
      <Surface style={styles.gridContainer} elevation={1}>
        <View style={styles.grid}>
          {[...Array(6)].map((_, index) => renderImageSlot(index))}
        </View>
        <Text style={styles.imageCount}>{images.length}/6 photos</Text>
      </Surface>

      {/* Modal para seleccionar origen de imagen */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}>
          <Surface style={styles.modalContent} elevation={5}>
            <Text variant="titleMedium" style={styles.modalTitle}>
              Add Photo
            </Text>

            <List.Item
              title="Take Photo"
              left={props => <List.Icon {...props} icon="camera" />}
              onPress={handleTakePhoto}
              style={styles.listItem}
            />

            <List.Item
              title="Choose from Library"
              left={props => <List.Icon {...props} icon="image" />}
              onPress={handleChooseFromLibrary}
              style={styles.listItem}
            />

            <Button
              mode="text"
              onPress={hideModal}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonLabel}>
              Cancel
            </Button>
          </Surface>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 4,
    color: colors.secondary,
  },
  recommendation: {
    textAlign: 'center',
    color: colors.textSecondary,
  },
  gridContainer: {
    marginVertical: 0,
    borderRadius: 16,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageSlot: {
    width: '30%',
    aspectRatio: 0.75,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  addFab: {
    backgroundColor: 'transparent',
  },
  removeFab: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.textDisabled,
  },
  imageCount: {
    textAlign: 'center',
    marginTop: 8,
    color: colors.textSecondary,
  },
  modalContainer: {
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  listItem: {
    paddingVertical: 12,
  },
  cancelButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  cancelButtonLabel: {
    color: colors.text,
  },
});
