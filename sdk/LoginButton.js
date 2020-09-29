/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';
import { login } from './requests';

const LoginButton = ({ sdkIdUClientId }) => {
  const handleLogin = async () => {
    try {
      const code = await login(sdkIdUClientId);
      console.log(code);
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
};

export default LoginButton;
