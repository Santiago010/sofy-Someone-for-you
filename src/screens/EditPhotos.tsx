import React, {useState} from 'react';
import {View} from 'react-native';
import {commonStyles} from '../theme/globalTheme';
import GridImage from '../components/GridImage';
import {Button} from 'react-native-paper';

export default function EditPhotos() {
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
      <View style={commonStyles.content}>
        <GridImage images={images} setImages={setImages} />
      </View>
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
  );
}
