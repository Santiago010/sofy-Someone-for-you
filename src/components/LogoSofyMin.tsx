import React from 'react';
import {Image, StyleSheet} from 'react-native';

export default function LogoSofyMin() {
  return (
    <Image
      source={require('../assets/Logo.png')}
      style={{...styles.logo}}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
});
