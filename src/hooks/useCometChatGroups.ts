import axios from 'axios';
import {appId, region, restKey} from '../assets/KeysCometChat';
import {
  InterestAndSubInterestResponse,
  UploadFile,
} from '../interfaces/interfacesApp';
import {
  Data,
  ListGroup,
  ResCreateGroup,
  ResUploadFileGroup,
} from '../interfaces/interfacesIAP';
import {privateDB} from '../db/db';

const urlsApiGroups = {
  listGroups: `https://${appId}.api-${region}.cometchat.io/v3/groups`,
};

export const useCometChatGroups = () => {
  const uploadImageToGroup = async (
    photo: UploadFile,
  ): Promise<{url: string; message: string}> => {
    try {
      const formData = new FormData();

      formData.append('file', {
        uri: photo.uri,
        type: photo.type,
        name: photo.name,
      } as any);

      const {data} = await privateDB.post<ResUploadFileGroup>(
        '/files/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return Promise.resolve({
        url: data.payload.url,
        message: 'Image uploaded successfully',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response) {
          console.error(
            'Error uploading image for group:',
            error.response.data,
          );
        }
      }
      return Promise.reject({url: '', message: 'Error uploading group image'});
    }
  };

  const createGroup = async (
    guid: string,
    name: string,
    type: string,
    tags: string[],
    admin: string,
    icon: UploadFile,
    description: string,
    owner: string,
  ) => {
    try {
      const {url: urlIconUploaded} = await uploadImageToGroup(icon);

      const {data} = await axios.post<ResCreateGroup>(
        urlsApiGroups.listGroups,
        {
          guid,
          name,
          type,
          tags,
          members: {
            admins: [`${admin}`],
            moderators: [],
            usersToBan: [],
            participants: [],
          },
          urlIconUploaded,
          description,
          owner,
        },
        {
          headers: {
            apikey: restKey,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Group created:', data);
      return data;
    } catch (error) {
      console.error('Error creating group:', error);
      if (error instanceof axios.AxiosError) {
        console.error(
          'Error creating group from cometChat:',
          error.response?.data,
        );
      }
      throw error;
    }
  };
  const fetchAllGroups = async (): Promise<{
    communities: Data[];
    message: string;
  }> => {
    try {
      const {data} = await axios.get<ListGroup>(urlsApiGroups.listGroups, {
        headers: {
          apikey: restKey,
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve({
        communities: data.data,
        message: 'found ' + data.data.length + ' communities',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response) {
          console.error('Error response fetching groups:', error.response.data);
        }
      }
      return Promise.reject({
        communities: [],
        message: 'Error fetching communities',
      });
    }
  };

  const fetGroupWithInterest = async (
    interest: InterestAndSubInterestResponse[],
  ): Promise<{
    communities: Data[];
    message: string;
  }> => {
    console.log('Fetching groups with interest:', interest);
    try {
      let tagsQuery = '';
      interest.forEach(item => {
        tagsQuery += `&tags=${item.name}`;
      });

      const url = `${urlsApiGroups.listGroups}?perPage=100${tagsQuery}`;

      const {data} = await axios.get<ListGroup>(url, {
        headers: {
          apikey: restKey,
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve({
        communities: data.data,
        message: 'found ' + data.data.length + ' communities',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response) {
          console.error(
            'Error response fetching groups with interest:',
            error.response.data,
          );
        }
      }
      return Promise.reject({
        communities: [],
        message: 'Error fetching communities',
      });
    }
  };

  return {fetchAllGroups, fetGroupWithInterest, createGroup};
};
