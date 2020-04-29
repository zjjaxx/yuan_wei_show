import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, StatusBar, Platform } from "react-native"
import AppRouter from "./router/index"
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from "react-redux"
import store from "./store/store"

const background = Platform.Version >= 23 ? "#fff" : 'gray'
console.disableYellowBox = true
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar backgroundColor={background} barStyle='dark-content' />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <AppRouter></AppRouter>
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
}

