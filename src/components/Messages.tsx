import React from 'react';
import {View, StyleSheet, KeyboardAvoidingViewComponent, KeyboardAvoidingView, Platform} from 'react-native';
import {
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
} from '@cometchat/chat-uikit-react-native';
import {CometChat} from '@cometchat/chat-sdk-react-native';

/**
 * Messages
 * --------
 * A self-contained chat screen that combines the **CometChatMessageHeader**, **CometChatMessageList**,
 * and **CometChatMessageComposer** provided by the CometChat React-Native UI Kit.
 *
 * Props
 * -----
 * • `user`  – (CometChat.User, optional) Target user for a 1-to-1 conversation.
 * • `group` – (CometChat.Group, optional) Target group for a group conversation.
 * • `onBack`— () ⇒ void Callback fired when the back button in the header is pressed.
 *
 */
const Messages = ({
  user,
  group,
  onBack,
}: {
  user?: CometChat.User;
  group?: CometChat.Group;
  onBack: () => void;
}) => {
  return (
    <KeyboardAvoidingView
      style={styles.root} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // Ajusta este offset si el composer queda muy arriba o muy abajo
      keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 40} 
    >
      <CometChatMessageHeader user={user} group={group} onBack={onBack} showBackButton />
      
      {/* La lista debe tener flex: 1 para que se encoja cuando el teclado suba */}
      <View style={{ flex: 1 }}>
        <CometChatMessageList user={user} group={group} />
      </View>

      <CometChatMessageComposer
        hideVideoAttachmentOption={false}
        hideFileAttachmentOption={true}
        hideAudioAttachmentOption={true}
        hideVoiceRecordingButton={true}
        user={user}
        group={group}
      />
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  /** Ensures the component stretches to use all available space */
  root: {
    flex: 1,
  },
});

export default Messages;
