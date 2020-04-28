import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView, StatusBar, Platform } from "react-native"
import router from "./router/index"
import { NavigationContainer } from '@react-navigation/native';

const background = Platform.Version >= 23 ? "#fff":'gray'
console.disableYellowBox = true
export default function App() {
  let route = router()
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={background} barStyle='dark-content' />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {route}
      </SafeAreaView>
    </NavigationContainer>
  );
}

