import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, TextInput, Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {commonStyles} from '../theme/globalTheme';
import {RootStackParamList} from '../navigator/types';
import LogoSofy from '../components/LogoSofy';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

export const Register = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [formData, setFormData] = useState({
    firstName: 'santiago',
    lastName: 'ortiz',
    email: 'santiago.dev06@gmail.com',
    password: 'hola',
    passwordVerification: 'hola',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const signUpPress = () => {
    navigation.navigate('InfoUser');
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
              value={formData.firstName}
              onChangeText={text => handleInputChange('firstName', text)}
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
              value={formData.lastName}
              onChangeText={text => handleInputChange('lastName', text)}
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
            value={formData.email}
            onChangeText={text => handleInputChange('email', text)}
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
              value={formData.password}
              onChangeText={text => handleInputChange('password', text)}
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
              value={formData.passwordVerification}
              onChangeText={text =>
                handleInputChange('passwordVerification', text)
              }
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

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
