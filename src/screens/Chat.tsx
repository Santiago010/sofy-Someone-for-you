import React, {useContext, useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {Text} from 'react-native-paper';
import {RootStackParamsStackChat} from '../navigator/StackChats';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {colors, commonStyles} from '../theme/globalTheme';
import ButtonGoBack from '../components/ButtonGoBack';

interface Props
  extends BottomTabScreenProps<RootStackParamsStackChat, 'Chat'> {}

export const Chat = ({navigation}: Props) => {
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });
  }, []);
  return (
    <SafeAreaView style={commonStyles.container}>
      <ButtonGoBack navigation={navigation} />

      <Text>1</Text>
    </SafeAreaView>
  );
};
