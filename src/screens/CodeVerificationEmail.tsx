import React, {useContext, useState} from 'react';
import {View, ScrollView, Image, StyleSheet} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {commonStyles} from '../theme/globalTheme';
import {AuthContext} from '../context/authContext/authContext';
import LogoSofy from '../components/LogoSofy';
import {useForm} from '../hooks/useForm';

export const CodeVerificationEmail = () => {
  const navigation = useNavigation();
  const {verificationCode, transactionId} = useContext(AuthContext);

  const {onChange, form, code} = useForm({
    code: '',
    transactionIdValue: transactionId,
  });

  const handleCode = () => {
    verificationCode({code: form.code, transactionId: form.transactionIdValue});

    // Aquí iría la lógica para verificar el código con formData
  };

  return (
    <ScrollView style={commonStyles.container}>
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
            placeholder="Enter your code"
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
          style={commonStyles.resetButton}
          labelStyle={commonStyles.resetButtonText}
          disabled={!code.trim()}>
          Check
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
