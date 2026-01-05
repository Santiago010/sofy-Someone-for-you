import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  CometChatConversations,
  CometChatThemeProvider,
  CometChatI18nProvider,
  CometChatUiKitConstants,
} from '@cometchat/chat-uikit-react-native';
import {CometChat} from '@cometchat/chat-sdk-react-native';
import Messages from '../components/Messages';
import {useCometChat} from '../hooks/useCometChat';
import {AuthContext} from '../context/authContext/authContext';
import {colors} from '../theme/globalTheme';

export default function Chats() {
  const [messageUser, setMessageUser] = useState<CometChat.User>();

  const {loginUser, isLoggedIn, isInitialized} = useCometChat();
  const {idUserForChats} = useContext(AuthContext);

  useEffect(() => {
    const autoLogin = async () => {
      if (isInitialized && !isLoggedIn && idUserForChats !== null) {
        const userUID = `${idUserForChats}`;
        await loginUser(userUID);
      }
    };
    autoLogin();
  }, [isInitialized, isLoggedIn, idUserForChats]);

  // Build a valid conversations request
  const conversationsRequestBuilder =
    new CometChat.ConversationsRequestBuilder()
      .setConversationType('user')
      .setLimit(50);

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
          {/* Only show when CometChat is ready and user is logged in */}
          {isInitialized && isLoggedIn && (
            <>
              <CometChatConversations
                conversationsRequestBuilder={conversationsRequestBuilder}
                // Catch internal errors
                onError={error => {
                  console.log('Error UI Conversations:', error);
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
                }}
                style={{
                  containerStyle: {
                    display: messageUser ? 'none' : 'flex',
                  },
                }}
              />

              {messageUser && (
                <Messages
                  user={messageUser}
                  onBack={() => {
                    setMessageUser(undefined);
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
