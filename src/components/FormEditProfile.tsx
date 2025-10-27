import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {colors, commonStyles} from '../theme/globalTheme';
import {Button, Chip, RadioButton, Text, TextInput} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import useGetInterest from '../hooks/getInterest';
import useGetGender from '../hooks/getGenders';
import {InterestResponse} from '../interfaces/interfacesApp';

export default function FormEditProfile({
  formData,
  setFormData,
  handleSave,
  areAllFieldsFilled,
  getFilledFieldsCount,
}: any) {
  // Usar el hook para obtener intereses
  const {data, loading, error} = useGetInterest();

  // Usar el hook para obtener géneros
  const {
    data: genders,
    loading: genderLoading,
    error: genderError,
  } = useGetGender();

  // Función para manejar cambios en inputs
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputsWithNumber = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleInterest = (interest: InterestResponse) => {
    setFormData(prev => {
      const isSelected = prev.selectedInterests.some(i => i.id === interest.id);
      if (isSelected) {
        return {
          ...prev,
          selectedInterests: prev.selectedInterests.filter(
            i => i.id !== interest.id,
          ),
        };
      } else if (prev.selectedInterests.length < 5) {
        return {
          ...prev,
          selectedInterests: [...prev.selectedInterests, interest],
        };
      }
      return prev; // Máximo 5 intereses
    });
  };

  const handleGenderChange = (genderId: string) => {
    const selectedGender = genders.find(g => g.id.toString() === genderId);
    setFormData(prev => ({
      ...prev,
      genderId,
      gender: selectedGender || null,
    }));
  };

  const handleShowMe = (showMeId: string) => {
    const selectedShowMe = genders.find(g => g.id.toString() === showMeId);

    setFormData(prev => ({
      ...prev,
      showMeId,
      showMe: selectedShowMe || null,
    }));
  };

  return (
    <>
      <View style={styles.formSection}>
        <Text variant="headlineSmall" style={styles.sectionTitle}>
          Personal Information
        </Text>

        {/* Campos de nombre (solo lectura desde auth) */}
        <View style={styles.nameContainer}>
          <View style={styles.nameField}>
            <Text variant="labelMedium" style={styles.label}>
              First Name
            </Text>
            <TextInput
              value={formData.firstName}
              onChangeText={text => handleInputChange('firstName', text)}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
            />
          </View>

          <View style={styles.nameField}>
            <Text variant="labelMedium" style={styles.label}>
              Last Name
            </Text>
            <TextInput
              value={formData.lastName}
              onChangeText={text => handleInputChange('lastName', text)}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
            />
          </View>
        </View>
        {/* Campo de edad */}
        <View style={styles.field}>
          <Text variant="labelMedium" style={styles.label}>
            Age *
          </Text>
          <TextInput
            mode="outlined"
            placeholder="Type your Age"
            value={formData.age}
            onChangeText={text => handleInputChange('age', text)}
            keyboardType="numeric"
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />
        </View>

        {/* Campo About You */}
        <View style={styles.field}>
          <Text variant="labelMedium" style={styles.label}>
            About You
          </Text>
          <TextInput
            mode="outlined"
            placeholder="About You*"
            value={formData.aboutYou}
            onChangeText={text => handleInputChange('aboutYou', text)}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
            outlineStyle={styles.inputOutline}
          />
        </View>

        {/* Selector de intereses */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando intereses...</Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {!loading && !error && (
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.label}>
              Select up to 5 interest
            </Text>
            <View style={styles.interestsContainer}>
              {data.map(interest => {
                const isSelected = formData.selectedInterests.some(
                  i => i.id === interest.id,
                );
                return (
                  <Chip
                    key={interest.id}
                    mode={isSelected ? 'flat' : 'outlined'}
                    onPress={() => toggleInterest(interest)}
                    style={[
                      styles.interestChip,
                      isSelected && styles.selectedChip,
                    ]}
                    textStyle={isSelected && styles.selectedChipText}>
                    {interest.name}
                  </Chip>
                );
              })}
            </View>
          </View>
        )}

        {/* Selector de género */}
        {genderLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando géneros...</Text>
          </View>
        )}
        {genderError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{genderError}</Text>
          </View>
        )}
        {!genderLoading && !genderError && (
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.label}>
              Gender*
            </Text>
            <RadioButton.Group
              onValueChange={handleGenderChange}
              value={formData.genderId}>
              {genders.map(gender => (
                <View key={gender.id} style={styles.radioOption}>
                  <RadioButton
                    value={gender.id.toString()}
                    color={colors.accent}
                  />
                  <Text variant="bodyMedium" style={styles.radioLabel}>
                    {gender.name}
                  </Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>
        )}

        {/* Maximum Distance */}
        <View style={styles.field}>
          <View style={styles.sliderContainer}>
            <Text variant="labelMedium" style={styles.label}>
              Maximum Distance
            </Text>
            <Text variant="bodyMedium" style={styles.distanceValue}>
              {formData.maxDistance} KM.
            </Text>
          </View>
          {/* TODO:SLIDEE */}
          <Slider
            thumbTintColor={`${colors.primary}`}
            maximumTrackTintColor={`${colors.secondary}`}
            minimumTrackTintColor={`${colors.primary}`}
            minimumValue={1}
            maximumValue={100}
            step={1}
            value={formData.maxDistance}
            onValueChange={ev => handleInputsWithNumber('maxDistance', ev)}
          />
        </View>

        {/* Whole World */}
        <View style={styles.field}>
          <View style={styles.radioOption}></View>
        </View>

        {/* Selector de género */}
        {genderLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando géneros...</Text>
          </View>
        )}
        {genderError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{genderError}</Text>
          </View>
        )}
        {!genderLoading && !genderError && (
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.label}>
              Show Me*
            </Text>
            <RadioButton.Group
              onValueChange={handleShowMe}
              value={formData.showMeId}>
              {genders.map(gender => (
                <View key={gender.id} style={styles.radioOption}>
                  <RadioButton
                    value={gender.id.toString()}
                    color={colors.accent}
                  />
                  <Text variant="bodyMedium" style={styles.radioLabel}>
                    {gender.name}
                  </Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>
        )}

        {/* Age Range */}
        <View style={styles.field}>
          <Text variant="labelMedium" style={styles.label}>
            Age Range
          </Text>
          <View style={styles.ageRangeContainer}>
            <TextInput
              mode="outlined"
              placeholder="18"
              value={`${formData.ageRangeMin}`}
              onChangeText={ev => {
                handleInputsWithNumber('ageRangeMin', Number(ev));
              }}
              keyboardType="numeric"
              style={[styles.input, styles.ageInput]}
              outlineStyle={styles.inputOutline}
            />
            <Text variant="bodyMedium" style={styles.ageSeparator}>
              -
            </Text>
            <TextInput
              mode="outlined"
              placeholder="100"
              value={`${formData.ageRangeMax}`}
              onChangeText={ev => {
                handleInputsWithNumber('ageRangeMax', Number(ev));
              }}
              keyboardType="numeric"
              style={[styles.input, styles.ageInput]}
              outlineStyle={styles.inputOutline}
            />
          </View>
        </View>
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
          Save ({getFilledFieldsCount().filled}/{getFilledFieldsCount().total})
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: colors.text,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
