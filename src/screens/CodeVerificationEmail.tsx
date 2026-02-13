import React, {useContext, useEffect} from 'react';
import {View, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {Text, TextInput, Button, ActivityIndicator} from 'react-native-paper';
import {colors, commonStyles} from '../theme/globalTheme';
import {AuthContext} from '../context/authContext/authContext';
import LogoSofy from '../components/LogoSofy';
import {useForm} from '../hooks/useForm';
import {showError} from '../helpers/ShowError';
import {useIsFocused} from '@react-navigation/native';

export const CodeVerificationEmail = () => {
  const {verificationCode, transactionId, errorMessage, removeError, loading} =
    useContext(AuthContext);

  const {onChange, form, code} = useForm({
    code: '123456',
    transactionIdValue: transactionId,
  });

  const handleCode = () => {
    verificationCode({code: form.code, transactionId: form.transactionIdValue});
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (errorMessage.length > 0 && isFocused) {
      showError({screen: 'CodeVerificationEmail', errorMessage, removeError});
    }
  }, [errorMessage, isFocused]);

  return (
    <ScrollView style={commonStyles.container}>
      <SafeAreaView>
        <View style={commonStyles.content}>
          <LogoSofy />
          <Text variant="headlineMedium" style={commonStyles.title}>
            Code Verification
          </Text>

          <Text variant="bodyLarge" style={commonStyles.subtitle}>
            Enter your code verification that has been sent to your email
          </Text>

          <View style={commonStyles.fieldLarge}>
            <Text variant="labelMedium" style={commonStyles.label}>
              Code
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Code Default: 123456"
              value={code}
              onChangeText={text => onChange(text, 'code')}
              keyboardType="email-address"
              autoCapitalize="none"
              style={commonStyles.input}
              outlineStyle={commonStyles.inputOutline}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleCode}
            style={[
              commonStyles.saveButton,
              !loading && commonStyles.saveButtonEnabled,
            ]}
            contentStyle={commonStyles.saveButtonContent}
            labelStyle={commonStyles.resetButtonText}
            disabled={!code.trim() || loading}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.textDisabled} />
            ) : (
              'Check'
            )}
          </Button>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
