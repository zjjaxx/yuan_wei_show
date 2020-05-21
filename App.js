import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, StatusBar, Platform } from "react-native"
import AppRouter from "./router/index"
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from "react-redux"
import store from "./store/store"
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';

const background = Platform.Version >= 23 ? "#fff" : 'gray'
console.disableYellowBox = true

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar backgroundColor={background} barStyle='dark-content' />
          <AppRouter></AppRouter>
        </NavigationContainer>
      </Provider>
    </ApplicationProvider>
  );
}

