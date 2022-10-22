import { configureStore } from '@reduxjs/toolkit';
import channelsReducer, {
  actions as channelsActions,
} from './channelsSlice.js';
import messagesReducer, { actions as messagesActions } from './messagesSlice.js';
import modalReducer, { actions as modalActions } from './modalSlice.js';

export const actions = {
  ...channelsActions,
  ...messagesActions,
  ...modalActions,
};

export default configureStore({
  reducer: {
    messages: messagesReducer,
    channels: channelsReducer,
    modal: modalReducer,
  },
});
