/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  return (
    <>
      <View style={styles.main}>
        <View style={styles.title}>
          <Text
            numberOfLines={2}
            style={{
              textAlign: 'left',
              fontSize: 40,
              fontWeight: 'bold',
              alignSelf: 'center',
              width: '80%',
              color: '#222',
            }}>
            App{'\n'}Prototipo
          </Text>
          <View
            style={{
              height: 10,
              width: 30,
              backgroundColor: '#222',
              marginLeft: '10%',
            }}></View>
        </View>
        <View style={styles.loginSection}>
          <LoginButton />
          <ScrollView
            style={{
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.8,
              shadowRadius: 2,
              width: '80%',
              alignSelf: 'center',
              margin: 15,
            }}>
            <Text
              numberOfLines={2}
              style={{
                textAlign: 'left',
                fontSize: 20,
                fontWeight: 'bold',
                color: '#222',
              }}>
              Información
            </Text>
            <View
              style={{
                height: 5,
                width: 15,
                backgroundColor: '#222',
                marginBottom: 5,
              }}></View>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec
              tortor non ante lobortis consequat at eget odio. Quisque vel diam
              egestas, aliquet elit a, mollis turpis. Cras faucibus, dolor et
              vestibulum semper, est ipsum placerat est, id dignissim felis elit
              ut eros. Integer non nisl blandit, mattis ante sed, pellentesque
              magna. Fusce suscipit, ipsum sit amet bibendum scelerisque, nisl
              felis gravida tortor, eget varius orci risus vel diam. Cras eget
              placerat nisl, quis ornare tellus. Donec sit amet faucibus nibh.
              Praesent consequat convallis convallis. Sed neque justo, tempor
              vel elit quis, lacinia mattis arcu. Morbi mollis lacus risus, sit
              amet sodales tortor luctus ut. Sed consequat felis vitae mattis
              ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Proin nec tortor non ante lobortis consequat at eget odio.
              Quisque vel diam egestas, aliquet elit a, mollis turpis. Cras
              faucibus, dolor et vestibulum semper, est ipsum placerat est, id
              dignissim felis elit ut eros. Integer non nisl blandit, mattis
              ante sed, pellentesque magna. Fusce suscipit, ipsum sit amet
              bibendum scelerisque, nisl felis gravida tortor, eget varius orci
              risus vel diam. Cras eget placerat nisl, quis ornare tellus. Donec
              sit amet faucibus nibh. Praesent consequat convallis convallis.
              Sed neque justo, tempor vel elit quis, lacinia mattis arcu. Morbi
              mollis lacus risus, sit amet sodales tortor luctus ut. Sed
              consequat felis vitae mattis ultricies.
            </Text>
          </ScrollView>
        </View>
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              Linking.openURL('https://agesic.gub.uy');
            }}>
            <Image
              source={require('./imgs/logo-agesic.png')}
              style={{
                flex: 1,
                alignSelf: 'center',
                resizeMode: 'contain',
                height: null,
                aspectRatio: 2,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}}>
            <Image
              source={require('./imgs/logoGubUy.png')}
              style={{
                flex: 1,
                alignSelf: 'center',
                resizeMode: 'contain',
                height: null,
                aspectRatio: 2,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

class LoginButton extends React.Component {
  componentDidMount() {
    // B
    if (Platform.OS === 'android') {
      // Linking.getInitialURL().then(url => {
      //   //this.navigate(url);
      // });
      Linking.addEventListener('url', this.handleOpenURL);
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  handleOpenURL(event) {
    console.log(event.url);
    const route = event.url.replace(/.*?:\/\//g, '');
    console.log(route);
    const code = route.match(/\/[^\/]+\/?code=([^&]*)/)[1];
    console.log('Code: ' + code);
    const state = route.match(/\/[^\/]+\/?state=([^&]*)/)[1];
    console.log('State: ' + state);

    // fetch('https://auth-testing.iduruguay.gub.uy', {
    //   method: 'POST',
    //   headers: {
    //       'Authorization': 'Basic ODk0MzI5OmNkYzA0ZjE5YWMwZjI4ZmIzZTFjZTZkNDJiMzdlODVhNjNmYjhhNjU0NjkxYWE0NDg0YjZiOTRi',
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   body: "grant_type=authorization_code&code="+code+"&redirect_uri=sdkIdU.testing://token"

    // });
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          Linking.openURL(
            'https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=894329&redirect_uri=sdkIdU.testing%3A%2F%2Fauth',
          )
        }>
        <View
          style={{
            borderRightColor: '#ddd',
            borderRightWidth: 1,
            justifyContent: 'center',
          }}>
          <Image
            source={require('./imgs/logoAgesicSimple.png')}
            style={{
              flex: 1,
              alignSelf: 'center',
              resizeMode: 'center',
              height: '100%',
              aspectRatio: 1,
              marginRight: 15,
            }}
          />
        </View>
        <View style={{}}>
          <Text style={{color: '#fff', fontWeight: 'bold', marginLeft: 15}}>
            Login con USUARIO gub.uy
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
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

export default App;
