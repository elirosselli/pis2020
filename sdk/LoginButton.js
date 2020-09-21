/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import LogoAgesicSimple from './images/logoAgesicSimple.png';
<<<<<<< HEAD
import { login } from './requests';

const LoginButton = ({ sdkIdUClientId }) => {
=======
import { login } from './requests/requests';

const LoginButton = ({ sdkIdUClientId }) => {
  // Used for debug
  const handleOpenURL = event => {
    console.log(event.url);
    const route = event.url.replace(/.*?:\/\//g, '');
    console.log(route);
    const code = route.match(/\/[^/]+\/?code=([^&]*)/)[1];
    console.log(`Code: ${code}`);
    const state = route.match(/\/[^/]+\/?state=([^&]*)/)[1];
    console.log(`State: ${state}`);
  };

  useEffect(() => {
    Linking.addEventListener('url', handleOpenURL);
    return () => {
      Linking.removeEventListener('url', handleOpenURL);
    };
  }, [handleOpenURL]);

>>>>>>> bf8e1072... Import only login funciton instead of all sdk functions to LoginButton
  const handleLogin = () => login(sdkIdUClientId);

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
