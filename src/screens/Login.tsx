import React, {useContext, useEffect} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {commonStyles} from '../theme/globalTheme';
import LogoSofy from '../components/LogoSofy';
import {useForm} from '../hooks/useForm';
import {AuthContext} from '../context/authContext/authContext';
import {showError} from '../helpers/ShowError';

export const Login = () => {
  const navigation = useNavigation();
  const {login, transactionId, errorMessage, removeError} =
    useContext(AuthContext);
  const {onChange, form, email, password} = useForm({
    email: '',
    password: '',
  });

  const sendData = () => {
    Keyboard.dismiss();
    login(form);
  };

  useEffect(() => {
    if (errorMessage.length > 0) {
      showError({screen: 'Login', errorMessage, removeError});
    }
  }, [errorMessage]);

  // Navegar automáticamente cuando transactionId esté disponible
  useEffect(() => {
    if (transactionId && transactionId.trim() !== '') {
      navigation.navigate('CodeVerificationEmail' as never);
    }
  }, [transactionId, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
      }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={commonStyles.container}>
          <SafeAreaView>
            <View style={commonStyles.content}>
              <LogoSofy />
              <Text variant="headlineMedium" style={commonStyles.title}>
                Log In
              </Text>

              <View style={commonStyles.field}>
                <Text variant="labelMedium" style={commonStyles.label}>
                  Email
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="Email"
                  value={email}
                  onChangeText={text => onChange(text, 'email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={commonStyles.input}
                  outlineStyle={commonStyles.inputOutline}
                />
              </View>

              <View style={commonStyles.passwordContainer}>
                <View style={commonStyles.field}>
                  <Text variant="labelMedium" style={commonStyles.label}>
                    Password
                  </Text>
                  <TextInput
                    mode="outlined"
                    placeholder="••••••••••"
                    value={password}
                    onChangeText={text => onChange(text, 'password')}
                    secureTextEntry
                    style={commonStyles.input}
                    outlineStyle={commonStyles.inputOutline}
                  />
                </View>

                <Text
                  variant="bodyMedium"
                  style={commonStyles.forgotPassword}
                  onPress={() => navigation.navigate('ForgotYourPassword')}>
                  Forgot your password?
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={() => sendData()}
                style={commonStyles.loginButton}
                labelStyle={commonStyles.loginButtonText}>
                Log in
              </Button>

              <View style={commonStyles.footer}>
                <Text variant="bodyMedium" style={commonStyles.footerText}>
                  Don't have an account?{' '}
                  <Text
                    onPress={() => navigation.navigate('Register')}
                    style={commonStyles.link}>
                    Sign up
                  </Text>
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
