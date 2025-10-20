import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export const Likes = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Likes Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
