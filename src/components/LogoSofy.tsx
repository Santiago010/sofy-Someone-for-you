import React from 'react';
import {Image, StyleSheet} from 'react-native';

export default function LogoSofy({withMarginBotton}: any) {
  return (
    <Image
      source={require('../assets/Logo.png')}
      style={{...styles.logo, marginBottom: withMarginBotton === true ? 20 : 0}}
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
