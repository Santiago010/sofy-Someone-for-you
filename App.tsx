/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {LogBox, Platform} from 'react-native';

import {PaperProvider} from 'react-native-paper';
import {AuthProvider} from './src/context/authContext/authContext';
import {MyStack} from './src/navigator/MyStack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ChatProviver} from './src/context/chatsContext/chatContext';

function AppState({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ChatProviver>
          <PaperProvider>{children}</PaperProvider>
        </ChatProviver>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function App(): React.JSX.Element {
  // Ignorar el warning de animaciones sin listeners
  LogBox.ignoreLogs([
    "Sending 'onAnimatedValueUpdate' with no listeners registered.",
  ]);

  LogBox.ignoreLogs([
    'Attempted to register RCTBridgeModule class RCTVideoManager',
  ]);

  if (Platform.OS === 'ios') {
    LogBox.ignoreLogs([
      'PermissionsAndroid module works only for Android platform.',
    ]);
  }

  return (
    <AppState>
      <MyStack />
    </AppState>
  );
}

export default App;
