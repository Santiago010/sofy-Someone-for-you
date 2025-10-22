import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from '../context/authContext/authContext';
import {useContext} from 'react';
import {BarIndicator} from 'react-native-indicators';
import {NavigationContainer} from '@react-navigation/native';
import {Register} from '../screens/Register';
import {Login} from '../screens/Login';
import {CodeVerificationEmail} from '../screens/CodeVerificationEmail';
import {BottonTabNavigator} from './BottonTabNavigator';
import {ForgotYourPassword} from '../screens/ForgotYourPassword';
import {InfoUser} from '../screens/InfoUser';
import {RootStackParamList} from './types';
import {colors} from '../theme/globalTheme';
import {View} from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

export const MyStack = () => {
  const {status} = useContext(AuthContext);

  console.log(status);

  if (status === 'checking') {
    return <BarIndicator count={4} size={50} color={colors.primary} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {status !== 'authenticated' ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen
              name="ForgotYourPassword"
              component={ForgotYourPassword}
            />
            <Stack.Screen
              name="CodeVerificationEmail"
              component={CodeVerificationEmail}
            />
            <Stack.Screen name="InfoUser" component={InfoUser} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="BottonTabNavigator"
              component={BottonTabNavigator}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );

  //   return (
  //     <NavigationContainer>
  //       <Stack.Navigator screenOptions={{headerShown: false}}>
  //         <Stack.Screen
  //           name="BottonTabNavigator"
  //           component={BottonTabNavigator}
  //         />
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   );
};
