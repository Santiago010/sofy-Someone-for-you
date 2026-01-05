import React, {useContext} from 'react';
import {Alert} from 'react-native';
import {UploadFile} from '../interfaces/interfacesApp';
import {RootStackCommunitiesParamList} from '../navigator/StackCommunities';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useCometChatGroups} from '../hooks/useCometChatGroups';
import ContentFormGroup from '../components/ContentFormGroup';
import {AuthContext} from '../context/authContext/authContext';

type Props = {
  navigation: StackNavigationProp<
    RootStackCommunitiesParamList,
    'CommunitiesEdit'
  >;
  route: RouteProp<RootStackCommunitiesParamList, 'CommunitiesEdit'>;
};

const CommunitiesEdit = ({navigation, route}: Props) => {
  const {communityDetails} = route.params;
  const {uploadImageToGroup, updateGroup} = useCometChatGroups();
  const {idUserForChats} = useContext(AuthContext);

  const handleSaveCommunity = async ({
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
    if (!idUserForChats) {
      Alert.alert('Error', 'User session not found');
      return;
    }

    try {
      let iconUrl = communityDetails.icon;

      // Si dataImage es un archivo nuevo (tiene type), lo subimos
      if ('type' in dataImage) {
        try {
          const response = await uploadImageToGroup(dataImage as UploadFile);
          iconUrl = response.url;
        } catch (error: any) {
          console.error('Error uploading image', error);
          Alert.alert('Error', 'Failed to upload image');
          return;
        }
      }

      // Actualizar grupo
      await updateGroup(communityDetails.guid, `${idUserForChats}`, {
        name,
        description,
        icon: iconUrl,
        tags: interests,
      });

      // Navegar atrás
      navigation.goBack();
    } catch (error: any) {
      console.error('Error updating group', error);
      Alert.alert('Error', 'Failed to update community');
    }
  };

  return (
    <ContentFormGroup
      navigation={navigation}
      title="Edit Community"
      buttonLabel="Save Community"
      initialValues={{
        name: communityDetails.name,
        description: communityDetails.description,
        imageUri: communityDetails.icon,
        interests: communityDetails.tags || [],
      }}
      onSubmit={handleSaveCommunity}
    />
  );
};

export default CommunitiesEdit;
