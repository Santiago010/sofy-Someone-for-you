import {createStackNavigator} from '@react-navigation/stack';
import Communities from '../screens/communities';
import CommunitiesDetails from '../screens/CommunitiesDetails';
import CommunitiesAdd from '../screens/CommunitiesAdd';

export type RootStackCommunitiesParamList = {
  Communities: undefined;
  CommunitiesAdd: {userId: number};
  CommunitiesDetails: {communityId: string};
};
const Stack = createStackNavigator<RootStackCommunitiesParamList>();

export const StackCommunities = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Communities" component={Communities} />
      <Stack.Screen name="CommunitiesAdd" component={CommunitiesAdd} />
      <Stack.Screen name="CommunitiesDetails" component={CommunitiesDetails} />
    </Stack.Navigator>
  );
};
