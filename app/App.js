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

import CheckboxList from 'rn-checkbox-list';

import { initialize } from 'sdk-gubuy-test';
import { getToken, getUserInfo, refreshToken } from 'sdk-gubuy-test';

import LoginButton from './LoginButton';

import LogoAgesic from './images/logo-agesic.png';
import LogoGubUy from './images/logoGubUy.png';

import styles from './app-styles';

import ENV from './env';

import scope from './scope';

import ReloadIcon from './utils/reload.png';

const { sdkIdUClientId, sdkIdUClientSecret } = ENV();

const App = () => {
  const [code, setCode] = useState();
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [scopeSel, setScopeSel] = useState('');

  const doUpdate = someNewValue => {
    setTimeout(() => {
      setScopeSel(someNewValue);
    }, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text numberOfLines={2} style={styles.title}>
          App{'\n'}Prototipo
        </Text>
        <View style={styles.titleSeparator} />
      </View>
      <View style={styles.loginContainer}>
        {!code && <LoginButton handleCode={setCode} />}
        {!code && (
          <View
            style={[
              styles.informationContainer,
              { width: '80%', paddingLeft: 0, paddingRight: 0 },
            ]}
          >
            <Text numberOfLines={2} style={styles.informationTitle}>
              Scope
            </Text>
            <View style={styles.informationSeparator} />
            <View style={{ minHeight: '35%' }}>
              <Text>{scopeSel}</Text>
              <CheckboxList
                listItems={scope}
                listItemStyle={{
                  padding: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}
                onChange={({ a, items }) => {
                  doUpdate(() => {
                    if (Array.isArray(items) && items.length > 0) {
                      return items
                        .map(val => val.name)
                        .reduce((acum, curr) => `${acum}  ${curr}`);
                    }
                    return '';
                  });
                }}
                theme="#005492"
              />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#222',
                  padding: 5,
                  width: '40%',
                  borderColor: '#000',
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                onPress={() => {
                  initialize(
                    'sdkIdU.testing%3A%2F%2Fauth',
                    sdkIdUClientId,
                    sdkIdUClientSecret,
                    'sdkIdU.testing://redirect',
                    scopeSel,
                  );
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                  }}
                >
                  Inicializar SDK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {code && (
          <View style={styles.logoutContainer}>
            {/* <Text style={styles.logoutContCodeText}>Code: {code}</Text> */}
            <TouchableOpacity
              style={styles.logoutContTouch}
              onPress={async () => {
                setCode();
                setToken(null);
                setUserInfo({});
              }}
            >
              <Text style={styles.logoutContText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}

        {code && (
          <ScrollView style={styles.informationContainer}>
            {/* Code */}
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} style={styles.informationTitle}>
                Code
              </Text>
              <View style={styles.informationSeparator} />
              <View style={styles.infoContainer}>
                <ScrollView
                  style={{
                    width: '100%',
                    padding: 10,
                  }}
                >
                  <Text style={styles.infoHeader}>auth_code</Text>
                  <Text style={{ fontSize: 12 }}>{code}</Text>
                </ScrollView>
              </View>
            </View>

            {/* Token */}
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} style={styles.informationTitle}>
                Token
              </Text>
              <View style={styles.informationSeparator} />
              <View style={styles.infoContainer}>
                {token == null && (
                  <TouchableOpacity
                    style={[styles.infoBtn]}
                    onPress={async () => {
                      setToken(await getToken());
                    }}
                  >
                    <Text style={styles.infoBtnText}>GET TOKEN</Text>
                  </TouchableOpacity>
                )}
                {token != null && (
                  <View
                    style={{
                      width: '100%',
                      padding: 10,
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={async () => {
                          setToken(await refreshToken());
                        }}
                      >
                        <Image
                          style={{ height: 15, width: 15, alignSelf: 'center' }}
                          source={ReloadIcon}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 9 }}>
                      <Text style={styles.infoHeader}>access_token</Text>
                      <Text style={{ fontSize: 12 }}>{token}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* User Info */}
            <View style={{ flex: 2 }}>
              <Text numberOfLines={2} style={styles.informationTitle}>
                UserInfo
              </Text>
              <View style={styles.informationSeparator} />
              <View style={styles.infoContainer}>
                {/* Mostrar boton */}
                {Object.keys(userInfo).length === 0 && (
                  <TouchableOpacity
                    style={styles.infoBtn}
                    onPress={async () => {
                      setUserInfo(await getUserInfo());
                    }}
                  >
                    <Text style={styles.infoBtnText}>GET USER INFO</Text>
                  </TouchableOpacity>
                )}

                {Object.keys(userInfo).length > 0 && (
                  <ScrollView
                    style={{
                      width: '100%',
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    {Object.keys(scope).map(key => {
                      if (scope[key].data.some(val => userInfo[val])) {
                        return (
                          <View key={scope[key].id}>
                            <Text style={styles.infoHeader}>
                              {scope[key].name}
                            </Text>
                            <View style={styles.informationSeparatorBlue} />
                            {scope[key].data.map(val => (
                              <View
                                style={{
                                  borderBottomWidth: 1,
                                  borderColor: '#ecf0f1',
                                }}
                                key={val}
                              >
                                <Text style={{ fontWeight: 'bold' }}>
                                  {val}
                                </Text>
                                <Text style={{ fontSize: 12 }}>
                                  {String(userInfo[val])}
                                </Text>
                              </View>
                            ))}
                          </View>
                        );
                      }
                      return null;
                    })}
                  </ScrollView>
                )}
              </View>
            </View>
          </ScrollView>
        )}
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
