/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// istanbul ignore file
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import {
  login,
  logout,
  getParameters,
  getToken,
  getUserInfo,
  refreshToken,
} from 'sdk-gubuy-test';

import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';

const LoginButton = ({ handleUserInfo }) => {
  const handleButton = async () => {
    const parameters = getParameters();
    if (parameters.code === '') await handleLogin();
    else {
      await handleLogout();
      handleUserInfo(null);
    }
  };
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
      console.log(`User Info: ${userInfo.nombre_completo}`);
      // Guardo Info de usuario en la APP
      handleUserInfo(userInfo);
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
  handleUserInfo: PropTypes.func.isRequired,
};

export default LoginButton;
