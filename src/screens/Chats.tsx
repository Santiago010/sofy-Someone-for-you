import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  CometChatConversations,
  CometChatThemeProvider,
  CometChatUiKitConstants,
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
  const {GetDetailsUser, detailsUser} = useContext(AuthContext);

  // Ejemplo: Login automático cuando el componente se monta
  useEffect(() => {
    const autoLogin = async () => {
      if (isInitialized && !isLoggedIn && detailsUser !== null) {
        // Aquí obtienes el UID del usuario autenticado en tu app
        const userUID = `${detailsUser.id}`; // ← Esto viene de tu sistema de auth
        await loginUser(userUID);
      }
    };

    autoLogin();
  }, [isInitialized, isLoggedIn, detailsUser]);

  // Cargar detalles del usuario al montar el componente
  useEffect(() => {
    GetDetailsUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.fullScreen}>
      <CometChatThemeProvider
        theme={{
          light: {
            color: {
              primary: colors.primary,
              primaryButtonBackground: colors.primary,
              primaryButtonIcon: colors.primary,
            },
          },
        }}>
        {/* Show conversations only after the user is logged in */}
        {isLoggedIn && (
          <>
            {/* Conversation list (hidden when a chat is open) */}
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

            {/* Active chat screen */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {flex: 1},
});
