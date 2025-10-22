import {createStackNavigator} from '@react-navigation/stack';
import EditPhoneNumber from '../screens/EditPhoneNumber';
import EditEmail from '../screens/EditEmail';
import SeeLocation from '../screens/SeeLocation';
import ContactUs from '../screens/ContactUs';
import Privacy from '../screens/Privacy';
import TermsAndServices from '../screens/TermsAndServices';
import Settings from '../screens/Setting';
const Stack = createStackNavigator();

export const StackSettingsApps = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="EditPhoneNumber" component={EditPhoneNumber} />
      <Stack.Screen name="EditEmail" component={EditEmail} />
      <Stack.Screen name="SeeLocation" component={SeeLocation} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="TermsAndServices" component={TermsAndServices} />
    </Stack.Navigator>
  );
};
