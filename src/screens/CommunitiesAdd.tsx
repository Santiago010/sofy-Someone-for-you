import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Chip,
  ActivityIndicator,
  Portal,
  Modal,
  List,
  Surface,
  FAB,
} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {colors, commonStyles} from '../theme/globalTheme';
import useGetInterestWithSubInterest from '../hooks/getInterestWithSubInterest';
import {
  InterestAndSubInterestResponse,
  UploadFile,
} from '../interfaces/interfacesApp';
import ButtonGoBack from '../components/ButtonGoBack';
import {RootStackCommunitiesParamList} from '../navigator/StackCommunities';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useCometChatGroups} from '../hooks/useCometChatGroups';
import {GenerateGuid} from '../helpers/GenerateGuid';

type Props = {
  navigation: StackNavigationProp<
    RootStackCommunitiesParamList,
    'CommunitiesAdd'
  >;
  route: RouteProp<RootStackCommunitiesParamList, 'CommunitiesAdd'>;
};

const CommunitiesAdd = ({navigation, route}: Props) => {
  const {userId} = route.params;

  // 1. Estado del Formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [dataImage, setDataImage] = useState<UploadFile | {}>({});
  const [InterestForGroup, setInterestForGroup] = useState<string[]>([]);

  const {uploadImageToGroup, createGroup} = useCometChatGroups();

  // Estado para controlar mostrar todos los intereses
  const [showAllInterests, setShowAllInterests] = useState(false);

  // Estado para el modal de imagen
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  // Hook de intereses
  const {
    data: interests,
    loading: loadingInterests,
    error: errorInterests,
  } = useGetInterestWithSubInterest();

  // --- Lógica de Imagen (Similar a GridImage) ---

  useEffect(() => {
    console.log('dataImage changed:', dataImage);
  }, [dataImage]);

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

  const handleImageResponse = (response: any) => {
    setLoadingImage(false);
    setModalVisible(false);

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
      setModalVisible(false);
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];

      const file: UploadFile = {
        uri: asset.uri || '',
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      };
      setDataImage(file);
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
    setLoadingImage(true);
    launchCamera(
      {mediaType: 'photo', quality: 0.8, maxWidth: 1000, maxHeight: 1000},
      handleImageResponse,
    );
  };

  const handleChooseFromLibrary = () => {
    setLoadingImage(true);
    launchImageLibrary(
      {mediaType: 'photo', quality: 0.8, maxWidth: 1000, maxHeight: 1000},
      handleImageResponse,
    );
  };

  const removeImage = () => {
    setDataImage({} as UploadFile);
  };

  // --- Lógica de Intereses ---

  const toggleInterest = (interestName: string) => {
    setInterestForGroup(prev => {
      if (prev.includes(interestName)) {
        return prev.filter(name => name !== interestName);
      } else {
        return [...prev, interestName];
      }
    });
  };

  // --- Validación y Guardado ---

  const isFormValid = () => {
    return (
      dataImage.uri !== '' &&
      name.trim().length > 0 &&
      description.trim().length > 0 &&
      InterestForGroup.length > 0
    );
  };

  const handleCreateCommunity = () => {
    uploadImageToGroup(dataImage as UploadFile)
      .then(({url, message}) => {
        createGroup(
          GenerateGuid(),
          name,
          'public',
          InterestForGroup,
          `${userId}`,
          url,
          description,
          `${userId}`,
        )
          .then(({nameGroup, message}) => {
            navigation.goBack();
          })
          .catch(({message}) => {
            console.error('Error creating group from screen:', message);
          });
      })
      .catch(({url, message}) => {
        console.error('Error uploading image for group from screen:', message);
      });
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ButtonGoBack navigation={navigation} />
        <Text variant="headlineMedium" style={styles.screenTitle}>
          Create Community
        </Text>

        {/* 1. Selector de Imagen */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.label}>
            Community Cover
          </Text>
          <Surface style={styles.imageContainer} elevation={1}>
            {loadingImage ? (
              <ActivityIndicator color={colors.primary} />
            ) : dataImage.uri ? (
              <View style={styles.fullImageWrapper}>
                <Image source={{uri: dataImage.uri}} style={styles.image} />
                <FAB
                  icon="close"
                  style={styles.removeFab}
                  size="small"
                  onPress={removeImage}
                  color={colors.background}
                />
                <FAB
                  icon="pencil"
                  style={styles.editFab}
                  size="small"
                  onPress={() => setModalVisible(true)}
                  color={colors.primary}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.placeholderContainer}
                onPress={() => setModalVisible(true)}>
                <FAB
                  icon="camera-plus"
                  style={styles.addIcon}
                  size="medium"
                  color={colors.primary}
                  mode="flat"
                  onPress={() => setModalVisible(true)}
                />
                <Text style={styles.placeholderText}>
                  Upload a Image for your Communitie
                </Text>
              </TouchableOpacity>
            )}
          </Surface>
        </View>

        {/* 2. Name Input */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.label}>
            Name
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Community Name"
            value={name}
            onChangeText={setName}
            style={commonStyles.input}
            outlineStyle={commonStyles.inputOutline}
          />
        </View>

        {/* 3. Description Input */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.label}>
            Description
          </Text>
          <TextInput
            mode="outlined"
            placeholder="What is this community about?"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={[commonStyles.input, styles.textArea]}
            outlineStyle={commonStyles.inputOutline}
          />
        </View>

        {/* 4. Interests Selector */}
        <View style={styles.section}>
          <Text variant="labelLarge" style={styles.label}>
            Select Interests ({InterestForGroup.length})
          </Text>

          {loadingInterests ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <View style={styles.chipsContainer}>
                {(showAllInterests ? interests : interests.slice(0, 13)).map(
                  (interest: InterestAndSubInterestResponse) => {
                    const isSelected = InterestForGroup.includes(interest.name);
                    return (
                      <Chip
                        key={interest.id}
                        mode={isSelected ? 'flat' : 'outlined'}
                        onPress={() => toggleInterest(interest.name)}
                        style={[styles.chip, isSelected && styles.selectedChip]}
                        textStyle={isSelected && styles.selectedChipText}
                        showSelectedOverlay>
                        {interest.name}
                      </Chip>
                    );
                  },
                )}
              </View>

              {/* Botones Show More / Show Less */}
              {interests.length > 13 && !showAllInterests && (
                <View style={styles.showMoreContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowAllInterests(true)}
                    style={styles.showMoreButton}>
                    Show more
                  </Button>
                </View>
              )}
              {interests.length > 13 && showAllInterests && (
                <View style={styles.showMoreContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowAllInterests(false)}
                    style={styles.showMoreButton}>
                    Show less
                  </Button>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* 5. Botón de Guardado */}
      <View style={commonStyles.saveContainer}>
        <Button
          mode="contained"
          onPress={handleCreateCommunity}
          disabled={!isFormValid()}
          style={[
            !isFormValid()
              ? commonStyles.saveButton
              : commonStyles.saveButtonEnabled,
          ]}
          contentStyle={commonStyles.saveButtonContent}
          labelStyle={commonStyles.saveButtonLabel}>
          Create Community
        </Button>
      </View>

      {/* Modal de Selección de Imagen */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}>
          <Surface style={styles.modalContent} elevation={5}>
            <Text variant="titleMedium" style={styles.modalTitle}>
              Upload Photo
            </Text>
            <List.Item
              title="Take Photo"
              left={props => <List.Icon {...props} icon="camera" />}
              onPress={handleTakePhoto}
            />
            <List.Item
              title="Choose from Library"
              left={props => <List.Icon {...props} icon="image" />}
              onPress={handleChooseFromLibrary}
            />
            <Button
              mode="text"
              onPress={() => setModalVisible(false)}
              textColor={colors.textSecondary}>
              Cancel
            </Button>
          </Surface>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
  },
  screenTitle: {
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    color: colors.text,
    fontWeight: '600',
  },
  // Estilos de Imagen
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  fullImageWrapper: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    height: '100%',
  },
  addIcon: {
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  placeholderText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },
  removeFab: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  editFab: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: colors.background,
  },
  // Inputs
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  // Chips
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    margin: 2,
    backgroundColor: colors.background,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  selectedChipText: {
    color: colors.background,
  },
  // Show More Button Styles
  showMoreContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  showMoreButton: {
    borderRadius: 8,
    borderColor: colors.border,
  },
  // Modal
  modalContainer: {
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
  },
  modalTitle: {
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    color: colors.text,
  },
  spacer: {
    height: 60,
  },
});

export default CommunitiesAdd;
