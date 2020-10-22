/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// istanbul ignore file
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View, Alert } from 'react-native';
import { login, logout, getParameters } from 'sdk-gubuy-test';

import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';

const LoginButton = ({ handleCode, notActive }) => {
  const handleButton = async () => {
    if (notActive) {
      Alert.alert(
        'SDK Alert',
        'SDK no inicializado',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: true },
      );
    } else {
      const parameters = getParameters();
      if (parameters.code === '') await handleLogin();
      else {
        await handleLogout();
        handleCode('');
      }
    }
  };
  const handleLogin = async () => {
    try {
      const code = await login();
      handleCode(code);
      // Guardo Info de usuario en la APP
    } catch (err) {
      console.log(err);
      const parameters = getParameters();
      console.log(parameters);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
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

LoginButton.propTypes = {
  handleCode: PropTypes.func.isRequired,
  notActive: PropTypes.bool.isRequired,
};

export default LoginButton;
