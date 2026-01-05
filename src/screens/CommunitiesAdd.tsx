import React from 'react';
import {View} from 'react-native';
import {commonStyles} from '../theme/globalTheme';
import {UploadFile} from '../interfaces/interfacesApp';
import {RootStackCommunitiesParamList} from '../navigator/StackCommunities';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useCometChatGroups} from '../hooks/useCometChatGroups';
import {GenerateGuid} from '../helpers/GenerateGuid';
import ContentFormGroup from '../components/ContentFormGroup';

type Props = {
  navigation: StackNavigationProp<
    RootStackCommunitiesParamList,
    'CommunitiesAdd'
  >;
  route: RouteProp<RootStackCommunitiesParamList, 'CommunitiesAdd'>;
};

const CommunitiesAdd = ({navigation, route}: Props) => {
  const {userId} = route.params;
  const {uploadImageToGroup, createGroup} = useCometChatGroups();

  const handleCreateCommunity = ({
    name,
    description,
    dataImage,
    interests,
  }: {
    name: string;
    description: string;
    dataImage: UploadFile | {uri: string};
    interests: string[];
  }) => {
    // En creación, dataImage siempre debería ser un UploadFile válido
    uploadImageToGroup(dataImage as UploadFile)
      .then(({url, message}) => {
        createGroup(
          GenerateGuid(),
          name,
          'public',
          interests,
          `${userId}`,
          url,
          description,
          `${userId}`,
        )
          .then(({guidGroup, message}) => {
            navigation.navigate('CommunitiesDetails', {
              communityId: guidGroup,
              band: true,
            });
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
    <ContentFormGroup
      navigation={navigation}
      title="Create Community"
      buttonLabel="Create Community"
      onSubmit={handleCreateCommunity}
    />
  );
};

export default CommunitiesAdd;
