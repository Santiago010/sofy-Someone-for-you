import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import YouLikedMe from '../screens/YouLikedMe';
import SeeWhoLikesYou from '../screens/SeeYouLikesYou';
import ButtonGoBack from '../components/ButtonGoBack';
import LogoSofyMin from '../components/LogoSofyMin';
import {useNavigation} from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

export default function TopTapNavigatorLikes() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.headerContainer}>
        <View style={styles.backButtonContainer}>
          <ButtonGoBack navigation={navigation} />
        </View>
        <LogoSofyMin />
      </View>
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
          name="My Interactions"
          component={YouLikedMe}
          options={{
            tabBarLabel: 'My Interactions',
          }}
        />
        <Tab.Screen
          name="Interactions With Me"
          component={SeeWhoLikesYou}
          options={{
            tabBarLabel: 'Interactions With Me',
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
});
