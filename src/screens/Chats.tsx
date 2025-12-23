import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  CometChatConversations,
  CometChatThemeProvider,
  CometChatUiKitConstants,
  CometChatI18nProvider,
} from '@cometchat/chat-uikit-react-native';
import {CometChat} from '@cometchat/chat-sdk-react-native';
import Messages from '../components/Messages';
import {useCometChat} from '../hooks/useCometChat';
import {AuthContext} from '../context/authContext/authContext';
import {colors} from '../theme/globalTheme';

export default function Chats() {
  const [messageUser, setMessageUser] = useState<CometChat.User>();
  const [messageGroup, setMessageGroup] = useState<CometChat.Group>();

  const {loginUser, isLoggedIn, isInitialized} = useCometChat();
  const {idUserForChats} = useContext(AuthContext);

  useEffect(() => {
    console.log('messageuser:', messageUser);
  }, [messageUser, messageGroup]);

  useEffect(() => {
    const autoLogin = async () => {
      if (isInitialized && !isLoggedIn && idUserForChats !== null) {
        const userUID = `${idUserForChats}`;
        await loginUser(userUID);
      }
    };
    autoLogin();
  }, [isInitialized, isLoggedIn, idUserForChats]);

  return (
    <SafeAreaView style={styles.fullScreen}>
      <CometChatI18nProvider autoDetectLanguage={false}>
        <CometChatThemeProvider
          theme={{
            mode: 'light',
            light: {
              color: {
                primary: colors.primary,
                primaryButtonBackground: colors.primary,
              },
            },
          }}>
          {isLoggedIn && (
            <>
              <CometChatConversations
                style={{
                  containerStyle: {
                    display: messageUser || messageGroup ? 'none' : 'flex',
                  },
                }}
                onItemPress={(conversation: CometChat.Conversation) => {
                  if (
                    conversation.getConversationType() ===
                    CometChatUiKitConstants.ConversationTypeConstants.user
                  ) {
                    setMessageUser(
                      conversation.getConversationWith() as CometChat.User,
                    );
                    return;
                  }
                  setMessageGroup(
                    conversation.getConversationWith() as CometChat.Group,
                  );
                }}
              />

              {(messageUser || messageGroup) && (
                <Messages
                  user={messageUser}
                  group={messageGroup}
                  onBack={() => {
                    setMessageUser(undefined);
                    setMessageGroup(undefined);
                  }}
                />
              )}
            </>
          )}
        </CometChatThemeProvider>
      </CometChatI18nProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {flex: 1},
});
