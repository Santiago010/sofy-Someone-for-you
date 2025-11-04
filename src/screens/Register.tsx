import React, {useContext, useEffect} from 'react';
import {View, ScrollView, Keyboard} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {commonStyles} from '../theme/globalTheme';
import {RootStackParamList} from '../navigator/types';
import LogoSofy from '../components/LogoSofy';
import {AuthContext} from '../context/authContext/authContext';
import {useForm} from '../hooks/useForm';
import {showError} from '../helpers/ShowError';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

export const Register = () => {
  const {signUp, errorMessage, removeError, signUpResponseWithInfoUser} =
    useContext(AuthContext);
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const {onChange, form} = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordVerification: '',
  });

  useEffect(() => {
    if (signUpResponseWithInfoUser !== null) {
      navigation.navigate('InfoUser');
    }
  }, [signUpResponseWithInfoUser]);

  useEffect(() => {
    if (errorMessage.length > 0) {
      showError({errorMessage, removeError});
    }
  }, [errorMessage]);

  const signUpPress = () => {
    Keyboard.dismiss();
    if (form.password === form.passwordVerification) {
      signUp(form);
    } else {
      showError({
        screen: 'Register',
        errorMessage: 'Password and Password Verification must be equals',
        removeError,
      });
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <LogoSofy />
        <Text variant="headlineMedium" style={commonStyles.title}>
          Sign Up
        </Text>

        <View style={commonStyles.nameContainer}>
          <View style={commonStyles.nameField}>
            <Text variant="labelMedium" style={commonStyles.label}>
              First name
            </Text>
            <TextInput
              mode="outlined"
              value={form.firstName}
              onChangeText={text => onChange(text, 'firstName')}
              style={commonStyles.input}
              outlineStyle={commonStyles.inputOutline}
            />
          </View>

          <View style={commonStyles.nameField}>
            <Text variant="labelMedium" style={commonStyles.label}>
              Last name
            </Text>
            <TextInput
              mode="outlined"
              value={form.lastName}
              onChangeText={text => onChange(text, 'lastName')}
              style={commonStyles.input}
              outlineStyle={commonStyles.inputOutline}
            />
          </View>
        </View>

        <View style={commonStyles.field}>
          <Text variant="labelMedium" style={commonStyles.label}>
            Email
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Email"
            value={form.email}
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
              placeholder="Password"
              value={form.password}
              onChangeText={text => onChange(text, 'password')}
              secureTextEntry
              style={commonStyles.input}
              outlineStyle={commonStyles.inputOutline}
            />
          </View>
          <View style={commonStyles.field}>
            <Text variant="labelMedium" style={commonStyles.label}>
              Verification Password
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Password Verification"
              value={form.passwordVerification}
              onChangeText={text => onChange(text, 'passwordVerification')}
              secureTextEntry
              style={commonStyles.input}
              outlineStyle={commonStyles.inputOutline}
            />
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => signUpPress()}
          style={commonStyles.signUpButton}
          labelStyle={commonStyles.signUpButtonText}>
          Sign up
        </Button>

        <View style={commonStyles.footer}>
          <Text variant="bodyMedium" style={commonStyles.footerText}>
            Already have an account?{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              style={commonStyles.link}>
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
