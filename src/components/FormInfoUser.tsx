import React from 'react';
import {View} from 'react-native';
import {Chip, Text, TextInput} from 'react-native-paper';

export default function FormInfoUser({form, onChange}: any) {
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

  // Función para manejar selección de intereses
  const toggleInterest = (interest: string) => {};

  return (
    <>
      {/* Nuevos campos de formulario */}
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
              value={form.firstName}
              onChangeText={text => onChange('firstName', text)}
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
              value={form.lastName}
              onChangeText={text => onChange('lastName', text)}
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
            value={form.age}
            onChangeText={text => onChange('age', text)}
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
            value={form.aboutYou}
            onChangeText={text => onChange('aboutYou', text)}
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
                  form.selectedInterests.includes(interest)
                    ? 'flat'
                    : 'outlined'
                }
                onPress={() => toggleInterest(interest)}
                style={[
                  styles.interestChip,
                  form.selectedInterests.includes(interest) &&
                    styles.selectedChip,
                ]}
                textStyle={
                  form.selectedInterests.includes(interest) &&
                  styles.selectedChipText
                }>
                {interest}
              </Chip>
            ))}
          </View>
        </View>

        {/* Selector de género */}
        <View style={styles.field}>
          <Text variant="labelMedium" style={styles.label}>
            Gender*
          </Text>
          <RadioButton.Group
            onValueChange={value => onChange('gender', value)}
            value={form.gender}>
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
              {form.maxDistance} mi.
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
            value={form.maxDistance}
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
            onValueChange={value => onChange('showMe', value)}
            value={form.showMe}>
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
              value={`${form.ageRangeMin}`}
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
              value={`${form.ageRangeMax}`}
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
    </>
  );
}
