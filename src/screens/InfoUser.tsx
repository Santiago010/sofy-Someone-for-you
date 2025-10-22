import React, {useContext, useEffect, useState} from 'react';
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
import FormEditProfile from '../components/FormEditProfile';

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

  // Función para manejar cambios en showMe (ya no se usa con radio buttons)

  // Función para calcular campos llenos
  const getFilledFieldsCount = () => {
    let count = 0;
    const totalFields = 11; // Total de campos que necesitamos validar

    if (formData.firstName.length >= 3) count++;
    if (formData.lastName.length >= 3) count++;
    if (images.length === 6) count++;
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
        signUp({
          firstName: 'as',
          lastName: 's',
          email: 's',
          password: 'd',
          passwordVerification: 's',
        });
      }, 2000);
    }
  };

  useEffect(() => {
    console.log(images.length);
  }, [images]);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={commonStyles.container}>
          <View style={commonStyles.content}>
            <GridImage images={images} setImages={setImages} />

            <FormEditProfile
              formData={formData}
              setFormData={setFormData}
              getFilledFieldsCount={getFilledFieldsCount}
              areAllFieldsFilled={areAllFieldsFilled}
              handleSave={handleSave}
            />
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
