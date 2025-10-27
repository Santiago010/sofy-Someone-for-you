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

import {useNavigation} from '@react-navigation/native';
import {colors, commonStyles} from '../theme/globalTheme';
import GridImage from '../components/GridImage';
import {AuthContext} from '../context/authContext/authContext';
import FormEditProfile from '../components/FormEditProfile';
import {
  InterestResponse,
  GenderResponse,
  CompleteInfoUser,
} from '../interfaces/interfacesApp';

export const InfoUser = () => {
  const navigation = useNavigation();
  const [images, setImages] = useState<string[]>([]);
  const {signUpResponseWithInfoUser, completeInfoUser} =
    useContext(AuthContext);

  // Estados para los nuevos campos
  const [formData, setFormData] = useState({
    age: '',
    aboutYou: '',
    selectedInterests: [] as InterestResponse[],
    gender: null as GenderResponse | null,
    genderId: '',
    maxDistance: 1,
    showMe: null as GenderResponse | null,
    showMeId: '',
    firstName: signUpResponseWithInfoUser?.payload.name,
    lastName: signUpResponseWithInfoUser?.payload.lastname,
    ageRangeMin: 18,
    ageRangeMax: 100,
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Función para manejar cambios en showMe (ya no se usa con radio buttons)

  // Función para calcular campos llenos
  const getFilledFieldsCount = () => {
    let count = 0;
    const totalFields = 10; // Total de campos que necesitamos validar

    if (formData.firstName && formData.firstName.length >= 3) count++;
    if (formData.lastName && formData.lastName.length >= 3) count++;
    // if (images.length === 6) count++;
    if (formData.age.trim() !== '') count++;
    if (formData.aboutYou.trim() !== '') count++;
    if (formData.selectedInterests.length > 0) count++;
    if (formData.genderId !== '') count++;
    if (formData.maxDistance < 999) count++; // Si cambió del valor por defecto
    if (formData.showMeId !== '') count++;
    if (formData.ageRangeMin > 18) count++; // Si cambió del rango por defecto
    if (formData.ageRangeMax < 100) count++;

    return {filled: count, total: totalFields};
  };

  // Función para verificar si todos los campos están llenos
  const areAllFieldsFilled = () => {
    const {filled, total} = getFilledFieldsCount();
    return filled >= total;
  };

  function formatToISO8601(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Función para manejar el botón Save
  const handleSave = () => {
    if (areAllFieldsFilled()) {
      Keyboard.dismiss();

      // Extraer IDs de selectedInterests y unirlos con comas
      const categories = formData.selectedInterests
        .map(interest => interest.id)
        .join(',');

      // Preparar date_of_birth asumiendo que formData.age es el año de nacimiento
      const dateOfBirth = formData.age
        ? formatToISO8601(new Date(parseInt(formData.age, 10), 7, 14))
        : '';

      // Preparar el objeto CompleteInfoUser
      const completeInfoData: CompleteInfoUser = {
        categories,
        date_of_birth: dateOfBirth,
        gender_id: parseInt(formData.genderId, 10),
        interested_gender_id: parseInt(formData.showMeId, 10),
        max_distance_km: formData.maxDistance,
        min_age: formData.ageRangeMin,
        max_age: formData.ageRangeMax,
        email: signUpResponseWithInfoUser?.payload.email || '',
      };

      // Llamar a completeInfoUser con los datos preparados
      completeInfoUser(completeInfoData);
    }

    Keyboard.dismiss();
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
