import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Platform,
  UIManager,
  Image,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import {useCometChatGroups} from '../hooks/useCometChatGroups';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackCommunitiesParamList} from '../navigator/StackCommunities';
import {RouteProp} from '@react-navigation/native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {
  Text,
  Button,
  Chip,
  Surface,
  Portal, // Agregado
  Modal, // Agregado
  List, // Agregado
  FAB, // Agregado
} from 'react-native-paper';
import {colors, commonStyles} from '../theme/globalTheme';
import ButtonGoBack from '../components/ButtonGoBack';
import {
  DataMembersCommunity,
  DataMessageOfCommunity,
  ResDetailsGroup,
} from '../interfaces/interfacesIAP';
import {UploadFile} from '../interfaces/interfacesApp'; // Agregado (Asegúrate de que esta interfaz exista aquí o impórtala correctamente)
import {AuthContext} from '../context/authContext/authContext';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'; // Agregado

// Habilitar animaciones en Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  navigation: StackNavigationProp<
    RootStackCommunitiesParamList,
    'CommunitiesDetails'
  >;
  route: RouteProp<RootStackCommunitiesParamList, 'CommunitiesDetails'>;
};

const CommunitiesDetails = ({navigation, route}: Props) => {
  const {communityId} = route.params;
  const {
    getDetailsGroup,
    getMembersGroup,
    getMessagesGroup,
    addReactionToMessage,
    addMembersToGroup,
    uploadImageToGroup,
    addMessage,
  } = useCometChatGroups();

  const {idUserForChats} = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [messageError, setMessageError] = useState('');
  const [actualUserIsJoined, setActualUserIsJoined] = useState(false);
  const [showBtnJoinGroup, setShowBtnJoinGroup] = useState(false);
  const [groupDetails, setGroupDetails] = useState<ResDetailsGroup>(
    {} as ResDetailsGroup,
  );
  const [groupMembers, setGroupMembers] = useState<DataMembersCommunity[]>([]);
  const [groupMessages, setGroupMessages] = useState<DataMessageOfCommunity[]>(
    [],
  );
  // Nuevo estado para guardar la info del miembro actual
  const [currentUserMember, setCurrentUserMember] =
    useState<DataMembersCommunity | null>(null);

  // Estado para el texto del nuevo post
  const [newPostText, setNewPostText] = useState('');

  // --- Estados para el Link ---
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [positionForLinkInText, setPositionForLinkInText] = useState<
    number | null
  >(null);
  const [linkText, setLinkText] = useState('');
  const [linkError, setLinkError] = useState(false);

  // --- Estados para la Imagen del Post ---
  const [postImage, setPostImage] = useState<UploadFile | {}>({});
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const handlePublishPost = async () => {
    // 1. Lógica de Texto: Insertar Link si existe
    let allTextForNewPost = newPostText;

    if (linkText && linkText.trim().length > 0) {
      const position =
        positionForLinkInText !== null
          ? positionForLinkInText
          : newPostText.length;
      // Insertamos el link con espacios alrededor para evitar que se pegue al texto
      const part1 = newPostText.slice(0, position);
      const part2 = newPostText.slice(position);
      allTextForNewPost = `${part1} ${linkText} ${part2}`.trim();
    }

    // Validar que haya algo que enviar (texto o imagen)
    const imageFile = postImage as UploadFile;
    const hasImage = imageFile && imageFile.uri;

    if (!allTextForNewPost.trim() && !hasImage) {
      setMessageError('Please write something or upload an image.');
      return;
    }

    setLoadingFeed(true); // Mostrar carga en el feed mientras se publica
    setMessageError('');

    let attachments: {url: string; name: string; mimeType: string}[] = [];

    try {
      // 2. Lógica de Imagen: Subir si existe
      if (hasImage) {
        try {
          const {url} = await uploadImageToGroup(imageFile);
          // Si llega aquí, la imagen se subió correctamente (then implícito por await)
          attachments.push({
            url: url,
            name: imageFile.name || 'image.png',
            mimeType: imageFile.type || 'image/png',
          });
        } catch (err) {
          // Caso contrario (catch)
          console.error('Upload error:', err);
          setMessageError('Error uploading image Post, retry maybe later.');
          setLoadingFeed(false);
          return; // Detenemos la ejecución si falla la imagen
        }
      }

      // 3. Llamar a addMessage
      // Obtenemos el GUID del grupo de los detalles o de los params
      const groupGuid = groupDetails?.data?.guid || communityId;

      await addMessage(
        groupGuid,
        `${idUserForChats}`, // onBehalfOf
        allTextForNewPost,
        attachments,
      );

      // 4. Limpieza de estados tras éxito
      setNewPostText('');
      setLinkText('');
      setPostImage({});
      setShowImageUpload(false);
      setShowLinkInput(false);
      setPositionForLinkInText(null);

      // Recargar el feed para ver el nuevo mensaje
      fetchFeed();
    } catch (error) {
      console.error('Publish error:', error);
      setMessageError('Error publishing post. Please try again.');
    } finally {
      setLoadingFeed(false);
    }
  };

  // --- Lógica de Imagen (Copiada de CommunitiesAdd) ---
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

  useEffect(() => {
    if (actualUserIsJoined) {
      Promise.all([
        getDetailsGroup(communityId),
        getMembersGroup(communityId),
      ]).then(([detailsRes, membersRes]) => {
        setGroupDetails(detailsRes.details as ResDetailsGroup);
        setGroupMembers(membersRes.members);
      });
    }
  }, [actualUserIsJoined]);

  useEffect(() => {
    const memberFound = groupMembers.find(
      member => member.uid === `${idUserForChats}`,
    );

    if (memberFound) {
      setCurrentUserMember(memberFound);
    }

    const isMember = !!memberFound;

    console.log(isMember);
    // Ocultar botón si ya es miembro en la lista O si acabamos de unirnos exitosamente (flag local)
    setShowBtnJoinGroup(!(isMember || actualUserIsJoined));
  }, [groupMembers, idUserForChats, actualUserIsJoined]);

  // Nuevos estados para la carga individual de tabs
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    console.log(currentUserMember);
  }, [currentUserMember]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDetailsGroup(communityId),
      getMembersGroup(communityId),
      getMessagesGroup(communityId),
    ])
      .then(([detailsRes, membersRes, messagesRes]) => {
        setGroupDetails(detailsRes.details as ResDetailsGroup);
        setGroupMembers(membersRes.members);
        setGroupMessages(messagesRes.messages);

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching group details or members:', error);
        setLoading(false);
      });
  }, [communityId]);

  // Función para recargar mensajes (Feed)
  const fetchFeed = async () => {
    setLoadingFeed(true);
    try {
      const res = await getMessagesGroup(communityId);
      setGroupMessages(res.messages);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoadingFeed(false);
    }
  };

  const addActualUserToGroup = async () => {
    try {
      await addMembersToGroup(communityId, [`${idUserForChats}`]);
      setActualUserIsJoined(true);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };
  // Función para recargar miembros
  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await getMembersGroup(communityId);
      setGroupMembers(res.members);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Manejador del cambio de pestañas
  const handleTabChange = (index: number) => {
    // El orden de las tabs es: 0: About, 1: Feed, 2: Members
    if (index === 1) {
      fetchFeed();
    } else if (index === 2) {
      fetchMembers();
    }
  };

  // Función para validar URL
  const validateLink = (text: string) => {
    setLinkText(text);
    if (text.length === 0) {
      setLinkError(false);
      return;
    }
    // Regex estricto para validar URL completa
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    setLinkError(!pattern.test(text));
  };

  // Función auxiliar para renderizar texto con links detectados
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
                style={{color: '#2980b9', textDecorationLine: 'underline'}} // Azul enlace
                onPress={() => Linking.openURL(part)}>
                {part}
              </Text>
            );
          }
          return (
            <Text
              style={{
                color: colors.text,
              }}
              key={index}>
              {part}
            </Text>
          );
        })}
      </Text>
    );
  };

  // Componente para crear nuevo post
  const renderCreatePost = () => {
    if (!currentUserMember) {
      return null;
    }

    // Casting para facilitar acceso a propiedades
    const imageFile = postImage as UploadFile;

    return (
      <Surface style={styles.createPostCard} elevation={1}>
        {/* 1. Avatar y TextInput */}
        <View style={styles.createPostHeader}>
          {currentUserMember.avatar ? (
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

        {/* Área de Link (Condicional) */}
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
              {/* Botón de pegar eliminado */}
            </View>

            {/* Mensaje de Error de Link */}
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

        {/* Área de carga de imagen (Condicional) */}
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

        {/* 2. Iconos y Botón Publicar */}
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

  // Renderizado de las acciones al deslizar (Swipe)
  const renderRightActions = (item: DataMembersCommunity) => {
    const isOwner = `${idUserForChats}` === groupDetails?.data?.owner;

    return (
      <View style={styles.actionsContainer}>
        {/* Botón 3: Robot Love */}
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: colors.primary}]} // Fondo suave opcional
          onPress={() => console.log('Robot action')}>
          <MaterialDesignIcons
            name={'robot-love'}
            size={28}
            color={colors.backgroundSecondary}
          />
        </TouchableOpacity>

        {/* Botón 2: Book Heart */}
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: colors.secondary}]} // Fondo suave opcional
          onPress={() => console.log('Book action')}>
          <MaterialDesignIcons
            name={'book-heart'}
            size={28}
            color={colors.backgroundSecondary}
          />
        </TouchableOpacity>

        {/* Botón 1: Eliminar (Solo si es Owner) */}
        {isOwner && (
          <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: colors.error}]} // Fondo suave opcional
            onPress={() => console.log('Delete member', item.uid)}>
            <MaterialDesignIcons
              name={'trash-can'}
              size={28}
              color={colors.backgroundSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderMemberItem = ({item}: {item: DataMembersCommunity}) => {
    const content = (
      <View style={styles.memberItemContainer}>
        <Image
          source={{
            uri: item.avatar,
          }}
          style={styles.memberAvatar}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberScope}>{item.scope}</Text>
        </View>
        <View style={styles.memberStatusContainer}>
          <Text style={styles.memberStatusText}>{item.status}</Text>
          {item.status === 'online' && <View style={styles.onlineIndicator} />}
        </View>
      </View>
    );

    if (currentUserMember) {
      return (
        <Swipeable renderRightActions={() => renderRightActions(item)}>
          {content}
        </Swipeable>
      );
    }

    return content;
  };

  const renderFeedItem = ({item}: {item: DataMessageOfCommunity}) => {
    console.log('Rendering feed item:', item.data.reactions, 'of', item.id);
    const sender = item.data?.entities.sender;
    const avatar = sender?.entity.avatar;
    const name = sender?.entity.name || 'Unknown';
    // Convertir timestamp a fecha legible (asumiendo segundos)
    const date = new Date(item.sentAt * 1000).toLocaleDateString();
    const text = item.data?.text;
    const attachments = item.data?.attachments;
    // Obtener URL de la imagen si existe en attachments
    const imageUrl =
      attachments && attachments.length > 0 ? attachments[0].url : null;

    // Lógica para contadores de reacciones
    const reactions = item.data?.reactions || [];
    const thumbsUpReaction = reactions.find(r => r.reaction === '👍');
    const thumbsDownReaction = reactions.find(r => r.reaction === '👎');

    const thumbsUpCount = thumbsUpReaction ? thumbsUpReaction.count : 0;
    const thumbsDownCount = thumbsDownReaction ? thumbsDownReaction.count : 0;

    return (
      <Surface style={styles.feedCard} elevation={1}>
        {/* 1, 2 & 3: Avatar, Nombre y Fecha */}
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

        {/* 4. Texto del mensaje con detección de links */}
        {text ? renderTextWithLinks(text) : null}

        {/* 4. Imagen (si attachments tiene url) */}
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={styles.feedImage}
            resizeMode="cover"
          />
        ) : null}

        {/* 5. Botones de acción */}
        <View style={styles.feedFooter}>
          <TouchableOpacity
            onPress={() => {
              addReactionToMessage(item.id, '👍', `${idUserForChats}`);
              handleTabChange(1);
            }}
            style={styles.feedActionBtn}>
            <MaterialDesignIcons
              name={'thumb-up'}
              size={28}
              color={colors.primary} // Usé textSecondary para que sea visible sobre fondo blanco
            />
            <Text style={styles.reactionCount}>{thumbsUpCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              addReactionToMessage(item.id, '👎', `${idUserForChats}`);
              handleTabChange(1);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{marginTop: 10}}>Loading Community...</Text>
      </View>
    );
  }

  // CORRECCIÓN: Accedemos a groupDetails.details.data en lugar de groupDetails.data
  if (!groupDetails || !groupDetails.data) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Community not found</Text>
      </View>
    );
  }

  // CORRECCIÓN: Desestructuramos desde la ruta correcta
  const {name, icon, membersCount, description, tags} = groupDetails.data;

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Surface style={styles.imageCard} elevation={2}>
          <ImageBackground
            source={{uri: icon}}
            style={styles.heroImage}
            imageStyle={{borderRadius: 16}}>
            <View style={styles.overlay}>
              <View style={styles.heroContent}>
                <Text variant="headlineMedium" style={styles.heroTitle}>
                  {name}
                </Text>
                <View style={styles.ratingContainer}>
                  {/* Estrella omitida según instrucciones */}
                  <Text style={styles.heroMembers}>{membersCount} members</Text>
                </View>
                <Text
                  variant="bodyMedium"
                  style={styles.heroDescription}
                  numberOfLines={2}>
                  {description}
                </Text>
                {showBtnJoinGroup && (
                  <Button
                    mode="contained"
                    style={styles.joinButton}
                    labelStyle={styles.joinButtonLabel}
                    onPress={() => addActualUserToGroup()}>
                    Join Community
                  </Button>
                )}
              </View>
            </View>
          </ImageBackground>
        </Surface>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={commonStyles.container}>
        {/* 1. Botón atrás y Nombre de comunidad (Fixed Header) */}
        <View style={styles.topNav}>
          <ButtonGoBack navigation={navigation} />
          <Text variant="titleMedium" style={styles.topNavTitle}>
            {name}
          </Text>
          <View style={{width: 40}} />
        </View>

        {/* 3. Collapsible Tab View */}
        <Tabs.Container
          renderHeader={renderHeader}
          headerContainerStyle={{backgroundColor: colors.background}}
          onIndexChange={handleTabChange} // Detectar cambio de tab
        >
          {/* Tab: About Community */}
          <Tabs.Tab name="About community">
            <Tabs.ScrollView contentContainerStyle={styles.tabContent}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Welcome to {name} 👋
              </Text>
              <Text variant="bodyMedium" style={styles.longDescription}>
                {description}
              </Text>

              <Text variant="titleMedium" style={styles.subTitle}>
                Tags
              </Text>
              <View style={styles.chipsContainer}>
                {tags && tags.length > 0 ? (
                  tags.map((tag: string, index: number) => (
                    <Chip
                      key={index}
                      style={styles.chip}
                      textStyle={styles.chipText}>
                      {tag}
                    </Chip>
                  ))
                ) : (
                  <Text style={{color: colors.textSecondary}}>
                    No tags available
                  </Text>
                )}
              </View>
            </Tabs.ScrollView>
          </Tabs.Tab>

          {/* Tab: Feed */}
          <Tabs.Tab name="Feed">
            {loadingFeed ? (
              <View style={styles.tabLoadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <Tabs.FlatList
                data={groupMessages}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={renderFeedItem}
                ListHeaderComponent={renderCreatePost()}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      There are no publications
                    </Text>
                  </View>
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </Tabs.Tab>

          {/* Tab: Members */}
          <Tabs.Tab name="Members">
            {loadingMembers ? (
              <View style={styles.tabLoadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <Tabs.FlatList
                data={groupMembers}
                keyExtractor={(item, index) => item.uid || index.toString()}
                renderItem={renderMemberItem}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      There are no members yet
                    </Text>
                  </View>
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </Tabs.Tab>
        </Tabs.Container>

        {/* Modal de Selección de Imagen (Portal) */}
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
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Nuevo estilo para el loading dentro de las tabs
  tabLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  topNavTitle: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  // Header / Hero Styles
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  imageCard: {
    borderRadius: 16,
    height: 250,
    backgroundColor: colors.backgroundSecondary,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Oscurecer imagen para leer texto
    borderRadius: 16,
    justifyContent: 'flex-end',
    padding: 16,
  },
  heroContent: {
    gap: 8,
  },
  heroTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroMembers: {
    color: 'white',
    fontSize: 14,
  },
  heroDescription: {
    color: '#f0f0f0',
    fontSize: 13,
  },
  joinButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  joinButtonLabel: {
    color: colors.primary, // O el color que prefieras para el texto del botón
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Tab Content Styles
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 12,
    color: colors.text,
  },
  longDescription: {
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  subTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.backgroundSecondary, // O un color suave
  },
  chipText: {
    color: colors.text,
  },
  // Estilos para la lista de miembros y Swipeable
  listContent: {
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  memberItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#ccc',
  },
  memberInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  memberScope: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  memberStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberStatusText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 5,
    textTransform: 'capitalize',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50', // Verde online
  },
  // Estilos acciones Swipe
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos para el Feed (Reddit Style)
  feedCard: {
    backgroundColor: colors.background,
    marginBottom: 10,
    padding: 15,
    borderBottomWidth: 4,
    borderBottomColor: '#f2f2f2', // Separador gris claro entre posts
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
  // Estilos para Create Post Component
  createPostCard: {
    backgroundColor: colors.background,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 10, // Un poco de margen lateral si se desea
    marginTop: 10,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center', // Alineado arriba para cuando crezca el input
    marginBottom: 10,
  },
  createPostInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100, // Altura máxima antes de hacer scroll interno
    paddingVertical: 8, // Ajuste para centrar con avatar
  },
  // Estilos para la sección de Link
  linkSection: {
    marginTop: 5,
    marginBottom: 10,
  },
  linkInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary, // Un gris muy suave
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  linkInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#2980b9', // Color azul para indicar link
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
  // Estilos para la carga de imagen (Copiados y adaptados)
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
  // Estilos del Modal
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
});

export default CommunitiesDetails;
