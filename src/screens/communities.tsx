import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground, // Agregado
} from 'react-native';
import {colors} from '../theme/globalTheme';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';
import LogoSofy from '../components/LogoSofy';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackCommunitiesParamList} from '../navigator/StackCommunities';
import ContentInfoPlanConnect from '../components/ContentInfoPlanConnect';
import {AuthContext} from '../context/authContext/authContext';
import {useCometChatGroups} from '../hooks/useCometChatGroups';
import {Data} from '../interfaces/interfacesIAP';
import {Button} from 'react-native-paper'; // Agregado para el botón de la tarjeta

type Props = {
  navigation: StackNavigationProp<RootStackCommunitiesParamList, 'Communities'>;
};
const Communities = ({navigation}: Props) => {
  const [whatTypeListCommunity, setWhatTypeCommunity] = useState('all');
  const [activeTab, setActiveTab] = useState<'feed' | 'communities'>('feed');
  const [postText, setPostText] = useState('');
  const {isConnect, suscriptions} = useContext(PurchasesContext);
  const {idUserForChats, GetDetailsUser, detailsUser} = useContext(AuthContext);
  const {
    fetchAllGroups,
    fetGroupWithInterest,
    fetchNotJoinedGroups,
    fetchJoinedGroups,
    fetchGroupsWithInterestNotJoined,
  } = useCometChatGroups();
  const [listCommunities, setListCommunities] = useState<Data[]>([]);
  const [listCommunitiesJoined, setListCommunitiesJoined] = useState<Data[]>(
    [],
  ); // Nuevo estado
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
    console.log('idUserForChats:', idUserForChats);
  }, []);

  // Nuevo useEffect para cargar comunidades unidas
  useEffect(() => {
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

  useEffect(() => {
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
            console.log(detailsUser.categories);
            console.log(res.communities);
            setListCommunities([addCommunityItem, ...res.communities]);
          })
          .catch(err => {
            setListCommunities([addCommunityItem]);
            console.error('Error fetching communities by interest:', err);
          });
      }
    }
  }, [detailsUser, whatTypeListCommunity]);

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialDesignIcons
          name="comment-flash"
          size={30}
          color={colors.primary}
        />
        <Text style={styles.headerTitle}>Communities</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Communities Section (Moved outside of tabs) */}
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

        {/* Tabs (Moved inside ScrollView) */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('feed')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'feed' && styles.tabTextActive,
              ]}>
              My feed
            </Text>
            {activeTab === 'feed' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('communities')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'communities' && styles.tabTextActive,
              ]}>
              My communities
            </Text>
            {activeTab === 'communities' && (
              <View style={styles.tabIndicator} />
            )}
          </TouchableOpacity>
        </View>

        {/* Contenido Tab: My Feed */}
        {activeTab === 'feed' && (
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={{color: colors.textSecondary}}>
              No posts in your feed yet.
            </Text>
          </View>
        )}

        {/* Contenido Tab: My Communities */}
        {activeTab === 'communities' && (
          <View style={styles.myCommunitiesContainer}>
            {listCommunitiesJoined.length === 0 ? (
              <Text style={styles.noCommunitiesText}>
                You haven't joined any communities yet.
              </Text>
            ) : (
              listCommunitiesJoined.map(community => (
                <View key={community.guid} style={styles.cardContainer}>
                  <ImageBackground
                    source={{uri: community.icon}}
                    style={styles.cardImageBackground}
                    imageStyle={{borderRadius: 16}}>
                    <View style={styles.cardOverlay}>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{community.name}</Text>
                        <View style={styles.cardRatingContainer}>
                          <MaterialDesignIcons
                            name="star"
                            size={16}
                            color="#FFD700"
                          />
                          <Text style={styles.cardMembersText}>
                            4.3 ({community.membersCount} members)
                          </Text>
                        </View>
                        <Button
                          mode="contained"
                          style={styles.viewCommunityButton}
                          labelStyle={styles.viewCommunityButtonLabel}
                          onPress={() =>
                            navigation.navigate('CommunitiesDetails', {
                              communityId: community.guid,
                            })
                          }>
                          View Community
                        </Button>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 10, // Espacio después de las tabs
  },
  tabButton: {
    marginRight: 40,
    paddingBottom: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: colors.textDisabled,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  createPostContainer: {
    backgroundColor: colors.background,
    margin: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  createPostInput: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingTop: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addPostIn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPostInText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
    marginRight: 4,
  },
  publishButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  feedPost: {
    backgroundColor: colors.background,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  postedIn: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  communityLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  viewCommunity: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  postUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  postUserAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  postUserLocation: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  postTitle: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
  },
  postQuote: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  postContent: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  // Estilos para My Communities Cards
  myCommunitiesContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
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
});

export default Communities;
