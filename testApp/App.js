/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {initialize, login, logout, getToken, refreshToken, getUserInfo} from 'sdk-gubuy-test';

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
  
  llamarSDK = async () => {
    try {
      initialize('sdkIdU.testing%3A%2F%2Fauth', '894329', 'cdc04f19ac0f28fb3e1ce6d42b37e85a63fb8a654691aa4484b6b94b','sdkIdU.testing%3A%2F%2Fredirect');
      const code = await login();
      console.log("hola");
      console.log(`Code: ${code}`);
      const token = await getToken();
      console.log(`Token: ${token}`);
    } catch (error) {
      console.log(error);
      console.log("Error");
      
    }
  };
  
  llamarSDK();
  return (
    <>
      <View><Text>Hola</Text></View>
    </>
  );
};


export default App;
