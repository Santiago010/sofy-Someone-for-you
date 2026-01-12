import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CardsUsers} from '../screens/CardsUsers';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import {colors} from '../theme/globalTheme';
import {StackProfile} from './StackProfile';
import TopTapNavigatorLikes from './TopTabNavigatorLikes';
import Chats from '../screens/Chats';
import {useContext, useEffect, useState, useCallback} from 'react';
import {AuthContext} from '../context/authContext/authContext';
import {useMatchSocket} from '../hooks/useMatchSocket';
import {MatchResponse} from '../interfaces/interfacesApp';
import {ModalMatchFromSocket} from '../components/ModalMatchFromSocket';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BarIndicator} from 'react-native-indicators';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';
import {View} from 'react-native';
import {StackCommunities} from './StackCommunities';
import MyAffinities from '../screens/MyAffinities';

export type RootBottonTabNavigator = {
  Home: undefined;
  Likes: undefined;
  StackCommunities: undefined;
  Chats: undefined;
  StackProfile: undefined;
  MyAffinities: undefined;
};

const Tab = createBottomTabNavigator<RootBottonTabNavigator>();

export const BottonTabNavigator = () => {
  const {getIDUserForChats, idUserForChats} = useContext(AuthContext);
  const {getStateSuscription, isLoadingSuscritions} =
    useContext(PurchasesContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [matchData, setMatchData] = useState<MatchResponse | null>(null);

  const onMatchReceived = useCallback((data: MatchResponse) => {
    console.log('📥 Match recibido en BottonTabNavigator:', data);
    setMatchData(data);
  }, []);

  useEffect(() => {
    getIDUserForChats();
  }, []);

  useEffect(() => {
    if (matchData) {
      setModalVisible(true);
    }
  }, [matchData]);

  useEffect(() => {
    if (idUserForChats) {
      console.log('Verificando suscripción para el usuario:', idUserForChats);
      getStateSuscription(idUserForChats).then(res => {
        console.log(res.res);
      });
    }
  }, [idUserForChats]);

  const toggleModal = useCallback(() => {
    setModalVisible(prev => !prev);
  }, []);

  const {socket} = useMatchSocket(onMatchReceived, idUserForChats);

  if (isLoadingSuscritions) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <BarIndicator count={4} size={50} color={colors.primary} />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false, // <-- Mostrar el header en las tabs
            tabBarShowLabel: false,
            tabBarIcon: ({focused, color, size}) => {
              let iconName: string;

              if (route.name === 'MyAffinities') {
                iconName = focused ? 'fire' : 'fire-circle';
              } else if (route.name === 'Home') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Chats') {
                iconName = focused ? 'chat' : 'chat-outline';
              } else if (route.name === 'StackCommunities') {
                iconName = focused ? 'comment-flash' : 'comment-flash-outline';
              } else if (route.name === 'StackProfile') {
                iconName = focused ? 'account' : 'account-outline';
              } else {
                iconName = 'home-variant-outline';
              }

              return (
                <MaterialDesignIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
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
          <Tab.Screen name="MyAffinities" component={MyAffinities} />
          <Tab.Screen name="StackCommunities" component={StackCommunities} />
          <Tab.Screen name="Home" component={CardsUsers} />
          <Tab.Screen name="Chats" component={Chats} />
          <Tab.Screen name="StackProfile" component={StackProfile} />
        </Tab.Navigator>

        {matchData && (
          <ModalMatchFromSocket
            modalVisible={modalVisible}
            toggleModal={toggleModal}
            user={matchData}
          />
        )}
      </SafeAreaView>
    );
  }
};
