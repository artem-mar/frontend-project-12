import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider } from '@rollbar/react';
import { io } from 'socket.io-client';

import init from './init.jsx';
import store from './slices/index.js';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const run = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));

  const socket = io();
  const app = await init(socket);

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    environment: 'production',
  };
  root.render(
    <RollbarProvider config={rollbarConfig}>
      <Provider store={store}>
        {app}
      </Provider>
    </RollbarProvider>,
  );
};

run();
