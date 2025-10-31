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
import {Text, TextInput, Button} from 'react-native-paper';
import {colors, commonStyles} from '../theme/globalTheme';
import LogoSofy from '../components/LogoSofy';
import ButtonGoBack from '../components/ButtonGoBack';
import {useForm} from '../hooks/useForm';
import {AuthContext} from '../context/authContext/authContext';
import {EditDetailsInfoUser} from '../interfaces/interfacesApp';

export default function EditPhoneNumber({navigation}: any) {
  const {
    EditDetailsInfo,
    editDetailsSuccess,
    setEditDetailsSuccessFun,
    detailsUser,
  } = useContext(AuthContext);
  const {phoneNumber, onChange} = useForm({
    phoneNumber: '',
  });

  useEffect(() => {
    if (detailsUser) {
      onChange(detailsUser.phone, 'phoneNumber');
    }
  }, []);

  useEffect(() => {
    setEditDetailsSuccessFun(false);
  }, []);

  useEffect(() => {
    if (editDetailsSuccess) {
      navigation.goBack();
    }
  }, [editDetailsSuccess, navigation]);

  const [isValid, setIsValid] = useState(false);

  // Validar que el número de teléfono tenga al menos 10 dígitos
  useEffect(() => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    setIsValid(cleanNumber.length >= 10);
  }, [phoneNumber]);

  const handleSave = () => {
    if (isValid) {
      Keyboard.dismiss();

      const editDetailsInfoUser: EditDetailsInfoUser = {
        phone: phoneNumber,
      };

      EditDetailsInfo(editDetailsInfoUser);
      // Aquí puedes agregar la lógica para guardar el número de teléfono

      // navigation.goBack();
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
                  Edit Phone Number
                </Text>

                <Text variant="bodyMedium" style={styles.subtitle}>
                  Please enter your phone number to update your contact
                  information
                </Text>

                <View style={styles.field}>
                  <Text variant="labelMedium" style={styles.label}>
                    Phone Number *
                  </Text>
                  <TextInput
                    mode="outlined"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChangeText={text => onChange(text, 'phoneNumber')}
                    keyboardType="phone-pad"
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="phone" />}
                  />
                  {phoneNumber.length > 0 && !isValid && (
                    <Text variant="bodySmall" style={styles.helperText}>
                      Phone number must be at least 10 digits
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.saveContainer}>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  disabled={!isValid}
                  style={[
                    styles.saveButton,
                    isValid && styles.saveButtonEnabled,
                  ]}
                  contentStyle={styles.saveButtonContent}
                  labelStyle={styles.saveButtonLabel}>
                  Save Changes
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
