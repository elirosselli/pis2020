import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    backgroundColor: '#ecf0f1',
    flex: 3,
    width: '100%',
    marginTop: 30,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'left',
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center',
    width: '80%',
    color: '#222',
  },
  titleSeparator: {
    height: 10,
    width: 30,
    backgroundColor: '#222',
    marginLeft: '10%',
  },
  loginContainer: {
    backgroundColor: '#fff',
    flex: 7,
  },
  informationContainer: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width: '80%',
    alignSelf: 'center',
    margin: 15,
    flex: 1,
  },
  informationTitle: {
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  informationSeparator: {
    height: 5,
    width: 15,
    backgroundColor: '#222',
    marginBottom: 5,
  },
  bottomSection: {
    backgroundColor: '#ecf0f1',
    flex: 1,
    flexDirection: 'row',
    borderTopColor: '#222',
    borderTopWidth: 1,
  },
  logosContainer: {
    flex: 1,
    alignSelf: 'center',
    resizeMode: 'contain',
    height: null,
    aspectRatio: 2,
  },
  logoutContainer: {
    backgroundColor: '#005492',
    textAlign: 'right',
    padding: 10,
    flexDirection: 'row',
  },
  logoutContText: {
    color: '#fff',
    textDecorationLine: 'underline',
    textAlign: 'right',
    flex: 1,
  },
  logoutContCodeText: {
    color: '#fff',
    textAlign: 'left',
    flex: 5,
  },
  infoBtn: {
    backgroundColor: '#222',
    padding: 10,
    width: '80%',
    borderWidth: 2,
  },
  infoBtnText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ecf0f1',
    marginTop: 10,
    marginBottom: 10,
  },
  infoHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#005492',
  }
});

export default styles;
