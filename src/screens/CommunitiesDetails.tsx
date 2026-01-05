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
} from 'react-native';
import {useCometChatGroups} from '../hooks/useCometChatGroups';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackCommunitiesParamList} from '../navigator/StackCommunities';
import {RouteProp} from '@react-navigation/native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {Text, Button, Chip, Surface, Portal, Dialog} from 'react-native-paper';
import {colors, commonStyles} from '../theme/globalTheme';
import ButtonGoBack from '../components/ButtonGoBack';
import {
  DataMembersCommunity,
  DataMessageOfCommunity,
  ResDetailsGroup,
} from '../interfaces/interfacesIAP';
import {AuthContext} from '../context/authContext/authContext';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import FlatListFeed from '../components/FlatListFeed'; // Importamos el nuevo componente

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
  const {communityId, band} = route.params;
  const {
    getDetailsGroup,
    getMembersGroup,
    getMessagesGroup,
    addReactionToMessage,
    addMembersToGroup,
    uploadImageToGroup,
    addMessage,
    removeMemberFromGroup,
  } = useCometChatGroups();

  const {idUserForChats} = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [actualUserIsJoined, setActualUserIsJoined] = useState(false);
  const [showModalForDeleteUser, setShowModalForDeleteUser] = useState(false);
  const [showBtnJoinGroup, setShowBtnJoinGroup] = useState(false);
  const [groupDetails, setGroupDetails] = useState<ResDetailsGroup>(
    {} as ResDetailsGroup,
  );

  const [groupMembers, setGroupMembers] = useState<DataMembersCommunity[]>([]);
  const [groupMessages, setGroupMessages] = useState<DataMessageOfCommunity[]>(
    [],
  );
  const [memberToDelete, setMemberToDelete] =
    useState<DataMembersCommunity | null>(null);

  // Nuevo estado para guardar la info del miembro actual
  const [currentUserMember, setCurrentUserMember] =
    useState<DataMembersCommunity | null>(null);

  // Nuevos estados para la carga individual de tabs
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  //   TODO:useeffect para volver a cargar los detalles de un grupo cuando el usuario se une
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

  //   TODO:useEffect para no mostrar el boton de unirse si ya es miembro
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

  //TODO: Cargar detalles del grupo, miembros y mensajes al montar el componente
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

  //TODO: Función para recargar mensajes (Feed) es llamada por handleTabChange
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

  //TODO: Función para que el usuario actual se una al grupo
  const addActualUserToGroup = async () => {
    try {
      await addMembersToGroup(communityId, [`${idUserForChats}`]);
      setActualUserIsJoined(true);
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };
  //TODO: Función para recargar miembros, se llama cuando handleDeleteMember, handleTabChange
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

  const handleDeleteMeOfCommunity = async () => {
    try {
      await removeMemberFromGroup(communityId, `${idUserForChats}`, `${owner}`);
      // Navegar hacia atrás después de salir del grupo
      navigation.goBack();
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  //TODO: funcion para eliminar un miembro cuando soy admin
  const handleDeleteMember = async (member: DataMembersCommunity) => {
    try {
      await removeMemberFromGroup(
        communityId,
        member.uid!,
        `${idUserForChats}`,
      );
      // Refrescar la lista de miembros después de eliminar
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  //TODO: Manejador del cambio de pestañas
  const handleTabChange = (index: number) => {
    // El orden de las tabs es: 0: About, 1: Feed, 2: Members
    if (index === 1) {
      fetchFeed();
    } else if (index === 2) {
      fetchMembers();
    }
  };

  //TODO:funcion para Renderizado las acciones al deslizar (Swipe)
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
            onPress={() => {
              setMemberToDelete(item);
              setShowModalForDeleteUser(true);
            }}>
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

  //   TODO:funcion para Renderizado de cada miembro en la lista
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

  //   TODO:loading principal
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{marginTop: 10}}>Loading Community...</Text>
      </View>
    );
  }

  // CORRECCIÓN: Desestructuramos desde la ruta correcta
  const {name, icon, membersCount, description, tags, owner} =
    groupDetails.data;
  // CORRECCIÓN: Accedemos a groupDetails.details.data en lugar de groupDetails.data
  if (!groupDetails || !groupDetails.data) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Community not found</Text>
      </View>
    );
  }

  console.log(owner, idUserForChats);

  //   TODO:funcion para renderizar el header con la informacion de la comunidad -->
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
                {owner === `${idUserForChats}` ? (
                  <Button
                    mode="contained"
                    style={styles.joinButton}
                    labelStyle={styles.joinButtonLabel}
                    onPress={() =>
                      navigation.navigate('CommunitiesEdit', {
                        communityDetails: groupDetails.data,
                      })
                    }>
                    Edit Community
                  </Button>
                ) : showBtnJoinGroup ? (
                  <Button
                    mode="contained"
                    style={styles.joinButton}
                    labelStyle={styles.joinButtonLabel}
                    onPress={() => addActualUserToGroup()}>
                    Join Community
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    style={styles.joinButton}
                    labelStyle={styles.joinButtonLabel}
                    onPress={() => handleDeleteMeOfCommunity()}>
                    Leave Community
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
          <ButtonGoBack
            navigation={navigation}
            band={band}
            toScreen="Communities"
          />
          <Text variant="titleMedium" style={styles.topNavTitle}>
            {name}
          </Text>
          <View />
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
            <FlatListFeed
              groupMessages={groupMessages}
              currentUserMember={currentUserMember}
              idUserForChats={`${idUserForChats}`}
              communityId={communityId}
              groupDetails={groupDetails}
              loadingFeed={loadingFeed}
              setLoadingFeed={setLoadingFeed}
              addReactionToMessage={addReactionToMessage}
              uploadImageToGroup={uploadImageToGroup}
              addMessage={addMessage}
              fetchFeed={fetchFeed}
              handleTabChange={handleTabChange}
              listCommunitiesJoined={[]} // Agregado explícitamente vacío
            />
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

            <Portal>
              <Dialog
                visible={showModalForDeleteUser}
                onDismiss={() => setShowModalForDeleteUser(false)}>
                <Dialog.Title>Confirmar</Dialog.Title>
                <Dialog.Content>
                  <Text variant="bodyMedium">¿Estás seguro de continuar?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setShowModalForDeleteUser(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onPress={async () => {
                      if (memberToDelete) {
                        await handleDeleteMember(memberToDelete);
                      }
                      setShowModalForDeleteUser(false);
                      setMemberToDelete(null);
                    }}>
                    Aceptar
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </Tabs.Tab>
        </Tabs.Container>
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
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 12,
    color: colors.text,
  },
  longDescription: {
    textAlign: 'center',
    fontSize: 16,
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
    backgroundColor: colors.primary,
    // O un color suave
  },
  chipText: {
    color: colors.text,
    fontSize: 14,
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
