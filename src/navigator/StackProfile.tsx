import {createStackNavigator} from '@react-navigation/stack';
import EditPhotos from '../screens/EditPhotos';
import {Profile} from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import {StackSettingsApps} from './StackSettingsApp';
import {useContext, useEffect, useCallback} from 'react';
import {AuthContext} from '../context/authContext/authContext';
import {useNavigation} from '@react-navigation/native';

const Stack = createStackNavigator();

// Hook para detectar cuando la ruta activa es "Profile"
const useProfileVisible = (onVisible: () => void) => {
  const navigation = useNavigation();
  useEffect(() => {
    const handleStateChange = () => {
      const state = navigation.getState();
      const route = state.routes[state.index];
      if (route?.name === 'Profile') {
        onVisible();
      }
    };
    const unsubscribe = navigation.addListener('state', handleStateChange);
    handleStateChange(); // chequeo inicial
    return unsubscribe;
  }, [navigation, onVisible]);
};

export const StackProfile = () => {
  const {GetDetailsUser} = useContext(AuthContext);

  const handleProfileVisible = useCallback(() => {
    GetDetailsUser();
  }, [GetDetailsUser]);

  useProfileVisible(handleProfileVisible);

  useEffect(() => {
    GetDetailsUser(); // carga inicial (opcional)
  }, [GetDetailsUser]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditPhotos" component={EditPhotos} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="StackSettingsApps" component={StackSettingsApps} />
    </Stack.Navigator>
  );
};
