import React from 'react';
import {Image, StyleSheet} from 'react-native';

export default function LogoSofy() {
  return (
    <Image
      source={require('../assets/Logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
