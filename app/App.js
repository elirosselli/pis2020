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

import LoginButton from './LoginButton';

import LogoAgesic from './images/logo-agesic.png';
import LogoGubUy from './images/logoGubUy.png';

import styles from './app-styles';

import ENV from './env';

const { sdkIdUClientId, sdkIdUClientSecret } = ENV();

const App = () => (
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      <Text numberOfLines={2} style={styles.title}>
        App{'\n'}Prototipo
      </Text>
      <View style={styles.titleSeparator} />
    </View>
    <View style={styles.loginContainer}>
      <LoginButton
        sdkIdUClientId={sdkIdUClientId}
        sdkIdUClientSecret={sdkIdUClientSecret}
      />
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
