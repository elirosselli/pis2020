import React, { useEffect } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import ENV from '../env';
import styles from './styles';
import LogoAgesicSimple from '../images/logoAgesicSimple.png';

const LoginButton = () => {
  const { sdkIdUClientId } = ENV();

  // Used for debug
  const handleOpenURL = event => {
    console.log(event.url);
    const route = event.url.replace(/.*?:\/\//g, '');
    console.log(route);
    const code = route.match(/\/[^/]+\/?code=([^&]*)/)[1];
    console.log(`Code: ${code}`);
    const state = route.match(/\/[^/]+\/?state=([^&]*)/)[1];
    console.log(`State: ${state}`);
    getToken(1, 1, code);
  };

  useEffect(() => {
    Linking.addEventListener('url', handleOpenURL);
    return () => {
      Linking.removeEventListener('url', handleOpenURL);
    };
  }, [handleOpenURL]);

  const handleLogin = () =>
    Linking.openURL(
      `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${sdkIdUClientId}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
    );

  const getToken = (clientId, clientSecret, authCode) => {
    console.log(authCode);
    RNFetchBlob.config({ trusty: true })
      .fetch(
        'POST',
        'https://auth-testing.iduruguay.gub.uy/oidc/v1/token',
        {
          Authorization:
            'Basic ODk0MzI5OmNkYzA0ZjE5YWMwZjI4ZmIzZTFjZTZkNDJiMzdlODVhNjNmYjhhNjU0NjkxYWE0NDg0YjZiOTRi==',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: 'application/json',
        },
        `grant_type=authorization_code&code=${authCode}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
      )
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(function (error) {
        console.log(`Hubo un problema con la petición Fetch:${error.message}`);
      });
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
