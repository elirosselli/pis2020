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

initialize('sdkIdU.testing%3A%2F%2Fauth', sdkIdUClientId, sdkIdUClientSecret);

const App = () => {
  const [userInfo, setUserInfo] = useState({});
  const [code, setCode] = useState();
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text numberOfLines={2} style={styles.title}>
          App{'\n'}Prototipo
        </Text>
        <View style={styles.titleSeparator} />
      </View>
      <View style={styles.loginContainer}>
        {!code && (
          <LoginButton handleUserInfo={setUserInfo} handleCode={setCode} />
        )}
        {code && (
          <View style={styles.logoutContainer}>
            {/* <Text style={styles.logoutContCodeText}>Code: {code}</Text> */}
            <Text style={styles.logoutContText}>Logout</Text>
          </View>
        )}
        {code && (
          <View style={styles.informationContainer}>
            <View style={{ flex: 2 }}>
              <Text numberOfLines={2} style={styles.informationTitle}>
                Token
              </Text>
              <View style={styles.informationSeparator} />
              <View style={styles.infoContainer}>
                <TouchableOpacity style={styles.infoBtn}>
                  <Text style={styles.infoBtnText}>GET TOKEN</Text>
                </TouchableOpacity>
                {/* <ScrollView
                  style={{
                    width: '100%',
                    padding: 10,
                  }}
                >
                  <Text style={styles.infoHeader}>access_token</Text>
                  <Text style={{ fontSize: 12 }}>
                    aFDSAFASDFSDAFASDDFASFSAFSDAF
                  </Text>
                </ScrollView> */}
              </View>
            </View>
            <View style={{ flex: 4 }}>
              <Text numberOfLines={2} style={styles.informationTitle}>
                UserInfo
              </Text>
              <View style={styles.informationSeparator} />
              <View style={styles.infoContainer}>
                <TouchableOpacity style={styles.infoBtn}>
                  <Text style={styles.infoBtnText}>GET USER INFO</Text>
                </TouchableOpacity>
                {/* <ScrollView
                  style={{
                    width: '100%',
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                >
                  {Object.keys(userInfo).map((key, index) => (
                    <View key={index}>
                      <Text style={styles.infoHeader}>{key}</Text>
                      <Text style={{ fontSize: 12 }}>{userInfo[key]}</Text>
                    </View>
                  ))}
                </ScrollView> */}
              </View>
            </View>
          </View>
        )}

        {console.log(userInfo)}
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
