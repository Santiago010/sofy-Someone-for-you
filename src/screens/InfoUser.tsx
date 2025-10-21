import React, {useContext, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Chip,
  RadioButton,
} from 'react-native-paper';
import {colors, commonStyles} from '../theme/globalTheme';
import GridImage from '../components/GridImage';
import {AuthContext} from '../context/authContext/authContext';

export const InfoUser = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState<string[]>([]);
  const {signUp} = useContext(AuthContext);

  // Estados para los nuevos campos
  const [formData, setFormData] = useState({
    age: '',
    aboutYou: '',
    selectedInterests: [] as string[],
    gender: '',
    maxDistance: 1,
    showMe: '',
    firstName: '',
    lastName: '',
    ageRangeMin: 18,
    ageRangeMax: 100,
  });

  // Opciones de intereses
  const interests = [
    'Dancing',
    'Music',
    'Movies',
    'Play an instrument',
    'Sports',
    'Reading',
    'Cooking',
    'Travel',
    'Photography',
    'Gaming',
    'Art',
    'Fitness',
  ];

  const handleInputsWithNumber = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para manejar cambios en inputs
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Función para manejar selección de intereses
  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : prev.selectedInterests.length < 5
        ? [...prev.selectedInterests, interest]
        : prev.selectedInterests, // Máximo 5 intereses
    }));
  };

  // Función para manejar cambios en showMe (ya no se usa con radio buttons)

  // Función para calcular campos llenos
  const getFilledFieldsCount = () => {
    let count = 0;
    const totalFields = 10; // Total de campos que necesitamos validar

    if (formData.firstName.length >= 3) count++;
    if (formData.lastName.length >= 3) count++;
    if (images.length === 5) count++;
    if (formData.age.trim() !== '') count++;
    if (formData.aboutYou.trim() !== '') count++;
    if (formData.selectedInterests.length > 0) count++;
    if (formData.gender !== '') count++;
    if (formData.maxDistance < 999) count++; // Si cambió del valor por defecto
    if (Object.values(formData.showMe).some(value => value)) count++;
    if (formData.ageRangeMin > 18) count++; // Si cambió del rango por defecto
    if (formData.ageRangeMax < 100) count++;

    return {filled: count, total: totalFields};
  };

  // Función para verificar si todos los campos están llenos
  const areAllFieldsFilled = () => {
    const {filled, total} = getFilledFieldsCount();
    return filled >= total;
  };

  // Función para manejar el botón Save
  const handleSave = () => {
    if (areAllFieldsFilled()) {
      console.log('Todos los campos están llenos:', formData);
      console.log('Image', images);

      setTimeout(() => {
        signUp();
      }, 2000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={commonStyles.container}>
          <View style={commonStyles.content}>
            <GridImage images={images} setImages={setImages} />

            {/* Nuevos campos de formulario */}
            <View style={styles.formSection}>
              <Text variant="headlineSmall" style={styles.sectionTitle}>
                Personal Information
              </Text>

              {/* Campos de nombre (solo lectura desde auth) */}
              <View style={styles.nameContainer}>
                <View style={styles.nameField}>
                  <Text variant="labelMedium" style={styles.label}>
                    First Name
                  </Text>
                  <TextInput
                    value={formData.firstName}
                    onChangeText={text => handleInputChange('firstName', text)}
                    mode="outlined"
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                  />
                </View>

                <View style={styles.nameField}>
                  <Text variant="labelMedium" style={styles.label}>
                    Last Name
                  </Text>
                  <TextInput
                    value={formData.lastName}
                    onChangeText={text => handleInputChange('lastName', text)}
                    mode="outlined"
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                  />
                </View>
              </View>

              {/* Campo de edad */}
              <View style={styles.field}>
                <Text variant="labelMedium" style={styles.label}>
                  Age *
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="Type your Age"
                  value={formData.age}
                  onChangeText={text => handleInputChange('age', text)}
                  keyboardType="numeric"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                />
              </View>

              {/* Campo About You */}
              <View style={styles.field}>
                <Text variant="labelMedium" style={styles.label}>
                  About You
                </Text>
                <TextInput
                  mode="outlined"
                  placeholder="About You*"
                  value={formData.aboutYou}
                  onChangeText={text => handleInputChange('aboutYou', text)}
                  multiline
                  numberOfLines={4}
                  style={[styles.input, styles.textArea]}
                  outlineStyle={styles.inputOutline}
                />
              </View>

              {/* Selector de intereses */}
              <View style={styles.field}>
                <Text variant="labelMedium" style={styles.label}>
                  Select up to 5 interest
                </Text>
                <View style={styles.interestsContainer}>
                  {interests.map(interest => (
                    <Chip
                      key={interest}
                      mode={
                        formData.selectedInterests.includes(interest)
                          ? 'flat'
                          : 'outlined'
                      }
                      onPress={() => toggleInterest(interest)}
                      style={[
                        styles.interestChip,
                        formData.selectedInterests.includes(interest) &&
                          styles.selectedChip,
                      ]}
                      textStyle={
                        formData.selectedInterests.includes(interest) &&
                        styles.selectedChipText
                      }>
                      {interest}
                    </Chip>
                  ))}
                </View>
              </View>

              {/* Selector de género */}
              <View style={styles.field}>
                <Text variant="labelMedium" style={styles.label}>
                  Gender*
                </Text>
                <RadioButton.Group
                  onValueChange={value => handleInputChange('gender', value)}
                  value={formData.gender}>
                  <View style={styles.radioOption}>
                    <RadioButton value="male" color={colors.accent} />
                    <Text variant="bodyMedium" style={styles.radioLabel}>
                      Male
                    </Text>
                  </View>

                  <View style={styles.radioOption}>
                    <RadioButton value="female" color={colors.accent} />
                    <Text variant="bodyMedium" style={styles.radioLabel}>
                      Female
                    </Text>
                  </View>

                  <View style={styles.radioOption}>
                    <RadioButton value="non-binary" color={colors.accent} />
                    <Text variant="bodyMedium" style={styles.radioLabel}>
                      Non-binary
                    </Text>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Maximum Distance */}
              <View style={styles.field}>
                <View style={styles.sliderContainer}>
                  <Text variant="labelMedium" style={styles.label}>
                    Maximum Distance
                  </Text>
                  <Text variant="bodyMedium" style={styles.distanceValue}>
                    {formData.maxDistance} mi.
                  </Text>
                </View>
                {/* TODO:SLIDEE */}
                <Slider
                  thumbTintColor={`${colors.primary}`}
                  maximumTrackTintColor={`${colors.secondary}`}
                  minimumTrackTintColor={`${colors.primary}`}
                  minimumValue={1}
                  maximumValue={100}
                  step={1}
                  value={formData.maxDistance}
                  onValueChange={ev =>
                    handleInputsWithNumber('maxDistance', ev)
                  }
                />
              </View>

              {/* Whole World */}
              <View style={styles.field}>
                <View style={styles.radioOption}></View>
              </View>

              {/* Show me */}
              <View style={styles.field}>
                <Text variant="labelMedium" style={styles.label}>
                  Show me*
                </Text>

                <RadioButton.Group
                  onValueChange={value => handleInputChange('showMe', value)}
                  value={formData.showMe}>
                  <View style={styles.radioOption}>
                    <RadioButton value="men" color={colors.accent} />
                    <Text variant="bodyMedium" style={styles.radioLabel}>
                      Men
                    </Text>
                  </View>

                  <View style={styles.radioOption}>
                    <RadioButton value="women" color={colors.accent} />
                    <Text variant="bodyMedium" style={styles.radioLabel}>
                      Women
                    </Text>
                  </View>

                  <View style={styles.radioOption}>
                    <RadioButton value="non-binary" color={colors.accent} />
                    <Text variant="bodyMedium" style={styles.radioLabel}>
                      Non-binary
                    </Text>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Age Range */}
              <View style={styles.field}>
                <Text variant="labelMedium" style={styles.label}>
                  Age Range
                </Text>
                <View style={styles.ageRangeContainer}>
                  <TextInput
                    mode="outlined"
                    placeholder="18"
                    value={`${formData.ageRangeMin}`}
                    onChangeText={ev => {
                      handleInputsWithNumber('ageRangeMin', Number(ev));
                    }}
                    keyboardType="numeric"
                    style={[styles.input, styles.ageInput]}
                    outlineStyle={styles.inputOutline}
                  />
                  <Text variant="bodyMedium" style={styles.ageSeparator}>
                    -
                  </Text>
                  <TextInput
                    mode="outlined"
                    placeholder="100"
                    value={`${formData.ageRangeMax}`}
                    onChangeText={ev => {
                      handleInputsWithNumber('ageRangeMax', Number(ev));
                    }}
                    keyboardType="numeric"
                    style={[styles.input, styles.ageInput]}
                    outlineStyle={styles.inputOutline}
                  />
                </View>
              </View>
            </View>

            {/* Botón Save con contador */}
            <View style={commonStyles.saveContainer}>
              <Button
                mode="contained"
                onPress={handleSave}
                disabled={!areAllFieldsFilled()}
                style={[
                  commonStyles.saveButton,
                  areAllFieldsFilled() && commonStyles.saveButtonEnabled,
                ]}
                contentStyle={commonStyles.saveButtonContent}
                labelStyle={commonStyles.saveButtonLabel}>
                Save ({getFilledFieldsCount().filled}/
                {getFilledFieldsCount().total})
              </Button>
            </View>

            {/* Loading Indicator
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Cargando imagen...</Text>
              </View>
            )} */}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 4,
    color: colors.secondary,
  },
  recommendation: {
    textAlign: 'center',
    color: colors.textSecondary,
  },
  gridContainer: {
    marginVertical: 0,
    borderRadius: 16,
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageSlot: {
    width: '30%',
    aspectRatio: 0.75,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  addFab: {
    backgroundColor: 'transparent',
  },
  removeFab: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.textDisabled,
  },
  imageCount: {
    textAlign: 'center',
    marginTop: 8,
    color: colors.textSecondary,
  },
  // Nuevos estilos para el formulario
  formSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nameField: {
    flex: 0.48,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    margin: 2,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  selectedChipText: {
    color: colors.background,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioLabel: {
    marginLeft: 8,
    color: colors.text,
  },
  modalContainer: {
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  listItem: {
    paddingVertical: 12,
  },
  cancelButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  cancelButtonLabel: {
    color: colors.text,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    color: colors.accent,
  },
  // Nuevos estilos para campos adicionales
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  distanceValue: {
    color: colors.accent,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: colors.text,
  },
  saveContainer: {
    padding: 20,
    paddingTop: 10,
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
  // Estilos adicionales para nuevos campos
  helperText: {
    color: colors.text,
    marginTop: 4,
  },
  ageRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ageInput: {
    flex: 1,
  },
  ageSeparator: {
    color: colors.text,
    fontSize: 16,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
