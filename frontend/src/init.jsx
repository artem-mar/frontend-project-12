import React from 'react';
import { io } from 'socket.io-client';
import i18next from 'i18next';
import filter from 'leo-profanity';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import resources from './locales/index.js';
import App from './components/App.jsx';
import { ApiContext } from './contexts/index.js';

export default async () => {
  filter.add(filter.getDictionary('ru'));

  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      fallbackLng: ['ru', 'en'],
      debug: false,
      resources,
    });

  const socket = io();

  return (
    <I18nextProvider i18n={i18n}>
      <ApiContext.Provider value={socket}>
        <App />
      </ApiContext.Provider>
    </I18nextProvider>
  );
};
