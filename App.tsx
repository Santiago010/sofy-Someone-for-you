/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import {PaperProvider} from 'react-native-paper';
import {AuthProvider} from './src/context/authContext/authContext';
import {MyStack} from './src/navigator/MyStack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function AppState({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider>{children}</PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function App(): React.JSX.Element {
  return (
    <AppState>
      <MyStack />
    </AppState>
  );
}

export default App;
