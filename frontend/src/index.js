import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import init from './init.jsx';
import store from './slices/index.js';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const run = async () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  const app = await init();
  root.render(
    <Provider store={store}>
      {app}
    </Provider>,
  );
};

run();
