/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './lib/App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';

import store from './lib/store';

const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
AppRegistry.registerComponent(appName, () => AppWrapper);
