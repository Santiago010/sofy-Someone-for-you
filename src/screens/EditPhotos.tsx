import React, {useContext, useEffect, useState, useCallback} from 'react';
import {View, SafeAreaView} from 'react-native';
import {commonStyles} from '../theme/globalTheme';
import GridImage from '../components/GridImage';
import {Button} from 'react-native-paper';
import ButtonGoBack from '../components/ButtonGoBack';
import {AuthContext} from '../context/authContext/authContext';
import {UploadFile} from '../interfaces/interfacesApp';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  EditPhotos: undefined;
  // ...otras rutas si las tienes...
};

type EditPhotosScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function EditPhotos({
  navigation,
}: {
  navigation: EditPhotosScreenNavigationProp;
}) {
  const [images, setImages] = useState<string[]>([]);

  const {detailsUser, removeImage, addImage, GetDetailsUser} =
    useContext(AuthContext);

  // Función para manejar cambios en los archivos de fotos (modo local)
  const handleImageFilesChange = (_files: UploadFile[]) => {
    // No se usa en modo backend, pero se mantiene para compatibilidad
  };

  // Función para refrescar datos después de operaciones
  const handleRefreshData = useCallback(() => {
    GetDetailsUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    if (areAllFieldsFilled()) {
      navigation.goBack();
    }
  };

  // Función para verificar si hay exactamente 6 fotos en el backend
  const areAllFieldsFilled = () => {
    const backendImagesCount = detailsUser?.individualFiles?.length || 0;
    return backendImagesCount === 6;
  };

  return (
    <View style={commonStyles.container}>
      <SafeAreaView>
        <View style={{marginHorizontal: 20}}>
          <ButtonGoBack navigation={navigation} />
          <GridImage
            images={images}
            setImages={setImages}
            onImageFilesChange={handleImageFilesChange}
            individualFiles={detailsUser?.individualFiles || []}
            onAddImage={addImage}
            onRemoveImage={removeImage}
            onRefreshData={handleRefreshData}
          />

          <View style={commonStyles.saveContainer}>
            <Button
              mode="contained"
              onPress={handleSave}
              disabled={!areAllFieldsFilled()}
              style={[
                commonStyles.saveButton,
                areAllFieldsFilled() && commonStyles.saveButtonEnabled,
              ]}
              contentStyle={commonStyles.saveButtonContent}>
              Save
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
