import React from 'react';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import filter from 'leo-profanity';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import resources from './locales/index.js';
import App from './components/App.jsx';
import { ApiContext } from './contexts/index.js';
import store, { actions } from './slices/index.js';

export default async (socket) => {
  filter.add(filter.getDictionary('ru'));

  const payloadCreator = (...args) => new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(Error('networkError'));
    }, 2000);

    socket.emit(...args, (r) => {
      if (r.status === 'ok') {
        resolve();
      }
      reject(Error('unknownError'));
    });
  });

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const api = {
    sendMessage: (message) => payloadCreator('newMessage', message),
    createChannel: (channel) => payloadCreator('newChannel', channel),
    removeChannel: (id) => payloadCreator('removeChannel', id),
    renameChannel: (updData) => payloadCreator('renameChannel', updData),
  };

  socket.on('newMessage', (m) => {
    store.dispatch(actions.addMessage(m));
  });
  socket.on('newChannel', (ch) => {
    store.dispatch(actions.addChannel(ch));
    store.dispatch(actions.setCurrentChannel(ch.id));
  });
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(actions.removeChannel(id));
    const defaultChannelId = 1;
    store.dispatch(actions.setCurrentChannel(defaultChannelId));
  });
  socket.on('renameChannel', (ch) => {
    store.dispatch(actions.updateChannel({ id: ch.id, changes: { name: ch.name } }));
  });

  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      fallbackLng: ['ru', 'en'],
      debug: false,
      resources,
    });

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ApiContext.Provider value={api}>
          <App />
        </ApiContext.Provider>
      </I18nextProvider>
    </Provider>
  );
};
