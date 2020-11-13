/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {initialize, login, logout, getToken, refreshToken, getUserInfo, setParameters, resetParameters} from 'sdk-gubuy-test';
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
    const init = initialize('sdkIdU.testing://auth', '894329', 'cdc04f19ac0f28fb3e1ce6d42b37e85a63fb8a654691aa4484b6b94b','sdkIdU.testing://redirect');
    Object.keys(init).forEach(key => {
      console.log(`${key}: ${init[key]}`);
    });
    setParameters({scope: "personal_info"});
    console.log("Inicializado");
    var end = now();
    console.log(`Tiempo de ejec: ${end-start} ms`);
  }

  handleLogin = async() => {
    try {
      var now = require("performance-now")
      var start = now();
      const code = await login();
      Object.keys(code).forEach(key => {
        console.log(`${key}: ${code[key]}`);
      });
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

      console.log(token)
      Object.keys(token).forEach(key => {
        console.log(`${key}: ${token[key]}`);
      });
      var end = now();
      console.log(`Tiempo de ejec: ${end-start} ms`);
    } catch (error) {
      console.log("Error");
    }
  }

  handleRefreshToken = async() => {
    try {
      var now = require("performance-now")
      var start = now();
      
      const rfToken = await refreshToken();
      Object.keys(rfToken).forEach(key => {
        console.log(`${key}: ${rfToken[key]}`);
      });
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
      Object.keys(info).forEach(key => {
        console.log(`${key}: ${info[key]}`);
      });
      
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
      const resp = await logout();
      var end = now();
      Object.keys(resp).forEach(key => {
        console.log(`${key}: ${resp[key]}`);
      });
      console.log(`Sesión cerrada.`)
      console.log(`Tiempo de ejec: ${end-start} ms`);
    } catch (error){
      console.log(`Error: ${error}`)
    }
  }

  handleProfiler = async() => {
    var cantEjecuciones = 10;
    console.log(``);
    console.log(``);
    console.log(`---------Iniciando Profiler---------`);
    console.log(`Promedio de ${cantEjecuciones} ejecuciones.`);
    console.log(`Se requerira que inicie sesion en el navegador para poder realizar las pruebas.`);
    try {
      initialize('sdkIdU.testing://auth', '894329', 'cdc04f19ac0f28fb3e1ce6d42b37e85a63fb8a654691aa4484b6b94b','sdkIdU.testing://redirect');
      setParameters({scope: 'personal_info'});
      await login();
      console.log(`Login realizado.`);
      console.log(`Comienzo de ejecucion de las pruebas.`);
      
      resetParameters();
      var tTotal = 0;
      var prom = 0;
      var now = require("performance-now");
      var start, end;

      //Prueba para inicializar
      for (let index = 0; index < cantEjecuciones; index++) {
        start = now();
        initialize('sdkIdU.testing://auth', '894329', 'cdc04f19ac0f28fb3e1ce6d42b37e85a63fb8a654691aa4484b6b94b','sdkIdU.testing://redirect');
        end = now();
        tTotal = tTotal + (end - start);
        //sleep(100);
        resetParameters();
      }
      prom = tTotal / 10;
      console.log(`Initialize:    ${prom} ms`);

      initialize('sdkIdU.testing://auth', '894329', 'cdc04f19ac0f28fb3e1ce6d42b37e85a63fb8a654691aa4484b6b94b','sdkIdU.testing://redirect');
      setParameters({scope: 'personal_info'});
      sleep(100);
      //Prueba para login
      tTotal = 0;
      for (let index = 0; index < cantEjecuciones; index++) {
        const resp = await login();
        tTotal = tTotal + resp.tiempo;
        sleep(200);
      }
      prom = tTotal / 10;
      console.log(`Login:    ${prom} ms`);

      //Prueba para getToken
      tTotal = 0;
      for (let index = 0; index < cantEjecuciones; index++) {
        const resp = await getToken();
        tTotal = tTotal + resp.tiempo;
        sleep(200);
        await login();
      }
      prom = tTotal / 10;
      console.log(`getToken:    ${prom} ms`);

      //Prueba para refreshToken
      await getToken();
      tTotal = 0;
      for (let index = 0; index < cantEjecuciones; index++) {
        const resp = await refreshToken();
        tTotal = tTotal + resp.tiempo;
        sleep(200);
      }
      prom = tTotal / 10;
      console.log(`refreshToken:    ${prom} ms`);

      //Prueba para getUserInfo
      tTotal = 0;
      for (let index = 0; index < cantEjecuciones; index++) {
        const resp = await getUserInfo();
        tTotal = tTotal + resp.tiempo;
        sleep(200);
      }
      prom = tTotal / 10;
      console.log(`getUserInfo:    ${prom} ms`);

      //Prueba para logout
      tTotal = 0;
      await login();
      await getToken();
      for (let index = 0; index < cantEjecuciones; index++) {
        const resp = await logout();
        tTotal = tTotal + resp.tiempo;
        sleep(200);
        await login();
        await getToken();
      }
      prom = tTotal / 10;
      console.log(`logout:    ${prom} ms`);

    } catch (error) {
      console.log(`Error: ${error}`);
      console.log(`Hubo un error en la ejecucion del profiler, intentelo nuevamente.`);
    }
    
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        <TouchableOpacity style={styles.buttonContainer} onPress={handleProfiler}>
          <Text style={styles.buttonText}>Analizar tiempos</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};


export default App;
