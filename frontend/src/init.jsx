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

  socket.on('newMessage', (m) => {
    store.dispatch(actions.addMessage(m));
  });
  socket.on('removeChannel', ({ id }) => {
    store.dispatch(actions.removeChannel(id));
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
        <ApiContext.Provider value={socket}>
          <App />
        </ApiContext.Provider>
      </I18nextProvider>
    </Provider>
  );
};
