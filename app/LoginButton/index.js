/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// istanbul ignore file
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
<<<<<<< HEAD
import { login, logout, getParameters } from 'sdk-gubuy-test';
=======
import { login, getParameters } from 'sdk-gubuy-test';
>>>>>>> 8bbb08b8512d2f82efe8862f4d49b8892de8cc21

import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';

const LoginButton = ({ handleCode }) => {
  const handleButton = async () => {
    const parameters = getParameters();
    if (parameters.code === '') await handleLogin();
<<<<<<< HEAD
    else {
      await handleLogout();
      handleCode(null);
    }
=======
>>>>>>> 8bbb08b8512d2f82efe8862f4d49b8892de8cc21
  };
  const handleLogin = async () => {
    try {
      const code = await login();
<<<<<<< HEAD
=======
      console.log(`Code: ${code}`);
>>>>>>> 8bbb08b8512d2f82efe8862f4d49b8892de8cc21
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
};

export default LoginButton;
