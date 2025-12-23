import axios from 'axios';
import {appId, region, restKey} from '../assets/KeysCometChat';
import {
  InterestAndSubInterestResponse,
  UploadFile,
} from '../interfaces/interfacesApp';
import {
  Data,
  DataMembersCommunity,
  DataMessageOfCommunity,
  ListGroup,
  ResCreateGroup,
  ResDetailsGroup,
  ResMembersCommunity,
  ResMessageOfCommunity,
  ResUploadFileGroup,
} from '../interfaces/interfacesIAP';
import {privateDB} from '../db/db';

const urlsApiGroups = {
  listGroups: `https://${appId}.api-${region}.cometchat.io/v3/groups`,
  messageGroup: `https://${appId}.api-${region}.cometchat.io/v3/messages`,
};

export const useCometChatGroups = () => {
  const addMessage = async (
    groupGuid: string,
    onBehalfOf: string,
    text: string,
    attachments: {
      url: string;
      name: string;
      mimeType: string;
    }[] = [],
  ): Promise<{message: string}> => {
    try {
      // Base payload
      const payload: any = {
        receiver: groupGuid,
        receiverType: 'group',
        category: 'message',
        type: 'text',
        data: {
          text,
        },
      };

      // Solo agrega attachments si viene contenido
      if (attachments && attachments.length > 0) {
        payload.data.attachments = attachments;
      }

      const {data} = await axios.post(urlsApiGroups.messageGroup, payload, {
        headers: {
          apikey: restKey,
          onBehalfOf,
          'Content-Type': 'application/json',
        },
      });

      console.log('Message sent:', data);

      return Promise.resolve({
        message: 'Message sent successfully',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(
          'Error sending message:',
          error.response?.data || error.message,
        );
      }

      return Promise.reject({
        message: 'Error sending message',
      });
    }
  };

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
            'Error uploading image for group from hook:',
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
    icon: string,
    description: string,
    owner: string,
  ): Promise<{guidGroup: string; message: string}> => {
    try {
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
          icon,
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
      return Promise.resolve({
        guidGroup: data.data.guid,
        message: 'Group created successfully',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(
          'Error creating group from cometChat:',
          error.response?.data,
        );
      }
      return Promise.reject({guidGroup: '', message: 'Error creating group'});
    }
  };

  const fetchJoinedGroups = async (
    userUid: string,
  ): Promise<{communities: Data[]; message: string}> => {
    try {
      const {data} = await axios.get<ListGroup>(urlsApiGroups.listGroups, {
        headers: {
          apikey: restKey,
          'Content-Type': 'application/json',
          onBehalfOf: userUid, // usuario por el cual se filtra
        },
        params: {
          hasJoined: true, // solo devuelve grupos que ya ha unido
        },
      });

      return Promise.resolve({
        communities: data.data,
        message: 'found ' + data.data.length + ' joined communities',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response) {
          console.error(
            'Error response fetching joined groups:',
            error.response.data,
          );
        }
      }
      return Promise.reject({
        communities: [],
        message: 'Error fetching joined communities',
      });
    }
  };

  const fetchNotJoinedGroups = async (
    userUid: string,
  ): Promise<{communities: Data[]; message: string}> => {
    try {
      const {data} = await axios.get<ListGroup>(urlsApiGroups.listGroups, {
        headers: {
          apikey: restKey,
          'Content-Type': 'application/json',
          onBehalfOf: userUid, // usuario para que el response marque hasJoined
        },
        params: {
          // no necesitas hasJoined para traer todos
        },
      });

      // Filtrar los grupos donde el usuario NO ha unido
      const notJoined = data.data.filter(group => !group.hasJoined);

      return Promise.resolve({
        communities: notJoined,
        message: 'found ' + notJoined.length + ' not joined communities',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response) {
          console.error(
            'Error response fetching not joined groups:',
            error.response.data,
          );
        }
      }
      return Promise.reject({
        communities: [],
        message: 'Error fetching not joined communities',
      });
    }
  };

  const fetchGroupsWithInterestNotJoined = async (
    userUid: string,
    interest: InterestAndSubInterestResponse[],
  ): Promise<{
    communities: Data[];
    message: string;
  }> => {
    try {
      let tagsQuery = '';
      interest.forEach(item => {
        tagsQuery += `&tags=${encodeURIComponent(item.name)}`;
      });

      // Armamos la URL con filtros por tags y tamaño de página
      const url = `${urlsApiGroups.listGroups}?perPage=100${tagsQuery}`;

      const {data} = await axios.get<ListGroup>(url, {
        headers: {
          apikey: restKey,
          'Content-Type': 'application/json',
          onBehalfOf: userUid, // Necesario para que venga hasJoined correctamente
        },
      });

      // Filtrar grupos donde el usuario NO ha joined (hasJoined === false)
      const notJoined = data.data.filter(group => !group.hasJoined);

      return Promise.resolve({
        communities: notJoined,
        message:
          'found ' + notJoined.length + ' communities not joined with interest',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response) {
          console.error(
            'Error response fetching groups with interest not joined:',
            error.response.data,
          );
        }
      }
      return Promise.reject({
        communities: [],
        message: 'Error fetching communities not joined',
      });
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

  const getDetailsGroup = async (
    guid: string,
  ): Promise<{details: ResDetailsGroup | {}; message: string}> => {
    try {
      const {data} = await axios.get<ResDetailsGroup>(
        `${urlsApiGroups.listGroups}/${guid}`,
        {
          headers: {
            apikey: restKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return Promise.resolve({
        details: data,
        message: 'Group details fetched successfully',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response) {
          console.error(
            'Error response fetching group details:',
            error.response.data,
          );
        }
      }
      return Promise.reject({
        details: {},
        message: 'Error fetching group details',
      });
    }
  };

  const getMembersGroup = async (
    guid: string,
  ): Promise<{members: DataMembersCommunity[]; message: string}> => {
    try {
      const {data} = await axios.get<ResMembersCommunity>(
        `${urlsApiGroups.listGroups}/${guid}/members?perPage=100&page=1`,
        {
          headers: {
            apikey: restKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return Promise.resolve({
        members: data.data,
        message: 'Group members fetched successfully',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response) {
          console.error(
            'Error response fetching group members:',
            error.response.data,
          );
        }
      }
      return Promise.reject({
        members: [],
        message: 'Error fetching group members',
      });
    }
  };

  const getMessagesGroup = async (
    guid: string,
  ): Promise<{messages: DataMessageOfCommunity[]; message: string}> => {
    // Placeholder for future implementation

    try {
      const {data} = await axios.get<ResMessageOfCommunity>(
        `${urlsApiGroups.listGroups}/${guid}/messages?myMentionsOnly=false&hasReactions=false&mentionsWithBlockedInfo=false&mentionswithTagInfo=false&limit=1000`,
        {
          headers: {
            apikey: restKey,
            'Content-Type': 'application/json',
          },
        },
      );
      return Promise.resolve({
        messages: data.data,
        message: 'Group messages fetched successfully',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response) {
          console.error(
            'Error response fetching group messages:',
            error.response.data,
          );
        }
      }
      return Promise.reject({
        messages: [],
        message: 'Error fetching group messages',
      });
    }
  };

  const addReactionToMessage = async (
    messageId: string,
    reaction: string,
    uidSender: string,
  ): Promise<{message: string}> => {
    try {
      // CometChat requiere el emoji URL encoded
      const encodedReaction = encodeURIComponent(reaction);

      const url = `https://${appId}.api-${region}.cometchat.io/v3/messages/${messageId}/reactions/${encodedReaction}`;

      const {data} = await axios.post(
        url,
        {},
        {
          headers: {
            apikey: restKey,
            onBehalfOf: uidSender,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Reaction added:', data);

      return Promise.resolve({
        message: 'Reaction added successfully',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(
          'Error adding reaction:',
          error.response?.data || error.message,
        );
      }

      return Promise.reject({
        message: 'Error adding reaction',
      });
    }
  };

  const fetGroupWithInterest = async (
    interest: InterestAndSubInterestResponse[],
  ): Promise<{
    communities: Data[];
    message: string;
  }> => {
    // console.log('Fetching groups with interest:', interest);
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

  const addMembersToGroup = async (
    guid: string,
    participants: string[],
  ): Promise<{message: string}> => {
    try {
      const url = `${urlsApiGroups.listGroups}/${guid}/members`;

      const {data} = await axios.post(
        url,
        {
          participants,
        },
        {
          headers: {
            apikey: restKey,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Members added to group:', data);

      return Promise.resolve({
        message: 'Members added successfully',
      });
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(
          'Error adding members to group:',
          error.response?.data || error.message,
        );
      }

      return Promise.reject({
        message: 'Error adding members to group',
      });
    }
  };

  return {
    fetchAllGroups,
    fetGroupWithInterest,
    createGroup,
    uploadImageToGroup,
    getDetailsGroup,
    getMembersGroup,
    getMessagesGroup,
    addReactionToMessage,
    addMembersToGroup,
    addMessage,
    fetchJoinedGroups,
    fetchNotJoinedGroups,
    fetchGroupsWithInterestNotJoined,
  };
};
