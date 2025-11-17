import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {commonStyles} from '../theme/globalTheme';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import LogoSofy from '../components/LogoSofy';
import {AuthContext} from '../context/authContext/authContext';

export const ForgotYourPassword = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [email, setEmail] = useState('');
  const {forgotYourPassword, loading} = useContext(AuthContext);

  const handleResetPassword = () => {
    Keyboard.dismiss();

    forgotYourPassword(email)
      .then(res => {
        navigation.navigate('SetANewPassword');
      })
      .catch(error => {
        console.log('Error:', error);
      });
  };

  return (
    <ScrollView style={commonStyles.container}>
      <SafeAreaView>
        <View style={commonStyles.content}>
          <LogoSofy />
          <Text variant="headlineMedium" style={commonStyles.title}>
            Forgot Password
          </Text>

          <Text variant="bodyLarge" style={commonStyles.subtitle}>
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>

          <View style={commonStyles.fieldLarge}>
            <Text variant="labelMedium" style={commonStyles.label}>
              Email
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={commonStyles.input}
              outlineStyle={commonStyles.inputOutline}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleResetPassword}
            style={[
              commonStyles.saveButton,
              !loading && commonStyles.saveButtonEnabled,
            ]}
            contentStyle={commonStyles.saveButtonContent}
            labelStyle={commonStyles.resetButtonText}
            disabled={!email.trim() || loading}>
            Send Reset Link
          </Button>

          <View style={commonStyles.footer}>
            <Text variant="bodyMedium" style={commonStyles.footerText}>
              Remember your password?{' '}
              <Text
                onPress={() => navigation.navigate('Login')}
                style={commonStyles.link}>
                Log in
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
