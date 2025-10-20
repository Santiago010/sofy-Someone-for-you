import {Dimensions} from 'react-native';

export const DeviceDimensions = () => {
  const {width: widthWindow, height: heightWindow} = Dimensions.get('window');

  return {
    widthWindow,
    heightWindow,
  };
};
