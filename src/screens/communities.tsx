import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {colors} from '../theme/globalTheme';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackCommunitiesParamList} from '../navigator/StackCommunities';
import ContentInfoPlanConnect from '../components/ContentInfoPlanConnect';
import {AuthContext} from '../context/authContext/authContext';
import {useCometChatGroups} from '../hooks/useCometChatGroups';
import {useCometChat} from '../hooks/useCometChat';
import {
  Data,
  DataMessageOfCommunity,
  ResDetailsGroup,
} from '../interfaces/interfacesIAP';
import {Button} from 'react-native-paper';
import FlatListFeed from '../components/FlatListFeed'; // Importado
import {Tabs} from 'react-native-collapsible-tab-view'; // Agregado
import {useFocusEffect} from '@react-navigation/native';

type Props = {
  navigation: StackNavigationProp<RootStackCommunitiesParamList, 'Communities'>;
};
const Communities = ({navigation}: Props) => {
  const [whatTypeListCommunity, setWhatTypeCommunity] = useState('all');
  const {isConnect, suscriptions} = useContext(PurchasesContext);
  const {idUserForChats, GetDetailsUser, detailsUser} = useContext(AuthContext);
  const {loginUser, isLoggedIn, isInitialized} = useCometChat();

  useEffect(() => {
    const autoLogin = async () => {
      if (
        isConnect &&
        isInitialized &&
        !isLoggedIn &&
        idUserForChats !== null
      ) {
        const userUID = `${idUserForChats}`;
        await loginUser(userUID);
      }
    };
    autoLogin();
  }, [isInitialized, isLoggedIn, idUserForChats, isConnect]);

  const {
    fetchNotJoinedGroups,
    fetchJoinedGroups,
    fetchGroupsWithInterestNotJoined,
    getMessagesGroup,
    addReactionToMessage,
    uploadImageToGroup,
    addMessage,
  } = useCometChatGroups();
  const [listCommunities, setListCommunities] = useState<Data[]>([]);
  const [listCommunitiesJoined, setListCommunitiesJoined] = useState<Data[]>(
    [],
  );
  // Nuevos estados para el Feed Agregado
  const [allFeeds, setAllFeeds] = useState<DataMessageOfCommunity[]>([]);
  const [loadingAllFeeds, setLoadingAllFeeds] = useState(false);

  const userIdRef = useRef(0);

  const addCommunityItem = {
    guid: 'add-community-btn-001',
    name: 'Add',
    tags: [],
    icon: '',
    description: '',
    owner: '',
    type: '',
    membersCount: 0,
    hasJoined: true,
    createdAt: 0,
    updatedAt: 0,
    joinedAt: 0,
    scope: '',
  } as unknown as Data;

  useEffect(() => {
    GetDetailsUser();
  }, []);

  // Función para cargar comunidades unidas
  const loadJoinedCommunities = useCallback(() => {
    if (idUserForChats) {
      fetchJoinedGroups(`${idUserForChats}`)
        .then(res => {
          setListCommunitiesJoined(res.communities);
        })
        .catch(err => {
          console.error('Error fetching joined communities:', err);
        });
    }
  }, [idUserForChats]);

  // Función para cargar otras comunidades (all o interest)
  const loadOtherCommunities = useCallback(() => {
    if (whatTypeListCommunity === 'all') {
      fetchNotJoinedGroups(`${idUserForChats}`)
        .then(res => {
          setListCommunities([addCommunityItem, ...res.communities]);
        })
        .catch(err => {
          setListCommunities([addCommunityItem]);
          console.error('Error fetching all communities:', err);
        });
    } else {
      if (detailsUser && detailsUser.id) {
        userIdRef.current = detailsUser.id;
        fetchGroupsWithInterestNotJoined(
          `${idUserForChats}`,
          detailsUser.categories,
        )
          .then(res => {
            setListCommunities([addCommunityItem, ...res.communities]);
          })
          .catch(err => {
            setListCommunities([addCommunityItem]);
            console.error('Error fetching communities by interest:', err);
          });
      }
    }
  }, [idUserForChats, whatTypeListCommunity, detailsUser]);

  // useFocusEffect para recargar datos al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      if (idUserForChats) {
        loadJoinedCommunities();
        loadOtherCommunities();
      }
    }, [loadJoinedCommunities, loadOtherCommunities, idUserForChats]),
  );

  // Lógica para obtener y agregar feeds de todas las comunidades unidas
  const fetchAllFeeds = async () => {
    // Si no hay comunidades unidas, limpiamos el feed
    if (listCommunitiesJoined.length === 0) {
      setAllFeeds([]);
      return;
    }

    setLoadingAllFeeds(true);

    try {
      // Creamos un array de promesas para obtener mensajes de cada grupo
      const promises = listCommunitiesJoined.map(async community => {
        try {
          const res = await getMessagesGroup(community.guid);
          return res.messages;
        } catch (error) {
          // Si falla uno, lo logueamos pero retornamos array vacío para no romper Promise.all
          console.warn(
            `Failed to fetch messages for ${community.name} (${community.guid})`,
            error,
          );
          return [];
        }
      });

      // Esperamos a que todas terminen
      const results = await Promise.all(promises);

      // Aplanamos el array de arrays (flat) y ordenamos por fecha (más reciente primero)
      const aggregatedFeeds = results
        .flat()
        .sort((a, b) => b.sentAt - a.sentAt);

      setAllFeeds(aggregatedFeeds);
    } catch (error) {
      console.error('Error aggregating feeds:', error);
    } finally {
      setLoadingAllFeeds(false);
    }
  };

  // Cargar feeds cuando cambian las comunidades unidas (inicial)
  useEffect(() => {
    if (listCommunitiesJoined.length > 0) {
      fetchAllFeeds();
    }
  }, [listCommunitiesJoined]);

  // Manejador de cambio de tab
  const handleTabChange = (index: number) => {
    // 0: My feed, 1: My communities
    if (index === 0) {
      // Solo cargar si no hay feeds y hay comunidades, para evitar limpiar la lista al cambiar de tab
      if (allFeeds.length === 0 && listCommunitiesJoined.length > 0) {
        fetchAllFeeds();
      }
    }
  };

  // Si no tiene Connect, mostrar pantalla de upgrade
  if (!isConnect) {
    return (
      <View style={styles.constainerSofyConnect}>
        <View style={styles.headerContainerSofyConnect}>
          <MaterialDesignIcons
            name="comment-flash"
            size={30}
            color={colors.primary}
          />
          <Text style={styles.headerTitle}>Communities</Text>
        </View>
        <ContentInfoPlanConnect
          origin="screen"
          setModalVisible={() => {}}
          productFromProfile={suscriptions[0]}
          userIdRef={idUserForChats}
        />
      </View>
    );
  }

  // Renderizado del Header Colapsable
  const renderHeader = () => {
    return (
      <View style={{backgroundColor: colors.background}}>
        {/* Header Title */}
        <View style={styles.header}>
          <MaterialDesignIcons
            name="comment-flash"
            size={30}
            color={colors.primary}
          />
          <Text style={styles.headerTitle}>Communities</Text>
        </View>

        {/* Communities Horizontal Scroll Section */}
        <View style={styles.communitiesSection}>
          <View style={styles.communitiesHeader}>
            <Text style={styles.sectionTitle}>All communities</Text>
            <TouchableOpacity
              onPress={() => {
                setWhatTypeCommunity(prev =>
                  prev === 'all' ? 'interest' : 'all',
                );
              }}>
              <Text style={styles.viewAllText}>
                View {whatTypeListCommunity === 'all' ? 'by interest' : 'all'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.communitiesScroll}>
            {listCommunities.map((community, index) => (
              <TouchableOpacity
                key={community.guid}
                onPress={() => {
                  if (community.name === 'Add') {
                    if (idUserForChats) {
                      navigation.navigate('CommunitiesAdd', {
                        userId: idUserForChats,
                      });
                    }
                  } else {
                    navigation.navigate('CommunitiesDetails', {
                      communityId: community.guid,
                    });
                  }
                }}
                style={[
                  styles.communityItem,
                  index === 0 && styles.communityItemFirst,
                ]}>
                <View style={styles.communityImageContainer}>
                  {community.name === 'Add' ? (
                    <View
                      style={[
                        styles.communityImage,
                        {
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.backgroundSecondary,
                          borderWidth: 1,
                          borderColor: colors.border,
                        },
                      ]}>
                      <MaterialDesignIcons
                        name="plus"
                        size={50}
                        color={colors.text}
                      />
                    </View>
                  ) : (
                    <Image
                      source={{uri: community.icon}}
                      style={styles.communityImage}
                    />
                  )}
                </View>
                <Text style={[styles.communityName]}>{community.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Renderizado de items para "My Communities"
  const renderCommunityItem = ({item}: {item: Data}) => (
    <View style={styles.cardContainer}>
      <ImageBackground
        source={{uri: item.icon}}
        style={styles.cardImageBackground}
        imageStyle={{borderRadius: 16}}>
        <View style={styles.cardOverlay}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={styles.cardRatingContainer}>
              <MaterialDesignIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.cardMembersText}>
                ({item.membersCount} members)
              </Text>
            </View>
            <Button
              mode="contained"
              style={styles.viewCommunityButton}
              labelStyle={styles.viewCommunityButtonLabel}
              onPress={() =>
                navigation.navigate('CommunitiesDetails', {
                  communityId: item.guid,
                })
              }>
              View Community
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <Tabs.Container
        renderHeader={renderHeader}
        headerContainerStyle={{backgroundColor: colors.background}}
        onIndexChange={handleTabChange}>
        {/* Tab: My Feed */}
        <Tabs.Tab name="My feed">
          <FlatListFeed
            groupMessages={allFeeds}
            currentUserMember={null}
            idUserForChats={`${idUserForChats}`}
            communityId={''}
            groupDetails={{} as ResDetailsGroup}
            loadingFeed={loadingAllFeeds}
            setLoadingFeed={setLoadingAllFeeds}
            addReactionToMessage={addReactionToMessage}
            uploadImageToGroup={uploadImageToGroup}
            addMessage={addMessage}
            fetchFeed={fetchAllFeeds}
            handleTabChange={() => {}}
            isAllFeed={true}
            listCommunitiesJoined={listCommunitiesJoined} // Agregado
          />
        </Tabs.Tab>

        {/* Tab: My Communities */}
        <Tabs.Tab name="My communities">
          <Tabs.FlatList
            data={listCommunitiesJoined}
            keyExtractor={item => item.guid}
            renderItem={renderCommunityItem}
            contentContainerStyle={styles.myCommunitiesContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.noCommunitiesText}>
                  You haven't joined any communities yet.
                </Text>
              </View>
            }
          />
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  constainerSofyConnect: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainerSofyConnect: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  // Estilos para la pantalla de upgrade
  upgradeScrollContent: {
    alignItems: 'center',
    padding: 3,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 28,
  },
  upgradeSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  benefitsContainer: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilos existentes para comunidades
  communitiesSection: {
    paddingTop: 20,
    paddingBottom: 25,
  },
  communitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  communitiesScroll: {
    paddingLeft: 20,
  },
  communityItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  communityItemFirst: {
    marginLeft: 0,
  },
  communityImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  communityImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  communityName: {
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
    maxWidth: 80,
  },
  communityNameDisabled: {
    color: colors.textDisabled,
  },
  // Estilos para My Communities Cards
  myCommunitiesContainer: {
    paddingHorizontal: 20,
    paddingTop: 400,
    paddingBottom: 120,
  },
  noCommunitiesText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
    fontSize: 16,
  },
  cardContainer: {
    height: 200,

    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.backgroundSecondary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Oscurecer fondo
    justifyContent: 'flex-end',
    padding: 16,
    borderRadius: 16,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardMembersText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
  },
  viewCommunityButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  viewCommunityButtonLabel: {
    color: colors.primary, // Color del texto del botón
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default Communities;
