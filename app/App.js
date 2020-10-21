/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { initialize } from 'sdk-gubuy-test';

import LoginButton from './LoginButton';

import LogoAgesic from './images/logo-agesic.png';
import LogoGubUy from './images/logoGubUy.png';

import styles from './app-styles';

import ENV from './env';

const { sdkIdUClientId, sdkIdUClientSecret } = ENV();

initialize(
  'sdkIdU.testing%3A%2F%2Fauth',
  sdkIdUClientId,
  sdkIdUClientSecret,
  'sdkIdU.testing://redirect',
);

const App = () => {
  const [userInfo, setUserInfo] = useState({});
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text numberOfLines={2} style={styles.title}>
          App{'\n'}Prototipo
        </Text>
        <View style={styles.titleSeparator} />
      </View>
      <View style={styles.loginContainer}>
<<<<<<< HEAD
        <LoginButton handleUserInfo={setUserInfo} />
=======
        {!userInfo.nombre_completo && (
          <LoginButton handleUserInfo={setUserInfo} />
        )}
        {userInfo.nombre_completo && <Text> Logout </Text>}
>>>>>>> Get user Info
        <ScrollView style={styles.informationContainer}>
          <Text numberOfLines={2} style={styles.informationTitle}>
            Información
          </Text>
          <View style={styles.informationSeparator} />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec
          </Text>
<<<<<<< HEAD
          {userInfo && userInfo.nombre_completo && (
=======
          {userInfo.nombre_completo && (
>>>>>>> Get user Info
            <Text>Hola: {userInfo.nombre_completo}</Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            Linking.openURL('https://agesic.gub.uy');
          }}
        >
          <Image source={LogoAgesic} style={styles.logosContainer} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }}>
          <Image source={LogoGubUy} style={styles.logosContainer} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;
