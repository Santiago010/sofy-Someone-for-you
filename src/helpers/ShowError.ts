import {Alert} from 'react-native';

interface Props {
  removeError: () => void;
  errorMessage: string;
  screen: string;
}

export const showError = ({screen, errorMessage, removeError}: Props) => {
  Alert.alert(`Error in ${screen}`, errorMessage, [
    {
      text: 'Ok',
      onPress: removeError,
    },
  ]);
};
