import {createStackNavigator} from '@react-navigation/stack';
import Chats from '../screens/Chats';
import {Chat} from '../screens/Chat';

export type RootStackParamsStackChat = {
  Chats: undefined;
  Chat: undefined;
};

const AppStackChats = createStackNavigator<RootStackParamsStackChat>();

export const StackChats = () => {
  return (
    <AppStackChats.Navigator screenOptions={{headerShown: false}}>
      <AppStackChats.Screen name="Chats" component={Chats} />
      <AppStackChats.Screen name="Chat" component={Chat} />
    </AppStackChats.Navigator>
  );
};
