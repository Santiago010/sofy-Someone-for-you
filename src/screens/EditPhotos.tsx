import React, {useContext, useEffect, useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import {commonStyles} from '../theme/globalTheme';
import GridImage from '../components/GridImage';
import {Button} from 'react-native-paper';
import ButtonGoBack from '../components/ButtonGoBack';
import {AuthContext} from '../context/authContext/authContext';
import {IndividualFile, UploadFile} from '../interfaces/interfacesApp';

export default function EditPhotos({navigation}) {
  const [images, setImages] = useState<string[]>([]);
  const [imageFromUrl, setImagesFromUrl] = useState<IndividualFile[]>([]);
  const [image, setImage] = useState<string>('');
  const [photoFiles, setPhotoFiles] = useState<UploadFile[]>([]);

  const {detailsUser, removeImage, addImage} = useContext(AuthContext);

  useEffect(() => {
    if (detailsUser !== null) {
      setImagesFromUrl(detailsUser.individualFiles);
    }
  }, [detailsUser]);

  useEffect(() => {
    console.log(imageFromUrl);

    if (imageFromUrl.length > 0) {
      removeImage(`${imageFromUrl[0].id}`);
    }
  }, [imageFromUrl]);

  // Función para manejar cambios en los archivos de fotos
  const handleImageFilesChange = (files: UploadFile[]) => {
    setPhotoFiles(files);
  };

  const handleSave = () => {
    addImage(photoFiles[0]);
  };

  // Función para verificar si todos los campos están llenos
  const areAllFieldsFilled = () => {
    const {filled, total} = getFilledFieldsCount();
    return filled >= total;
  };

  // Función para calcular campos llenos
  const getFilledFieldsCount = () => {
    let count = 0;
    const totalFields = 0; // Total de campos que necesitamos validar

    if (images.length === 6) count++;

    return {filled: count, total: totalFields};
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
