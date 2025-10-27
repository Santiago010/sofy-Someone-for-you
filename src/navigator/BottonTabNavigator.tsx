import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {CardsUsers} from '../screens/CardsUsers';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {colors} from '../theme/globalTheme';
import {StackProfile} from './StackProfile';
import TopTapNavigatorLikes from './TopTabNavigatorLikes';
import {StackChats} from './StackChats';
import {useContext, useEffect} from 'react';
import {AuthContext} from '../context/authContext/authContext';

export type RootBottonTabNavigator = {
  Home: undefined;
  Likes: undefined;
  StackChats: undefined;
  StackProfile: undefined;
};

interface Props extends BottomTabScreenProps<RootBottonTabNavigator, 'Home'> {}

const Tab = createBottomTabNavigator<RootBottonTabNavigator>();

export const BottonTabNavigator = () => {
  const {GetDetailsUser} = useContext(AuthContext);

  useEffect(() => {
    GetDetailsUser();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'fire' : 'fire-circle';
          } else if (route.name === 'Likes') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'StacksChats') {
            iconName = focused ? 'chat' : 'chat-outline';
          } else if (route.name === 'StackProfile') {
            iconName = focused ? 'account' : 'account-outline';
          } else {
            iconName = 'home-variant-outline';
          }

          return (
            <MaterialDesignIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: colors.text,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}>
      <Tab.Screen name="Home" component={CardsUsers} />
      <Tab.Screen name="Likes" component={TopTapNavigatorLikes} />
      <Tab.Screen name="StacksChats" component={StackChats} />
      <Tab.Screen name="StackProfile" component={StackProfile} />
    </Tab.Navigator>
  );
};
