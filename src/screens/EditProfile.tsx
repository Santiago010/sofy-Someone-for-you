import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Keyboard, KeyboardAvoidingView, Platform} from 'react-native';
import {colors, commonStyles} from '../theme/globalTheme';
import LogoSofy from '../components/LogoSofy';
import ButtonGoBack from '../components/ButtonGoBack';
import FormEditProfile from '../components/FormEditProfile';
import {AuthContext} from '../context/authContext/authContext';

export default function EditProfile({navigation}: any) {
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

  const {EditDetailsInfo} = useContext(AuthContext);

  // Función para manejar cambios en showMe (ya no se usa con radio buttons)

  // Función para calcular campos llenos
  const getFilledFieldsCount = () => {
    let count = 0;
    const totalFields = 0; // Total de campos que necesitamos validar

    if (formData.firstName.length >= 3) count++;
    if (formData.lastName.length >= 3) count++;
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
      EditDetailsInfo({
        min_age: 10,
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
