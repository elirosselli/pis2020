import { createStore } from 'redux';

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text]);
    default:
      return state;
  }
}

const store = createStore(todos, ['Use Redux']);

store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs',
});

// // Connect our store to the reducers

// // Api client event handlers
// client.on('response', apiResponseHandler(store))

// if (window.__DEV__ && console.groupCollapsed) {
//   configureRequestLogger(client)
// }

// sagaMiddleware.run(models.sagas)

export default store;
