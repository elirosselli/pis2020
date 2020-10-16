/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { initialize, setParameters } from 'sdk-gubuy-test';

import LoginButton from './LoginButton';

import LogoAgesic from './images/logo-agesic.png';
import LogoGubUy from './images/logoGubUy.png';

import styles from './app-styles';

import ENV from './env';

const { sdkIdUClientId, sdkIdUClientSecret } = ENV();

initialize('sdkIdU.testing%3A%2F%2Fauth', sdkIdUClientId, sdkIdUClientSecret);

setParameters({ postLogoutRedirectUri: 'sdkIdU.testing://redirect' });

const App = () => (
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      <Text numberOfLines={2} style={styles.title}>
        App{'\n'}Prototipo
      </Text>
      <View style={styles.titleSeparator} />
    </View>
    <View style={styles.loginContainer}>
      <LoginButton />
      <ScrollView style={styles.informationContainer}>
        <Text numberOfLines={2} style={styles.informationTitle}>
          Información
        </Text>
        <View style={styles.informationSeparator} />
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec
        </Text>
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

export default App;
