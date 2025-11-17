import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text, TextInput, Button, ActivityIndicator} from 'react-native-paper';
import {colors, commonStyles} from '../theme/globalTheme';
import LogoSofy from '../components/LogoSofy';
import ButtonGoBack from '../components/ButtonGoBack';
import {useForm} from '../hooks/useForm';
import {AuthContext} from '../context/authContext/authContext';
import {ChangePasspord, EditDetailsInfoUser} from '../interfaces/interfacesApp';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  EditPassword: undefined;
};
type EditPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function EditPassword({
  navigation,
}: {
  navigation: EditPasswordScreenNavigationProp;
}) {
  const {
    changePassword,
    editDetailsSuccess,
    setEditDetailsSuccessFun,
    loading,
  } = useContext(AuthContext);
  const {password, onChange} = useForm({
    password: '',
  });

  useEffect(() => {
    setEditDetailsSuccessFun(false);
  }, []);

  useEffect(() => {
    if (editDetailsSuccess) {
      navigation.goBack();
    }
  }, [editDetailsSuccess, navigation]);

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(password.length >= 8);
  }, [password]);

  const handleSave = () => {
    if (isValid) {
      Keyboard.dismiss();

      const changePasswordval: ChangePasspord = {
        newPassword: password,
      };

      changePassword(changePasswordval)
        .then(res => {
          console.log('change password full');
        })
        .catch(error => {
          console.log('Error:', error);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={commonStyles.container}>
          <SafeAreaView>
            <View style={commonStyles.content}>
              <ButtonGoBack navigation={navigation} />
              <LogoSofy />

              <View style={styles.formSection}>
                <Text variant="headlineSmall" style={styles.sectionTitle}>
                  Change Password
                </Text>

                <Text variant="bodyMedium" style={styles.subtitle}>
                  Please enter new password
                </Text>

                <View style={styles.field}>
                  <Text variant="labelMedium" style={styles.label}>
                    New Password *
                  </Text>
                  <TextInput
                    mode="outlined"
                    placeholder="Enter your new password"
                    value={password}
                    onChangeText={text => onChange(text, 'password')}
                    secureTextEntry
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="onepassword" />}
                  />
                  {password.length > 0 && !isValid && (
                    <Text variant="bodySmall" style={styles.helperText}>
                      Password must be at least 8 characters
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.saveContainer}>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  disabled={!isValid || loading}
                  style={[
                    !isValid || loading
                      ? commonStyles.saveButton
                      : commonStyles.saveButtonEnabled,
                  ]}
                  contentStyle={styles.saveButtonContent}
                  labelStyle={styles.saveButtonLabel}>
                  {loading ? (
                    <ActivityIndicator
                      size="large"
                      color={colors.textDisabled}
                    />
                  ) : (
                    'Save'
                  )}
                </Button>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: colors.textSecondary,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.background,
  },
  inputOutline: {
    borderRadius: 8,
  },
  helperText: {
    color: colors.error,
    marginTop: 4,
    marginLeft: 12,
  },
  saveContainer: {
    marginTop: 30,
    paddingBottom: 20,
  },
  saveButton: {
    borderRadius: 25,
    backgroundColor: colors.textSecondary,
  },
  saveButtonEnabled: {
    backgroundColor: colors.secondary,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
  saveButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
