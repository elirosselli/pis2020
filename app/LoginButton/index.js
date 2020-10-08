/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// istanbul ignore file
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { login, getToken } from 'sdk-gubuy-test';

import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';

const LoginButton = ({ sdkIdUClientId, sdkIdUClientSecret }) => {
  const handleLogin = async () => {
    try {
      const code = await login(sdkIdUClientId);
      console.log(code);
      const token = await getToken(code, sdkIdUClientId, sdkIdUClientSecret);
      console.log(token);
    } catch (err) {
      console.log(err);
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
  sdkIdUClientId: PropTypes.string.isRequired,
  sdkIdUClientSecret: PropTypes.string.isRequired,
};

export default LoginButton;
