import { StyleSheet } from 'react-native';

const buttonStyles = StyleSheet.create({
  buttonContainer: {
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
  buttonSeparator: {
    borderRightColor: '#ddd',
    borderRightWidth: 1,
    justifyContent: 'center',
  },
  buttonLogo: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'center',
    height: '100%',
    aspectRatio: 1,
    marginRight: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 15,
  }
});

export default buttonStyles;
