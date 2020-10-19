/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// istanbul ignore file
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import {
  login,
  getParameters,
  getToken,
  getUserInfo,
  refreshToken,
} from 'sdk-gubuy-test';

import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';

const LoginButton = ({ handleUserInfo, handleCode }) => {
  const handleLogin = async () => {
    try {
      const code = await login();
      console.log(`Code: ${code}`);
      const token = await getToken();
      console.log(`Token: ${token}`);
      const newToken = await refreshToken();
      console.log(`New Token: ${newToken}`);
      const parameters = getParameters();
      console.log(parameters);
      const userInfo = await getUserInfo();
      console.log('User Info', userInfo);
      // Guardo Info de usuario en la APP
      handleUserInfo(userInfo);
      handleCode(code);
    } catch (err) {
      console.log(err);
      const parameters = getParameters();
      console.log(parameters);
    }
  };

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
      <View style={styles.buttonSeparator}>
        <Image source={LogoAgesicSimple} style={styles.buttonLogo} />
      </View>
      <Text style={styles.buttonText}>Login con USUARIO gub.uy</Text>
    </TouchableOpacity>
  );
};

LoginButton.propTypes = {
  handleUserInfo: PropTypes.func.isRequired,
  handleCode: PropTypes.func.isRequired,
};

export default LoginButton;
