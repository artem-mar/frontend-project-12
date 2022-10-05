import { configureStore } from '@reduxjs/toolkit';
import channelsReducer, {
  actions as channelsActions,
  fetchData,
  addChannelThunk,
  removeChannelThunk,
  renameChannelThunk,
} from './channelsSlice.js';
import messagesReducer, { actions as messagesActions, sendMessageThunk } from './messagesSlice.js';
import modalReducer, { actions as modalActions } from './modalSlice.js';

export const actions = {
  ...channelsActions,
  ...messagesActions,
  ...modalActions,
};

export const thunks = {
  fetchData,
  addChannel: addChannelThunk,
  removeChannel: removeChannelThunk,
  renameChannel: renameChannelThunk,
  sendMessage: sendMessageThunk,
};

export default configureStore({
  reducer: {
    messages: messagesReducer,
    channels: channelsReducer,
    modal: modalReducer,
  },
});
