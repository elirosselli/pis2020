/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {initialize, login, logout, getToken, refreshToken, getUserInfo, validateToken} from 'sdk-gubuy-test';
import styles from './styles';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';


const App: () => React$Node = () => {
  
  //Completar aqui con sus credenciales de testing
  var client_id = 'client_id';
  var redirect_uri = 'redirect_uri';
  var client_secret = 'client_secret';

  handleInit = async() => {
    console.log("Inicializando sdk");
    var now = require("performance-now")
    var start = now();
    try {
      const init = initialize(redirect_uri, client_id, client_secret, false, 'personal_info');
      console.log(`ErrorCode: ${init.errorCode}`);
      console.log(`ErrorDescription: ${init.errorDescription}`);
      var end = now();
      console.log(`Tiempo de ejec: ${end-start} ms`);
    } catch (error) {
      console.log(`ErrorCode: ${error.errorCode}`);
      console.log(`ErrorDescription: ${error.errorDescription}`);
    }
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
      console.log(`ErrorCode: ${error.errorCode}`);
      console.log(`ErrorDescription: ${error.errorDescription}`);
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
      console.log(`ErrorCode: ${error.errorCode}`);
      console.log(`ErrorDescription: ${error.errorDescription}`);
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
      console.log(`ErrorCode: ${error.errorCode}`);
      console.log(`ErrorDescription: ${error.errorDescription}`);
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
      console.log(`ErrorCode: ${error.errorCode}`);
      console.log(`ErrorDescription: ${error.errorDescription}`);
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
      console.log(`ErrorCode: ${error.errorCode}`);
      console.log(`ErrorDescription: ${error.errorDescription}`);
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
      console.log(`ErrorCode: ${error.errorCode}`);
      console.log(`ErrorDescription: ${error.errorDescription}`);
    }
  }

  handleProfiler = async() => {
    var cantEjecuciones = 10;
    var tEspera = 10;
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
        //Prueba para initialize
        var start = now();
        initialize(redirect_uri, client_id, client_secret, false, 'personal_info');
        var end = now();
        tInit += end - start;

        //Prueba para login
        const resp = await login();
        tLogin = tLogin + resp.tiempo;

        //Prueba para getToken
        resp = await getToken();
        tGetToken = tGetToken + resp.tiempo;

        //Prueba para validateToken
        resp = await validateToken();
        tValidateToken = tValidateToken + resp.tiempo;

        //Prueba para refreshToken
        resp = await refreshToken();
        tRefreshToken = tRefreshToken + resp.tiempo;

        //Prueba para getUserInfo
        resp = await getUserInfo();
        tUserInfo = tUserInfo + resp.tiempo;

        //Prueba para logout
        resp = await logout();
        tLogout = tLogout + resp.tiempo;
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
      console.log(error.errorCode);
      console.log(error.errorDescription);
      console.log(`Hubo un error en la ejecucion del profiler, intentelo nuevamente.`);
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
