import React, {useContext} from 'react';
import {FlatList, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {colors, commonStyles} from '../theme/globalTheme';
import {ChatContext} from '../context/chatsContext/chatContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsStackChat} from '../navigator/StackChats';

export default function Chats() {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamsStackChat>>();
  const {userChats} = useContext(ChatContext);
  return (
    <SafeAreaView style={commonStyles.container}>
      <View>
        <FlatList
          data={userChats}
          ListHeaderComponent={
            <>
              {userChats?.length === 0 && (
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 22,
                    textAlign: 'center',
                  }}>
                  🧐¡Sin Chats!
                </Text>
              )}
            </>
          }
          keyExtractor={({id}) => id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
              <Text style={{color: colors.text}}>{item.id}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
