import React from 'react';
import {
  View,
  Linking,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Text} from 'react-native-paper';
import LogoSofy from '../components/LogoSofy';
import {useNavigation} from '@react-navigation/native';
import ButtonGoBack from '../components/ButtonGoBack';
import {commonStyles} from '../theme/globalTheme';

export default function ContactUS({navigation}: any) {
  const handleEmailPress = () => {
    Linking.openURL('mailto:sofysomeoneforyouappbubble@gmail.com');
  };

  return (
    <SafeAreaView>
      <View style={commonStyles.content}>
        <ButtonGoBack navigation={navigation} />
        <LogoSofy />
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.description}>
          Email us with your questions, suggestions, complaints, or issues at:
        </Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.email}>sofysomeoneforyouappbubble@gmail.com</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#1976d2',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
