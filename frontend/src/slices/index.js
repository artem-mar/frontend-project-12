import { configureStore } from '@reduxjs/toolkit';
import channelsReducer, { actions as channelsActions } from './channelsSlice.js';
import messagesReducer, { actions as messagesActions } from './messagesSlice.js';

export const actions = {
  ...channelsActions,
  ...messagesActions,
};

export default configureStore({
  reducer: {
    messages: messagesReducer,
    channels: channelsReducer,
  },
});
