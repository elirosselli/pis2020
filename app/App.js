import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Linking} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export default function App() {
  const [token, setToken] = useState(null);
  const handleLogin = async () => {
    const response = await WebBrowser.openAuthSessionAsync(
      'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=894329&redirect_uri=sdkIdU.testing%3A%2F%2Fauth',
    );
    setToken(response);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <>
      <View style={styles.main}>
        <View style={styles.title}>
          <Text
            numberOfLines={2}
            style={
              {
                textAlign: 'left', fontSize: 40, fontWeight: 'bold', alignSelf: 'center', width: '80%', color: '#222',
              }
            }
          >
            App
            {'\n'}
            Prototipo
          </Text>
          <View style={{height: 10, width: 30, backgroundColor: '#222', marginLeft: '10%'}} />
        </View>
        <View style={styles.loginSection}>
          <LoginButton />
          <ScrollView 
            style={{
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              width: '80%',
              alignSelf: 'center',
              margin: 15,
            }}
          >
            <Text
              numberOfLines={2}
              style={{ textAlign: 'left',fontSize: 20, fontWeight: 'bold', color: '#222' }}
            >
              Información
            </Text>
            <View style={{ height: 5, width: 15, backgroundColor: '#222', marginBottom: 5 }} />
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Proin nec tortor non ante lobortis consequat at eget odio.
              Quisque vel diam egestas, aliquet elit a, mollis turpis.
              Cras faucibus, dolor et vestibulum semper, est ipsum
              placerat est, id dignissim felis elit ut eros.
              Integer non nisl blandit, mattis ante sed, pellentesque magna.
              Fusce suscipit, ipsum sit amet bibendum scelerisque,
              nisl felis gravida tortor, eget varius orci risus vel diam.
              Cras eget placerat nisl, quis ornare tellus. Donec sit amet faucibus nibh.
              Praesent consequat convallis convallis.
              Sed neque justo, tempor vel elit quis, lacinia mattis arcu.
              Morbi mollis lacus risus, sit amet sodales tortor luctus ut.
              Sed consequat felis vitae mattis ultricies.
            </Text>
          </ScrollView>
        </View>
        <View style={styles.bottomSection}>
          <TouchableOpacity style={{flex: 1}} onPress={() => {Linking.openURL('https://agesic.gub.uy')}}>
            <Image
              source={
                require('./assets/logo-agesic.png')
              }
              style={
                {
                  flex: 1, alignSelf: 'center', resizeMode: 'contain', height: null, aspectRatio: 2,
                }
              }
            />
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}}>
            <Image
              source={require('./assets/logoGubUy.png')}
              style={
                {
                  flex: 1, alignSelf: 'center', resizeMode: 'contain', height: null, aspectRatio: 2,
                }
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

class LoginButton extends React.Component {
  componentDidMount() { // B
    // Linking.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    // Linking.removeEventListener('url', this.handleOpenURL);
  }

  // handleOpenURL(evento) {
  //   console.log(evento.url);
  //   const route = evento.url.replace(/.*?:\/\//g, '');
  //   console.log(route);
  //   const code = route.match(/\/[^/]+\/?code=([^&]*)/)[1];
  //   console.log(`Code: ${code}`);
  //   const state = route.match(/\/[^/]+\/?state=([^&]*)/)[1];
  //   console.log(`State: ${state}`);
  // }

  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={ () => Linking.openURL('https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=894329&redirect_uri=sdkIdU.testing%3A%2F%2Fauth')}
      >
        <View style={{ borderRightColor: '#ddd', borderRightWidth: 1, justifyContent: 'center' }}>
          <Image
            source={require('./assets/logoAgesicSimple.png')} 
            style={
              {
                flex: 1, alignSelf: 'center', resizeMode: 'center', height: '100%', aspectRatio: 1, marginRight: 15 
              }
            }
          />
        </View>
        <View>
          <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 15 }}>Login con USUARIO gub.uy</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // },
  main: {
    flex: 1,
    height: 1,
  },
  title: {
    backgroundColor: '#ecf0f1',
    flex: 3,
    width: '100%',
    marginTop: 30,
    justifyContent: 'center',
  },
  loginSection: {
    backgroundColor: '#fff',
    flex: 7,
  },
  button: {
    backgroundColor: '#005492',
    width: '80%',
    alignSelf: 'center',
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#222',
    flexDirection: 'row',
  },
  bottomSection: {
    backgroundColor: '#ecf0f1',
    flex: 1,
    flexDirection: 'row',
    borderTopColor: '#222',
    borderTopWidth: 1,
  },
});
