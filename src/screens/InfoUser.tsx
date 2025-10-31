import React, {useContext, useState} from 'react';
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {commonStyles} from '../theme/globalTheme';
import GridImage from '../components/GridImage';
import {AuthContext} from '../context/authContext/authContext';
import FormEditProfile from '../components/FormEditProfile';
import {
  InterestResponse,
  GenderResponse,
  CompleteInfoUser,
  UploadFile,
} from '../interfaces/interfacesApp';

export const InfoUser = () => {
  const [images, setImages] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<UploadFile[]>([]);
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

  // Función para manejar cambios en showMe (ya no se usa con radio buttons)

  // Función para calcular campos llenos
  const getFilledFieldsCount = () => {
    let count = 0;
    const totalFields = 11; // Total de campos que necesitamos validar

    if (formData.firstName && formData.firstName.length >= 3) count++;
    if (formData.lastName && formData.lastName.length >= 3) count++;
    if (images.length === 6) count++;
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

  // Función para manejar cambios en los archivos de fotos
  const handleImageFilesChange = (files: UploadFile[]) => {
    setPhotoFiles(files);
  };

  // Función para manejar el botón Save
  const handleSave = () => {
    if (areAllFieldsFilled()) {
      Keyboard.dismiss();

      // Extraer IDs de selectedInterests y unirlos con comas
      const categories = formData.selectedInterests
        .map(interest => interest.id)
        .join(',');

      // Preparar el objeto CompleteInfoUser
      const completeInfoData: CompleteInfoUser = {
        categories,
        age: Number(formData.age),
        gender_id: parseInt(formData.genderId, 10),
        interested_gender_id: parseInt(formData.showMeId, 10),
        max_distance_km: formData.maxDistance,
        min_age: formData.ageRangeMin,
        max_age: formData.ageRangeMax,
        email: signUpResponseWithInfoUser?.payload.email || '',
        photos: photoFiles,
        description: formData.aboutYou,
      };

      // Llamar a completeInfoUser con los datos preparados
      completeInfoUser(completeInfoData);
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
            <GridImage
              images={images}
              setImages={setImages}
              onImageFilesChange={handleImageFilesChange}
            />

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
