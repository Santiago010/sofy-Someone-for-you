import React, {useState} from 'react';
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
import {useLocation} from '../hooks/useLocation';

export default function SeeLocation({navigation}: any) {
  const {address, isLoadingLocation, requestLocationPermission} = useLocation();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateLocation = async () => {
    setIsUpdating(true);
    try {
      await requestLocationPermission();
    } finally {
      setIsUpdating(false);
    }
  };

  const displayAddress =
    isLoadingLocation || isUpdating
      ? 'Loading...'
      : address || 'Ubicación no disponible';

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
                  Your Location
                </Text>

                <Text variant="bodyMedium" style={styles.subtitle}>
                  This is your current location. You can update it to refresh
                  your address.
                </Text>

                <View style={styles.field}>
                  <Text variant="labelMedium" style={styles.label}>
                    Current Address
                  </Text>
                  <TextInput
                    mode="outlined"
                    value={displayAddress}
                    editable={false}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="map-marker" />}
                    multiline
                    numberOfLines={3}
                  />
                  <Text variant="bodySmall" style={styles.helperText}>
                    This address is automatically detected from your device
                    location
                  </Text>
                </View>
              </View>

              <View style={styles.updateContainer}>
                <Button
                  mode="contained"
                  onPress={handleUpdateLocation}
                  disabled={isUpdating || isLoadingLocation}
                  loading={isUpdating}
                  style={[
                    styles.updateButton,
                    !isUpdating &&
                      !isLoadingLocation &&
                      styles.updateButtonEnabled,
                  ]}
                  contentStyle={styles.updateButtonContent}
                  labelStyle={styles.updateButtonLabel}>
                  {isUpdating ? 'Updating...' : 'Update Location'}
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
    color: colors.textSecondary,
    marginTop: 4,
    marginLeft: 12,
  },
  updateContainer: {
    marginTop: 30,
    paddingBottom: 20,
  },
  updateButton: {
    borderRadius: 25,
    backgroundColor: colors.textSecondary,
  },
  updateButtonEnabled: {
    backgroundColor: colors.secondary,
  },
  updateButtonContent: {
    paddingVertical: 8,
  },
  updateButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
