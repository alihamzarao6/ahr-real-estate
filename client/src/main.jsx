import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App.jsx'
import './index.css';
import { store, persistor } from './redux/store.js';

// The <PersistGate> component ensures that the rendering of app is delayed until the persisted state has been retrieved and set.

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
)
