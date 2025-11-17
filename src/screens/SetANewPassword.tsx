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

export default function SetANewPassword() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {setANewPassword, errorMessage, removeError, loading} =
    useContext(AuthContext);
  const {onChange, form, token, newPassword} = useForm({
    token: '',
    newPassword: '',
  });

  const sendData = async () => {
    Keyboard.dismiss();
    try {
      await setANewPassword(token, newPassword);
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Error setting new password:', error);
    }
  };

  useEffect(() => {
    if (errorMessage.length > 0 && isFocused) {
      showError({screen: 'SetANewPassword', errorMessage, removeError});
    }
  }, [errorMessage, isFocused]);

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
                Set New Password
              </Text>

              <View style={commonStyles.field}>
                <Text variant="labelMedium" style={commonStyles.label}>
                  Token
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="Token"
                  value={token}
                  onChangeText={text => onChange(text, 'token')}
                  autoCapitalize="none"
                  style={commonStyles.input}
                  outlineStyle={commonStyles.inputOutline}
                />
              </View>

              <View style={commonStyles.field}>
                <Text variant="labelMedium" style={commonStyles.label}>
                  New Password
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="••••••••••"
                  value={newPassword}
                  onChangeText={text => onChange(text, 'newPassword')}
                  secureTextEntry
                  style={commonStyles.input}
                  outlineStyle={commonStyles.inputOutline}
                />
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
                  'Change Password'
                )}
              </Button>
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
