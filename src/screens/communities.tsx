import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {colors} from '../theme/globalTheme';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';
import LogoSofy from '../components/LogoSofy';
import {useNavigation} from '@react-navigation/native';
import ContentInfoPlanConnect from '../components/ContentInfoPlanConnect';
import {AuthContext} from '../context/authContext/authContext';

interface Community {
  id: string;
  name: string;
  image: any;
  isComingSoon?: boolean;
}

const Communities = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'communities'>('feed');
  const [postText, setPostText] = useState('');
  const {isConnect, suscriptions} = useContext(PurchasesContext);
  const {detailsUser} = useContext(AuthContext);
  const userIdRef = useRef(0);

  useEffect(() => {
    if (detailsUser && detailsUser.id) {
      userIdRef.current = detailsUser.id;
    }
  }, [detailsUser]);

  const communities: Community[] = [
    {
      id: '1',
      name: 'Spirituality',
      image: '',
    },
    {
      id: '2',
      name: 'Art & Craft',
      image: '',
    },
    {
      id: '3',
      name: 'Spirituality',
      image: '',
    },
    {
      id: '4',
      name: 'Coming soon',
      image: '',
      isComingSoon: true,
    },
  ];

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
          userIdRef={userIdRef.current}
        />
      </View>
    );
  }

  // Si tiene Connect, mostrar comunidades
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
        {/* Communities Section */}
        <View style={styles.communitiesSection}>
          <View style={styles.communitiesHeader}>
            <Text style={styles.sectionTitle}>All communities</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.communitiesScroll}>
            {communities.map((community, index) => (
              <TouchableOpacity
                key={community.id}
                style={[
                  styles.communityItem,
                  index === 0 && styles.communityItemFirst,
                ]}>
                <View style={styles.communityImageContainer}>
                  <Image
                    source={community.image}
                    style={styles.communityImage}
                  />
                </View>
                <Text
                  style={[
                    styles.communityName,
                    community.isComingSoon && styles.communityNameDisabled,
                  ]}>
                  {community.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tabs */}
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

        {/* Create Post */}
        <View style={styles.createPostContainer}>
          <View style={styles.createPostInput}>
            <Image source={{uri: ''}} style={styles.userAvatar} />
            <TextInput
              style={styles.postInput}
              placeholder="write your post here"
              placeholderTextColor="#999"
              value={postText}
              onChangeText={setPostText}
              multiline
            />
          </View>

          <View style={styles.postActions}>
            <View style={styles.addPostIn}>
              <Text style={styles.addPostInText}>Add your post in</Text>
            </View>

            <TouchableOpacity style={styles.publishButton}>
              <Text style={styles.publishButtonText}>Publish Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feed Post */}
        <View style={styles.feedPost}>
          <View style={styles.postHeader}>
            <Text style={styles.postedIn}>
              Posted in <Text style={styles.communityLink}>Reiki Healing</Text>
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewCommunity}>view community</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.postUser}>
            <Image source={{uri: ''}} style={styles.postUserAvatar} />
            <View>
              <Text style={styles.postUserName}>Aarav Sharma</Text>
              <Text style={styles.postUserLocation}>Banglore, India</Text>
            </View>
          </View>

          <Text style={styles.postTitle}>
            This is what i learned in my recent course
          </Text>

          <Text style={styles.postQuote}>"The whole secret of existence"</Text>

          <Text style={styles.postContent}>
            "The whole secret of existence lies in the pursuit of meaning,
            purpose, and connection. It is a delicate dance between
            self-discovery, compassion for others, and embracing the
            ever-unfolding mysteries
          </Text>
        </View>
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
});

export default Communities;
