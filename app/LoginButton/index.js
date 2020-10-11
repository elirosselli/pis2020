/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// istanbul ignore file
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { login, getToken, getParameters } from 'sdk-gubuy-test';

import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      const code = await login();
      console.log(`Code: ${code}`);
      const parameters = getParameters();
      console.log(parameters);
      const token = await getToken(code);
      console.log(token);
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

export default LoginButton;
