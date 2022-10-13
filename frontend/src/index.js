import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider } from '@rollbar/react';

import init from './init.jsx';
import store from './slices/index.js';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const run = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  const app = await init();
  const rollbarConfig = {
    accessToken: '77e0cb8a9a1b4548a60433cc0ee7ab62',
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
