/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {initialize, login, logout, getToken, refreshToken, getUserInfo} from 'sdk-gubuy-test';
import styles from './styles';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TouchableOpacity
} from 'react-native';

//const {performance} = require('perf_hooks');

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {

  handleInit = async() => {
    console.log("Inicializando sdk");
    var now = require("performance-now")
    var start = now();
    initialize('sdkIdU.testing://auth', '894329', 'cdc04f19ac0f28fb3e1ce6d42b37e85a63fb8a654691aa4484b6b94b','sdkIdU.testing://redirect');
    console.log("Inicializado");
    var end = now();
    console.log(`Tiempo de ejec: ${end-start} ms`);
  }

  handleLogin = async() => {
    try {
      var now = require("performance-now")
      var start = now();
      const code = await login();
      console.log(`Code: ${code}`);
      var end = now();
      console.log(`Tiempo de ejec: ${end-start} ms`);
    } catch (error) {
      console.log(error);
      console.log("Error");
    }
  }

  handleGetToken = async() => {
    try {
      var now = require("performance-now")
      var start = now();
      const token = await getToken();
      console.log(`Token: ${token}`);
      var end = now();
      console.log(`Tiempo de ejec: ${end-start} ms`);
    } catch (error) {
      console.log(error);
      console.log("Error");
    }
  }

  handleRefreshToken = async() => {
    try {
      var now = require("performance-now")
      var start = now();
      const rfToken = await refreshToken();
      console.log(`Token: ${rfToken}`);
      var end = now();
      console.log(`Tiempo de ejec: ${end-start} ms`);
    } catch (error) {
      console.log(error);
      console.log("Error");
    }
  }

  handleGetUserInfo = async() => {
    try {
      var now = require("performance-now")
      var start = now();
      const info = await getUserInfo();
      console.log(`Nombre: ${info.primer_nombre}`);
      console.log(`Sdo Nombre: ${info.segundo_nombre}`);
      console.log(`Apellido: ${info.primer_apellido}`);
      console.log(`Sdo Apellido: ${info.segundo_apellido}`);
      console.log(`Documento: ${info.documento}`);
      var end = now();
      console.log(`Tiempo de ejec: ${end-start} ms`);
    } catch (error) {
      console.log(error);
      console.log("Error");
    }
  }

  

  handleLogout = async() => {
    var now = require("performance-now")
    var start = now();
    try{
      await logout();
      var end = now();
      console.log(`Sesión cerrada.`)
      console.log(`Tiempo de ejec: ${end-start} ms`);
    } catch (error){
      console.log(`Error: ${error}`)
    }
  }
  return (
    <>
      <View>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleInit}>
          <Text style={styles.buttonText}>Initialize</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleGetToken}>
          <Text style={styles.buttonText}>getToken</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleRefreshToken}>
          <Text style={styles.buttonText}>refreshToken</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleGetUserInfo}>
          <Text style={styles.buttonText}>getUserInfo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};


export default App;
