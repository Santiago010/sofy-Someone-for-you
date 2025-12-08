import React, {useState, useEffect} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
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
import {UploadFile, IndividualFile} from '../interfaces/interfacesApp';
import {showError} from '../helpers/ShowError';

interface GridImageProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  onImageFilesChange?: (files: UploadFile[]) => void;
  individualFiles?: IndividualFile[];
  onAddImage?: (photo: UploadFile) => Promise<void>;
  onRemoveImage?: (fileId: string) => Promise<void>;
  onRefreshData?: () => void;
}

export default function GridImage({
  images,
  setImages,
  onImageFilesChange,
  individualFiles = [],
  onAddImage,
  onRemoveImage,
  onRefreshData,
}: GridImageProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(6).fill(false),
  );
  const [backendImages, setBackendImages] = useState<string[]>(
    Array(6).fill(''),
  );
  const [backendFileIds, setBackendFileIds] = useState<string[]>(
    Array(6).fill(''),
  );
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null,
  );

  // Cargar imágenes desde el backend cuando individualFiles cambia
  useEffect(() => {
    if (individualFiles && individualFiles.length > 0) {
      const newBackendImages = Array(6).fill('');
      const newBackendFileIds = Array(6).fill('');

      individualFiles.forEach((individualFile, index) => {
        if (index < 6 && individualFile.file && individualFile.file.url) {
          newBackendImages[index] = individualFile.file.url;
          newBackendFileIds[index] = individualFile.file.id.toString();
        }
      });

      setBackendImages(newBackendImages);
      setBackendFileIds(newBackendFileIds);
    }
  }, [individualFiles]);

  const showModal = (index: number) => {
    setSelectedSlotIndex(index);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedSlotIndex(null);
  };

  //   Eliminar imagen del backend
  const removeImageFromBackend = async (index: number) => {
    if (individualFiles.length === 1) {
      showError({
        screen: 'EditPhotos',
        errorMessage: 'At least one photo is required.',
        removeError: () => {},
      });
      return;
    }
    const fileId = backendFileIds[index];

    if (!fileId || !onRemoveImage) {
      return;
    }

    // Activar loading para este slot
    const newLoadingStates = [...loadingStates];
    newLoadingStates[index] = true;
    setLoadingStates(newLoadingStates);

    try {
      await onRemoveImage(fileId);

      // Limpiar el slot después de eliminar exitosamente
      const newBackendImages = [...backendImages];
      const newBackendFileIds = [...backendFileIds];
      newBackendImages[index] = '';
      newBackendFileIds[index] = '';
      setBackendImages(newBackendImages);
      setBackendFileIds(newBackendFileIds);

      // Refrescar datos si está disponible
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la imagen. Intenta de nuevo.');
      console.error('Error removing image:', error);
    } finally {
      // Desactivar loading
      const newLoadingStates = [...loadingStates];
      newLoadingStates[index] = false;
      setLoadingStates(newLoadingStates);
    }
  };

  // Eliminar imagen local
  const removeLocalImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImages(newImages);
    setImageFiles(newFiles);
    if (onImageFilesChange) {
      onImageFilesChange(newFiles);
    }
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
  const handleImageResponse = async (response: any) => {
    setLoading(false);

    if (response.didCancel) {
      hideModal();
      return;
    }

    if (response.errorCode) {
      let errorMessage = 'Error desconocido';

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
      hideModal();
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];

      // Verificar si hay espacio disponible
      const totalImages =
        backendImages.filter(img => img !== '').length + images.length;
      if (totalImages >= 6) {
        Alert.alert('Límite alcanzado', 'Solo puedes agregar hasta 6 imágenes');
        hideModal();
        return;
      }

      // Crear objeto UploadFile
      const file: UploadFile = {
        uri: asset.uri || '',
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      };

      // Si hay función para subir al backend, usarla
      if (onAddImage && selectedSlotIndex !== null) {
        // Activar loading para este slot
        const newLoadingStates = [...loadingStates];
        newLoadingStates[selectedSlotIndex] = true;
        setLoadingStates(newLoadingStates);

        hideModal();

        try {
          await onAddImage(file);

          // Refrescar datos si está disponible
          if (onRefreshData) {
            onRefreshData();
          }
        } catch (error) {
          Alert.alert('Error', 'No se pudo subir la imagen. Intenta de nuevo.');
          console.error('Error uploading image:', error);
        } finally {
          // Desactivar loading
          const newLoadingStates = [...loadingStates];
          newLoadingStates[selectedSlotIndex] = false;
          setLoadingStates(newLoadingStates);
        }
      } else {
        // Modo local (sin backend)
        setImages(prev => [...prev, asset.uri]);
        const newFiles = [...imageFiles, file];
        setImageFiles(newFiles);

        if (onImageFilesChange) {
          onImageFilesChange(newFiles);
        }
        hideModal();
      }
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
    const hasBackendImage = backendImages[index] !== '';
    const hasLocalImage = images[index];
    const isLoading = loadingStates[index];

    return (
      <Surface key={index} style={styles.imageSlot} elevation={2}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : hasBackendImage ? (
          <View style={styles.imageContainer}>
            <Image source={{uri: backendImages[index]}} style={styles.image} />
            <FAB
              icon="close"
              style={styles.removeFab}
              size="small"
              onPress={() => removeImageFromBackend(index)}
              color={colors.background}
            />
          </View>
        ) : hasLocalImage ? (
          <View style={styles.imageContainer}>
            <Image source={{uri: hasLocalImage}} style={styles.image} />
            <FAB
              icon="close"
              style={styles.removeFab}
              size="small"
              onPress={() => removeLocalImage(index)}
              color={colors.background}
            />
          </View>
        ) : (
          <FAB
            icon="plus"
            style={styles.addFab}
            size="small"
            onPress={() => showModal(index)}
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
        <Text style={styles.imageCount}>
          {backendImages.filter(img => img !== '').length + images.length}/6
          photos
        </Text>
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
  loadingContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
