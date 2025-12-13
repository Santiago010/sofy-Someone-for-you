import React, {useState, useContext} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {useCometChat} from '../hooks/useCometChat';
import {AuthContext} from '../context/authContext/authContext';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../theme/globalTheme';
import {PayloadWhoLikedMe} from '../interfaces/interfacesApp';

const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

interface ModalMatchProps {
  modalVisible: boolean;
  toggleModal: () => void;
  user: PayloadWhoLikedMe;
}

export const ModalMatch: React.FC<ModalMatchProps> = ({
  modalVisible,
  toggleModal,
  user,
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const {sendMessageToUser} = useCometChat();
  const {idUserForChats, removeUserFromWhoLikedMe} = useContext(AuthContext);
  const navigation = useNavigation();

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);

    const res = await sendMessageToUser(
      `${idUserForChats}`,
      user.fromIndividual.id.toString(),
      message,
    );
    setSending(false);

    if (res?.success) {
      removeUserFromWhoLikedMe(user.fromIndividual.id);
      toggleModal();

      navigation.navigate('Chats');
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={toggleModal}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ImageBackground
            source={{uri: user?.fromIndividual.individualFiles?.[0]?.file?.url}}
            style={styles.background}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
            blurRadius={1.5}>
            <View style={styles.content}>
              <Text style={styles.matchText}>IT'S MATCH!</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Say something nice"
                  placeholderTextColor={colors.textSecondary}
                  value={message}
                  onChangeText={setMessage}
                  editable={!sending}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSend}
                  disabled={sending}>
                  {sending ? (
                    <ActivityIndicator color={colors.background} />
                  ) : (
                    <Text style={styles.buttonText}>Send</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
};

const MODAL_WIDTH = windowWidth * 0.92;
const MODAL_HEIGHT = MODAL_WIDTH * 1.3;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: MODAL_WIDTH,
    height: MODAL_HEIGHT,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 4},
  },
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  matchText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 28,
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 8,
    letterSpacing: 1.5,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginRight: 10,
    height: 46,
    color: colors.text,
  },
  button: {
    backgroundColor: '#FF9800',
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 11,
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
  },
});
