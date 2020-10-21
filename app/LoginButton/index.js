/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// istanbul ignore file
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { login, getParameters } from 'sdk-gubuy-test';

import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';

const LoginButton = ({ handleCode }) => {
  const handleButton = async () => {
    const parameters = getParameters();
    if (parameters.code === '') await handleLogin();
  };
  const handleLogin = async () => {
    try {
      const code = await login();
      console.log(`Code: ${code}`);
      handleCode(code);
      // Guardo Info de usuario en la APP
    } catch (err) {
      console.log(err);
      const parameters = getParameters();
      console.log(parameters);
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
