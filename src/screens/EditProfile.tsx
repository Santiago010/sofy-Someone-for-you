import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import {commonStyles} from '../theme/globalTheme';
import LogoSofy from '../components/LogoSofy';
import ButtonGoBack from '../components/ButtonGoBack';
import FormEditProfile from '../components/FormEditProfile';
import {AuthContext} from '../context/authContext/authContext';
import {
  EditDetailsInfoUser2,
  GenderResponse,
  InterestAndSubInterestResponse,
  subcategories,
  PayloadDetails2,
} from '../interfaces/interfacesApp';
import {showError} from '../helpers/ShowError';

export default function EditProfile({navigation}: any) {
  const {
    detailsUser,
    EditDetailsInfo,
    errorMessage,
    removeError,
    editDetailsSuccess,
    setEditDetailsSuccessFun,
  } = useContext(AuthContext);
  // Estados para los nuevos campos

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    setEditDetailsSuccessFun(false);
  }, []);

  useEffect(() => {
    if (errorMessage.length > 0) {
      showError({screen: 'Edit Profile', errorMessage, removeError});
    }
  }, [errorMessage]);

  useEffect(() => {
    if (editDetailsSuccess) {
      navigation.goBack();
    }
  }, [editDetailsSuccess, navigation]);

  useEffect(() => {
    // Cargar datos del usuario en el formData cuando detailsUser esté disponible
    if (detailsUser) {
      // Inicializar intereses principales y subintereses seleccionados
      const interests = detailsUser.categories || [];
      const subInterests: subcategories[] = [];
      interests.forEach((interest: InterestAndSubInterestResponse) => {
        if (interest.subcategories && Array.isArray(interest.subcategories)) {
          interest.subcategories.forEach((sub: subcategories) => {
            if (sub) {
              subInterests.push(sub);
            }
          });
        }
      });

      setFormData(prev => ({
        ...prev,
        aboutYou: detailsUser.description || '',
        firstName: detailsUser.name || '',
        lastName: detailsUser.lastname || '',
        age: `${detailsUser.age}`,
        gender: detailsUser.gender || null,
        genderId: detailsUser.gender?.id?.toString() || '',
        maxDistance: detailsUser.max_distance_km || 1,
        showMe: detailsUser.interested_gender || null,
        showMeId: detailsUser.interested_gender?.id?.toString() || '',
        ageRangeMin: detailsUser.min_age || 18,
        ageRangeMax: detailsUser.max_age || 100,
        selectedInterests: interests,
        selectedSubInterests: subInterests,
      }));
    }
  }, [detailsUser]);

  // Función para manejar cambios en showMe (ya no se usa con radio buttons)

  // Función para calcular campos llenos
  const getFilledFieldsCount = () => {
    let count = 0;
    const totalFields = 10; // Total de campos que necesitamos validar

    if (formData.firstName.length >= 3) count++;
    if (formData.lastName.length >= 3) count++;
    if (formData.age.length !== 0) count++;
    if (formData.aboutYou.length !== 0) count++;
    if (formData.selectedSubInterests.length > 0) count++;
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

  // Función para manejar el botón Save
  const handleSave = () => {
    if (areAllFieldsFilled()) {
      Keyboard.dismiss();

      // Extraer IDs de los subintereses seleccionados
      const subcategories = formData.selectedSubInterests
        .map(sub => sub.id)
        .join(',');

      const editDetailsInfoUser: EditDetailsInfoUser2 = {
        subcategories,
        age: Number(formData.age),
        gender_id: parseInt(formData.genderId, 10),
        interested_gender_id: parseInt(formData.showMeId, 10),
        max_distance_km: formData.maxDistance,
        min_age: formData.ageRangeMin,
        max_age: formData.ageRangeMax,
        name: formData.firstName,
        lastname: formData.lastName,
        description: formData.aboutYou,
      };

      EditDetailsInfo(editDetailsInfoUser);
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
            <View style={{marginHorizontal: 20}}>
              <ButtonGoBack navigation={navigation} />
              <LogoSofy />

              <FormEditProfile
                formData={formData}
                setFormData={setFormData}
                getFilledFieldsCount={getFilledFieldsCount}
                areAllFieldsFilled={areAllFieldsFilled}
                handleSave={handleSave}
              />
            </View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
