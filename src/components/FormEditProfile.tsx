import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors, commonStyles} from '../theme/globalTheme';
import {Button, Chip, RadioButton, Text, TextInput} from 'react-native-paper';
import Slider from '@react-native-community/slider';

export default function FormEditProfile({
  formData,
  setFormData,
  handleSave,
  areAllFieldsFilled,
  getFilledFieldsCount,
}: any) {
  // Opciones de intereses
  const interests = [
    'Dancing',
    'Music',
    'Movies',
    'Play an instrument',
    'Sports',
    'Reading',
    'Cooking',
    'Travel',
    'Photography',
    'Gaming',
    'Art',
    'Fitness',
  ];

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

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter(i => i !== interest)
        : prev.selectedInterests.length < 5
        ? [...prev.selectedInterests, interest]
        : prev.selectedInterests, // Máximo 5 intereses
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
        <View style={styles.field}>
          <Text variant="labelMedium" style={styles.label}>
            Select up to 5 interest
          </Text>
          <View style={styles.interestsContainer}>
            {interests.map(interest => (
              <Chip
                key={interest}
                mode={
                  formData.selectedInterests.includes(interest)
                    ? 'flat'
                    : 'outlined'
                }
                onPress={() => toggleInterest(interest)}
                style={[
                  styles.interestChip,
                  formData.selectedInterests.includes(interest) &&
                    styles.selectedChip,
                ]}
                textStyle={
                  formData.selectedInterests.includes(interest) &&
                  styles.selectedChipText
                }>
                {interest}
              </Chip>
            ))}
          </View>
        </View>

        {/* Selector de género */}
        <View style={styles.field}>
          <Text variant="labelMedium" style={styles.label}>
            Gender*
          </Text>
          <RadioButton.Group
            onValueChange={value => handleInputChange('gender', value)}
            value={formData.gender}>
            <View style={styles.radioOption}>
              <RadioButton value="male" color={colors.accent} />
              <Text variant="bodyMedium" style={styles.radioLabel}>
                Male
              </Text>
            </View>

            <View style={styles.radioOption}>
              <RadioButton value="female" color={colors.accent} />
              <Text variant="bodyMedium" style={styles.radioLabel}>
                Female
              </Text>
            </View>

            <View style={styles.radioOption}>
              <RadioButton value="non-binary" color={colors.accent} />
              <Text variant="bodyMedium" style={styles.radioLabel}>
                Non-binary
              </Text>
            </View>
          </RadioButton.Group>
        </View>

        {/* Maximum Distance */}
        <View style={styles.field}>
          <View style={styles.sliderContainer}>
            <Text variant="labelMedium" style={styles.label}>
              Maximum Distance
            </Text>
            <Text variant="bodyMedium" style={styles.distanceValue}>
              {formData.maxDistance} mi.
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

        {/* Show me */}
        <View style={styles.field}>
          <Text variant="labelMedium" style={styles.label}>
            Show me*
          </Text>

          <RadioButton.Group
            onValueChange={value => handleInputChange('showMe', value)}
            value={formData.showMe}>
            <View style={styles.radioOption}>
              <RadioButton value="men" color={colors.accent} />
              <Text variant="bodyMedium" style={styles.radioLabel}>
                Men
              </Text>
            </View>

            <View style={styles.radioOption}>
              <RadioButton value="women" color={colors.accent} />
              <Text variant="bodyMedium" style={styles.radioLabel}>
                Women
              </Text>
            </View>

            <View style={styles.radioOption}>
              <RadioButton value="non-binary" color={colors.accent} />
              <Text variant="bodyMedium" style={styles.radioLabel}>
                Non-binary
              </Text>
            </View>
          </RadioButton.Group>
        </View>

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

      {/* Loading Indicator
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Cargando imagen...</Text>
              </View>
            )} */}
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
});
