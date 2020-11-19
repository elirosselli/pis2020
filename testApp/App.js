/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {initialize, login, logout, getToken, refreshToken, getUserInfo, setParameters, resetParameters, validateToken} from 'sdk-gubuy-test';
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
    const init = initialize('sdkIdU.testing://auth', '894329', 'cdc04f19ac0f28fb3e1ce6d42b37e85a63fb8a654691aa4484b6b94b', false, 'personal_info');
    //console.log(init);
    //setParameters({'scope': 'personal_info'});
    console.log(`ErrorName: ${init.name}`)
    console.log(`ErrorCode: ${init.errorCode}`)
    console.log(`ErrorDescription: ${init.errorDescription}`)
    console.log(`ErrorMessage: ${init.message}`)
    
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
      console.log(`ErrorName: ${error.name}`)
      console.log(`ErrorCode: ${error.errorCode}`)
      console.log(`ErrorDescription: ${error.errorDescription}`)
      //console.log(error);
    }
  }

  handleGetToken = async() => {
    try {
      var now = require("performance-now")
      var start = now();
      const token = await getToken();
      Object.keys(token).forEach(key => {
        console.log(`${key}: ${token[key]}`);
      });
      var end = now();
      console.log(`Tiempo de ejec: ${end-start} ms`);
    } catch (error) {
      console.log(`ErrorName: ${error.name}`)
      console.log(`ErrorCode: ${error.errorCode}`)
      console.log(`ErrorDescription: ${error.errorDescription}`)
      //console.log(error);
      
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
      console.log(`ErrorName: ${error.name}`)
      console.log(`ErrorCode: ${error.errorCode}`)
      console.log(`ErrorDescription: ${error.errorDescription}`)
      //console.log(error);
    }
  }

  handleValidate = async() => {
    try {
      var now = require("performance-now")
      var start = now();
      
      const resp = await validateToken();
      Object.keys(resp).forEach(key => {
        console.log(`${key}: ${resp[key]}`);
      });
      var end = now();
      console.log(`Tiempo de ejec: ${end-start} ms`);
    } catch (error) {
      console.log(`ErrorName: ${error.name}`)
      console.log(`ErrorCode: ${error.errorCode}`)
      console.log(`ErrorDescription: ${error.errorDescription}`)
      //console.log(error);
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
      console.log(`ErrorName: ${error.name}`)
      console.log(`ErrorCode: ${error.errorCode}`)
      console.log(`ErrorDescription: ${error.errorDescription}`)
      //console.log(error);
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
      console.log(`ErrorName: ${error.name}`)
      console.log(`ErrorCode: ${error.errorCode}`)
      console.log(`ErrorDescription: ${error.errorDescription}`)
      //console.log(error);
    }
  }

  handleProfiler = async() => {
    var cantEjecuciones = 10;
    var tEspera = 1000;
    console.log(``);
    console.log(``);
    console.log(`---------Iniciando Profiler---------`);
    console.log(`Promedio de ${cantEjecuciones} ejecuciones.`);
    console.log(`Se requerira que inicie sesion en el navegador para poder realizar las pruebas.`);
    try {
      var tInit = 0;
      var tLogin =0;
      var tGetToken = 0;
      var tRefreshToken = 0;
      var tValidateToken = 0;
      var tUserInfo = 0;
      var tLogout = 0;
      var now = require("performance-now");
      for (let i = 0; i < cantEjecuciones; i ++){
        var start = now();
        initialize('sdkIdU.testing://auth', '894329', 'cdc04f19ac0f28fb3e1ce6d42b37e85a63fb8a654691aa4484b6b94b', false, 'personal_info');
        var end = now();
        tInit += end - start;

        sleep(tEspera);
        
        //Prueba para login
        const resp = await login();
        tLogin = tLogin + resp.tiempo;

        sleep(tEspera);

        //Prueba para getToken
        resp = await getToken();
        tGetToken = tGetToken + resp.tiempo;

        sleep(tEspera);

        resp = await validateToken();
        tValidateToken = tValidateToken + resp.tiempo;

        sleep(tEspera);

        //Prueba para refreshToken
        resp = await refreshToken();
        tRefreshToken = tRefreshToken + resp.tiempo;

        sleep(tEspera);


        //Prueba para getUserInfo
        resp = await getUserInfo();
        tUserInfo = tUserInfo + resp.tiempo;

        sleep(tEspera);

        //Prueba para logout
        resp = await logout();
        tLogout = tLogout + resp.tiempo;

        sleep(tEspera);
      }

      tInit = tInit / cantEjecuciones;
      console.log(`Initialize: ${tInit}`);
      tLogin = tLogin / cantEjecuciones;
      console.log(`Login: ${tLogin}`);
      tGetToken = tGetToken / cantEjecuciones;
      console.log(`Get Token: ${tGetToken}`);
      tRefreshToken = tRefreshToken / cantEjecuciones;
      console.log(`Refresh Token: ${tRefreshToken}`);
      tValidateToken = tValidateToken / cantEjecuciones;
      console.log(`Validate Token: ${tValidateToken}`);
      tUserInfo = tUserInfo / cantEjecuciones;
      console.log(`User Info: ${tUserInfo}`);
      tLogout = tLogout / cantEjecuciones;
      console.log(`Log out: ${tLogout}`);
    } catch (error) {
      console.log(error.name);
      console.log(error.errorCode);
      console.log(error.errorDescription);
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
        <TouchableOpacity style={styles.buttonContainer} onPress={handleValidate}>
          <Text style={styles.buttonText}>Validar Token</Text>
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
