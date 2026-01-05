import {createStackNavigator} from '@react-navigation/stack';
import Communities from '../screens/communities';
import CommunitiesDetails from '../screens/CommunitiesDetails';
import CommunitiesAdd from '../screens/CommunitiesAdd';
import {DataGroup} from '../interfaces/interfacesIAP';
import CommunitiesEdit from '../screens/CommunitiesEdit';

export type RootStackCommunitiesParamList = {
  Communities: undefined;
  CommunitiesAdd: {userId: number};
  CommunitiesDetails: {communityId: string; band?: boolean};
  CommunitiesEdit: {communityDetails: DataGroup};
};
const Stack = createStackNavigator<RootStackCommunitiesParamList>();

export const StackCommunities = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Communities" component={Communities} />
      <Stack.Screen name="CommunitiesAdd" component={CommunitiesAdd} />
      <Stack.Screen name="CommunitiesDetails" component={CommunitiesDetails} />
      <Stack.Screen name="CommunitiesEdit" component={CommunitiesEdit} />
    </Stack.Navigator>
  );
};
