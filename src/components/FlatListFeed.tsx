import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Surface,
  Portal,
  Modal,
  List,
  FAB,
  Menu, // Agregado Menu
} from 'react-native-paper';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Tabs} from 'react-native-collapsible-tab-view';

import {colors} from '../theme/globalTheme';
import {
  Data,
  DataMembersCommunity,
  DataMessageOfCommunity,
  ResDetailsGroup,
} from '../interfaces/interfacesIAP';
import {UploadFile} from '../interfaces/interfacesApp';

interface FlatListFeedProps {
  groupMessages: DataMessageOfCommunity[];
  currentUserMember: DataMembersCommunity | null;
  idUserForChats: string;
  communityId: string;
  groupDetails: ResDetailsGroup;
  loadingFeed: boolean;
  setLoadingFeed: (loading: boolean) => void;
  // Funciones API pasadas desde el hook del padre
  addReactionToMessage: (
    messageId: string,
    reaction: string,
    uid: string,
  ) => Promise<any>;
  uploadImageToGroup: (file: UploadFile) => Promise<any>;
  addMessage: (
    guid: string,
    onBehalfOf: string,
    text: string,
    attachments: any[],
  ) => Promise<any>;
  fetchFeed: () => void;
  handleTabChange: (index: number) => void;
  isAllFeed?: boolean;
  listCommunitiesJoined?: Data[];
}

const FlatListFeed = ({
  groupMessages,
  currentUserMember,
  idUserForChats,
  communityId,
  groupDetails,
  loadingFeed,
  setLoadingFeed,
  addReactionToMessage,
  uploadImageToGroup,
  addMessage,
  fetchFeed,
  handleTabChange,
  isAllFeed = false,
  listCommunitiesJoined = [],
}: FlatListFeedProps) => {
  // --- Estados Locales del Feed ---
  const [messageError, setMessageError] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [selectedCommunityGuid, setSelectedCommunityGuid] = useState('');

  // Estado para el menú de selección de comunidad
  const [visibleCommunityMenu, setVisibleCommunityMenu] = useState(false);
  const openMenu = () => setVisibleCommunityMenu(true);
  const closeMenu = () => setVisibleCommunityMenu(false);

  // Estados para Link
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [positionForLinkInText, setPositionForLinkInText] = useState<
    number | null
  >(null);
  const [linkText, setLinkText] = useState('');
  const [linkError, setLinkError] = useState(false);

  // Estados para Imagen
  const [postImage, setPostImage] = useState<UploadFile | {}>({});
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  // --- Lógica de Imagen ---
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
      Alert.alert('Error', 'Error al seleccionar imagen');
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      const file: UploadFile = {
        uri: asset.uri || '',
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      };
      setPostImage(file);
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
    setPostImage({} as UploadFile);
  };

  // --- Lógica de Publicación ---
  const validateLink = (text: string) => {
    setLinkText(text);
    if (text.length === 0) {
      setLinkError(false);
      return;
    }
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
      'i',
    );
    setLinkError(!pattern.test(text));
  };

  const handlePublishPost = async () => {
    // 1. Determinar el GUID destino
    let targetGuid = '';

    if (isAllFeed) {
      if (!selectedCommunityGuid) {
        setMessageError('Please select a community to post to.');
        return;
      }
      targetGuid = selectedCommunityGuid;
    } else {
      targetGuid = groupDetails?.data?.guid || communityId;
    }

    let allTextForNewPost = newPostText;

    if (linkText && linkText.trim().length > 0) {
      const position =
        positionForLinkInText !== null
          ? positionForLinkInText
          : newPostText.length;
      const part1 = newPostText.slice(0, position);
      const part2 = newPostText.slice(position);
      allTextForNewPost = `${part1} ${linkText} ${part2}`.trim();
    }

    const imageFile = postImage as UploadFile;
    const hasImage = imageFile && imageFile.uri;

    if (!allTextForNewPost.trim() && !hasImage) {
      setMessageError('Please write something or upload an image.');
      return;
    }

    setLoadingFeed(true);
    setMessageError('');

    let attachments: {url: string; name: string; mimeType: string}[] = [];

    try {
      if (hasImage) {
        try {
          const {url} = await uploadImageToGroup(imageFile);
          attachments.push({
            url: url,
            name: imageFile.name || 'image.png',
            mimeType: imageFile.type || 'image/png',
          });
        } catch (err) {
          console.error('Upload error:', err);
          setMessageError('Error uploading image Post, retry maybe later.');
          setLoadingFeed(false);
          return;
        }
      }

      // Usamos targetGuid determinado al inicio
      await addMessage(
        targetGuid,
        `${idUserForChats}`,
        allTextForNewPost,
        attachments,
      );

      setNewPostText('');
      setLinkText('');
      setPostImage({});
      setShowImageUpload(false);
      setShowLinkInput(false);
      setPositionForLinkInText(null);

      // Opcional: Resetear selección si es AllFeed
      if (isAllFeed) {
        setSelectedCommunityGuid('');
      }

      fetchFeed();
    } catch (error) {
      console.error('Publish error:', error);
      setMessageError('Error publishing post. Please try again.');
    } finally {
      setLoadingFeed(false);
    }
  };

  // --- Render Helpers ---
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
      <Text style={styles.feedText}>
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            return (
              <Text
                key={index}
                style={{color: '#2980b9', textDecorationLine: 'underline'}}
                onPress={() => Linking.openURL(part)}>
                {part}
              </Text>
            );
          }
          return (
            <Text style={{color: colors.text}} key={index}>
              {part}
            </Text>
          );
        })}
      </Text>
    );
  };

  const renderCreatePost = () => {
    // Permitir renderizar si es AllFeed aunque currentUserMember sea null (usará placeholder)
    if (!currentUserMember && !isAllFeed) {
      return null;
    }

    const imageFile = postImage as UploadFile;

    // Obtener nombre de la comunidad seleccionada
    const selectedCommunity = listCommunitiesJoined.find(
      c => c.guid === selectedCommunityGuid,
    );
    const selectedLabel = selectedCommunity
      ? selectedCommunity.name
      : 'Select a community...';

    return (
      <Surface style={styles.createPostCard} elevation={1}>
        <View style={styles.createPostHeader}>
          {currentUserMember?.avatar ? (
            <Image
              source={{uri: currentUserMember.avatar}}
              style={styles.feedAvatar}
            />
          ) : (
            <View style={styles.feedAvatarPlaceholder}>
              <Text style={styles.profileImageText}>👤</Text>
            </View>
          )}
          <TextInput
            style={styles.createPostInput}
            placeholder="Write your post here"
            placeholderTextColor={colors.textSecondary}
            multiline
            value={newPostText}
            onChangeText={setNewPostText}
          />
        </View>

        {/* Selector de Comunidad (Solo si isAllFeed es true) usando Menu de Paper */}
        {isAllFeed && listCommunitiesJoined.length > 0 && (
          <View style={styles.pickerContainer}>
            <Menu
              visible={visibleCommunityMenu}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity
                  onPress={openMenu}
                  style={styles.pickerButton}>
                  <Text
                    style={[
                      styles.pickerText,
                      !selectedCommunityGuid && {color: colors.textSecondary},
                    ]}>
                    {selectedLabel}
                  </Text>
                  <MaterialDesignIcons
                    name="chevron-down"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              }
              contentStyle={{backgroundColor: 'white'}}>
              {listCommunitiesJoined.map(c => (
                <Menu.Item
                  key={c.guid}
                  onPress={() => {
                    setSelectedCommunityGuid(c.guid);
                    closeMenu();
                  }}
                  title={c.name}
                />
              ))}
            </Menu>
          </View>
        )}

        {showLinkInput && (
          <View style={styles.linkSection}>
            <View style={styles.linkInputContainer}>
              <TextInput
                style={styles.linkInput}
                placeholder="Paste or write your link here"
                placeholderTextColor={colors.textSecondary}
                value={linkText}
                onChangeText={validateLink}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {linkError && (
              <View style={styles.errorContainer}>
                <MaterialDesignIcons
                  name="alert-circle-outline"
                  size={24}
                  color="#B00020"
                />
                <Text style={styles.errorText}>
                  Oops, this link isn't valid. Double-check, and try again.
                </Text>
              </View>
            )}
            {messageError.length > 0 && (
              <Text style={styles.errorText}>{messageError}</Text>
            )}
          </View>
        )}

        {showImageUpload && (
          <View style={styles.imageUploadSection}>
            <Surface style={styles.imageContainer} elevation={1}>
              {loadingImage ? (
                <ActivityIndicator color={colors.primary} />
              ) : imageFile.uri ? (
                <View style={styles.fullImageWrapper}>
                  <Image source={{uri: imageFile.uri}} style={styles.image} />
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
                  <Text style={styles.placeholderText}>Upload an Image</Text>
                </TouchableOpacity>
              )}
            </Surface>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.createPostFooter}>
          <View style={styles.createPostIconsContainer}>
            <TouchableOpacity
              onPress={() => {
                if (postImage) {
                  removeImage();
                }
                setShowImageUpload(!showImageUpload);
              }}>
              <MaterialDesignIcons
                name={'image-album'}
                size={28}
                color={showImageUpload ? colors.primary : colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (linkText) {
                  setLinkText('');
                }
                setPositionForLinkInText(newPostText.length);
                setShowLinkInput(!showLinkInput);
              }}>
              <MaterialDesignIcons
                name={'link-box'}
                size={28}
                color={showLinkInput ? colors.primary : colors.text}
              />
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={() => handlePublishPost()}
            style={styles.publishButton}
            labelStyle={styles.publishButtonLabel}>
            Publish Post
          </Button>
        </View>
      </Surface>
    );
  };

  const renderFeedItem = ({item}: {item: DataMessageOfCommunity}) => {
    const sender = item.data?.entities.sender;
    const avatar = sender?.entity.avatar;
    const name = sender?.entity.name || 'Unknown';
    const date = new Date(item.sentAt * 1000).toLocaleDateString();
    const text = item.data?.text;
    const attachments = item.data?.attachments;
    const imageUrl =
      attachments && attachments.length > 0 ? attachments[0].url : null;

    const reactions = item.data?.reactions || [];
    const thumbsUpReaction = reactions.find(r => r.reaction === '👍');
    const thumbsDownReaction = reactions.find(r => r.reaction === '👎');

    const thumbsUpCount = thumbsUpReaction ? thumbsUpReaction.count : 0;
    const thumbsDownCount = thumbsDownReaction ? thumbsDownReaction.count : 0;

    // Obtener nombre de la comunidad para el modo AllFeed
    const communityName = item.data?.entities?.receiver?.entity?.name;

    return (
      <Surface style={styles.feedCard} elevation={1}>
        {/* Header condicional para All Feed */}
        {isAllFeed && communityName && (
          <View style={styles.postedInHeader}>
            <Text style={styles.postedInText}>Posted in </Text>
            <Text style={styles.postedInCommunity}>{communityName}</Text>
          </View>
        )}

        <View style={styles.feedHeader}>
          {avatar ? (
            <Image source={{uri: avatar}} style={styles.feedAvatar} />
          ) : (
            <View style={styles.feedAvatarPlaceholder}>
              <Text style={styles.profileImageText}>👤</Text>
            </View>
          )}
          <View>
            <Text style={styles.feedUser}>{name}</Text>
            <Text style={styles.feedDate}>{date}</Text>
          </View>
        </View>

        {text ? renderTextWithLinks(text) : null}

        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={styles.feedImage}
            resizeMode="cover"
          />
        ) : null}

        <View style={styles.feedFooter}>
          <TouchableOpacity
            onPress={() => {
              addReactionToMessage(item.id, '👍', `${idUserForChats}`);
              // En modo AllFeed, tal vez no queramos cambiar de tab, o sí.
              // Si handleTabChange maneja tabs del padre, aquí podría no aplicar igual si estamos en Communities screen.
              // Pero lo dejamos funcional.
              if (!isAllFeed) {
                handleTabChange(1);
              } else {
                fetchFeed(); // Recargar feed general
              }
            }}
            style={styles.feedActionBtn}>
            <MaterialDesignIcons
              name={'thumb-up'}
              size={28}
              color={colors.primary}
            />
            <Text style={styles.reactionCount}>{thumbsUpCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              addReactionToMessage(item.id, '👎', `${idUserForChats}`);
              if (!isAllFeed) {
                handleTabChange(1);
              } else {
                fetchFeed();
              }
            }}
            style={styles.feedActionBtn}>
            <MaterialDesignIcons
              name={'thumb-down'}
              size={28}
              color={colors.secondary}
            />
            <Text style={styles.reactionCount}>{thumbsDownCount}</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    );
  };

  if (loadingFeed) {
    return (
      <View style={styles.tabLoadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Tabs.FlatList
        data={groupMessages}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderFeedItem}
        ListHeaderComponent={renderCreatePost()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>There are no publications</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

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
    </>
  );
};

const styles = StyleSheet.create({
  // Estilos para el Picker (Adaptado para Menu)
  pickerContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    height: 50,
    justifyContent: 'center',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: '100%',
    width: '100%',
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
  },
  // Nuevos estilos para el header de All Feed
  postedInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  postedInText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  postedInCommunity: {
    color: colors.primary, // Naranja o color primario
    fontSize: 13,
    fontWeight: 'bold',
  },
  tabLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontStyle: 'italic',
  },
  // Feed Item Styles
  feedCard: {
    backgroundColor: colors.background,
    marginBottom: 10,
    padding: 15,
    borderBottomWidth: 4,
    borderBottomColor: '#f2f2f2',
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
  },
  feedAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 20,
  },
  feedUser: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.text,
  },
  feedDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  feedText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  feedImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  feedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 20,
  },
  feedActionBtn: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  reactionCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  // Create Post Styles
  createPostCard: {
    backgroundColor: colors.background,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 10,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  createPostInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  linkSection: {
    marginTop: 5,
    marginBottom: 10,
  },
  linkInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  linkInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#2980b9',
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  errorText: {
    marginLeft: 10,
    color: colors.text,
    fontSize: 14,
    flex: 1,
  },
  imageUploadSection: {
    marginTop: 10,
    marginBottom: 5,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  createPostFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createPostIconsContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  publishButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  publishButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Modal Styles
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
});

export default FlatListFeed;
