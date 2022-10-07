import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData, removeChannelThunk, payloadCreator } from './channelsSlice.js';

export const sendMessageThunk = createAsyncThunk('sendMessageThunk', payloadCreator);

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: messagesAdapter.addOne,
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
