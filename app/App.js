/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Switch,
} from 'react-native';

import CheckboxList from 'rn-checkbox-list';

import {
  initialize,
  getToken,
  getUserInfo,
  refreshToken,
  logout,
  setParameters,
  validateToken,
} from 'sdk-gubuy-test';

import LoginButton from './LoginButton';

import LogoAgesic from './images/logo-agesic.png';
import LogoGubUy from './images/logoGubUy.png';

import styles from './app-styles';

import ENV from './env';

import scope from './scope';

import CheckIcon from './utils/check.png';
import CorrectIcon from './utils/correct.png';
import WrongIcon from './utils/wrong.png';
import ReloadIcon from './utils/reload.png';

const envVariables = ENV();

const App = () => {
  const [code, setCode] = useState();
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [scopeSel, setScopeSel] = useState('');
  const [updated, setUpdated] = useState(0);
  const [initialized, setInitialized] = useState(0);
  const [refreshTokenLoading, setRefreshTokenLoading] = useState(false);
  const [sdkProduction, setIsEnabled] = useState(false);
  const [validateTokenResult, setValidateTokenResult] = useState(0);
  
  const toggleSwitch = () => {
    setInitialized(0);
    setIsEnabled(previousState => !previousState);
  };

  const { sdkIdUClientId, sdkIdUClientSecret } = sdkProduction
    ? envVariables.production
    : envVariables.development;
  const sdkRedirectUri = sdkProduction
    ? 'sdkIdUy%3A%2F%2Fauth'
    : 'sdkIdU.testing%3A%2F%2Fauth';
  const sdkPostLogoutRedirectUri = sdkProduction
    ? 'sdkIdUy://logout'
    : 'sdkIdU.testing://redirect';

  const doUpdate = someNewValue => {
    setTimeout(() => {
      if (someNewValue() !== scopeSel) {
        setScopeSel(someNewValue);
        setUpdated(0);
      }
    }, 0);
  };

  const errorColor =
    (updated === 0 && { backgroundColor: '#222' }) ||
    (updated === 1 && { backgroundColor: '#2ecc71' }) ||
    (updated === -1 && { backgroundColor: '#e74c3c' });

  const initializedColor =
    (initialized === 0 && { backgroundColor: '#222' }) ||
    (initialized === 1 && { backgroundColor: '#2ecc71' }) ||
    (initialized === -1 && { backgroundColor: '#e74c3c' });

  const validateStatus =
    (validateTokenResult === 0 && CheckIcon) ||
    (validateTokenResult === 1 && CorrectIcon) ||
    (validateTokenResult === -1 && WrongIcon);
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
          <LoginButton handleCode={setCode} notActive={initialized !== 1} />
        )}
        {!code && (
          <View
            style={[
              styles.informationContainer,
              { width: '80%', paddingLeft: 0, paddingRight: 0 },
            ]}
          >
            {/* INICIALIZAR SDK */}
            <View
              style={{
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}
            >
              <View
                style={{ flex: 1, flexDirection: 'row', alignSelf: 'center' }}
              >
                <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>
                  Producción
                </Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#3a6a8c' }}
                  thumbColor={sdkProduction ? '#005492' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={sdkProduction}
                />
              </View>
              <TouchableOpacity
                style={[
                  {
                    padding: 5,
                    width: '40%',
                    borderColor: '#000',
                    borderWidth: 1,
                    borderRadius: 5,
                    alignSelf: 'flex-end',
                    flex: 1,
                  },
                  initializedColor,
                ]}
                onPress={() => {
                  try {
                    initialize(
                      sdkRedirectUri,
                      sdkIdUClientId,
                      sdkIdUClientSecret,
                      sdkPostLogoutRedirectUri,
                      sdkProduction,
                    );
                    setParameters({ state: '9JoSGrmWYy' });
                    setInitialized(1);
                  } catch (error) {
                    console.log(error);
                    setInitialized(-1);
                  }
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
            <Text numberOfLines={2} style={styles.informationTitle}>
              Scope
            </Text>
            <View style={styles.informationSeparator} />
            <View style={{ minHeight: '35%' }}>
              <CheckboxList
                listItems={scope}
                listItemStyle={{
                  padding: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}
                onChange={({ items }) => {
                  doUpdate(() => {
                    if (Array.isArray(items) && items.length > 0) {
                      const res = items
                        .map(val => val.name)
                        .reduce((acum, curr) => `${acum}  ${curr}`);
                      return res;
                    }
                    return '';
                  });
                }}
                theme="#005492"
              />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <TouchableOpacity
                style={[
                  {
                    padding: 5,
                    width: '40%',
                    borderColor: '#000',
                    borderWidth: 1,
                    borderRadius: 5,
                  },
                  errorColor,
                ]}
                onPress={() => {
                  try {
                    setParameters({ scope: scopeSel });
                    setUpdated(1);
                  } catch (error) {
                    console.log(error);
                    setUpdated(-1);
                  }
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                  }}
                >
                  Guardar scope
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {code && (
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutContTouch}
              onPress={async () => {
                try {
                  await logout();
                  setCode();
                  setToken(null);
                  setUserInfo({});
                } catch (err) {
                  console.log(err);
                }
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
                      try {
                        const respGetToken = await getToken();
                        setToken(respGetToken.accessToken);
                      } catch (err) {
                        console.log(err.errorCode, err.errorDescription);
                      }
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
                        flex: 3,
                        flexDirection: 'row',
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                        }}
                        onPress={async () => {
                          try {
                            const respValidateToken = await validateToken();
                            console.log(respValidateToken);
                            setValidateTokenResult(1);
                          } catch (err) {
                            setValidateTokenResult(-1);
                            console.log(err.errorCode, err.errorDescription);
                          }
                        }}
                      >
                        <Image
                          style={{ height: 15, width: 15, alignSelf: 'center' }}
                          source={validateStatus}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#ecf0f1',
                          flex: 1,
                        }}
                        onPress={async () => {
                          try {
                            setRefreshTokenLoading(true);
                            const respRefreshToken = await refreshToken();
                            setToken(respRefreshToken.refreshToken);
                            setRefreshTokenLoading(false);
                            setValidateTokenResult(0);
                          } catch (err) {
                            console.log(err.errorCode, err.errorDescription);
                          }
                        }}
                        disabled={refreshTokenLoading}
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
                      try {
                        setUserInfo(await getUserInfo());
                      } catch (err) {
                        console.log(err);
                      }
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
