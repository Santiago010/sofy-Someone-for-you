import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {colors} from '../theme/globalTheme';
import {ListGetUserForInterest} from '../interfaces/interfacesForAffinities';
import {useLikeOrDislike} from '../hooks/useLikeOrDislike';

const {width: windowWidth} = Dimensions.get('window');

interface ModalForComplimentProps {
  modalVisible: boolean;
  toggleModal: () => void;
  item: ListGetUserForInterest | null;
  onSuccess: () => void; // Removes user from list
}

export const ModalForCompliment: React.FC<ModalForComplimentProps> = ({
  modalVisible,
  toggleModal,
  item,
  onSuccess,
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const {compliment} = useLikeOrDislike();

  const handleSend = async () => {
    if (!message.trim() || !item) return;

    setSending(true);
    try {
      const res = await compliment(item.id, message);
      // Assuming compliment returns something truthy on success or throws/returns false
      // If your hook doesn't throw, check 'res'
      if (res) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setMessage('');
          toggleModal();
          onSuccess();
        }, 3000);
      } else {
        // Handle failure if needed
      }
    } catch (error) {
      console.error('Error sending compliment', error);
    } finally {
      setSending(false);
    }
  };

  const imageUrl =
    item?.individualFiles && item?.individualFiles[0]
      ? item.individualFiles[0].file.url
      : 'https://via.placeholder.com/400';

  if (!item) return null;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={toggleModal}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ImageBackground
            source={{uri: imageUrl}}
            style={styles.background}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
            blurRadius={1.5}>
            <View style={styles.content}>
              {success ? (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>
                    Thanks for the compliment to {item.name}, I hope you’re
                    lucky
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.matchText}>Send a Compliment</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Say something nice..."
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
                </>
              )}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 8,
    textAlign: 'center',
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
  },
  successContainer: {
    padding: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
});
