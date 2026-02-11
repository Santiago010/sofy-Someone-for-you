import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

import {commonStyles} from '../theme/globalTheme';
import GridImage from '../components/GridImage';
import {AuthContext} from '../context/authContext/authContext';
import FormEditProfile from '../components/FormEditProfile';
import {
  GenderResponse,
  UploadFile,
  InterestAndSubInterestResponse,
  CompleteInfoUser2,
  subcategories,
} from '../interfaces/interfacesApp';
import {showError} from '../helpers/ShowError';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCometChat} from '../hooks/useCometChat';

export const InfoUser = () => {
  const [images, setImages] = useState<string[]>([]);
  const {createCometChatUser} = useCometChat();
  const [photoFiles, setPhotoFiles] = useState<UploadFile[]>([]);
  const {
    signUpResponseWithInfoUser,
    completeInfoUser,
    removeError,
    errorMessage,
    loading,
  } = useContext(AuthContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (errorMessage.length > 0 && isFocused) {
      showError({screen: 'InfoUser', errorMessage, removeError});
    }
  }, [errorMessage, isFocused]);

  // Estados para los nuevos campos
  const [formDataNew, setFormDataNew] = useState({
    age: '',
    aboutYou: '',
    selectedInterests: [] as InterestAndSubInterestResponse[],
    selectedSubInterests: [] as subcategories[],
    gender: null as GenderResponse | null,
    genderId: '',
    maxDistance: 1,
    showMe: null as GenderResponse | null,
    showMeId: '',
    firstName: '',
    lastName: '',
    ageRangeMin: 18,
    ageRangeMax: 100,
  });

  const getFirstNameAndLastName = async () => {
    const firstName = await AsyncStorage.getItem('firstname');
    const lastName = await AsyncStorage.getItem('lastname');
    setFormDataNew(prevState => ({
      ...prevState,
      firstName: signUpResponseWithInfoUser?.payload.name || firstName || '',
      lastName: signUpResponseWithInfoUser?.payload.lastname || lastName || '',
    }));
  };

  useEffect(() => {
    getFirstNameAndLastName();
  }, []);
  // Función para calcular campos llenos usando formDataNew
  const getFilledFieldsCount = () => {
    let count = 0;
    const totalFields = 11; // Total de campos que necesitamos validar

    if (formDataNew.firstName && formDataNew.firstName.length >= 3) count++;
    if (formDataNew.lastName && formDataNew.lastName.length >= 3) count++;
    if (images.length === 6) count++;
    if (formDataNew.age.trim() !== '') count++;
    if (formDataNew.aboutYou.trim() !== '') count++;
    if (formDataNew.selectedSubInterests.length > 0) count++;
    if (formDataNew.genderId !== '') count++;
    if (formDataNew.maxDistance < 999) count++; // Si cambió del valor por defecto
    if (formDataNew.showMeId !== '') count++;
    if (formDataNew.ageRangeMin > 18) count++; // Si cambió del rango por defecto
    if (formDataNew.ageRangeMax < 100) count++;

    return {filled: count, total: totalFields};
  };

  // Verifica si todos los campos están llenos usando formDataNew
  const areAllFieldsFilled = () => {
    const {filled, total} = getFilledFieldsCount();
    return filled >= total;
  };

  // Función para manejar cambios en los archivos de fotos
  const handleImageFilesChange = (files: UploadFile[]) => {
    setPhotoFiles(files);
  };

  // Función para manejar el botón Save usando formDataNew
  const handleSave = () => {
    if (areAllFieldsFilled()) {
      Keyboard.dismiss();

      // Extraer IDs de los subintereses seleccionados
      const subcategories = formDataNew.selectedSubInterests
        .map(sub => sub.id)
        .join(',');

      // Preparar el objeto CompleteInfoUser2
      const completeInfoData: CompleteInfoUser2 = {
        subcategories,
        age: Number(formDataNew.age),
        gender_id: parseInt(formDataNew.genderId, 10),
        interested_gender_id: parseInt(formDataNew.showMeId, 10),
        max_distance_km: formDataNew.maxDistance,
        min_age: formDataNew.ageRangeMin,
        max_age: formDataNew.ageRangeMax,
        email: signUpResponseWithInfoUser?.payload.email || '',
        photos: photoFiles,
        description: formDataNew.aboutYou,
      };

      completeInfoUser(completeInfoData).then(response => {
        createCometChatUser(
          `${response.res.id}`,
          `${response.res.name} ${response.res.lastname}`,
          response.res.individualFiles[0].file.url,
        )
          .then(res => {
            console.log('CometChat user created successfully', res.success);
          })
          .catch(err => {
            console.error('Error creating CometChat user', err);
          });
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={commonStyles.container}>
          <View style={commonStyles.content}>
            <GridImage
              images={images}
              setImages={setImages}
              onImageFilesChange={handleImageFilesChange}
            />

            <FormEditProfile
              formData={formDataNew}
              setFormData={setFormDataNew}
              getFilledFieldsCount={getFilledFieldsCount}
              areAllFieldsFilled={areAllFieldsFilled}
              handleSave={handleSave}
              loading={loading}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
