import {createContext, useState} from 'react';
import {UserChat} from '../../interfaces/interfacesApp';

interface ChatContextProp {
  userChats: UserChat[] | null;
}

export const ChatContext = createContext({} as ChatContextProp);

export const ChatProviver = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [userChats, setUserChats] = useState<UserChat[]>([{id: '1'}]);
  return (
    <ChatContext.Provider
      value={{
        userChats,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
