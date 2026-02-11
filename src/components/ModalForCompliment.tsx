import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  Animated,
} from 'react-native';
import {Modal as PaperModal, Portal, Menu, Divider} from 'react-native-paper';
import {colors} from '../theme/globalTheme';
import {ListGetUserForInterest} from '../interfaces/interfacesForAffinities';
import {useLikeOrDislike} from '../hooks/useLikeOrDislike';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const {width: windowWidth} = Dimensions.get('window');

const COMPLIMENTS = [
  'Your skills are very interesting; I feel a strong connection with them.',
  'There’s so much to learn from someone like you.',
  'I’m thrilled to see I’m not the only one who values what you mention.',
  'Your interests resonate with me deeply; I’d love to get to know you better.',
  'Your perspective creates a special connection for me.',
  'It’s hard to find people who share my priorities and interests.',
  'It’s a pleasure to find someone genuinely interested in what they share.',
  'I’m not looking for a prince or princess, just someone who makes me laugh like you do.',
  'Simple profile, but it says a lot.',
  'You seem like a very considerate person.',
  'Your maturity really shines through. It’s refreshing to read something like this.',
  'Your profile inspires confidence, and I’d love to connect with you.',
  'Your profile caught my eye; I’d like to get to know you.',
  'I love the vibe you give off. Would you like to chat?',
  'I saw something interesting on your profile. What’s your favorite place to relax?',
  'I find what you share really interesting. Would you like to chat?',
  'It’s always nice to meet new people. How about we talk for a bit?',
  'I’d love to know more about you. Want to chat?',
  'I think your profile is great. Would you like to talk for a while?',
  'If your smile were a GIF, it would be on an endless loop in my mind.',
  'Are you Wi-Fi? Because I feel the connection without needing a password.',
  'Your feed feels like a trailer for the good life.',
  'You have that calm, Sunday-morning energy.',
  'You give off the kind of warmth that feels like a real hug.',
  'Your bio is so interesting I forgot why I opened the app.',
];

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
  const [visibleMenu, setVisibleMenu] = useState(false);
  const {compliment} = useLikeOrDislike();

  // Animation value for bounce effect
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    
  
    return () => {
      setMessage('');
    }
  }, [])
  

  // Trigger animation when success state becomes true
  useEffect(() => {
    if (success) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5, // Lower friction = more bounce
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [success]);

  const openMenu = () => setVisibleMenu(true);
  const closeMenu = () => setVisibleMenu(false);

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
    <Portal>
      <PaperModal
        visible={modalVisible}
        onDismiss={toggleModal}
        contentContainerStyle={styles.modalContainer}
        style={styles.overlay}>
        <ImageBackground
          source={{uri: imageUrl}}
          style={styles.background}
          imageStyle={styles.imageStyle}
          resizeMode="cover"
          blurRadius={1.5}>
          <View style={styles.content}>
            {success ? (
              <Animated.View
                style={[
                  styles.successContainer,
                  {transform: [{scale: scaleAnim}]},
                ]}>
                <MaterialDesignIcons
                  name="party-popper"
                  size={80}
                  color="#FFD700"
                  style={styles.successIcon}
                />
                <Text style={styles.successTitle}>Awesome! 🚀</Text>
                <Text style={styles.successText}>
                  Compliment sent to {item.name}.
                </Text>
                <Text style={styles.successSubText}>
                  Fingers crossed for a match! 🤞
                </Text>
              </Animated.View>
            ) : (
              <>
                <Text style={styles.matchText}>Send a Compliment</Text>
                <View style={styles.pickerContainer}>
                  <Menu
                    visible={visibleMenu}
                    onDismiss={closeMenu}
                    anchor={
                      <TouchableOpacity
                        style={styles.pickerButton}
                        onPress={openMenu}
                        disabled={sending}>
                        <Text
                          style={[
                            styles.pickerText,
                            !message && {color: colors.textSecondary},
                          ]}
                          numberOfLines={1}>
                          {message || 'Select a compliment...'}
                        </Text>
                        <MaterialDesignIcons
                          name="chevron-down"
                          size={24}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    }
                    contentStyle={styles.menuContent}>
                    <ScrollView style={styles.menuScroll}>
                      {COMPLIMENTS.map((compl, index) => (
                        <React.Fragment key={index}>
                          <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                              setMessage(compl);
                              closeMenu();
                            }}>
                            <Text style={styles.menuItemText}>{compl}</Text>
                          </TouchableOpacity>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </ScrollView>
                  </Menu>
                </View>

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
              </>
            )}
          </View>
        </ImageBackground>
      </PaperModal>
    </Portal>
  );
};

const MODAL_WIDTH = windowWidth * 0.92;
const MODAL_HEIGHT = MODAL_WIDTH * 1.3;

const styles = StyleSheet.create({
  overlay: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.65)', // Handled by PaperModal backdrop
  },
  modalContainer: {
    width: MODAL_WIDTH,
    height: MODAL_HEIGHT,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignSelf: 'center',
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
  pickerContainer: {
    marginVertical: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    height: 50,
    justifyContent: 'center',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: '100%',
    width: '100%',
  },
  pickerText: {
    fontSize: 16,
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
    width: '100%',
    marginTop: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  successIcon: {
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 4,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF9800',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  successSubText: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: MODAL_WIDTH - 48,
  },
  menuScroll: {
    maxHeight: 300,
  },
  menuItemText: {
    fontSize: 14,
    color: colors.text,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
});
