import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useCometChatGroups} from '../hooks/useCometChatGroups';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackCommunitiesParamList} from '../navigator/StackCommunities';
import {RouteProp} from '@react-navigation/native';

type Props = {
  navigation: StackNavigationProp<
    RootStackCommunitiesParamList,
    'CommunitiesDetails'
  >;
  route: RouteProp<RootStackCommunitiesParamList, 'CommunitiesDetails'>;
};

const CommunitiesDetails = ({navigation, route}: Props) => {
  const {communityId} = route.params;
  const {getDetailsGroup} = useCometChatGroups();

  useEffect(() => {
    getDetailsGroup(communityId)
      .then(res => {
        console.log('Group details:', res);
      })
      .catch(error => {
        console.error('Error fetching group details:', error);
      });
  }, [communityId]);

  return (
    <View style={styles.container}>
      <Text>CommunitiesDetails</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommunitiesDetails;
