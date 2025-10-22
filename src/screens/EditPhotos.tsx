import React, {useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import {commonStyles} from '../theme/globalTheme';
import GridImage from '../components/GridImage';
import {Button} from 'react-native-paper';
import ButtonGoBack from '../components/ButtonGoBack';

export default function EditPhotos({navigation}) {
  const [images, setImages] = useState<string[]>([]);

  const handleSave = () => {
    console.log('Image', images);
  };

  // Función para verificar si todos los campos están llenos
  const areAllFieldsFilled = () => {
    const {filled, total} = getFilledFieldsCount();
    return filled >= total;
  };

  // Función para calcular campos llenos
  const getFilledFieldsCount = () => {
    let count = 0;
    const totalFields = 1; // Total de campos que necesitamos validar

    if (images.length === 6) count++;

    return {filled: count, total: totalFields};
  };

  return (
    <View style={commonStyles.container}>
      <SafeAreaView>
        <View style={{marginHorizontal: 20}}>
          <ButtonGoBack navigation={navigation} />
          <GridImage images={images} setImages={setImages} />

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
              Save
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
