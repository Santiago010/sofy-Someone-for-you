import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CardsUsers} from '../screens/CardsUsers';
import {Likes} from '../screens/Likes';
import {Chat} from '../screens/Chat';
import {Profile} from '../screens/Profile';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {colors} from '../theme/globalTheme';
import {StackProfile} from './StackProfile';
import TopTapNavigatorLikes from './TopTabNavigatorLikes';

const Tab = createBottomTabNavigator();

export const BottonTabNavigator = () => {
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
          } else if (route.name === 'Chat') {
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
          backgroundColor: 'white',
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
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="StackProfile" component={StackProfile} />
    </Tab.Navigator>
  );
};
