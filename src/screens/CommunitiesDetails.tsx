import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useCometChatGroups} from '../hooks/useCometChatGroups';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackCommunitiesParamList} from '../navigator/StackCommunities';
import {RouteProp} from '@react-navigation/native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {Text, Button, Chip, Surface} from 'react-native-paper';
import {colors, commonStyles} from '../theme/globalTheme';
import ButtonGoBack from '../components/ButtonGoBack';

type Props = {
  navigation: StackNavigationProp<
    RootStackCommunitiesParamList,
    'CommunitiesDetails'
  >;
  route: RouteProp<RootStackCommunitiesParamList, 'CommunitiesDetails'>;
};

const CommunitiesDetails = ({navigation, route}: Props) => {
  const {communityId} = route.params;
  const {getDetailsGroup, getMembersGroup, getMessagesGroup} =
    useCometChatGroups();

  const [loading, setLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [groupMembers, setGroupMembers] = useState<any>(null);
  const [groupMessages, setGroupMessages] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDetailsGroup(communityId),
      getMembersGroup(communityId),
      getMessagesGroup(communityId),
    ])
      .then(([detailsRes, membersRes, messagesRes]) => {
        setGroupDetails(detailsRes);
        setGroupMembers(membersRes);
        setGroupMessages(messagesRes);
        console.log('Group Messages:', messagesRes.messages);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching group details or members:', error);
        setLoading(false);
      });
  }, [communityId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{marginTop: 10}}>Loading Community...</Text>
      </View>
    );
  }

  // CORRECCIÓN: Accedemos a groupDetails.details.data en lugar de groupDetails.data
  if (!groupDetails || !groupDetails.details || !groupDetails.details.data) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Community not found</Text>
      </View>
    );
  }

  // CORRECCIÓN: Desestructuramos desde la ruta correcta
  const {name, icon, membersCount, description, tags} =
    groupDetails.details.data;

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
                <Button
                  mode="contained"
                  style={styles.joinButton}
                  labelStyle={styles.joinButtonLabel}
                  onPress={() => console.log('Join pressed')}>
                  Join Community
                </Button>
              </View>
            </View>
          </ImageBackground>
        </Surface>
      </View>
    );
  };

  return (
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
        headerContainerStyle={{backgroundColor: colors.background}}>
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
          <Tabs.ScrollView contentContainerStyle={styles.tabContent}>
            <Text>Feed content coming soon...</Text>
          </Tabs.ScrollView>
        </Tabs.Tab>

        {/* Tab: Members */}
        <Tabs.Tab name="Members">
          <Tabs.ScrollView contentContainerStyle={styles.tabContent}>
            <Text>Members list ({membersCount})</Text>
            {/* Aquí podrías iterar sobre groupMembers si fuera necesario */}
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default CommunitiesDetails;
