import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SafeAreaView} from 'react-native';
import YouLikedMe from '../screens/YouLikedMe';
import SeeWhoLikesYou from '../screens/SeeYouLikesYou';

const Tab = createMaterialTopTabNavigator();

export default function TopTapNavigatorLikes() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#007AFF',
            height: 3,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
        }}>
        <Tab.Screen
          name="YouLikedMe"
          component={YouLikedMe}
          options={{
            tabBarLabel: 'Users you like',
          }}
        />
        <Tab.Screen
          name="seeWhoLikesYou"
          component={SeeWhoLikesYou}
          options={{
            tabBarLabel: 'See Who Likes You',
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
