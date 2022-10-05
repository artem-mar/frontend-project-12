import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData, removeChannelThunk } from './channelsSlice.js';

export const sendMessageThunk = createAsyncThunk(
  'sendMessageThunk',
  async ({ message, api }) => {
    await api.sendMessage(message);
  },
);

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        messagesAdapter.addMany(state, payload.messages);
      })
      .addCase(removeChannelThunk.fulfilled, (state, action) => {
        const { id } = action.meta.arg;
        const removedMessages = Object.values(state.entities)
          .filter((m) => m.channelId !== id);
        messagesAdapter.setAll(state, removedMessages);
      });
  },
});

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;
