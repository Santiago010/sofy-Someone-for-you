import React, {useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {colors, commonStyles} from '../theme/globalTheme';
import {Button, Chip, RadioButton, Text, TextInput} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import useGetGender from '../hooks/getGenders';
import {
  InterestAndSubInterestResponse,
  subcategories,
} from '../interfaces/interfacesApp';
import useGetInterestWithSubInterest from '../hooks/getInterestWithSubInterest';

export default function FormEditProfile({
  formData,
  setFormData,
  handleSave,
  areAllFieldsFilled,
  getFilledFieldsCount,
  loading,
}: any) {
  // Usar el hook para obtener intereses

  // Usar el hook para obtener intereses con subintereses
  const {
    data: interestsWithSub,
    loading: loadingWithSub,
    error: errorWithSub,
  } = useGetInterestWithSubInterest();

  // Usar el hook para obtener géneros
  const {
    data: genders,
    loading: genderLoading,
    error: genderError,
  } = useGetGender();

  // Estado para controlar mostrar todos los intereses
  const [showAllInterests, setShowAllInterests] = useState(false);

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

  // Toggle para intereses principales
  const toggleInterest = (interest: InterestAndSubInterestResponse) => {
    setFormData((prev: any) => {
      const isSelected = prev.selectedInterests.some(
        (i: InterestAndSubInterestResponse) => i.id === interest.id,
      );
      if (isSelected) {
        // Al desseleccionar, quitar también los subintereses relacionados
        const filteredSubInterests = prev.selectedSubInterests.filter(
          (sub: subcategories) =>
            !interest.subcategories.some(
              (si: subcategories) => si.id === sub.id,
            ),
        );
        return {
          ...prev,
          selectedInterests: prev.selectedInterests.filter(
            (i: InterestAndSubInterestResponse) => i.id !== interest.id,
          ),
          selectedSubInterests: filteredSubInterests,
        };
      } else if (prev.selectedInterests.length < 5) {
        return {
          ...prev,
          selectedInterests: [...prev.selectedInterests, interest],
        };
      }
      return prev;
    });
  };

  // Toggle para subintereses
  const toggleSubInterest = (
    interestId: number,
    subInterest: subcategories,
  ) => {
    setFormData((prev: any) => {
      const isSelected = prev.selectedSubInterests.some(
        (si: subcategories) => si.id === subInterest.id,
      );
      if (isSelected) {
        return {
          ...prev,
          selectedSubInterests: prev.selectedSubInterests.filter(
            (si: subcategories) => si.id !== subInterest.id,
          ),
        };
      } else {
        return {
          ...prev,
          selectedSubInterests: [...prev.selectedSubInterests, subInterest],
        };
      }
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

        {/* Selector de intereses con subintereses */}
        {loadingWithSub && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando intereses...</Text>
          </View>
        )}
        {errorWithSub && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorWithSub}</Text>
          </View>
        )}
        {!loadingWithSub && !errorWithSub && (
          <View style={styles.field}>
            <Text variant="labelMedium" style={styles.label}>
              Select up to 5 interest
            </Text>
            <View style={styles.interestsContainer}>
              {(showAllInterests
                ? interestsWithSub
                : interestsWithSub.slice(0, 13)
              ).map((interest: InterestAndSubInterestResponse) => {
                const isSelected = formData.selectedInterests.some(
                  (i: InterestAndSubInterestResponse) => i.id === interest.id,
                );
                return (
                  <View
                    key={interest.id}
                    style={{marginBottom: 8, width: '100%'}}>
                    <Chip
                      mode={isSelected ? 'flat' : 'outlined'}
                      onPress={() => toggleInterest(interest)}
                      style={[
                        styles.interestChip,
                        isSelected && styles.selectedChip,
                      ]}
                      textStyle={isSelected && styles.selectedChipText}>
                      {interest.name}
                    </Chip>
                    {/* Renderizar subintereses si el interés está seleccionado */}
                    {isSelected && (
                      <View style={styles.subInterestsContainer}>
                        {interest.subcategories.map((sub: subcategories) => {
                          const isSubSelected =
                            formData.selectedSubInterests.some(
                              (si: subcategories) => si.id === sub.id,
                            );
                          return (
                            <Chip
                              key={sub.id}
                              mode={isSubSelected ? 'flat' : 'outlined'}
                              onPress={() =>
                                toggleSubInterest(interest.id, sub)
                              }
                              style={[
                                styles.subInterestChip,
                                isSubSelected && styles.selectedChip,
                              ]}
                              textStyle={
                                isSubSelected && styles.selectedChipText
                              }>
                              {sub.name}
                            </Chip>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })}
              {/* Botón para ver más intereses si hay más de 13 */}
              {interestsWithSub.length > 13 && !showAllInterests && (
                <View
                  style={{width: '100%', alignItems: 'center', marginTop: 8}}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowAllInterests(true)}
                    style={{borderRadius: 8}}>
                    Show more
                  </Button>
                </View>
              )}
              {/* Botón para mostrar menos si se están mostrando todos */}
              {interestsWithSub.length > 13 && showAllInterests && (
                <View
                  style={{width: '100%', alignItems: 'center', marginTop: 8}}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowAllInterests(false)}
                    style={{borderRadius: 8}}>
                    Show less
                  </Button>
                </View>
              )}
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
          disabled={!areAllFieldsFilled() || loading}
          style={[
            commonStyles.saveButton,
            areAllFieldsFilled() && commonStyles.saveButtonEnabled,
          ]}
          contentStyle={commonStyles.saveButtonContent}
          labelStyle={commonStyles.saveButtonLabel}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.secondary} />
          ) : (
            `Save (${getFilledFieldsCount().filled}/${
              getFilledFieldsCount().total
            })`
          )}
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
  subInterestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
    marginLeft: 12,
  },
  interestChip: {
    margin: 2,
  },
  subInterestChip: {
    margin: 2,
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderWidth: 1,
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
