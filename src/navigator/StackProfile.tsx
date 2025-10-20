import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from '../context/authContext/authContext';
import {useContext} from 'react';
import {BarIndicator} from 'react-native-indicators';
import {RootStackParamList} from './types';
import EditPhotos from '../screens/EditPhotos';
import {Profile} from '../screens/Profile';

import EditProfile from '../screens/EditProfile';
import Setting from '../screens/Setting';
const Stack = createStackNavigator<RootStackParamList>();

export const StackProfile = () => {
  const {status} = useContext(AuthContext);

  if (status === 'checking') {
    return <BarIndicator count={4} size={50} color="#ff8704" />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditPhotos" component={EditPhotos} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Setting" component={Setting} />
    </Stack.Navigator>
  );
};
