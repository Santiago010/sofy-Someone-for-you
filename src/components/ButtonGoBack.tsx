import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {colors} from '../theme/globalTheme';

export default function ButtonGoBack({navigation}: any) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
        marginTop: Platform.OS === 'android' ? 20 : 0,
        alignSelf: 'flex-start',
      }}
      onPress={() => navigation.goBack()}>
      <MaterialDesignIcons name="arrow-left" size={24} color="#fff" />
    </TouchableOpacity>
  );
}
