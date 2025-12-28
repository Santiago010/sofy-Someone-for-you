import React, {useContext, useEffect} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {colors, commonStyles} from '../theme/globalTheme';
import LogoSofy from '../components/LogoSofy';
import {useForm} from '../hooks/useForm';
import {AuthContext} from '../context/authContext/authContext';
import {showError} from '../helpers/ShowError';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {login, transactionId, errorMessage, removeError, loading} =
    useContext(AuthContext);
  const {onChange, form, email, password} = useForm({
    email: 'santiago.dev06@gmail.com',
    password: 'p7EhCx33jwkQ*',
  });

  useEffect(() => {
    console.log(email);
  }, [email]);

  const sendData = () => {
    Keyboard.dismiss();
    login(form);
  };

  useEffect(() => {
    verificarionToken();
  }, []);

  const verificarionToken = async () => {
    const token = await AsyncStorage.getItem('access_token_only_complete_user');

    if (token) {
      navigation.navigate('InfoUser' as never);
    }
  };

  useEffect(() => {
    if (errorMessage.length > 0 && isFocused) {
      showError({screen: 'Login', errorMessage, removeError});
    }
  }, [errorMessage, isFocused]);

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
                disabled={loading}
                mode="contained"
                onPress={() => sendData()}
                style={[
                  commonStyles.saveButton,
                  !loading && commonStyles.saveButtonEnabled,
                ]}
                contentStyle={commonStyles.saveButtonContent}
                labelStyle={commonStyles.loginButtonText}>
                {loading ? (
                  <ActivityIndicator size="large" color={colors.textDisabled} />
                ) : (
                  'Log in'
                )}
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
