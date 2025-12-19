import {createStackNavigator} from '@react-navigation/stack';
import EditPhotos from '../screens/EditPhotos';
import {Profile} from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import {StackSettingsApps} from './StackSettingsApp';

const Stack = createStackNavigator();

export const StackProfile = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditPhotos" component={EditPhotos} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="StackSettingsApps" component={StackSettingsApps} />
    </Stack.Navigator>
  );
};
