/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// istanbul ignore file
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { login, getToken, getParameters, logout } from 'sdk-gubuy-test';
import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';

const stateLog = 'loggedOut'; //  cambiar a loggedIn una vez loggeado, y de nuevo a loggedOut una vez hecho el log out
const idToken = ''; //  poner idToken obtenido con Postman

const LoginButton = () => {
  const handleButton = async () => {
    const parameters = getParameters();
    if (parameters.code === '' || parameters.code === 'empty')
      await handleLogin();
    else await handleLogout();
  };
  const handleLogin = async () => {
    try {
      const code = await login();
      console.log(`Code: ${code}`);
      const token = await getToken();
      console.log(`Token: ${token}`);
      const parameters = getParameters();
      console.log(parameters);
    } catch (err) {
      console.log(err);
      const parameters = getParameters();
      console.log(parameters);
    }
  };

  const handleLogout = async () => {
    try {
      const redirectUri = await logout();
      console.log(redirectUri);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleButton}>
      <View style={styles.buttonSeparator}>
        <Image source={LogoAgesicSimple} style={styles.buttonLogo} />
      </View>
      <Text style={styles.buttonText}>Login con USUARIO gub.uy</Text>
    </TouchableOpacity>
  );
};

export default LoginButton;
